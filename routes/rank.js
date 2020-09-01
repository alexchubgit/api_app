"use strict";

const express = require('express');
const rank = express.Router();
const withAuth = require('../middleware');
const connection = require('../connection');


//Список званий
rank.get('/rank', (req, res) => {
    connection.query("SELECT * FROM ranks ORDER BY `rank`", (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

//Одно звание
rank.get('/one_rank', (req, res) => {
    const idrank = req.query.idrank;
    if (idrank !== undefined) {
        connection.query('SELECT * FROM ranks WHERE idrank like ' + idrank + ' LIMIT 1', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Список для поиска званий
rank.get('/list_rank', (req, res) => {
    const query = req.query.query;
    if (query !== undefined) {
        connection.query('SELECT * FROM ranks WHERE rank like "%' + query + '%" LIMIT 5', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Добавить звание
rank.post('/add_rank', withAuth, (req, res) => {
    const rank = req.body.rank;
    if (rank !== undefined) {
        connection.query("INSERT INTO ranks (rank) VALUES (?)", [rank], (err, result) => {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.affectedRows);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Обновить звание
rank.put('/upd_rank', withAuth, (req, res) => {
    const idrank = req.body.idrank;
    const rank = req.body.rank;
    if ((idrank !== undefined) && (rank !== undefined)){
        connection.query('UPDATE ranks SET rank="' + rank + '" WHERE idrank="' + idrank + '"', (err, result) => {
            if (err) throw err;
            console.log(`Changed ${result.changedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});

//Удаление звание
rank.delete('/del_rank', withAuth, (req, res) => {

    const idrank = req.body.idrank;
    if (idrank !== undefined) {
        connection.query('DELETE FROM ranks WHERE idrank = "' + idrank + '"', (err, result) => {
            if (err) throw err;
            console.log(`Deleted ${result.affectedRows} row(s)`);
            res.json({ success: true, message: 'Запрос выполнен' });
        });
    } else {
        res.json({ success: 'false', message: 'Запрос передан без параметра' });
    }
});


module.exports = rank;