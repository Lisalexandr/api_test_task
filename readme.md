# api-test-task

Tests that checks an API service.

Task: Create auth token with correct username and password and with this token submit test report.
Report has "priority" (in range 1-5) and "content" (required) fields.

Installation
-
1. Make sure you have a node.js v8.16 or higher
2. Run `npm install` to install dependencies
3. Run `npm test` to start tests

Structure
-
- `app.js` file contains a simple api with a POST and GET methods
- `test.js` file that contains the actual tests

Framework
-
- Mocha (https://mochajs.org/) as a test framework
- Supertest (https://www.npmjs.com/package/supertest) for API requests
