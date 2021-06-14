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



const API = {ottieniDomande, 
  inserisciUnNuovoQuestionario, inserisciUnNuovaDomandaAperta, inserisciUnNuovaDomandaChiusa, ottieniMieiQuestionari};

export default API;