# Code Style Guidelines

This document outlines the coding standards and conventions for the DroneWorld project.

## Table of Contents

- [General Principles](#general-principles)
- [Python Style Guide](#python-style-guide)
- [JavaScript/React Style Guide](#javascriptreact-style-guide)
- [Git Commit Messages](#git-commit-messages)
- [Documentation Standards](#documentation-standards)
- [File Organization](#file-organization)

## General Principles

1. **Readability First**: Code should be easy to read and understand
2. **Consistency**: Follow existing patterns in the codebase
3. **Documentation**: Document complex logic and public APIs
4. **Testing**: Write tests for new features and bug fixes
5. **Linting**: All code must pass linting checks before submission

## Python Style Guide

### Formatting

We use **Black** for code formatting with the following configuration:
- **Line length**: 160 characters (project-specific)
- **String quotes**: Double quotes preferred
- **Trailing commas**: Yes

**Run Black**:
```bash
cd backend
black .
```

### Linting

We use **flake8** with specific ignore rules. Run linting:
```bash
cd backend
flake8 . --max-line-length 160 --ignore E127,E251,E302,E501,E261,E262,E265,F401,F403,F405,F841,W293,E128,E303,E305,W292,E122,W391,E111,E117,E301,E125,E222,E226,E201,E203,E202,E721,W503,W504,E272,E126,E225,W291,E211,E231,E722,W191,E712,F523,E402,E306
```

### Naming Conventions

- **Classes**: `PascalCase` (e.g., `SimulationTaskManager`, `CollisionMonitor`)
- **Functions/Methods**: `snake_case` (e.g., `add_task()`, `get_current_state()`)
- **Variables**: `snake_case` (e.g., `drone_name`, `mission_state`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_WIND_SPEED`, `DEFAULT_PORT`)
- **Private methods**: Prefix with `__` (e.g., `__update_settings()`)

### Code Structure

```python
# 1. Imports (standard library, third-party, local)
import os
import sys
from typing import List, Optional

from flask import Flask, request
from PythonClient import airsim

# 2. Constants
DEFAULT_SPEED = 4.0
MAX_ALTITUDE = 100.0

# 3. Classes
class MyClass:
    """Class docstring."""
    
    def __init__(self, param: str):
        """Initialize class."""
        self.param = param
    
    def public_method(self) -> None:
        """Public method docstring."""
        pass
    
    def __private_method(self) -> None:
        """Private method (internal use only)."""
        pass
```

### Docstrings

Use Google-style docstrings:

```python
def fly_to_position(self, drone_name: str, position: List[float], speed: float) -> None:
    """
    Fly drone to specified position.
    
    Args:
        drone_name: Name of the drone (e.g., 'Drone1')
        position: Target position as [x, y, z] coordinates
        speed: Flight speed in m/s
    
    Returns:
        None
    
    Raises:
        TransportError: If connection to simulator fails
    """
    pass
```

### Type Hints

Use type hints for function parameters and return types:

```python
from typing import List, Optional, Dict, Tuple

def process_drones(drones: List[Dict[str, any]]) -> Optional[str]:
    """Process list of drone configurations."""
    pass
```

### Error Handling

```python
try:
    result = risky_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
    raise
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    return None
```

### Imports

Order imports as:
1. Standard library
2. Third-party packages
3. Local application imports

```python
# Standard library
import os
import sys
from typing import List

# Third-party
from flask import Flask
import numpy as np

# Local
from PythonClient.multirotor.control.simulation_task_manager import SimulationTaskManager
```

## JavaScript/React Style Guide

### Formatting

We use **Prettier** for code formatting. Configuration in `.prettierrc`:

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "jsxSingleQuote": true,
  "bracketSpacing": true
}
```

**Run Prettier**:
```bash
cd frontend
npm run format
```

### Linting

We use **ESLint** with React plugin. Run linting:
```bash
cd frontend
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Naming Conventions

- **Components**: `PascalCase` (e.g., `DroneDetails`, `MonitorControl`)
- **Functions/Variables**: `camelCase` (e.g., `handleSubmit`, `droneName`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_DRONES`, `API_BASE_URL`)
- **Files**: `PascalCase.jsx` for components, `camelCase.js` for utilities

### Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

/**
 * Component description.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onSubmit - Submit handler
 */
const MyComponent = ({ title, onSubmit }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleClick = () => {
    // Handler logic
    onSubmit();
  };

  return (
    <Box>
      <Typography>{title}</Typography>
    </Box>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MyComponent;
```

### React Best Practices

1. **Use functional components** with hooks
2. **Extract reusable logic** into custom hooks
3. **Use PropTypes** for type checking (or TypeScript if adopted)
4. **Keep components small** and focused
5. **Use meaningful variable names**

### File Organization

```
frontend/src/
├── components/        # Reusable components
├── pages/            # Page components
├── contexts/         # React contexts
├── utils/            # Utility functions
├── constants/        # Constants
└── tests/            # Test files
```

## Git Commit Messages

We follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(mission): add new fly-to-points-geo mission type

Implements geographic coordinate waypoint navigation using
Cesium integration for real-world coordinate conversion.

Closes #123
```

```
fix(monitor): resolve collision detection false positives

Fixed issue where collision monitor was triggering on
ground contact during takeoff. Added altitude threshold
check before collision detection.

Fixes #456
```

```
docs(readme): update installation instructions

Added Docker setup instructions and troubleshooting section.
```

## Documentation Standards

### Code Comments

- **Explain why**, not what (code should be self-explanatory)
- Comment complex algorithms or business logic
- Keep comments up-to-date with code changes

```python
# Good: Explains why
# Convert to NED coordinate system because AirSim uses NED
# but our input is in ENU
ned_position = [position[0], -position[1], -position[2]]

# Bad: States the obvious
# Set x to 10
x = 10
```

### README Files

- Keep README files updated
- Include setup instructions
- Document configuration options
- Provide examples

### API Documentation

- Document all public API endpoints
- Include request/response examples
- Document error codes
- Use Swagger/OpenAPI for REST APIs

## File Organization

### Python

```
backend/PythonClient/
├── server/              # Flask server
├── multirotor/
│   ├── control/         # Control logic
│   ├── mission/         # Mission implementations
│   ├── monitor/         # Monitor implementations
│   └── storage/         # Storage services
└── airsim/              # AirSim client
```

### JavaScript/React

```
frontend/src/
├── components/          # Reusable components
│   ├── Configuration/  # Config components
│   └── cesium/         # Cesium components
├── pages/              # Page components
├── contexts/           # React contexts
├── utils/              # Utility functions
└── constants/          # Constants
```

## Pre-commit Checklist

Before committing code:

- [ ] Code passes linting (`flake8` / `eslint`)
- [ ] Code is formatted (`black` / `prettier`)
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Commit message follows conventions
- [ ] No debug code or console.logs left
- [ ] No commented-out code
- [ ] Code follows style guidelines

## Tools and Automation

### Pre-commit Hooks (Future)

Consider setting up pre-commit hooks to automatically:
- Run linters
- Format code
- Run tests
- Check commit message format

### CI/CD

GitHub Actions automatically:
- Runs linting on PRs
- Formats code
- Runs tests
- Checks for security vulnerabilities

## Resources

- [PEP 8](https://www.python.org/dev/peps/pep-0008/) - Python style guide
- [Black Documentation](https://black.readthedocs.io/) - Python formatter
- [ESLint Rules](https://eslint.org/docs/rules/) - JavaScript linting
- [Prettier Options](https://prettier.io/docs/en/options.html) - Code formatter
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message format

---

**Questions?** Open an issue or ask in discussions.

