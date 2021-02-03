import css from "./SideBar.module.css";
import Link from "next/link";
import { Nav } from "react-bootstrap";

interface SideBarProps {
  visible: boolean;
  currentUser?: any;
}

const SideBar = ({ visible, currentUser }: SideBarProps): JSX.Element => {
  return (
    <div className={visible ? css.visible : css.hidden}>
      <>
        <h4>patient centre</h4>
        <ul>
          <Link href={`/patients/${currentUser.id}/appointments`} passHref>
            <Nav.Link>
              <li>appointments</li>
            </Nav.Link>
          </Link>
          <Link href={`/patients/${currentUser.id}/prescriptions`} passHref>
            <Nav.Link>
              <li>prescriptions</li>
            </Nav.Link>
          </Link>
          <Link href={`/patients/${currentUser.id}/payments`} passHref>
            <Nav.Link>
              <li>payments</li>
            </Nav.Link>
          </Link>
          <Link href={`/forgotpassword`} passHref>
            <Nav.Link>
              <li>forgot my password!</li>
            </Nav.Link>
          </Link>
        </ul>
      </>
    </div>
  );
};

export default SideBar;
