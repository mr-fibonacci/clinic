import axios from "axios";
import { NextPage } from "next";

interface Iteam {
  medics: any[];
}

const team: NextPage<Iteam> = ({ medics }) => {
  console.log(medics);
  return <h1>Our Team</h1>;
};

team.getInitialProps = async () => {
  try {
    let { data } = await axios.get("http://localhost:3000/medics");
    return { medics: data };
  } catch (err) {
    console.log(err);
    return { medics: [] };
  }
};

export default team;
