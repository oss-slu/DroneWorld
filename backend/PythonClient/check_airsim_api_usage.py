"""
Static compatibility checker for local AirSim API usage.

It scans Python files outside `airsim/` and reports:
1) `airsim.<symbol>` references that are not exported by local `airsim` package files.
2) Calls on AirSim client objects (`client.foo()`, `self.client.foo()`) where `foo`
   is not a method on `VehicleClient` or `MultirotorClient`.
"""

from __future__ import annotations

import ast
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Set, Tuple


ROOT = Path(__file__).resolve().parent
AIRSIM_DIR = ROOT / "airsim"
SKIP_PARTS = {"airsim", "__pycache__"}


@dataclass(frozen=True)
class Usage:
    file: Path
    line: int
    name: str


def _parse(path: Path) -> ast.AST:
    text = path.read_text(encoding="utf-8-sig")
    return ast.parse(text, filename=str(path))


def _iter_project_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*.py"):
        if any(part in SKIP_PARTS for part in path.parts):
            continue
        yield path


def _collect_airsim_exports() -> Tuple[Set[str], Set[str]]:
    exports: Set[str] = set()
    client_methods: Set[str] = set()

    for module_name in ("types.py", "utils.py", "client.py"):
        path = AIRSIM_DIR / module_name
        tree = _parse(path)
        for node in tree.body:
            if isinstance(node, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)):
                exports.add(node.name)
            elif isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        exports.add(target.id)
            elif isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
                exports.add(node.target.id)

            if isinstance(node, ast.ClassDef) and node.name in {"VehicleClient", "MultirotorClient"}:
                for member in node.body:
                    if isinstance(member, ast.FunctionDef):
                        client_methods.add(member.name)

    return exports, client_methods


def _is_multirotor_ctor(call: ast.Call) -> bool:
    func = call.func
    return (
        isinstance(func, ast.Attribute)
        and isinstance(func.value, ast.Name)
        and func.value.id == "airsim"
        and func.attr == "MultirotorClient"
    )


def _is_self_client_attr(node: ast.AST) -> bool:
    return (
        isinstance(node, ast.Attribute)
        and isinstance(node.value, ast.Name)
        and node.value.id == "self"
        and node.attr == "client"
    )


def _collect_usages(path: Path) -> Tuple[List[Usage], List[Usage]]:
    tree = _parse(path)
    module_symbol_usages: List[Usage] = []
    client_method_usages: List[Usage] = []
    known_client_vars: Set[str] = set()

    class Visitor(ast.NodeVisitor):
        def visit_Assign(self, node: ast.Assign) -> None:
            if isinstance(node.value, ast.Call) and _is_multirotor_ctor(node.value):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        known_client_vars.add(target.id)
            self.generic_visit(node)

        def visit_Attribute(self, node: ast.Attribute) -> None:
            if isinstance(node.value, ast.Name) and node.value.id == "airsim":
                module_symbol_usages.append(Usage(path, node.lineno, node.attr))
            self.generic_visit(node)

        def visit_Call(self, node: ast.Call) -> None:
            if isinstance(node.func, ast.Attribute):
                base = node.func.value
                if isinstance(base, ast.Name) and base.id in known_client_vars:
                    client_method_usages.append(Usage(path, node.lineno, node.func.attr))
                elif _is_self_client_attr(base):
                    client_method_usages.append(Usage(path, node.lineno, node.func.attr))
            self.generic_visit(node)

    Visitor().visit(tree)
    return module_symbol_usages, client_method_usages


def _format_grouped(usages: Iterable[Usage]) -> str:
    grouped: Dict[str, List[Usage]] = {}
    for usage in usages:
        grouped.setdefault(usage.name, []).append(usage)

    lines: List[str] = []
    for name in sorted(grouped):
        refs = ", ".join(f"{u.file.relative_to(ROOT)}:{u.line}" for u in sorted(grouped[name], key=lambda x: (str(x.file), x.line)))
        lines.append(f"  - {name}: {refs}")
    return "\n".join(lines)


def main() -> int:
    exports, client_methods = _collect_airsim_exports()

    all_symbol_usages: List[Usage] = []
    all_client_calls: List[Usage] = []

    for file in _iter_project_files(ROOT):
        symbols, client_calls = _collect_usages(file)
        all_symbol_usages.extend(symbols)
        all_client_calls.extend(client_calls)

    missing_symbols = [u for u in all_symbol_usages if u.name not in exports]
    missing_client_calls = [u for u in all_client_calls if u.name not in client_methods]

    if not missing_symbols and not missing_client_calls:
        print("AirSim compatibility check passed: no missing symbols or client methods found.")
        return 0

    if missing_symbols:
        print("Missing airsim module symbols:")
        print(_format_grouped(missing_symbols))

    if missing_client_calls:
        print("Missing AirSim client methods:")
        print(_format_grouped(missing_client_calls))

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
