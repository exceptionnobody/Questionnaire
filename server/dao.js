const db = require('./db');

// ottiene le domande dal questionario identified by {id}
exports.getQuestions = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM domande WHERE questionario=?';
      db.all(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row == undefined) {
          resolve({error: 'Task not found.'});
        } else {
          resolve(row);
        }
      });
    })}