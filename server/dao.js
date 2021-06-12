const db = require('./db');

// ottiene le domande dal questionario identified by {id}
exports.getQuestions = (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT opzione1, opzione2, opzione3, opzione4, opzione5, opzione6, opzione7, opzione8, opzione9, opzione10, opzioneaperta FROM domande  WHERE questionario=?`;
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

      exports.getAllQuestionari = ()=>{
        return new Promise((resolve, reject) => {
        
          const sql ="SELECT * FROM questionari";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            if (rows == undefined) {
              resolve({error: 'Task not found.'});
            } else {
              const questionari = rows.map(t => ({
                qid: t.id,
                titolo: t.titolo,
                numdomande: t.numdomande
              }))
              resolve(questionari);
            }
          });
        
        })
      }