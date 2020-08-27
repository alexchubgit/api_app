"use strict";

const express = require('express');
const persons = express.Router();
const md5 = require('md5'); //Работа с хэшами MD5
const fs = require('fs'); //Работа с файловой системой
const path = require('path');
const formidable = require('formidable'); //Обработчик форм FormData()
const withAuth = require('../middleware');
const connection = require('../connection');


//Список людей в конкретном подразделении
persons.get('/persons', (req, res) => {
    const val = req.query.iddep;
    //const val = req.body.iddep;
    //const val = 10;

    connection.query("SELECT *, IF(file IS NULL or file = '', 'photo.png', file) as file, date_format(date,'%Y-%m-%d') AS date FROM persons LEFT JOIN depart USING(iddep) LEFT JOIN places USING(idperson) LEFT JOIN pos USING(idpos) LEFT JOIN ranks USING(idrank) WHERE iddep like " + val + " ORDER BY name", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Список уволенных людей
persons.get('/dismissed', (req, res) => {
    //const val = req.query.iddep;
    //const val = req.body.iddep;
    const val = 0;

    connection.query("SELECT *, IF(file IS NULL or file = '', 'photo.png', file) as file, date_format(date,'%Y-%m-%d') AS date FROM persons LEFT JOIN ranks USING(idrank) WHERE iddep = " + val + " ORDER BY name", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Описание одного сотрудника
persons.get('/one_person', (req, res) => {
    const val = req.query.idperson;
    //const val = req.body.iddep;
    //const val = 10;

    connection.query("SELECT *, IF(file IS NULL or file = '', 'photo.png', file) as file, date_format(date,'%Y-%m-%d') AS date FROM persons LEFT JOIN depart USING(iddep) LEFT JOIN places USING(idperson) LEFT JOIN pos USING(idpos) LEFT JOIN ranks USING(idrank) WHERE idperson like " + val + " LIMIT 1", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Список для поиска сотрудников
persons.get('/list_persons', (req, res) => {
    const val = req.query.query;
    //const val = req.body.iddep;
    //const val = 10;

    connection.query('SELECT * FROM persons LEFT JOIN depart USING(iddep) WHERE name like "%' + val + '%" LIMIT 5', (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Дни рождения
persons.get('/dates', (req, res) => {
    connection.query("SELECT *, IF(file IS NULL OR file = '', 'photo.png', file) as file, date_format(date,'%Y-%m-%d') AS date from persons LEFT JOIN depart USING(iddep) LEFT JOIN places USING(idperson) LEFT JOIN pos USING(idpos) LEFT JOIN ranks USING(idrank) WHERE date_format(now()+interval 7 day,'%m-%d')>date_format(date,'%m-%d') AND date_format(now(),'%m-%d')<date_format(date,'%m-%d') AND iddep != 0 ORDER BY `name`", (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});

//Дни рождения сотрудников сегодня
persons.get('/dates_today', (req, res) => {
    const day = new Date().toISOString().substr(5, 5);
    const sql = "SELECT *, date_format(date,'%Y-%m-%d') AS date FROM persons LEFT JOIN depart USING(iddep) LEFT JOIN pos USING(idpos) LEFT JOIN ranks USING(idrank) WHERE DATE_FORMAT(date, '%m-%d') like '" + day + "' ORDER BY `name`";
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.send(JSON.stringify(rows));
    });
});


//Поиск сотрудника
persons.get('/search', (req, res) => {
    const val = req.query.query;
    //console.log(val);

    //регулярные выражения по проверке цифр и букв
    const regexp_alph = /[a-zа-я\s]/i;
    const regexp_num = /^[0-9 \-()+]{2,16}$/i;

    if (regexp_num.test(val) == true) {

        connection.query('SELECT *, date_format(date,"%Y-%m-%d") AS date FROM persons LEFT JOIN depart USING(iddep) LEFT JOIN places USING(idperson) LEFT JOIN pos USING(idpos) LEFT JOIN ranks USING(idrank) WHERE persons.cellular like "%' + val + '%" OR persons.business like "%' + val + '%" OR places.work like "%' + val + '%" AND iddep != 0 ORDER BY persons.idperson LIMIT 10', (err, rows) => {
            if (err) throw err;
            res.send(JSON.stringify(rows));
        });

    } else if (regexp_alph.test(val) == true) {

        connection.query('SELECT *, date_format(date,"%Y-%m-%d") AS date FROM persons LEFT JOIN depart USING(iddep) LEFT JOIN places USING(idperson) LEFT JOIN pos USING(idpos) LEFT JOIN ranks USING(idrank) WHERE persons.name like "%' + val + '%" AND iddep != 0 ORDER BY persons.idperson LIMIT 10', (err, rows) => {
            if (err) throw err;
            res.send(JSON.stringify(rows));
        });
    }
});


//Уволить сотрудника
persons.put('/dismiss', withAuth, (req, res) => {
    const idperson = req.body.idperson;

    const sql = 'UPDATE persons SET iddep="0", idpos="0", idrole="0" WHERE idperson="' + idperson + '"';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Changed ${result.changedRows} row(s)`);
        res.send("1");
    });

});


//Загрузка файла
persons.post('/add_person', withAuth, (req, res) => {

    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.maxFileSize = 20 * 1024 * 1024;
    form.hash = 'sha1';
    form.uploadDir = __dirname + "/../public/photo/";
    form.keepExtensions = true;


    form.parse(req, (err, fields, files) => {

        if (err) console.error(err);

        //console.log(fields);


        let date = '';
        let file = '';

        if (fields.date == undefined) {
            date = '1970-01-01';
            //console.log(date);
        } else {
            date = fields.date;
            //console.log(date);
        }

        const name = fields.name;
        const cellular = fields.cellular;
        const business = fields.business;
        const iddep = fields.iddep;
        const idpos = fields.idpos;
        const idrank = fields.idrank;

        //проверка выбран ли файл
        if (files.file == undefined) {
            //console.log('No files selected.\n');

            //Выполняем запрос на добавление сотрудника
            connection.query('INSERT INTO persons (name, date, cellular, business, iddep, idpos, idrank, file) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, date, cellular, business, iddep, idpos, idrank, file], (err, result) => {
                if (err) throw err;
                console.log("1 record inserted, ID: " + result.insertId);

                res.send("1");
            });

        } else {

            //Allow ext
            const filetypes = /jpeg|jpg|png|gif/;
            //check ext
            const extname = filetypes.test(path.extname(files.file.name).toLowerCase());
            //check mime
            const mimetype = filetypes.test(files.file.type);

            //Если расширение и mime тип соответствуют
            if (mimetype && extname) {
                //console.log('Expansion of norms.\n');

                //Функция генерации случайного значения для нового имени            
                const newname = md5(Math.random()) + path.extname(files.file.name).toLowerCase();

                //Переименовываем загруженный файл
                fs.rename(files.file.path, form.uploadDir + newname, (err) => {
                    if (err) throw err;
                });

                //Выполняем запрос на добавление сотрудника
                connection.query('INSERT INTO persons (name, date, cellular, business, iddep, idpos, idrank, file) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, date, cellular, business, iddep, idpos, idrank, newname], (err, result) => {
                    if (err) throw err;
                    console.log("1 record inserted, ID: " + result.insertId);

                    //connection.end();

                    res.send("1");
                });

            } else {
                //console.log('Expansion is not norms.\n');

                fs.unlinkSync(files.file.path);
                console.log('Deleted: ' + files.file.path);

                res.send('0');
            }
        }
    });

    // form.parse(req, (err, fields, files) => {

    //     if (err) {
    //         console.error(err);
    //         throw err
    //     }

    //     for (const file of Object.entries(files)) {
    //         console.log(file)
    //     }

    //     console.log(fields);
    //     //console.log(files.image);
    // })

    //return res.send('POST HTTP method on user resource');
});


//Обновить сотрудника
persons.put('/upd_person', withAuth, (req, res) => {

    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.maxFileSize = 20 * 1024 * 1024;
    form.hash = 'sha1';
    form.uploadDir = __dirname + "/../public/photo/";
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {

        if (err) console.error(err);

        //console.log(fields);

        const name = fields.name;

        // const date = '1970-01-01';

        const date = fields.date;

        const cellular = fields.cellular;
        const business = fields.business;
        const iddep = fields.iddep;
        const idpos = fields.idpos;
        const idrank = fields.idrank;
        const idperson = fields.idperson;

        //проверка выбран ли файл
        if (files.file == undefined) {
            //console.log('No files selected.\n');

            const sql = 'UPDATE persons SET name="' + name + '", date="' + date + '", cellular="' + cellular + '", business="' + business + '", iddep="' + iddep + '", idpos="' + idpos + '", idrank="' + idrank + '" WHERE idperson="' + idperson + '"';

            connection.query(sql, (err, result) => {
                if (err) throw err;

                console.log("1 record inserted, ID: " + result.insertId);
                res.send("1");
            });

        } else {

            //Allow ext
            const filetypes = /jpeg|jpg|png|gif/;
            //check ext
            const extname = filetypes.test(path.extname(files.file.name).toLowerCase());
            //check mime
            const mimetype = filetypes.test(files.file.type);

            //Если расширение и mime тип соответствуют
            if (mimetype && extname) {
                //console.log('Expansion of norms.\n');

                //Функция генерации случайного значения для нового имени            
                const newname = md5(Math.random()) + path.extname(files.file.name).toLowerCase();

                //Переименовываем загруженный файл
                fs.rename(files.file.path, form.uploadDir + newname, (err) => {
                    if (err) throw err;
                });

                const sql = 'UPDATE persons SET name="' + name + '", date="' + date + '", cellular="' + cellular + '", business="' + business + '", iddep="' + iddep + '", idpos="' + idpos + '", idrank="' + idrank + '", file="' + newname + '" WHERE idperson="' + idperson + '"';

                connection.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("1 record inserted, ID: " + result.insertId);
                    res.send("1");
                });

            } else {
                //console.log('Expansion is not norms.\n');

                fs.unlinkSync(files.file.path);
                console.log('Deleted: ' + files.file.path);
                res.send('0');
            }
        }
    });
});


//Удаление сотрудника
persons.delete('/del_person', withAuth, (req, res) => {

    const idperson = req.body.idperson;

    //Выполнить выборку названия файла а потом удалить запись и файл в папке
    const sql = 'SELECT * FROM persons WHERE idperson = "' + idperson + '"';

    connection.query(sql, (err, rows) => {

        //console.log('file value' + rows[0].file);

        if ((rows[0].file == undefined) || (rows[0].file == "")) {

            //console.log('Uninstall without a file');

            connection.query('DELETE FROM persons WHERE idperson = "' + idperson + '"', (err, result) => {
                if (err) throw err;

                console.log(`Deleted ${result.affectedRows} row(s)`);

            });

            res.send("1");

        } else {
            //console.log('Deleting with a file.\n');

            const dir = __dirname + "/../public/photo/";

            fs.unlinkSync(dir + rows[0].file);
            console.log('Deleted: ' + rows[0].file);

            connection.query('DELETE FROM persons WHERE idperson = "' + idperson + '"', (err, result) => {
                if (err) throw err;

                console.log(`Deleted ${result.affectedRows} row(s)`);

            });

            res.send("1");

        }
    });
});


module.exports = persons;