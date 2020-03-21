"use strict";

const express = require('express');
const place = express.Router();
const connection = require('../connection');


//Список рабочих мест
place.get('/place', (req, res) => {
    const idaddr = req.query.idaddr;
    connection.query('SELECT * FROM places LEFT JOIN persons USING(idperson) WHERE idaddr = ' + idaddr + ' ORDER BY place;', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Добавить рабочее место
place.post('/add_place', (req, res) => {

    const place = req.body.place;
    const work = req.body.work;
    const internal = req.body.internal;
    const fax = req.body.fax;
    const email = req.body.email;
    const idaddr = req.body.idaddr;
    const idperson = req.body.idperson;

    connection.query('INSERT INTO places (place, work, internal, fax, email, idaddr, idperson) VALUES (?, ?, ?, ?, ?, ?, ?)', [place, work, internal, fax, email, idaddr, idperson], (err, result) => {
        if (err) throw err;
        console.log("1 record inserted, ID: " + result.insertId);
        res.send("1");
    });
});

//Обновить рабочее место
place.post('/upd_place', (req, res) => {

    const place = req.body.place;
    const work = req.body.work;
    const internal = req.body.internal;
    const fax = req.body.fax;
    const email = req.body.email;
    const idaddr = req.body.idaddr;
    const idperson = req.body.idperson;
    const idplace = req.body.idplace;

    const sql = 'UPDATE places SET place="' + place + '", work="' + work + '", internal="' + internal + '", fax="' + fax + '", email="' + email + '", idaddr="' + idaddr + '", idperson="' + idperson + '" WHERE idplace="' + idplace + '"';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Changed ${result.changedRows} row(s)`);
        res.send("1");
    });
});

//Удаление рабочего места
place.post('/del_place', (req, res)=>{
    const idplace = req.body.idplace;
    connection.query('DELETE FROM places WHERE idplace = "' + idplace + '"', (err, result)=>{
        if (err) throw err;
        console.log(`Deleted ${result.affectedRows} row(s)`);
        res.send("1");
    });
});

//Убрать сотрудника с места
place.post('/del_person_place', (req, res)=>{
    const idplace = req.body.idplace;
    const sql = 'UPDATE places SET idperson="0" WHERE idplace="' + idplace + '"';
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        console.log(`Changed ${result.changedRows} row(s)`);
        res.send("1");
    });
});



module.exports = place;