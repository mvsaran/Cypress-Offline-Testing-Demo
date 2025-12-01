# 🌐 Cypress Offline Testing Demo

This project demonstrates **three different approaches** to test offline scenarios in Cypress, providing comprehensive examples for handling network connectivity testing in web applications.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Takeaways](#key-takeaways)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Implementation from Scratch](#implementation-from-scratch)
- [Running Tests](#running-tests)
- [Testing Scenarios Explained](#testing-scenarios-explained)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This demo application showcases how to test various offline scenarios using Cypress:
1. **Full Offline Mode** using Chrome DevTools Protocol (CDP)
2. **Network Request Failures** using `cy.intercept()`
3. **Manual Event Triggering** for offline/online events

The application includes a simple UI that displays network status and fetches user data from an external API, making it perfect for demonstrating offline behavior testing.

---

## 🎬 Live Demo

Here's what happens when you run the tests:

```
Running: offline.cy.js (1 of 1)

Offline Testing Scenarios
  ✓ Scenario 1: Full Offline Mode (CDP) - Checks UI Indicator (425ms)
  ✓ Scenario 2: Network Request Failure (cy.intercept) - Checks Error Handling (564ms)
  ✓ Scenario 3: Manual Event Triggering - Checks Event Listeners (117ms)

3 passing (1s)

┌────────────────────────────────────────────────────────────────────┐
│ Tests:        3                                                    │
│ Passing:      3                                                    │
│ Failing:      0                                                    │
│ Pending:      0                                                    │
│ Skipped:      0                                                    │
│ Screenshots:  0                                                    │
│ Video:        false                                                │
│ Duration:     1 second                                             │
│ Spec Ran:     offline.cy.js                                        │
└────────────────────────────────────────────────────────────────────┘
```

### Test Execution Flow

**Scenario 1: Full Offline Mode (CDP)**
```
1. Browser starts ONLINE → Network status banner is HIDDEN
2. Execute goOffline() → Chrome DevTools Protocol activates
3. Browser goes OFFLINE → 'offline' event fires
4. App detects offline state → Banner becomes VISIBLE
5. Cypress verifies: "You are currently offline" message appears
6. Execute goOnline() → Browser reconnects → Banner HIDES
```

**Scenario 2: Network Request Failure (cy.intercept)**
```
1. Setup intercept to force network error on API call
2. User clicks "Fetch Users" button
3. Cypress intercepts the request → Forces network error
4. App's catch block executes → Error message displays
5. Cypress verifies: Error message visible, no user cards rendered
```

**Scenario 3: Manual Event Triggering**
```
1. Get window object via cy.window()
2. Stub navigator.onLine = false
3. Manually dispatch 'offline' event
4. App's event listener fires → Banner shows
5. Stub navigator.onLine = true
6. Dispatch 'online' event → Banner hides
```

---

## 🔑 Key Takeaways

### Comparison of Testing Approaches

| Feature | Scenario 1 (CDP) | Scenario 2 (Intercept) | Scenario 3 (Manual) |
|---------|------------------|------------------------|---------------------|
| **Method** | Chrome DevTools Protocol | cy.intercept() | JavaScript Events |
| **Network Actually Offline?** | ✅ Yes | ❌ No | ❌ No |
| **Triggers Browser Events?** | ✅ Yes | ❌ No | ✅ Yes (manually) |
| **Blocks API Requests?** | ✅ All requests | ✅ Specific requests | ❌ No |
| **Browser Support** | Chrome only | All browsers | All browsers |
| **Best For** | PWA, Service Workers | API error handling | Event listener testing |
| **Execution Speed** | Slower (425ms) | Medium (564ms) | Fastest (117ms) |
| **Realism** | Most realistic | Partially realistic | Simulated only |

### When to Use Each Approach

**Use Scenario 1 (CDP)** when:
- Testing Progressive Web Apps (PWA)
- Validating Service Worker caching
- Testing complete offline experience
- Need to trigger real browser offline events
- Only targeting Chromium-based browsers

**Use Scenario 2 (Intercept)** when:
- Testing API error handling logic
- Simulating intermittent network failures
- Testing retry mechanisms
- Need cross-browser compatibility
- Want to fail specific requests while keeping others working

**Use Scenario 3 (Manual)** when:
- Testing event listener logic
- Need fastest test execution
- Testing on Firefox or other non-Chromium browsers
- Only testing UI response to events (not actual network behavior)
- Unit testing offline/online event handlers

### Summary

1. **Scenario 1 (CDP)** - Most realistic, actually disconnects the browser from the network
2. **Scenario 2 (Intercept)** - Most practical for API testing, works across all browsers
3. **Scenario 3 (Manual)** - Fastest and most compatible, but only simulates events

Each approach tests different aspects of offline functionality, and combining all three provides comprehensive coverage.

---

## 📁 Folder Structure

```
cypress-offline-demo/
│
├── cypress/                      # Cypress test directory
│   ├── e2e/                      # End-to-end test files
│   │   └── offline.cy.js         # Offline testing scenarios
│   └── screenshots/              # Test screenshots (auto-generated)
│
├── node_modules/                 # Dependencies (auto-generated)
│
├── app.js                        # Application JavaScript logic
├── index.html                    # Main HTML page
├── cypress.config.js             # Cypress configuration
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
└── README.md                     # This file
```

### Key Files Explained

- **`index.html`**: Simple web page with network status indicator and user fetch functionality
- **`app.js`**: Handles online/offline events and API data fetching
- **`cypress/e2e/offline.cy.js`**: Contains three test scenarios for offline behavior
- **`cypress.config.js`**: Configures Cypress with baseUrl and other settings

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome recommended for CDP features)

Verify installation:
```bash
node --version
npm --version
```

---

## 🚀 Implementation from Scratch

Follow these steps to build this project from the ground up:

### Step 1: Initialize the Project

```bash
# Create project directory
mkdir cypress-offline-demo
cd cypress-offline-demo

# Initialize npm project
npm init -y
```

### Step 2: Install Cypress

```bash
# Install Cypress as a dev dependency
npm install --save-dev cypress
```

### Step 3: Create Application Files

**Create `index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline Testing Demo</title>
    <style>
        body { font-family: sans-serif; padding: 2rem; }
        #network-status {
            padding: 1rem;
            background-color: #ffdddd;
            color: #d8000c;
            border: 1px solid #d8000c;
            margin-bottom: 1rem;
            display: none;
        }
        #network-status.visible { display: block; }
        .user-card { border: 1px solid #ccc; padding: 10px; margin-bottom: 5px; }
        #error-msg { color: red; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Cypress Offline Testing Demo</h1>
    <div id="network-status">⚠️ You are currently offline!</div>
    <button id="fetch-btn">Fetch Users</button>
    <div id="error-msg"></div>
    <div id="user-list"></div>
    <script src="app.js"></script>
</body>
</html>
```

**Create `app.js`:**
```javascript
const statusDiv = document.getElementById('network-status');
const fetchBtn = document.getElementById('fetch-btn');
const userList = document.getElementById('user-list');
const errorMsg = document.getElementById('error-msg');

// Handle Online/Offline Events
function updateOnlineStatus() {
    if (navigator.onLine) {
        statusDiv.classList.remove('visible');
    } else {
        statusDiv.classList.add('visible');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Data Fetching Logic
fetchBtn.addEventListener('click', async () => {
    errorMsg.textContent = '';
    userList.innerHTML = 'Loading...';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Network response was not ok');

        const users = await response.json();
        userList.innerHTML = users.map(user =>
            `<div class="user-card"><strong>${user.name}</strong> (${user.email})</div>`
        ).join('');
    } catch (error) {
        console.error('Fetch error:', error);
        userList.innerHTML = '';
        errorMsg.textContent = 'Error: Failed to fetch data. Please check your connection.';
    }
});
```

### Step 4: Configure Cypress

**Create `cypress.config.js`:**
```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:8080',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: false,
    },
});
```

### Step 5: Create Cypress Tests

**Create `cypress/e2e/offline.cy.js`:**
```javascript
describe('Offline Testing Scenarios', () => {

    // Helper to simulate offline mode via CDP
    const goOffline = () => {
        cy.log('**Going Offline via CDP**')
        return cy.wrap(
            Cypress.automation('remote:debugger:protocol', {
                command: 'Network.enable',
            })
        ).then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.emulateNetworkConditions',
                params: {
                    offline: true,
                    latency: 0,
                    downloadThroughput: 0,
                    uploadThroughput: 0,
                },
            })
        })
    }

    const goOnline = () => {
        cy.log('**Going Online via CDP**')
        return cy.wrap(
            Cypress.automation('remote:debugger:protocol', {
                command: 'Network.enable',
            })
        ).then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.emulateNetworkConditions',
                params: {
                    offline: false,
                    latency: 0,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                },
            })
        })
    }

    beforeEach(() => {
        goOnline()
        cy.visit('/')
    })

    it('Scenario 1: Full Offline Mode (CDP) - Checks UI Indicator', () => {
        cy.get('#network-status').should('not.be.visible')
        goOffline()
        cy.get('#network-status').should('be.visible')
            .and('contain', 'You are currently offline')
        goOnline()
        cy.get('#network-status').should('not.be.visible')
    })

    it('Scenario 2: Network Request Failure (cy.intercept) - Checks Error Handling', () => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', { forceNetworkError: true }).as('getUsers')
        cy.get('#fetch-btn').click()
        cy.wait('@getUsers')
        cy.get('#error-msg').should('be.visible')
            .and('contain', 'Error: Failed to fetch data')
        cy.get('.user-card').should('not.exist')
    })

    it('Scenario 3: Manual Event Triggering - Checks Event Listeners', () => {
        cy.window().then((win) => {
            Object.defineProperty(win.navigator, 'onLine', { value: false, configurable: true })
            win.dispatchEvent(new Event('offline'))
        })
        cy.get('#network-status').should('be.visible')
        
        cy.window().then((win) => {
            Object.defineProperty(win.navigator, 'onLine', { value: true, configurable: true })
            win.dispatchEvent(new Event('online'))
        })
        cy.get('#network-status').should('not.be.visible')
    })
})
```

### Step 6: Update package.json

Add `"type": "commonjs"` to your `package.json`:
```json
{
  "name": "cypress-offline-demo",
  "version": "1.0.0",
  "type": "commonjs",
  "devDependencies": {
    "cypress": "^15.7.0"
  }
}
```

---

## 🧪 Running Tests

### Option 1: Quick Start (Recommended)

```bash
# Terminal 1: Start the local web server
npx http-server -p 8080

# Terminal 2: Run Cypress tests in headless mode
npx cypress run
```

### Option 2: Interactive Mode (For Development)

```bash
# Terminal 1: Start the local web server
npx http-server -p 8080

# Terminal 2: Open Cypress Test Runner
npx cypress open
```

Then:
1. Click on "E2E Testing"
2. Select your browser (Chrome recommended)
3. Click on `offline.cy.js` to run the tests

### Option 3: Run Specific Tests

```bash
# Run only one test file
npx cypress run --spec "cypress/e2e/offline.cy.js"

# Run in headed mode (see the browser)
npx cypress run --headed

# Run in specific browser
npx cypress run --browser chrome
```

### Expected Output

When tests run successfully, you should see:
```
  Offline Testing Scenarios
    ✓ Scenario 1: Full Offline Mode (CDP) - Checks UI Indicator
    ✓ Scenario 2: Network Request Failure (cy.intercept) - Checks Error Handling
    ✓ Scenario 3: Manual Event Triggering - Checks Event Listeners

  3 passing
```

---

## 🔍 Testing Scenarios Explained

### Scenario 1: Full Offline Mode (CDP)

**What it does:**
- Uses Chrome DevTools Protocol to simulate complete network disconnection
- Triggers browser's native offline/online events

**Use Cases:**
- Testing "You are offline" banners
- Service Worker caching behavior
- Progressive Web App (PWA) offline functionality
- Network status indicators

**Code Example:**
```javascript
Cypress.automation('remote:debugger:protocol', {
    command: 'Network.emulateNetworkConditions',
    params: { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 }
})
```

**Limitations:**
- Only works with Chromium-based browsers
- Requires CDP support

---

### Scenario 2: Network Request Failure (cy.intercept)

**What it does:**
- Intercepts specific API calls and forces network errors
- Browser remains "online" but specific requests fail

**Use Cases:**
- Testing error handling for failed API requests
- Simulating intermittent network issues
- Testing retry logic
- Validating error messages without full offline mode

**Code Example:**
```javascript
cy.intercept('GET', 'https://api.example.com/users', { 
    forceNetworkError: true 
}).as('getUsers')
```

**Advantages:**
- Works across all browsers
- More granular control (fail specific requests)
- Doesn't affect other network traffic

---

### Scenario 3: Manual Event Triggering

**What it does:**
- Manually dispatches `offline` and `online` events
- Stubs `navigator.onLine` property

**Use Cases:**
- Testing event listeners when CDP is unavailable
- Cross-browser testing (including Firefox)
- Simple UI logic checks
- Unit testing event handlers

**Code Example:**
```javascript
cy.window().then((win) => {
    Object.defineProperty(win.navigator, 'onLine', { value: false, configurable: true })
    win.dispatchEvent(new Event('offline'))
})
```

**Advantages:**
- Browser-agnostic (works everywhere)
- Fast and lightweight
- Good for testing event listener logic

**Limitations:**
- Doesn't actually block network requests
- Only tests UI response to events

---

## 🛠️ Troubleshooting

### Issue: "http-server: command not found"

**Solution:**
```bash
npm install -g http-server
# OR use npx (recommended)
npx http-server -p 8080
```

### Issue: Tests fail with "baseUrl" error

**Solution:** Ensure the local server is running on port 8080 before running tests.

### Issue: CDP commands not working

**Solution:** 
- Ensure you're using Chrome or another Chromium-based browser
- CDP only works with Chromium browsers
- Use Scenario 2 or 3 for Firefox/other browsers

### Issue: Port 8080 already in use

**Solution:**
```bash
# Use a different port
npx http-server -p 8081

# Update cypress.config.js baseUrl to match
baseUrl: 'http://localhost:8081'
```

---

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Network Emulation in Cypress](https://docs.cypress.io/api/commands/intercept)

---

## 👤 Author

Saran Kumar

---

## 📄 License

ISC
