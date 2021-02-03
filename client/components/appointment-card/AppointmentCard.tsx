import { Card, Button } from "react-bootstrap";

export interface IAppointmentCard {
  id: string;
  timestamp: string;
  medic: { type: string; id: string };
}

const AppointmentCard = (props: IAppointmentCard) => {
  const { id, timestamp } = props;
  const { type } = props.medic;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{timestamp}</Card.Title>
        <Card.Subtitle>{type}</Card.Subtitle>
        <Card.Text>Appointment times:</Card.Text>
        <Card.Text>{type}</Card.Text>
        <Button variant="primary">Book!</Button>
      </Card.Body>
    </Card>
  );
};

export default AppointmentCard;
