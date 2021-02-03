import axios from "axios";
import Link from "next/link";
import { Nav, Navbar } from "react-bootstrap";
import Drawer from "../drawer/Drawer";
import { useCurrentUser } from "../UserContext";

const MyNavbar = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const handleSignOut = async () => {
    try {
      await axios.post("http://localhost:3000/users/signout", null, {
        withCredentials: true,
      });
      console.log("signed out!");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Navbar bg="dark" variant="dark">
      <Nav className="mr-auto">
        <Drawer main={<Nav.Link>Menu</Nav.Link>} currentUser={currentUser} />
        <Link href="/" passHref>
          <Nav.Link>Home</Nav.Link>
        </Link>
        <Link href="/team" passHref>
          <Nav.Link>Our Team</Nav.Link>
        </Link>
        <Link href="/bookappointment" passHref>
          <Nav.Link>Book Appointment</Nav.Link>
        </Link>
        {currentUser ? (
          <div onClick={handleSignOut}>
            <Nav.Link>sign out</Nav.Link>
          </div>
        ) : (
          <>
            {" "}
            <Link href="/signin" passHref>
              <Nav.Link>sign in</Nav.Link>
            </Link>
            <Link href="/signup" passHref>
              <Nav.Link>sign up</Nav.Link>
            </Link>
          </>
        )}
      </Nav>
      <Link href="/" passHref>
        <Navbar.Brand href="/">clinic</Navbar.Brand>
      </Link>
    </Navbar>
  );
};

export default MyNavbar;
