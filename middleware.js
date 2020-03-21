const jwt = require('jsonwebtoken');
const SECRET_KEY = 'cAtwa1kkEy';

const withAuth = (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).send({ success: false, message: 'Unauthorized: No token provided' });
    } else {
        jwt.verify(token, SECRET_KEY, function (err, decoded) {
            if (err) {
                res.status(401).send({ success: false, message: 'Unauthorized: Invalid token' });
            } else {
                //console.log(decoded.phone);
                req.decoded = decoded;
                next();
            }
        });
    }
}

module.exports = withAuth;