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
      {currentUser ? (
        <>
          <h4>patient centre</h4>
          <ul>
            <Link href={`/patients/${currentUser.id}/appointments`}>
              <Nav.Link>
                <li>appointments</li>
              </Nav.Link>
            </Link>
            <Link href={`/patients/${currentUser.id}/prescriptions`}>
              <Nav.Link>
                <li>prescriptions</li>
              </Nav.Link>
            </Link>
            <Link href={`/patients/${currentUser.id}/payments`}>
              <Nav.Link>
                <li>payments</li>
              </Nav.Link>
            </Link>
          </ul>
        </>
      ) : (
        "please log in to gain access to patient profile"
      )}
    </div>
  );
};

export default SideBar;
