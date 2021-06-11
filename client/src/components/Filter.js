import {ListGroup} from 'react-bootstrap/';

/* get the list of labels to show, the one that is selected and the handler to notify a new selection */
const Filters = (props) => {
  const {items} = props;

  return (
    <ListGroup as="div" variant="flush">
        {
          Object.entries(items).map(([key, { label }]) => {
            return (
              <ListGroup.Item as="a" key={key} action>{label}</ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export default Filters;