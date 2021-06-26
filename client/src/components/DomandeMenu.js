import {ListGroup} from 'react-bootstrap/';

/* get the list of labels to show, the one that is selected and the handler to notify a new selection */
const DomandeMenu = (props) => {
  const {items} = props;

  return (
    <ListGroup as="div" variant="flush">
        {
          Object.entries(items).map(([key, { label, fnc }]) => {
            return (
              <ListGroup.Item  variant="warning" className="text-dark" as="a" key={key} onClick={fnc} action>{label}</ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export default DomandeMenu;