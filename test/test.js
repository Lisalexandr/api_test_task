const request = require('supertest');
const app = require('../app');
const assert = require('assert');

let server = app.listen(3000, () => console.log(`Test app is running!`))

// Dummy GET tests to make sure that app is working ok

describe('GET pages', function () {

    it('main page should respond with text "Test app for WG" and status 200', function (done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Test app for WG!')
            .expect(200, done);
    });
    it('/test page should respond with text "This is test page" and status 200', function (done) {
        request(app)
            .get('/test')
            .set('Accept', 'application/json')
            .expect('This is test page')
            .expect(200, done);
    });
});

// Dummy POST test
describe('POST /api', function () {
    it('respond with code 200 and token', function (done) {
        request(app)
            .post('/api')
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ 'token': 'I am your POST response' })
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

const tokenLength = 13
const userName = `my_test_user`
const userPassword = `my_test_password`
const reportContent = `some report text`

let authToken
const randomPriority = Math.floor(Math.random() * 5) + 1

describe('POST /api/auth', function () {

    it('should respond with status 200 and a correct token if auth is success', async () => {
        await request(app)
            .post('/api/auth')
            .send({ username: userName, password: userPassword })
            .expect(200)
            .expect(response => {
                authToken = 'token ' + response.body.token;
                assert.strictEqual(typeof (response.body.token), 'number');
                assert.strictEqual(response.body.token.toString().length, tokenLength)
            })
    });

    it('should respond with status 400 if username is empty', async () => {
        await request(app)
            .post('/api/auth')
            .send({ username: "", password: userPassword })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Username is incorrect");
            })
    });

    it('should respond with status 400 if username is missimg', async () => {
        await request(app)
            .post('/api/auth')
            .send({ password: userPassword })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Username is incorrect");
            })
    });

    it('should respond with status 400 if password is empty', async () => {
        await request(app)
            .post('/api/auth')
            .send({ username: userName, password: "" })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Password is incorrect");
            })
    });

    it('should respond with status 400 if password is missing', async () => {
        await request(app)
            .post('/api/auth')
            .send({ username: userName })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Password is incorrect");
            })
    });
})

describe('POST /api/submit_report', function () {

    it('should respond with "Sucess" message and code 200 if request is correct', async () => {
        await request(app)
            .post('/api/submit_report')
            .set('Authorization', authToken)
            .send({ priority: randomPriority, report: reportContent })
            .expect(200)
            .expect('Success')
    });

    it('should respond with an error "Report is a required field" and code 400 if report has no value', async () => {
        await request(app)
            .post('/api/submit_report')
            .set('Authorization', authToken)
            .send({ priority: randomPriority, report: "" })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Report is a required field");
            })
    });

    it('should respond with an error "Report is a required field" and code 400 if report is missing', async () => {
        await request(app)
            .post('/api/submit_report')
            .set('Authorization', authToken)
            .send({ priority: randomPriority })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Report is a required field");
            })
    });

    it('should respond with an error "Priority is out of range" and code 400 if priority > 1', async () => {
        await request(app)
            .post('/api/submit_report')
            .set('Authorization', authToken)
            .send({ priority: 0, report: reportContent })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Priority is out of range");
            })
    });

    it('should respond with an error "Priority is out of range" and code 400 if priority < 5', async () => {
        await request(app)
            .post('/api/submit_report')
            .set('Authorization', authToken)
            .send({ priority: 6, report: reportContent })
            .expect(400)
            .expect(response => {
                assert.strictEqual(response.body.error, "Priority is out of range");
            })
    });
    this.afterAll(() => {
        server.close();
    })
})
