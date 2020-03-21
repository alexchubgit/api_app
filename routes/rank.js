"use strict";

const express = require('express');
const rank = express.Router();
const connection = require('../connection');


//Список званий
rank.get('/rank', (req, res) => {
    connection.query("SELECT * FROM ranks ORDER BY `rank`", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Одно звание
rank.get('/one_rank', (req, res) => {
    const val = req.query.idrank;
    connection.query('SELECT * FROM ranks WHERE idrank like ' + val + ' LIMIT 1', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Список для поиска званий
rank.get('/list_rank', (req, res) => {
    const val = req.query.query;
    connection.query('SELECT * FROM ranks WHERE rank like "%' + val + '%" LIMIT 5', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Добавить звание
rank.post('/add_rank', (req, res) => {
    const rank = req.body.rank;
    connection.query("INSERT INTO ranks (rank) VALUES (?)", [rank], (err, result) => {
        if (err) throw err;
        console.log("1 record inserted, ID: " + result.affectedRows);
        res.send("1");
    });
});

//Обновить звание
rank.post('/upd_rank', (req, res) => {
    const idrank = req.body.idrank;
    const rank = req.body.rank;
    const sql = 'UPDATE ranks SET rank="' + rank + '" WHERE idrank="' + idrank + '"';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Changed ${result.changedRows} row(s)`);
        res.send("1");
    });
});

//Удаление звание
rank.post('/del_rank', (req, res) => {
    const idrank = req.body.idrank;
    connection.query('DELETE FROM ranks WHERE idrank = "' + idrank + '"', (err, result) => {
        if (err) throw err;
        console.log(`Deleted ${result.affectedRows} row(s)`);
        res.send("1");
    });
});


module.exports = rank;