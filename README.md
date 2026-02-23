# Playwright Tests

## Overview
This project utilizes [Playwright](https://playwright.dev/), a powerful framework for end-to-end testing of web applications. The goal of this project is to provide comprehensive and automated testing solutions for various web applications to ensure quality and performance.

## Features
- **Cross-Browser Testing**: Run tests across modern browsers, including Chromium, Firefox, and WebKit.
- **Headless Mode**: Execute tests in a headless browser environment, enabling faster test runs.
- **Auto-Waiting**: Automatically waits for elements to be ready before performing actions, reducing flakiness in tests.
- **Video Recording**: Capture video recordings of test runs for better debugging and presentation.

## Projects

### Swaglabs
This project demonstrates end-to-end testing using **parameterized tests with multiple points of view**. The test suite includes:
- Navigating to the dashboard
- Checking out 3 items from inventory
- Completing the order process
- Visual testing of the inventory page

**Run Swaglabs tests:**
```bash
npm run swaglabs-tests
```

### Heroku
This project focuses on testing **file upload and file download** functionality.

**Run Heroku tests:**
```bash
npm run heroku-chrome
```

## Getting Started
1. **Installation**: Clone this repository and install dependencies:
```bash
git clone https://github.com/cuevaschris/playwright-tests.git
cd playwright-tests
npm install
```
2. **Running Tests**: Execute tests using the following command:
```bash
npx playwright test
```

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
