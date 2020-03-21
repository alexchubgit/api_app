"use strict";

const express = require('express');
const addr = express.Router();
const connection = require('../connection');


//Список адресов
addr.get('/addr', (req, res) => {
    connection.query("SELECT * FROM addr ORDER BY `addr`", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Один адрес
addr.get('/one_addr', (req, res) => {
    const val = req.query.idaddr;
    connection.query('SELECT * FROM addr WHERE idaddr like ' + val + ' LIMIT 1', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Список для поиска адресов
addr.get('/list_addr', (req, res) => {
    const val = req.query.query;
    connection.query('SELECT * FROM addr WHERE addr like "%' + val + '%" LIMIT 5', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Добавить адрес
addr.post('/add_addr', (req, res) => {

    const addr = req.body.addr;
    const postcode = req.body.postcode;
    const lat = req.body.lat;
    const lng = req.body.lng;

    connection.query('INSERT INTO addr (addr, lat, lng, postcode) VALUES (?, ?, ?, ?)', [addr, lat, lng, postcode], (err, result) => {
        if (err) throw err;
        console.log("1 record inserted, ID: " + result.insertId);
        res.send("1");
    });
});

//Обновить адрес
addr.post('/upd_addr', (req, res) => {

    const idaddr = req.body.idaddr;
    const addr = req.body.addr;
    const postcode = req.body.postcode;
    const lat = req.body.lat;
    const lng = req.body.lng;

    const sql = 'UPDATE addr SET addr="' + addr + '", postcode="' + postcode + '", lat="' + lat + '", lng="' + lng + '" WHERE idaddr="' + idaddr + '"';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Changed ${result.changedRows} row(s)`);
        res.send("1");
    });
});

//Удаление адреса
addr.post('/del_addr', (req, res) => {

    const idaddr = req.body.idaddr;

    connection.query('DELETE FROM addr WHERE idaddr = "' + idaddr + '"', (err, result) => {
        if (err) throw err;
        console.log(`Deleted ${result.affectedRows} row(s)`);
        res.send("1");
    });
});



module.exports = addr;