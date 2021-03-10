"use strict";

const express = require('express');
const place = express.Router();
const withAuth = require('../middleware');
const connection = require('../connection');


//Список рабочих мест
place.get('/place', (req, res) => {
    const idaddr = req.query.idaddr;
    connection.query('SELECT * FROM places LEFT JOIN persons USING(idperson) WHERE idaddr = ' + idaddr + ' ORDER BY place;', (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

//Одно рабочее место
place.get('/one_place', (req, res) => {
    const idplace = req.query.idplace;
    if (idplace !== undefined) {
        connection.query('SELECT * FROM places LEFT JOIN persons USING(idperson) LEFT JOIN addr USING(idaddr) WHERE idplace like ' + idplace + ' LIMIT 1', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Добавить рабочее место
place.post('/add_place', withAuth, (req, res) => {
    const place = req.body.place;
    const work = req.body.work;
    const internal = req.body.internal;
    const ipphone = req.body.ipphone;
    const arm = req.body.arm;
    const idaddr = req.body.idaddr;
    const idperson = req.body.idperson;
    if (place !== undefined) {
        connection.query('INSERT INTO places (place, work, internal, ipphone, arm, idaddr, idperson) VALUES (?, ?, ?, ?, ?, ?, ?)', [place, work, internal, ipphone, arm, idaddr, idperson], (err, result) => {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.insertId);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Обновить рабочее место
place.put('/upd_place', withAuth, (req, res) => {
    const place = req.body.place;
    const work = req.body.work;
    const internal = req.body.internal;
    const ipphone = req.body.ipphone;
    const arm = req.body.arm;
    const idaddr = req.body.idaddr;
    const idperson = req.body.idperson;
    const idplace = req.body.idplace;
    if (idplace !== undefined) {
        connection.query('UPDATE places SET place="' + place + '", work="' + work + '", internal="' + internal + '", ipphone="' + ipphone + '", arm="' + arm + '", idaddr="' + idaddr + '", idperson="' + idperson + '" WHERE idplace="' + idplace + '"', (err, result) => {
            if (err) throw err;
            console.log(`Changed ${result.changedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Удаление рабочего места
place.delete('/del_place', withAuth, (req, res) => {
    const idplace = req.body.idplace;
    if (idplace !== undefined) {
        connection.query('DELETE FROM places WHERE idplace = "' + idplace + '"', (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Убрать сотрудника с места
place.put('/del_person_place', withAuth, (req, res) => {
    const idplace = req.body.idplace;
    if (idplace !== undefined) {
        const sql = 'UPDATE places SET idperson="0" WHERE idplace="' + idplace + '"';
        connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log(`Changed ${result.changedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});



module.exports = place;