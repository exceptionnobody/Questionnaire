# Exam #1234: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

Route: /login per autenticare l'admin

Route: /admin per lavorare in modalità admin.

Route: / pagina principale per gli utilizzatori per compilare i questionari

Route: /:param viene dirattata o su /admin o su / a seconda se si è autenticati o meno.

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

AUTENTICAZIONE:
- GET /api/sessions/current per verificare che l'admin sia già loggato
- POST /api/sessions per autenticare un admin, body richiesto {username: req.body.username,password:req.body.password}
        risposta: {id: row.id,  name: row.user, color: row.color}
- DELTE /api/sessions/current per deautenticare l'utente

-APPLICAZIONE:
- GET /api/questionari con parametro ?admin=? l'id dell'admin nell'URL per ottenere tutti i questionari di un dato admin, null per tutti i questionari
      risposta: lista dei questionari dell'admin, se specificato, altrimenti se null ritorna tutti i questionari

- GET /api/domande con parametro l'id dell'admin nell'URL, ?admin=?, null per ottenere tutte le domande di tutti gli admin, 
      risposta: le domande di tutti i questionari del dato admin o se null ritorna tutte le domande

- POST /api/questionari con body richiesto:     {qid: req.body.qid, admin: req.body.admin, titolo: req.body.titolo,              numdomande:req.body.numdomande} . Inserisce un nuovo questionari
      risposta: id del questionario appena inserito nel db

- PUT /api/questionari body richiesto {qid: req.body.qid} id del questionario. Aggiorna il numero di utenti del questionario specificato nel body.
      risposta: id della riga che è stata cambiata 

- PUT /api/domande body richiesto  {qid: req.body.qid, numdomande: req.body.numdomande} Aggiorna il numero di domande del questionario specificato.
      risposta: id della riga che è stata cambiata 

- POST /api/domandeaperte boyd richiesto  {did: req.body.did, qid: req.body.qid, quesito: req.body.quesito, min: req.body.min,  max: req.body.max,  tipo: req.body.tipo,  numopzioni: req.body.numopzioni,  obbligatoria: req.body.obbligatoria }
      risposta: id della domanda aperta appena inserita

- POST /api/domandechiuse body richiesto { did: req.body.did, qid: req.body.qid, quesito: req.body.quesito,  min: req.body.min,
   max: req.body.max,  tipo: req.body.tipo, numopzioni: req.body.numopzioni, obbligatoria: req.body.obbligatoria, opzione1: req.body.opzione1,  opzione2: req.body.opzione2,  opzione3: req.body.opzione3, opzione4: req.body.opzione4, opzione5: req.body.opzione5, opzione6: req.body.opzione6, opzione7: req.body.opzione7, opzione8: req.body.opzione8, opzione9: req.body.opzione9,
   opzione10: req.body.opzione10} 
  risposta: id della domanda chiusa appena inserita

 - POST /api/utenti body richiesto {nome: req.body.nome,  questionario: req.body.questionario } . Inserisce l'utilizzatore che sta compilando il questionario specificato nel body.
  risposta : id dell'utente appena inserito

- POST /api/risposte body richiesto  risposta = {domanda: req.body.domanda, user: req.body.user, tipo: req.body.tipo,  numrisposte: req.body.numrisposte, opzione1: req.body.opzione1, opzione2: req.body.opzione2, opzione3: req.body.opzione3, opzione4: req.body.opzione4, opzione5: req.body.opzione5, opzione6: req.body.opzione6, opzione7: req.body.opzione7, opzione8: req.body.opzione8, opzione9: req.body.opzione9,  opzione10: req.body.opzione10, opzioneaperta: req.body.opzioneaperta
 }. Inserisce la risposta specificata nel body.
 risposta: id della risposta inserita

- GET /api/risposte richiesta parametrica questionario=valore&user=valore; Ottiene le risposte dell'user specificato e del questionario specificato.
risposta: tutte le risposte di un dato utente

- GET /api/utenti parametrica: ?admin=valore. Tutti gli utenti che hanno risposto ai questionari dell'admin specificato.
 risposta la lista di tutti gli utenti che hanno risposto al questionario dell'admin specificato nel parametro

- DELETE /api/questionari/:qid parametrica, per cancellare un questionario, richiede autenticazione
  risposta solo status 200

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

- Tabella admin - contiene: id, user, hash, color . Scopo: memorizzare gli admin.

- Tabella domande - contiene: did, questionario, quesito, tipo, numopzioni, obbligatoria, min, max, opzione1, opzione2, opzione3, opzione4, opzione5, opzione6, opzione7, opzione8, opzione9, opzione10. Scopo: memorizzare le domande.

- Tabella questionari - contiene: qid, admin, titolo, numdomande, numutenti. Scopo: memorizzare i questionari.

- Tabella utenti - contiene: id, nome, questionario. Scopo: memorizzare gli utilizzatori.

- Tabella risposte - contiene: id, domanda, user, numrisposte, tipo, opzione1, opzione2, opzione3, opzione4, opzione5, opzione6, opzione7, opzione8, opzione9, opzione10, opzioneaperta. Scopo: memorizzare le risposte degli utilizzatori.

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

- QuestionarioManager: componente principale incaricato a visualizzare, creare e compilare i questionari
- LoginForm: componente incaricato ad autenticare l'admin
- DomandaChiusa: componente incaricato a creare una domanda chiusa
- DomandaAperta: componenteincaricato a creare una domanda aperta
- Filter: componente incaricato a visualizzare la lista dei questionari
- Navigation: componente incaricato a visualizzare la navbar e permettere all'utente di inserire il proprio nome
- FormPersonale: componente incaricato a visualizzare il form per creare il questionario

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

- admin1, password
- admin2, password2