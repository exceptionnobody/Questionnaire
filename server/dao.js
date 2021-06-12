const db = require('./db');

// ottiene le domande dal questionario identified by {id}
exports.getDomande = (idQuestionario) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM domande  WHERE questionario=?`;
    db.all(sql, [idQuestionario], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(row);
      }
    });
  })
}

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
        resolve({ error: 'Task not found.' });
      } else {
        resolve(row);
      }
    });
  })
}

exports.getAllQuestionari = () => {
  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM questionari";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
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

exports.createQuestionario = (questionario) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO questionari(admin, titolo, numdomande) VALUES(?, ?, ?)';
    db.run(sql, [questionario.admin, questionario.titolo, questionario.numdomande], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.inserisciDomande = (domanda) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO domande(did, questionario, quesito, tipo, numopzioni, min, max, opzione1, opzione2, opzione3, opzione4, opzione5, opzione6, opzione7, opzione8, opzione9, opzione10, opzioneaperta) 
                                VALUES(?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,)`;
    db.run(sql, [domanda.did, domanda.questionario, domanda.numopzioni, domanda.min, domanda.max, domanda.opzione1, domanda.opzione2, domanda.opzione3, domanda.opzione4, domanda.opzione5, domanda.opzione6, domanda.opzione7, domanda.opzione8, domanda.opzione9, domanda.opzione10, domanda.opzioneaperta], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};