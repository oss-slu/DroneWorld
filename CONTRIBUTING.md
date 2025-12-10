# Contributing to DroneWorld

Thank you for your interest in contributing to DroneWorld! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Proposing Features](#proposing-features)
- [Review Process](#review-process)
- [Questions?](#questions)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/DroneWorld.git
   cd DroneWorld
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/oss-slu/DroneWorld.git
   ```
4. **Create a branch** for your contribution:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Setup

### Prerequisites

- **Docker** and **Docker Compose** (recommended)
- **Python 3.10** (for backend development)
- **Node.js 20** (for frontend development)
- **Git**

### Quick Start with Docker

1. **Set up GitHub token** (required for simulator):
   ```bash
   # Linux/macOS
   ./dev.sh token
   
   # Windows
   .\dev.ps1 token
   ```

2. **Start development environment**:
   ```bash
   # Frontend + Backend only (faster for development)
   ./dev.sh dev
   
   # Full stack (includes simulator)
   ./dev.sh full
   ```

3. **Access services**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api/docs

### Local Development (Without Docker)

See [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) for detailed local development instructions.

## Contribution Workflow

1. **Stay up to date**: Regularly sync with upstream:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create your feature branch** from `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following our [code style guidelines](CODE_STYLE.md)

4. **Test your changes**:
   ```bash
   # Backend tests
   cd backend
   pip install -r requirements.txt
   # Run linting
   flake8 backend/ --max-line-length 160
   black backend/
   
   # Frontend tests
   cd frontend
   npm install
   npm run lint
   npm run test
   npm run build
   ```

5. **Commit your changes** with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add new collision detection monitor"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub using our [PR template](.github/pull_request_template.md)

## Code Style Guidelines

Please follow our [CODE_STYLE.md](CODE_STYLE.md) for detailed coding standards. Key points:

- **Python**: Follow PEP 8, use Black formatter, max line length 160
- **JavaScript**: Follow ESLint rules, use Prettier formatter
- **Commit messages**: Use conventional commits format (feat, fix, docs, etc.)
- **Documentation**: Add docstrings to new functions/classes

## Testing Requirements

### Backend Testing

- Ensure all new code passes linting (`flake8`)
- Format code with `black` before committing
- Add unit tests for new functionality when possible
- Test API endpoints manually or with automated tests

### Frontend Testing

- Run `npm run lint` and fix any issues
- Run `npm run test` and ensure all tests pass
- Add tests for new components/features
- Test UI changes manually in the browser

### Integration Testing

- Test your changes with the full stack when possible
- Verify Docker setup still works with your changes
- Check that existing features still function correctly

## Submitting Changes

### Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Add tests** for new features or bug fixes
3. **Ensure all tests pass** and code is properly formatted
4. **Update CHANGELOG.md** if applicable
5. **Create PR** with clear description using our template

### PR Requirements

- Clear title and description
- Reference related issues
- Include screenshots for UI changes
- Ensure CI checks pass
- Request review from maintainers

## Reporting Bugs

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) when reporting issues. Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, Docker version, etc.)
- Relevant logs or error messages
- Screenshots if applicable

## Proposing Features

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml) when proposing new features. Include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation approach
- Potential impact on existing functionality
- Examples or mockups if applicable

## Review Process

1. **Automated checks**: CI will run linting, formatting, and tests
2. **Code review**: Maintainers will review your PR
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

### Review Guidelines

- Be respectful and constructive in feedback
- Respond to review comments promptly
- Make requested changes in new commits (don't force-push)
- Ask questions if anything is unclear

## Questions?

- Check our [Wiki](https://github.com/oss-slu/DroneWorld/wiki)
- Read [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) for setup help
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Open a [question issue](.github/ISSUE_TEMPLATE/question.yml)
- Contact maintainers through GitHub discussions

## Good First Issues

Looking for a place to start? Check out issues labeled `good-first-issue`:

- Documentation improvements
- Small bug fixes
- Test coverage improvements
- UI/UX enhancements
- Code cleanup and refactoring

## Recognition

Contributors are recognized in [CONTRIBUTORS.md](CONTRIBUTORS.md). Thank you for helping make DroneWorld better!

---

**Note**: This is a capstone project under active development. We welcome contributions and appreciate your patience as we continue to improve the project structure and documentation.

