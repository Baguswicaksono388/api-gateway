// 'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');
const registry = require('./registry.json');
const fs = require('fs');
const { error } = require('console');

// all untuk semua method (get, post, dll)
router.all('/:apiName/:path', (req, res, next) => {
    console.log(req.params.apiName);
    if (registry.services[req.params.apiName]) {        
        axios({
            method: req.method,
            url: registry.services[req.params.apiName].url + req.params.path,
            headers: req.headers,
            data: req.body
        }).then((response) => {
            res.send(response.data);
        }).catch(err => {
            res.status(422).json({
                message : err
            });
        })
    } else {
        res.send("API Name doesn't exist");
    }
});

// EndPoint
router.post('/register', (req, res) => {
    const registrationInfo = req.body;
    if (apiAlreadyExists(registrationInfo)) {
        // return already exists
        res.send("Configuration already exists for "+ registrationInfo.apiName + " at "+ registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/");
    } else {
        registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/"
        
        registry.services[registrationInfo.apiName].push({ ...registrationInfo })
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not register '"+ registrationInfo.apiName + "'\n" + error);
            } else {
                res.send("Successfully registerered '"+ registrationInfo.apiName + "'");
            }
        });
    }
});

router.post('/unregister', (req, res) => {
    const registrationInfo = req.body;

    if (apiAlreadyExists(registrationInfo)) {
        const index = registry.services[registrationInfo.apiName].findIndex((instance) => {
            return registrationInfo.url === instance.url
        });
        registry.services[registrationInfo.apiName].splice(index, 1);
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not unregister '"+ registrationInfo.apiName + "'\n" + error);
            } else {
                res.send("Successfully unregistered '"+ registrationInfo.apiName + "'");
            }
        });
    } else {
        res.send("Configuration does not exist for " + registrationInfo.apiName + " at " + registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/");
    }
});

const apiAlreadyExists = (registrationInfo) => {
    let exists = false
    const url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/"
    registry.services[registrationInfo.apiName].forEach(instance => {
        if (instance.url === url) {
            return exists = true;
        }
    });

    return exists;
}

module.exports = router;
