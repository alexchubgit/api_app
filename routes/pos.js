"use strict";

const express = require('express');
const pos = express.Router();
const connection = require('../connection');


//Список должностей
pos.get('/pos', (req, res) => {
    connection.query("SELECT * FROM pos ORDER BY `pos`", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Одна должность
pos.get('/one_pos', (req, res) => {
    const val = req.query.idpos;
    connection.query('SELECT * FROM pos WHERE idpos like ' + val + ' LIMIT 1', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Список для поиска должностей
pos.get('/list_pos', (req, res) => {
    const val = req.query.query;
    connection.query('SELECT * FROM pos WHERE pos like "%' + val + '%" LIMIT 5', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Добавить должность
pos.post('/add_pos', (req, res) => {
    const pos = req.body.pos;
    connection.query("INSERT INTO pos (pos) VALUES (?)", [pos], (err, result) => {
        if (err) throw err;
        console.log("1 record inserted, ID: " + result.insertId);
        res.send("1");
    });
});

//Обновить должность
pos.put('/upd_pos', (req, res) => {
    const idpos = req.body.idpos;
    const pos = req.body.pos;
    const sql = 'UPDATE pos SET pos="' + pos + '" WHERE idpos="' + idpos + '"';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Changed ${result.changedRows} row(s)`);
        res.send("1");
    });
});


//Удаление должности
pos.delete('/del_pos', (req, res) => {

    const idpos = req.body.idpos;

    connection.query('DELETE FROM pos WHERE idpos = "' + idpos + '"', (err, result) => {
        if (err) throw err;
        console.log(`Deleted ${result.affectedRows} row(s)`);
        res.send("1");
    });
});


module.exports = pos;
