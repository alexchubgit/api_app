"use strict";

const express = require('express');
const auth = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
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

module.exports = auth;