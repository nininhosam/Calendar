const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { rejects } = require('assert');

async function findUser(username) {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from users where username like "${username}";`,
      (err, response) => {
        if (err) reject(err);
        resolve(response);
      }
    );
  });
}

const accountController = {
  async register(req, res) {
    const user = await findUser(req.body.username);
    if (user != 0) {
      res.status(400).send({ msg: 'This username already exists.' });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        db.query(
          `insert into users (username, password) values ("${req.body.username}", "${hashedPassword}");`
        );
        res.send('User registered.');
      } catch (error) {
        res.status(500).send({ msg: 'Something went wrong', error });
      }
    }
  },
  async login(req, res) {
    const user = await findUser(req.body.username);

    if (user == 0) {
      req.status(400).send({ msg: 'This username does not exist' });
    }
    try {
      if (await bcrypt.compare(req.body.password, user[0].password)) {
        // any info to be passed to req.user goes here ↓↓↓
        const userInfo = { name: user[0].username, id: user[0].id };
        const accessToken = jwt.sign(
          userInfo,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 3000 }
        );
        res.send({ accessToken: accessToken });
      } else {
        res.send({ msg: 'Wrong username or password.' });
      }
    } catch (error) {
      res.status(500).send({ msg: 'Something went wrong', error });
    }
  },
  async authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userInfo) => {
      if (err) return res.status(403).send({ msg: 'unauthorized' });
      req.user = userInfo;
      next();
    });
  },
};

module.exports = accountController;
