import {ListGroup, Button} from 'react-bootstrap/';

/* get the list of labels to show, the one that is selected and the handler to notify a new selection */
const Filters = (props) => {
  const {items, filtraQuestionario, setShowCompila, loggedIn} = props;
  return (
    <ListGroup as="div" variant="flush">
        {
          items.map((t,i) => {
            const valid= i
            return (
              <ListGroup.Item disabled={false} as="a" key={t.qid} onClick={()=>{filtraQuestionario(valid); setShowCompila(true); console.log(valid)}} action>{t.titolo}{' '}{loggedIn&& <Button variant="danger" disabled>{t.numutenti}</Button>}</ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export default Filters;