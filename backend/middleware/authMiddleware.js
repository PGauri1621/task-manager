

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("AUTH HEADERS:", req.headers); 

    const h = req.headers.authorization;
    if (!h) return res.status(401).json({ error: 'no header received' });

    const t = h.split(' ')[1];

    try {
        req.user = jwt.verify(t, process.env.JWT_SECRET);
        next();
    } catch (e) {
        return res.status(401).json({ error: 'bad token' });
    }
};
