"use strict";

const express = require('express');
const dep = express.Router();
const withAuth = require('../middleware');
const connection = require('../connection');


//Список подразделений
dep.get('/dep', (req, res) => {
    connection.query("SELECT * FROM depart ORDER BY `sdep`", (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

//Описание подразделения
dep.get('/one_dep', (req, res) => {
    const iddep = req.query.iddep;
    if (iddep !== undefined) {
        connection.query('SELECT depart.*, addr.*, parent.sdep AS parent, parent.iddep AS idparent, COUNT(idperson) AS count FROM depart LEFT JOIN addr USING(idaddr) LEFT JOIN persons USING(iddep) LEFT JOIN depart AS parent ON depart.idparent=parent.iddep WHERE depart.iddep like ' + iddep + ' LIMIT 1', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Список для поиска подразделения
dep.get('/list_dep', (req, res) => {
    const query = req.query.query;
    if (query !== undefined) {
        connection.query('SELECT * FROM depart WHERE sdep like "%' + query + '%" LIMIT 5', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Добавить подразделение
dep.post('/add_dep', withAuth, (req, res) => {
    const dep = req.body.dep;
    const sdep = req.body.sdep;
    const email = req.body.email;
    const idaddr = req.body.idaddr;
    const idparent = req.body.idparent;
    if (dep !== undefined) {
        connection.query('INSERT INTO depart (depart , sdep, email, idaddr, idparent) VALUES (?, ?, ?, ?, ?)', [dep, sdep, email, idaddr, idparent], (err, result) => {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.insertId);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Обновить подразделение
dep.put('/upd_dep', withAuth, (req, res) => {
    const dep = req.body.dep;
    const sdep = req.body.sdep;
    const email = req.body.email;
    const idaddr = req.body.idaddr;
    const idparent = req.body.idparent;
    const iddep = req.body.iddep;
    if (dep !== undefined) {
        connection.query('UPDATE depart SET depart="' + dep + '", sdep="' + sdep + '", email="' + email + '", idaddr="' + idaddr + '", idparent="' + idparent + '" WHERE iddep="' + iddep + '"', (err, result) => {
            if (err) throw err;
            console.log(`Changed ${result.changedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Удаление подразделения
dep.delete('/del_dep', withAuth, (req, res) => {
    const iddep = req.body.iddep;
    if (iddep !== undefined) {
        connection.query('DELETE FROM depart WHERE iddep = "' + iddep + '"', (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});


module.exports = dep;