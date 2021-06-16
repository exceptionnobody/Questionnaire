const db = require('./db');

// ottiene le domande dal questionario identified by {id}
exports.getDomande = (obj) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT domande.*
      FROM questionari INNER JOIN domande ON  questionari.qid = domande.questionario 
      WHERE admin = ?   
    `;
    db.all(sql, [obj], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(rows);
      }
    });
  })
}

exports.getTutteDomande = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM domande`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(rows);
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

exports.getAllMyQuestionnaire = (admin) => {
  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM questionari WHERE admin=?";
    db.all(sql, [admin], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        const questionari = rows.map(t => ({
          qid: t.qid,
          titolo: t.titolo,
          numdomande: t.numdomande
        }))
        resolve(questionari);
      }
    });

  })
}

exports.getAllQuestionnaires = () => {
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
          qid: t.qid,
          titolo: t.titolo,
          numdomande: t.numdomande,
          numutenti: t.numutenti
        }))
        resolve(questionari);
      }
    });

  })
}



exports.createQuestionario = (quest) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO questionari (admin, titolo, numdomande) VALUES(?, ?, ?)`;
    db.run(sql, [quest.admin, quest.titolo, quest.numdomande], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  });
};

exports.inserisciDomandeAperta = (domanda) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO domande(questionario, quesito, tipo, numopzioni, min, max) VALUES(?,?,?,?,?,?)";
    db.run(sql, [domanda.qid, domanda.quesito, domanda.tipo, domanda.numopzioni, domanda.min, domanda.max], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
    
  });
};


exports.inserisciDomandeChiusa = (domanda) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO domande(questionario, quesito, tipo, numopzioni, min, max, opzione1, opzione2, opzione3, opzione4, opzione5, opzione6, opzione7, opzione8, opzione9, opzione10) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.run(sql, [domanda.qid, domanda.quesito, domanda.tipo, domanda.numopzioni, domanda.min, domanda.max, domanda.opzione1?domanda.opzione1:null, domanda.opzione2? domanda.opzione2:null, domanda.opzione3?domanda.opzione3:null, domanda.opzione4?domanda.opzione4:null, domanda.opzione5?domanda.opzione5:null, domanda.opzione6?domanda.opzione6:null, domanda.opzione7?domanda.opzione7:null, domanda.opzione8?domanda.opzione8:null, domanda.opzione9?domanda.opzione9:null, domanda.opzione10?domanda.opzione10:null], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
    
  });
};

/*domanda.opzione1?domanda.opzione1:null, domanda.opzione2? domanda.opzione2:null, domanda.opzione3?domanda.opzione3:null, domanda.opzione4?domanda.opzione4:null, domanda.opzione5?domanda.opzione5:null, domanda.opzione6?domanda.opzione6:null, domanda.opzione7?domanda.opzione7:null, domanda.opzione8?domanda.opzione8:null, domanda.opzione9?domanda.opzione9:null, domanda.opzione10?domanda.opzione10:null], function (err) {
*/

exports.cancellaQuestionari = function() {
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM questionari WHERE qid = ?';
      db.run(sql, [2], function(err){
          if(err)
              reject(err);
          else 
              resolve("Task removed successfully");
      })
  });
}

exports.inserisciUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO utenti (nome, questionario) VALUES(?, ?)`;
    db.run(sql, [user.nome, user.questionario], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  });
};

exports.inseriscRisposte = (risposta) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO risposte (domanda, user, numrisposte, opzione1, opzione2, opzione3, opzione4, opzione5, opzione6, opzione7, opzione8, opzione9, opzione10, opzioneaperta) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.run(sql, [risposta.domanda, risposta.user, risposta.numrisposte, risposta.opzione1, risposta.opzione2, risposta.opzione3, risposta.opzione4, risposta.opzione5, risposta.opzione6, risposta.opzione7, risposta.opzione8, risposta.opzione9, risposta.opzione10, risposta.opzioneaperta?risposta.opzioneaperta:null], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  });
};