const db = require('../database');

const taskController = {
  async getTasks(req, res) {
    db.query(`select * from tasks`, (err, response) => {
      if (err) res.status(500).send('something went wrong');
      else res.send(response);
    });
  },
  async addTask(req, res) {
    let desc = req.body.description;
    let timestamp = req.body.timestamp;
    let userId = req.body.userId;

    if (timestamp == null || userId == null || desc == null) {
      res.sendStatus(400);
    } else {
      db.query(
        `insert into tasks (description, timestamp, user) values ("${desc}", ${timestamp}, ${userId});`,
        (err, response) => {
          if (err) res.status(500).send({ msg: 'something went wrong', err });
          else res.send({ msg: 'Task added' });
        }
      );
    }
  },
};

module.exports = taskController;
