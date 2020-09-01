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

    if ((login !== undefined) && (password !== undefined)) {

        connection.query('SELECT * FROM persons LEFT JOIN role USING(idrole) WHERE `cellular` = "' + login + '" AND `passwd` = "' + password + '" OR `business` = "' + login + '" AND `passwd` = "' + password + '" LIMIT 1', (err, rows) => {

            //здесь проверяем авторизацию и создаем токен
            if (rows.length == 0) {
                res.json({ success: false, message: 'Логин или пароль указаны неверно' });
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

                res.json({ success: true, message: 'Запрос выполнен. Токен получен', token: token });

            }
        })
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }

})

auth.get('/getuser', (req, res) => {

    //Проверка токена из видео урока
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        res.status(401).json({ success: false, message: "Token not provided!" });
    }

    const token = authHeader.replace('token ', '')

    //console.log('middleware ' + token);

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        //ошибка заголовков
        //res.status(200).json({ success: true, message: 'Good to authenticate token.' });

        //console.log('decode ' + decoded.role + ' ' + decoded.name);
        res.send(decoded);

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ success: false, message: "Token invalid!" });
        }
    }
});

module.exports = auth;