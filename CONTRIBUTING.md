# Contributing to DroneWorld

Thank you for your interest in contributing to DroneWorld! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Code Style Guidelines](#code-style-guidelines)

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to create a welcoming environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/DroneWorld.git`
3. Create a new branch: `git checkout -b your-feature-branch`
4. Make your changes
5. Commit your changes (see [Pre-commit Hooks](#pre-commit-hooks) below)
6. Push to your fork: `git push origin your-feature-branch`
7. Open a Pull Request

## Development Setup

### Prerequisites

- **Node.js** 16+ (for frontend development)
- **Python** 3.10 (for backend development)
- **Git** (for version control)
- **npm** or **yarn** (package manager)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
   This automatically installs and configures Git hooks via the `prepare` script.

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/macOS
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Install development tools (required for pre-commit hooks):
   ```bash
   pip install black flake8
   ```

## Pre-commit Hooks

This project uses pre-commit hooks to ensure code quality and consistency. Hooks are automatically installed when you run `npm install` in the `frontend/` directory.

### What Gets Checked

**Frontend files** (`.js`, `.jsx`, `.ts`, `.tsx`):
- ESLint validation (blocks commits with warnings or errors)
- Prettier formatting (automatically formats code)

**Backend files** (`.py`):
- Black formatting (automatically formats code)
- flake8 linting (checks code style and quality)

### Automatic Installation

Hooks are automatically installed via the `prepare` script in `frontend/package.json`. When you run `npm install`, Husky sets up the Git hooks directory.

**Verification:**
```bash
git config core.hooksPath
# Should output: frontend/.husky
```

If it doesn't, manually set it:
```bash
git config core.hooksPath frontend/.husky
```

### Manual Setup (if needed)

If hooks aren't working after `npm install`:

1. Ensure you're in the repository root
2. Run: `cd frontend && npm install`
3. Verify hook path: `git config core.hooksPath` should show `frontend/.husky`
4. Make hook executable (if needed):
   ```bash
   # Windows (Git Bash) or Linux/macOS
   git update-index --chmod=+x frontend/.husky/pre-commit
   ```

**Platform-specific notes:**
- **Windows**: If using Git Bash or PowerShell, hooks work automatically. CMD is not recommended.
- **macOS/Linux**: Hooks work automatically after `npm install`.
- **All platforms**: The hook uses standard shell commands (`sh`) compatible with Git's shell environment.

### Backend Tools Setup

For commits that include Python files, you must have `black` and `flake8` installed:

**Option 1: Install globally**
```bash
pip install black flake8
```

**Option 2: Install in virtual environment (recommended)**
```bash
# Activate your virtual environment first
pip install black flake8
```

**Important:** If you're working on backend code, activate your virtual environment before committing:
```bash
# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

The pre-commit hook will check for these tools and provide helpful error messages if they're missing.

### Troubleshooting Hooks

**Hooks not running:**
- Verify `git config core.hooksPath` returns `frontend/.husky`
- Check that `frontend/.husky/pre-commit` exists and is executable
- Ensure you've run `npm install` in the `frontend/` directory

**"lint-staged could not find any staged files":**
- This is normal if you're only committing non-code files (e.g., documentation, config files)
- If committing code files, check that file paths match the patterns in `frontend/package.json` → `lint-staged`

**Backend tools not found:**
- Ensure `black` and `flake8` are installed: `pip list | grep -E "black|flake8"`
- Activate your virtual environment if using one
- Install globally if needed: `pip install black flake8`

**Bypassing hooks (EMERGENCY ONLY):**

⚠️ **WARNING:** Bypassing hooks is strongly discouraged and should only be used in true emergencies (e.g., hotfixes, urgent security patches). Your code will still be checked in CI, and failing checks will block your PR.

```bash
git commit --no-verify -m "your message"
```

**Consequences of bypassing:**
- ❌ Code quality checks are skipped
- ❌ Formatting inconsistencies may be introduced
- ❌ CI pipeline will still run and may fail
- ❌ PR reviewers may request changes
- ❌ May delay merge process

**When it's acceptable:**
- Emergency hotfixes that need immediate deployment
- Documentation-only changes (though hooks typically skip these anyway)
- Temporary workarounds with a follow-up commit to fix issues

**Best practice:** Fix the underlying issue instead of bypassing hooks.

## Making Changes

### Code Style

- **Frontend**: Follow ESLint rules and Prettier formatting (configured in `.prettierrc`)
- **Backend**: Follow Black formatting and flake8 linting rules (configured in CI)

### Testing

- Frontend: Run `npm test` in the `frontend/` directory
- Backend: Follow existing test patterns in the backend codebase
- E2E: Cypress tests run automatically in CI

### Commit Messages

Use clear, descriptive commit messages:
- Start with a verb in imperative mood: "Add", "Fix", "Update", "Remove"
- Keep the first line under 72 characters
- Add details in the body if needed

Examples:
```
Add Cypress E2E tests to CI pipeline
Fix memory leak in simulation engine
Update documentation for pre-commit setup
```

## Submitting Changes

1. Ensure all pre-commit hooks pass
2. Write clear commit messages
3. Push to your fork
4. Open a Pull Request with:
   - Clear description of changes
   - Reference to related issues (if any)
   - Screenshots (for UI changes)

## Code Style Guidelines

### Frontend (JavaScript/TypeScript/React)

- Use Prettier for formatting (automatic via pre-commit)
- Follow ESLint rules (configured in `package.json`)
- Use functional components and hooks
- Keep components small and focused

### Backend (Python)

- Use Black for formatting (automatic via pre-commit)
- Follow flake8 linting rules (same as CI configuration)
- Use type hints where appropriate
- Follow PEP 8 style guide

### Configuration Files

- YAML files: Use consistent indentation (2 spaces)
- JSON files: Follow existing formatting
- Environment files: Never commit `.env` files with secrets

## Additional Resources

- [Project Wiki](https://github.com/oss-slu/DroneWorld/wiki)
- [Getting Started Guide](https://github.com/oss-slu/DroneWorld/wiki/Getting-Started)
- [Issue Tracker](https://github.com/oss-slu/DroneWorld/issues)

## Questions?

If you have questions or need help, please:
1. Check the [Wiki](https://github.com/oss-slu/DroneWorld/wiki)
2. Search existing [Issues](https://github.com/oss-slu/DroneWorld/issues)
3. Open a new issue with the "question" label

Thank you for contributing to DroneWorld! 🚀

