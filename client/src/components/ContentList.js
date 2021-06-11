import React from 'react'
import { Form, ListGroup, Button } from 'react-bootstrap/';
import { PencilSquare, Trash, ArrowDown, ArrowUp } from 'react-bootstrap-icons';

const OptionData = (props) => {
    const { optionsList } = props;
    const tipodomanda = optionsList.numopzioni!==1 ? true: false;
  
    return (
      <>

       
        
        <div className="flex-fill m-auto">
          <h6>{optionsList.tipo?"Domanda Chiusa": "Domanda Aperta"}</h6>
          <h4> {optionsList.quesito}</h4>
        </div>
        <div className="flex-fill m-auto">
       {tipodomanda ?  
       <StampaOpzioni optionsList={optionsList}opzioni={optionsList.domandachiusa} numopzioni={optionsList.numopzioni}></StampaOpzioni> 
       : <Form.Group className="m-0" controlId="formBasicCheckbox">
         {optionsList.temporaneo === 0 ?<Form.Control size="lg" type="text" placeholder="Large text" /> : null}                                                                                                                                             
          </Form.Group> }

        </div>
        
          
         </>
    )
  }
  
  const StampaOpzioni = (props) => {
    const {opzioni, optionsList} = props;
    return <Form>
      <div className="mb-3">
    { opzioni.map((t,i) =>{
      return  <Form.Check inline key={i} type="checkbox" label={t.opzione} className={optionsList.important ? 'important' : ''} />
     } )
     }
    </div>
    </Form>
    
  }



  const AnswerControls = (props) => {
    const { SpostaElementi, domanda, lunghezzadomande } = props;
    return (
      <>
        <div className="flex-fill m-auto">
         {lunghezzadomande > 1 && domanda.did !== lunghezzadomande-1 && <Button variant="danger" className="shadow-none" onClick={()=>SpostaElementi(domanda.did, domanda.did+1)}> <ArrowDown /></Button> }
         {lunghezzadomande > 1 &&  domanda.did !== 0 && <Button variant="danger" className="shadow-none" onClick={()=>SpostaElementi(domanda.did, domanda.did-1 )}><ArrowUp/></Button> }
          <Button variant="danger" className="shadow-none" ><PencilSquare /></Button>
          <Button variant="danger" className="shadow-none" ><Trash /></Button>
        </div>
      </>
    )
  }
  
  
  const ContentList = (props) => {
    const { questionList, SpostaElementi} = props;
    return (
      <>
        <ListGroup as="ul" variant="flush">
          {
            questionList.map(t => {

            ;
              return (
                <ListGroup.Item as="li" key={t.did} className={`d-flex w-100 justify-content-between ${t.tipo? "bg-warning":"bg-info"}`}>
                    <OptionData optionsList={t} />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   <div className="flex-fill m-auto">
                      <h3> {t.min} - {t.max}</h3>
                  
                    </div>
                    <AnswerControls domanda={t} lunghezzadomande={questionList.length}SpostaElementi={SpostaElementi}/>
                </ListGroup.Item>
              );
            })
          }
        </ListGroup>
      </>
    )
  }
  
  export default ContentList;