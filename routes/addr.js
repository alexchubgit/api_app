"use strict";

const express = require('express');
const addr = express.Router();
const withAuth = require('../middleware');
const connection = require('../connection');


//Список адресов
addr.get('/addr', (req, res) => {
    connection.query("SELECT * FROM addr ORDER BY `addr`", (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

//Один адрес
addr.get('/one_addr', (req, res) => {
    const idaddr = req.query.idaddr;
    if (idaddr !== undefined) {
        connection.query('SELECT * FROM addr WHERE idaddr like ' + idaddr + ' LIMIT 1', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Список для поиска адресов
addr.get('/list_addr', (req, res) => {
    const query = req.query.query;
    if (query !== undefined) {
        connection.query('SELECT * FROM addr WHERE addr like "%' + query + '%" LIMIT 5', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Добавить адрес
addr.post('/add_addr', withAuth, (req, res) => {
    const addr = req.body.addr;
    const postcode = req.body.postcode;
    const lat = req.body.lat;
    const lng = req.body.lng;
    if (addr !== undefined) {
        connection.query('INSERT INTO addr (addr, lat, lng, postcode) VALUES (?, ?, ?, ?)', [addr, lat, lng, postcode], (err, result) => {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.insertId);
            res.status(200).json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Обновить адрес
addr.put('/upd_addr', withAuth, (req, res) => {
    const idaddr = req.body.idaddr;
    const addr = req.body.addr;
    const postcode = req.body.postcode;
    const lat = req.body.lat;
    const lng = req.body.lng;
    if ((idaddr !== undefined) && (addr !== undefined)) {
        connection.query('UPDATE addr SET addr="' + addr + '", postcode="' + postcode + '", lat="' + lat + '", lng="' + lng + '" WHERE idaddr="' + idaddr + '"', (err, result) => {
            if (err) throw err;
            console.log(`Changed ${result.changedRows} row(s)`);
            res.status(200).json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Удаление адреса
addr.delete('/del_addr', withAuth, (req, res) => {
    const idaddr = req.body.idaddr;
    if (idaddr !== undefined) {
        connection.query('DELETE FROM addr WHERE idaddr = "' + idaddr + '"', (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} row(s)`);
            res.status(200).json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});



module.exports = addr;