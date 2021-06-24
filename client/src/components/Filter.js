import {ListGroup} from 'react-bootstrap/';

/* get the list of labels to show, the one that is selected and the handler to notify a new selection */
const Filters = (props) => {
  const {items, filtraQuestionario, setShowCompila, loggedIn, setRicaricaUtenti2} = props;
  return (
    <ListGroup as="div" variant="flush">
        {
          items.map((t,i) => {
            const valid= i
            return (
              <ListGroup.Item disabled={false} as="a" key={t.qid} onClick={()=>{
                
                if(loggedIn){
                  setRicaricaUtenti2(true)
                  
                  filtraQuestionario(valid); 
                }else{
                                  
                filtraQuestionario(valid); 
                
                setShowCompila(true);
                }
                }} action>{t.titolo}&nbsp;&nbsp;&nbsp;{loggedIn&& <span>{t.numutenti}</span>}</ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export default Filters;