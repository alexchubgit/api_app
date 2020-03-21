"use strict";

const express = require('express');
const auth = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const withAuth = require('../middleware');
const connection = require('../connection');

const SECRET_KEY = 'cAtwa1kkEy'

//Авторизация
auth.post('/login', (req, res) => {

    const login = req.body.login;
    const password = md5(req.body.password);
    let payload = {}

    connection.query('SELECT * FROM persons LEFT JOIN role USING(idrole) WHERE `cellular` = "' + login + '" AND `passwd` = "' + password + '" OR `business` = "' + login + '" AND `passwd` = "' + password + '" LIMIT 1', (err, rows) => {

        //здесь проверяем авторизацию и создаем токен
        if (rows.length == 0) {
            res.json({ message: 'Запрос не выполнен' });
        } else {
            payload = {
                idperson: rows[0].idperson,
                name: rows[0].name,
                phone: rows[0].cellular,
                role: rows[0].role
            };

            //здесь создается JWT
            const token = jwt.sign(payload, SECRET_KEY, {
                expiresIn: 60 * 60 * 24 // истекает через 24 часа 
            });

            res.json({ message: 'Запрос выполнен', token: token });

        }
    })
})

//Работа с токеном
auth.get('/checktoken', (req, res, next) => {

    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                res.json({ success: true, message: 'Good to authenticate token.', token: decoded });
                //req.decoded = decoded;
                //next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

//Закрытый маршрут
auth.get('/api/secret', withAuth, function (req, res) {
    console.log(req.decoded);
    res.send('Запрос после авторизации выполнен');
});


module.exports = auth;