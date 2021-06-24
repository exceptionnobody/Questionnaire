const baseURL = "/api";

async function inserisciUnNuovoQuestionario(questionario){
    let url = "/questionari";
    console.log(questionario)
    return new Promise((resolve, reject) => {
    fetch(baseURL+url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionario),
    }).then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error msg in the response body
            .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
        }
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}


async function cancellaNuovoQuestionario(questionario){
  let url = "/questionari/";
  console.log(questionario)
  return new Promise((resolve, reject) => {
  fetch(baseURL+url+questionario, {
      method: 'DELETE'
  }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}







async function inserisciUnNuovaDomandaAperta(domanda){
  let url = "/domandeaperte";
  return new Promise((resolve, reject) => {
  fetch(baseURL+url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(domanda)
  }).then((response) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}

async function inserisciUnNuovaDomandaChiusa(domanda){
  let url = "/domandechiuse";
  return new Promise((resolve, reject) => {
  fetch(baseURL+url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(domanda)
  }).then((response) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}


async function ottieniMieiQuestionari(admin) {
  let url = "/questionari?admin=";
  try{
  const response = await fetch(baseURL+url+admin);
  const tasksJson = await response.json();
  if(response.ok){
      return tasksJson.map((t) => Object.assign({}, t));
  } else {
      throw tasksJson;  // An object with the error coming from the server
  }
}catch(err){
    console.log(err)
}
}

async function ottieniDomande(qid) {
  let url = "/domande?admin=";
  try{
  const response = await fetch(baseURL+url+qid);
  const tasksJson = await response.json();
  if(response.ok){
      return tasksJson.map((t) => Object.assign({}, t));
  } else {
      throw tasksJson;  // An object with the error coming from the server
  }
}catch(err){
    console.log(err)
}
}

async function inserisciUtente(utente){
  let url = "/utenti";
  return new Promise((resolve, reject) => {
  fetch(baseURL+url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(utente)
  }).then((response) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}

async function inserisciRisposta(risposta){
  let url = "/risposte";
  return new Promise((resolve, reject) => {
  fetch(baseURL+url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(risposta)
  }).then((response) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}


async function aggiornaNumUtentiQuestionario(questionario){
  let url = "/questionari";
  return new Promise((resolve, reject) => {
  fetch(baseURL+url, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionario)
  }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}

async function aggiornaNumDomandeQuestionario(questionario){
  let url = "/domande";
  return new Promise((resolve, reject) => {
  fetch(baseURL+url, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionario)
  }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
});
}

async function logIn(credentials) {
  let response = await fetch(baseURL +'/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch(baseURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}


async function ottieniUtentiMieiQuestionari(id) {
  const response = await fetch(baseURL + '/utenti?admin='+id);
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

async function ottieniRisposteiMieiQuestionari(id_questionario, id_user) {
  const response = await fetch(baseURL + '/risposte?questionario='+id_questionario+"&utente="+id_user);
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}


const API = {ottieniDomande, inserisciUtente, inserisciRisposta, aggiornaNumUtentiQuestionario, logIn, logOut, getUserInfo,
  ottieniUtentiMieiQuestionari, ottieniRisposteiMieiQuestionari, aggiornaNumDomandeQuestionario, cancellaNuovoQuestionario,
  inserisciUnNuovoQuestionario, inserisciUnNuovaDomandaAperta, inserisciUnNuovaDomandaChiusa, ottieniMieiQuestionari};

export default API;