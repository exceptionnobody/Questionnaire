import React from 'react'
import { Form, ListGroup, Button, Row } from 'react-bootstrap/';
import { PencilSquare, Trash, ArrowDown, ArrowUp } from 'react-bootstrap-icons';

const OptionData = (props) => {
    const { optionsList } = props;
    const tipodomanda = optionsList.numopzioni!==1 ? true: false;
  
    return (
      <>
        <div className="flex-fill m-auto">
        <span><small>{optionsList.tipo?"Domanda Chiusa": "Domanda Aperta"}</small></span>
          <h4> {optionsList.quesito} </h4>
        </div>
        <div className="flex-fill m-auto">
       {tipodomanda ?   <StampaOpzioni optionsList={optionsList}opzioni={optionsList.domandachiusa} numopzioni={optionsList.numopzioni}></StampaOpzioni> 
      : <Row>
        <Form className="m-0" controlId="formBasicCheckbox">
         <Form.Control size="lg" type="text" placeholder="Large text" />                                                                                                                                              
          </Form>
          </Row> }
          
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
    const { SpostaElementi, domanda, lunghezzadomande, CancellaDomanda } = props;
    return (
      <>
        <div className="flex-fill m-auto">
         { lunghezzadomande > 1 && domanda.did !== lunghezzadomande-1 && <Button size="sm" variant="danger" className="shadow-none" onClick={()=>SpostaElementi(domanda.did, domanda.did+1)}> <ArrowDown /></Button> }
         { lunghezzadomande > 1 &&  domanda.did !== 0 && <Button size="sm" variant="danger" className="shadow-none" onClick={()=>SpostaElementi(domanda.did, domanda.did-1 )}><ArrowUp/></Button> }
          <Button size="sm" variant="danger" className="shadow-none" ><PencilSquare /></Button>
          <Button size="sm" variant="danger" className="shadow-none" onClick={()=>CancellaDomanda(domanda.did)} ><Trash /></Button>
        </div>
      </>
    )
  }
  
  
  const ContentList = (props) => {
    const { questionList, SpostaElementi, CancellaDomanda} = props;
    return (
      <>
        <ListGroup as="div" variant="flush">
          {
            questionList.map(t => {

            ;
              return (
                <ListGroup.Item as="li" key={t.did} className={`d-flex w-100  ${t.tipo? "bg-warning":"bg-info"}`}>
                    <OptionData optionsList={t} />
                    {t.modificabile && <AnswerControls domanda={t} lunghezzadomande={questionList.length}SpostaElementi={SpostaElementi} CancellaDomanda={CancellaDomanda}/>}
                </ListGroup.Item>
              );
            })
          }
        </ListGroup>
      </>
    )
  }
  
  export default ContentList;