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

    exports.getOptions = (id) => {
      return new Promise((resolve, reject) => {
        
        const sql = `SELECT did, quesito, D.tipo, D.quesito, R.opzione1, R.opzione2, R.opzione3, R.opzione4, R.opzioneaperta
                     FROM  domande D, risposte R
                      WHERE D.questionario =? AND  R.domanda = D.did`;

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
