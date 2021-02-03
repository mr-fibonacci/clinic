import axios from "axios";
import { NextPage } from "next";

interface Ibookappointment {
  appointments: any[];
}

const bookappointment: NextPage<Ibookappointment> = ({ appointments }) => {
  console.log(appointments);
  return <h1>appointments</h1>;
};

bookappointment.getInitialProps = async () => {
  // let data;
  try {
    let { data } = await axios.get("http://localhost:3000/appointments/active");
    console.log(data);
    return { appointments: data };
  } catch (err) {
    console.log(err);
  }
  return { appointments: [] };
};

export default bookappointment;
