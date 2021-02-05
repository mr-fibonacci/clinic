import { Card, Button } from "react-bootstrap";

export interface IAppointmentCard {
  id: string;
  timestamp: string;
  medic: { type: string; id: string };
}

const AppointmentCard = (props: IAppointmentCard) => {
  const { timestamp } = props;
  const { type } = props.medic;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{timestamp}</Card.Title>
        <Card.Subtitle>{type}</Card.Subtitle>
        <Button variant="primary">Book!</Button>
      </Card.Body>
    </Card>
  );
};

export default AppointmentCard;
