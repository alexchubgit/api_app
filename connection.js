const mysql = require('mysql'); //Драйвер для подключения MySQL
const config = require('./config'); //Файл конфигурации

//const connection = mysql.createConnection({

const connection = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.db,
    dateStrings: 'date',
    debug: false,
    multipleStatements: true
});

// connection.connect((err) => {
//     if (err) {
//         console.log('Error сonnecting to database');
//     }
// })
// setInterval(keepAlive, 15000)


module.exports = connection;

