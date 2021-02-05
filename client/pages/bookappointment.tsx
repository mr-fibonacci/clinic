import axios from "axios";
import { NextPage } from "next";
import { Col, Container, Row } from "react-bootstrap";
import AppointmentCard, {
  IAppointmentCard,
} from "../components/appointment-card/AppointmentCard";

interface Ibookappointment {
  appointments: IAppointmentCard[];
}

const bookappointment: NextPage<Ibookappointment> = ({ appointments }) => {
  return (
    <>
      <h1>appointments</h1>
      <Container>
        <Row>
          {" "}
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} {...appointment} />
          ))}
        </Row>
      </Container>
    </>
  );
};

bookappointment.getInitialProps = async () => {
  try {
    let { data } = await axios.get("http://localhost:3000/appointments/active");
    return { appointments: data };
  } catch (err) {
    console.log(err);
  }
  return { appointments: [] };
};

export default bookappointment;
