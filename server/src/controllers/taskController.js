const db = require('../database');

const taskController = {
  async getAllTasks(req, res) {
    db.query(`select * from tasks;`, (err, response) => {
      if (err) res.status(500).send('something went wrong');
      else res.send(response);
    });
  },
  async getMonthTasks(req, res) {
    db.query(
      `select * from tasks where user = ${req.user.id} and year = ${req.params.year} and month = ${req.params.month};`,
      (err, response) => {
        if (err) res.status(500).send({msg: 'something went wrong'});
        else res.send(response);
      }
    );
  },
  async getTasks(req, res) {
    db.query(
      `select * from tasks where user = ${req.user.id};`,
      (err, response) => {
        if (err) res.status(500).send({msg: 'something went wrong'});
        else res.send(response);
      }
    );
  },
  async addTask(req, res) {
    let desc = req.body.description;
    let date = req.body.date;
    let userId = req.user.id;

    if (date == null || userId == null || desc == null) {
      res.sendStatus(400);
    } else {
      db.query(
        `insert into tasks 
        (user, description, year, month, day, time) 
        values (${userId}, "${desc}", ${date.year}, ${date.month}, ${date.day}, ${date.time});`,
        (err, response) => {
          if (err) res.status(500).send({ msg: 'something went wrong', err });
          else res.send({ msg: 'Task added' });
        }
      );
    }
  },
  async grantTask(req, res) {
    let desc = req.body.description;
    let date = req.body.date;
    let userId = req.body.userId;

    if (date == null || userId == null || desc == null) {
      res.sendStatus(400);
    } else {
      db.query(
        `insert into tasks 
        (user, description, year, month, day, time) 
        values (${userId}, "${desc}", ${date.year}, ${date.month}, ${date.day}, ${date.time});`,
        (err, response) => {
          if (err) res.status(500).send({ msg: 'something went wrong', err });
          else res.send({ msg: 'Task added' });
        }
      );
    }
  },
};

module.exports = taskController;
