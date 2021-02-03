import Link from "next/link";
import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Drawer from "../drawer/Drawer";

const MyNavbar = (): JSX.Element => {
  return (
    <Navbar bg="dark" variant="dark">
      <Nav className="mr-auto">
        <Drawer main={<Nav.Link>Menu</Nav.Link>} currentUser="hello" />
        <Link href="/" passHref>
          <Nav.Link>Home</Nav.Link>
        </Link>
        <Link href="/team" passHref>
          <Nav.Link>Our Team</Nav.Link>
        </Link>
        <Link href="/bookappointment" passHref>
          <Nav.Link>Book Appointment</Nav.Link>
        </Link>
        <Link href="/signin" passHref>
          <Nav.Link>sign in</Nav.Link>
        </Link>
        <Link href="/signup" passHref>
          <Nav.Link>sign up</Nav.Link>
        </Link>
        <Link href="/signout" passHref>
          <Nav.Link>sign out</Nav.Link>
        </Link>
      </Nav>
      <Link href="/" passHref>
        <Navbar.Brand href="/">clinic</Navbar.Brand>
      </Link>
    </Navbar>
  );
};

export default MyNavbar;
