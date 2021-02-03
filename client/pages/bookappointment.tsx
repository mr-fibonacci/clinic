import axios from "axios";
import { NextPage } from "next";
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
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} {...appointment} />
      ))}
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
