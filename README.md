# Automated Testing for the Contact List App using Playwright (TypeScript)

## Overview
This project will implement an automated testing suite using the Playwright framework with TypeScript to validate the core functionalities of the Contact List App. The aim is to create a robust, maintainable, and scalable testing framework that adheres to best practices, with a focus on enhancing test coverage and enabling continuous integration (CI) capabilities.

## Prerequisites

- Node.js (v20.15.1)
- npm (v10.7.0)
- Typescript
- Playwright
- Git

## Justification for Choosing TypeScript
TypeScript was chosen as the primary language for this project due to its unique combination of developer productivity, robustness, and alignment with modern development practices. Here are the specific reasons for selecting TypeScript:

**Type Safety**
   - Error Reduction: TypeScript adds static typing to JavaScript, enabling the detection of type-related errors at compile time rather than at runtime. This improves code quality and reduces bugs.
   - Stronger Contracts: Features like interfaces and type aliases allow defining robust data structures, making API contracts more predictable and maintainable.
   - Tooling Support: IDEs like VSCode offer better autocompletion, refactoring, and inline error checking with TypeScript.

## Framework Structure
```bssh
HarborLab_Assessment/
├── main/
│   ├── fixtures     
│   ├── pages
│   ├── utils 
├── resources/
│   ├── config 
├── tests/
│   ├── gui 
│       ├── Check_Logout.test.ts
│       ├── Create_validate_user.test.ts
│       ├── Delete_contact.test.ts
│       ├── Invalid_dob.test.ts   
├── playwright.config.ts
├── package.json        
├── tsconfig.json       
└── README.md           
```
## Test Scenarios

1. **E2E Happy flow**
2. **Delete a contact**
3. **Create a contact with invalid DOB**
4. **Check Logout functionality**

# Installation and Setup

1. Clone the Repository
```bash
git clone git@github.com:GiannisKarampas/ContactListApp.git
```
2. Install Dependencies
```bash
npm run initialize
```

## Commands

Here are some examples of how to execute several processes via command line.

-   Runs the tests in a specific file (without env variables):

```bash
 npx playwright test test/gui/test_name
```

-   Starts the interactive UI mode:

```bash
 npx playwright test --ui
```

-   Generates and open allure report:

```bash
  npm run allure

  OR

  allure generate ./test-results/allure-reporter/my-allure-results -o ./test-results/allure-report --clean && allure open ./test-results/allure-report
```

## Running Tests Using NPM Scripts

The project includes several NPM scripts to simplify running tests and viewing reports. These can be run using the following commands:

- Run all the tests
```bash
npm run test
```

- Generate Allure Report After Test Run:
```bash
npm run test:report
```

## Areas for Improvement

1. Test Coverage: Add more scenarios, such as UI responsiveness.
   2. Field Validation: Test form validation for signup and login (e.g., invalid email format, weak passwords).
   3. Duplicate Entry Prevention: Attempt to create a contact with the same details and verify duplicate prevention.
   4. Edit a Contact: Update an existing contact's details and verify changes are saved.
2. Data Management: Implement better approach of data generation or use a mock server.
3. Continuous Execution: Integrate with CI tools like GitHub Actions or Jenkins.
4. Apply Cucumber to make it the test cases more friendly/readable