# Contributing to Kisha WalletConnect

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/kisha.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## 📝 Development Workflow

### Running the Development Server

```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:all

# Terminal 3: Start frontend
npm run dev
```

### Code Style

- Use Prettier for formatting: `npm run format`
- Run type checking: `npm run type-check`
- Follow TypeScript best practices
- Use meaningful variable and function names

### Testing

```bash
# Run contract tests
npm run test

# Run with coverage
npm run test:coverage
```

## 🎯 Contribution Guidelines

### Adding New Features

1. Create a feature branch
2. Add your feature with tests
3. Update documentation if needed
4. Ensure all tests pass
5. Submit a pull request

### Reporting Bugs

1. Check if the bug already exists in issues
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### Code Standards

- **TypeScript**: All code must be typed
- **Components**: Use functional components with hooks
- **Utilities**: Place in `utils/` directory
- **Hooks**: Place in `hooks/` directory
- **Components**: Place in `components/` directory

### Commit Messages

Use clear, descriptive commit messages:
- `feat: Add token approval hook`
- `fix: Fix gas estimation calculation`
- `docs: Update README with deployment steps`
- `style: Format code with Prettier`

## 📦 Project Structure

```
Kisha/
├── components/      # React components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── config/         # Configuration files
├── contracts/       # Smart contracts
├── scripts/        # Deployment scripts
├── test/           # Contract tests
└── styles/         # CSS styles
```

## 🔍 Code Review Process

1. All PRs require at least one approval
2. Code must pass linting and type checks
3. Tests must pass
4. Documentation should be updated

## 🐛 Bug Fixes

- Fix one bug per PR
- Include tests for the fix
- Reference the issue number

## ✨ Feature Requests

- Open an issue first to discuss
- Wait for approval before implementing
- Follow the project architecture

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Update FEATURES_SUMMARY.md for new features

## 🤝 Questions?

Open an issue or start a discussion. We're happy to help!

---

Thank you for contributing! 🎉

