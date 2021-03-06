const jwt = require('jsonwebtoken');
const config = require('./config'); //Файл конфигурации

const SECRET_KEY = config.jwt.secret;

const withAuth = (req, res, next) => {

    // check header or url parameters or post parameters for token
    /*const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).send({ success: false, message: 'Unauthorized: No token provided' });
    } else {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).send({ success: false, message: 'Unauthorized: Invalid token' });
            } else {
                res.json({ success: true, message: 'Good to authenticate token.', token: decoded });
                req.decoded = decoded;
                next();
            }
        });
    }*/


    //Проверка токена из видео урока
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        res.status(401).json({ success: false, message: "Token not provided!" });
    }

    const token = authHeader.replace('token ', '')

    //console.log('middleware ' + token);

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        //ошибка заголовков
        //res.status(200).json({ success: true, message: 'Good to authenticate token.' });

        //console.log('decode ' + decoded.role + ' ' + decoded.name);
        req.decoded = decoded;
        next();

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ success: false, message: "Token invalid!" });
        }
    }
}

module.exports = withAuth;

