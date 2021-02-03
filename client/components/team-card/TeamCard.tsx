import { Card, Button } from "react-bootstrap";

interface ITeamCard {
  id: string;
  image: string;
  shiftEnd: number;
  shiftStart: number;
  type: string;
  user: { firstName: string; lastName: string; email: string };
}

const TeamCard = (props: ITeamCard) => {
  const { image, shiftStart, shiftEnd, type } = props;
  const { firstName, lastName, email } = props.user;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>
          {firstName} {lastName}
        </Card.Title>
        <Card.Subtitle>{type}</Card.Subtitle>
        <Card.Text>Appointment times:</Card.Text>
        <Card.Text>
          Mon - Fri: {shiftStart} - {shiftEnd}
        </Card.Text>
        <Card.Text>email: {email}</Card.Text>
        <Button variant="primary">Book an appointment</Button>
      </Card.Body>
    </Card>
  );
};

export default TeamCard;
