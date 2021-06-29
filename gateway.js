const express = require('express');
const helmet = require('helmet');
const app = express();
const registry = require('./routes/registry.json');
const routes = require('./routes');
const PORT = 3000;

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(express.json());
// app.use(helmet()); //add security

const auth = (req, res, next) => {
    const url = req.protocol + '://' + req.host + ':' + PORT + req.path; //output http://localhost:3000/register
    const authString = Buffer.from(req.headers.authorization, 'base64').toString('utf8');
    const authParts = authString.split(':');
    const username = authParts[0];
    const password = authParts[1];
    console.log(authString);
    console.log(username + ' | ' + password);
    const user = registry.auth.users[username]; //output { username: 'bagus', password: 'password' }
    if (user) {
        if (user.username === username && user.password === password) {
            next();
        } else {
            res.send({
                authenticated: false,
                path: url,
                message: 'Authentication Unsuccessful: Incorrect password'
            });
        }
    } else {
        res.send({
            authenticated: false,
            path: url,
            message: 'Authentication Unsuccessful: User '+ username + 'does not exist'
        });
    }
}

app.get('/ui', (req, res) => {
    res.render('index', {services: registry.services});
})
app.use(auth);
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Gateway started on port ` + PORT);
});