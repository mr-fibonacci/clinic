import axios from "axios";
import { NextPage } from "next";
import TeamCard from "../components/team-card/TeamCard";

interface Iteam {
  medics: any[];
}

const team: NextPage<Iteam> = ({ medics }) => {
  console.log(medics);
  return (
    <>
      <h1>Our Medical Team</h1>
      {medics.map((medic) => (
        <TeamCard key={medic.id} {...medic} />
      ))}
    </>
  );
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
