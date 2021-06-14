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






const API = {inserisciUnNuovoQuestionario, inserisciUnNuovaDomandaAperta, inserisciUnNuovaDomandaChiusa};

export default API;