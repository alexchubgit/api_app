"use strict";

const express = require('express');
const pos = express.Router();
const withAuth = require('../middleware');
const connection = require('../connection');


//Список должностей
pos.get('/pos', (req, res) => {
    connection.query("SELECT * FROM pos ORDER BY `pos`", (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

//Одна должность
pos.get('/one_pos', (req, res) => {
    const idpos = req.query.idpos;
    if (idpos !== undefined) {
        connection.query('SELECT * FROM pos WHERE idpos like ' + idpos + ' LIMIT 1', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Список для поиска должностей
pos.get('/list_pos', (req, res) => {
    const query = req.query.query;
    if (query !== undefined) {
        connection.query('SELECT * FROM pos WHERE pos like "%' + val + '%" LIMIT 5', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Добавить должность
pos.post('/add_pos', withAuth, (req, res) => {
    const pos = req.body.pos;
    if (pos !== undefined) {
        connection.query("INSERT INTO pos (pos) VALUES (?)", [pos], (err, result) => {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.insertId);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Обновить должность
pos.put('/upd_pos', withAuth, (req, res) => {
    const idpos = req.body.idpos;
    const pos = req.body.pos;
    if ((idpos !== undefined) && (pos !== undefined)) {
        connection.query('UPDATE pos SET pos="' + pos + '" WHERE idpos="' + idpos + '"', (err, result) => {
            if (err) throw err;
            console.log(`Changed ${result.changedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});


//Удаление должности
pos.delete('/del_pos', withAuth, (req, res) => {
    const idpos = req.body.idpos;
    if (idpos !== undefined) {
        connection.query('DELETE FROM pos WHERE idpos = "' + idpos + '"', (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});


module.exports = pos;
