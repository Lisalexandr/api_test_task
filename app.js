const express = require('express')
const app = express()
const port = 3000

const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

app.use(requestTime)
app.use(express.json())
app.use(express.urlencoded())

app.get('/', (req, res) => res.send('Test app for WG!'))

app.get('/test', (req, res) => res.send('This is test page'))

app.post('/api', function (req, res) {
    res.send({'token': 'I am your POST response'})
})

app.post('/api/auth', function (req, res) {
    const myToken = req.requestTime                                             // Generate a token here

    if (typeof req.body.username === 'undefined' || req.body.username == '') {
        return res.status(400).json({'error': 'Username is incorrect'})
    } else if (typeof req.body.password === 'undefined' || req.body.password == '') {
        return res.status(400).json({'error': 'Password is incorrect'})
    } else {
        return res.json({'token': myToken})
    }
});

app.post('/api/submit_report', function (req, res) {
    // console.log(req.headers)                                                 // Uncomment to see the actual request headers

    if (typeof req.body.report === 'undefined' || req.body.report == '') {
        return res.status(400).json({'error': 'Report is a required field'})
    } else if (req.body.priority < 1 || req.body.priority > 5) {
        return res.status(400).json({'error': 'Priority is out of range'})
    } else {
        res.send('Success')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;