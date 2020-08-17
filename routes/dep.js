"use strict";

const express = require('express');
const dep = express.Router();
const connection = require('../connection');


//Список подразделений
dep.get('/dep', (req, res) => {
    connection.query("SELECT * FROM depart ORDER BY `sdep`", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Описание подразделения
dep.get('/one_dep', (req, res) => {
    const val = req.query.iddep;
    connection.query('SELECT depart.*, addr.*, parent.sdep AS parent, parent.iddep AS idparent, COUNT(idperson) AS count FROM depart LEFT JOIN addr USING(idaddr) LEFT JOIN persons USING(iddep) LEFT JOIN depart AS parent ON depart.idparent=parent.iddep WHERE depart.iddep like ' + val + ' LIMIT 1', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Список для поиска подразделения
dep.get('/list_dep', (req, res) => {
    const val = req.query.query;
    connection.query('SELECT * FROM depart WHERE sdep like "%' + val + '%" LIMIT 5', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Добавить подразделение
dep.post('/add_dep', (req, res) => {

    const dep = req.body.dep;
    const sdep = req.body.sdep;
    const email = req.body.email;
    const idaddr = req.body.idaddr;
    const idparent = req.body.idparent;

    connection.query('INSERT INTO depart (depart , sdep, email, idaddr, idparent) VALUES (?, ?, ?, ?, ?)', [dep, sdep, email, idaddr, idparent], (err, result) => {
        if (err) throw err;
        console.log("1 record inserted, ID: " + result.insertId);
        res.send("1");
    });
});

//Обновить подразделение
dep.put('/upd_dep', (req, res) => {

    const dep = req.body.dep;
    const sdep = req.body.sdep;
    const email = req.body.email;
    const idaddr = req.body.idaddr;
    const idparent = req.body.idparent;
    const iddep = req.body.iddep;

    const sql = 'UPDATE depart SET depart="' + dep + '", sdep="' + sdep + '", email="' + email + '", idaddr="' + idaddr + '", idparent="' + idparent + '" WHERE iddep="' + iddep + '"';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Changed ${result.changedRows} row(s)`);
        res.send("1");
    });
});

//Удаление подразделения
dep.delete('/del_dep', (req, res) => {

    const iddep = req.query.iddep;
    connection.query('DELETE FROM depart WHERE iddep = "' + iddep + '"', (err, result) => {
        if (err) throw err;
        console.log(`Deleted ${result.affectedRows} row(s)`);
        res.send("1");
    });
});


module.exports = dep;