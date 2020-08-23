"use strict";

const express = require('express');
const cors = require('cors');

//const mysql = require('mysql');
//const md5 = require('md5');
//const jwt = require('jsonwebtoken');
//const config = require('./config');
//const withAuth = require('./middleware');

const port = process.env.PORT || 4200

const app = express()

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.disable('x-powered-by');

const addr = require('./routes/addr');
const auth = require('./routes/auth');
const dep = require('./routes/dep');
const persons = require('./routes/persons');
const place = require('./routes/place');
const pos = require('./routes/pos');
const rank = require('./routes/rank');

//Connect all our routes to our application
app.get('/addr', addr);
app.get('/one_addr', addr);
app.get('/list_addr', addr);
app.post('/add_addr', addr);
app.put('/upd_addr', addr);
app.delete('/del_addr', addr);

app.post('/login', auth);
app.get('/checktoken', auth);
app.get('/api/secret', auth);

app.get('/dep', dep);
app.get('/one_dep', dep);
app.get('/list_dep', dep);
app.post('/add_dep', dep);
app.put('/upd_dep', dep);
app.delete('/del_dep', dep);

app.get('/persons', persons);
app.get('/dismissed', persons);
app.get('/one_person', persons);
app.get('/list_persons', persons);
app.get('/dates', persons);
app.get('/dates_today', persons);
app.get('/search', persons);
app.post('/add_person', persons);
app.post('/dismiss', persons);
app.put('/upd_person', persons);
app.delete('/del_person', persons);

app.get('/place', place);
app.get('/one_place', place);
app.post('/add_place', place);
app.post('/del_person_place', place);
app.put('/upd_place', place);
app.delete('/del_place', place);

app.get('/pos', pos);
app.get('/one_pos', pos);
app.get('/list_pos', pos);
app.post('/add_pos', pos);
app.put('/upd_pos', pos);
app.delete('/del_pos', pos);

app.get('/rank', rank);
app.get('/one_rank', rank);
app.get('/list_rank', rank);
app.post('/add_rank', rank);
app.put('/upd_rank', rank);
app.delete('/del_rank', rank);


//Start Express server on defined port
app.listen(port);

//Log to console to let us know it's working
console.log('API server started on: ' + port);