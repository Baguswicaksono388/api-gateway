'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const HOST = 'localhost'
const PORT = 3001;
const PROTOCOL = 'http'

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/fakeapi', (req, res) => {
    res.send('Hello from fake api server');
});

app.post('/bagusapi', (req, res) => {
    const input = req.body.input
    
    if (!input) {
        res.status(422).json({
            message: 'Cannot be empty'
        });
    } else {
        res.status(200).json({
            message: 'Success',
            data: input
        })
    }
});

app.listen(PORT, () => {
    axios({
            method: 'POST',
            url: 'http://localhost:3000/register',
            headers: {'Content-Type': 'application/json'},
            data: {
                apiName:"registrytest",
                protocol: PROTOCOL,
                host: HOST,
                port:PORT,
            }
        }).then((response) => {
            console.log(response.data);
        }).catch(err => {
            console.log(err)
        })
    console.log(`FAKE Api Server started on port `+ PORT);
});