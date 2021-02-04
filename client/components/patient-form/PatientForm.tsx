import React, { FormEvent, SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import { useCurrentUser } from "../UserContext";
import axios from "axios";

interface PatientFormState {
  [key: string]: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const PatientForm = (): JSX.Element => {
  const [state, setState] = useState<PatientFormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const { setCurrentUser } = useCurrentUser();
  const router = useRouter();

  const handleChange = (e: SyntheticEvent): void => {
    const {
      name,
      value,
    }: { name: string; value: string } = e.target as HTMLInputElement;
    console.log("field name:", name, "field value:", value);
    setState((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("yay submit please!");
    try {
      const { data } = await axios.post(
        `http://localhost:3000/patients`,
        state,
        { withCredentials: true }
      );
      console.log(data);
      setCurrentUser({ currentUser: data });
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const { email, password, firstName, lastName } = state;
  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          name="email"
          value={email}
          onChange={handleChange}
          type="email"
          placeholder="Enter email"
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          value={password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
        />
      </Form.Group>

      <Form.Group controlId="formBasicFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          name="firstName"
          value={firstName}
          onChange={handleChange}
          type="text"
          placeholder="First Name"
        />
      </Form.Group>

      <Form.Group controlId="formBasicLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          name="lastName"
          value={lastName}
          onChange={handleChange}
          type="text"
          placeholder="Last Name"
        />
      </Form.Group>

      <Button onClick={handleSubmit} variant="primary">
        Submit
      </Button>
    </Form>
  );
};

export default PatientForm;
