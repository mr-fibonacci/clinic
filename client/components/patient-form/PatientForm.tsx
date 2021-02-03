import React, { FormEvent, SyntheticEvent } from "react";
import { withRouter, NextRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

interface WithRouterProps {
  router: NextRouter;
}

interface PatientFormProps extends WithRouterProps {}
interface PatientFromState {
  [key: string]: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

class PatientForm extends React.Component<PatientFormProps, PatientFromState> {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };
  }

  handleChange = (e: SyntheticEvent): void => {
    const {
      name,
      value,
    }: { name: string; value: string } = e.target as HTMLInputElement;
    console.log("field name:", name, "field value:", value);
    this.setState({ [name]: value });
  };

  handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    const { id } = this.props.router.query;
    e.preventDefault();
    console.log("yay submit please!");
    try {
      const { data } = await axios.post(
        `http://localhost:3000/users/signup`,
        {
          ...this.state,
        },
        { withCredentials: true }
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { email, password, firstName, lastName } = this.state;
    return (
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            value={email}
            onChange={this.handleChange}
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
            onChange={this.handleChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Form.Group controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            name="firstName"
            value={firstName}
            onChange={this.handleChange}
            type="text"
            placeholder="First Name"
          />
        </Form.Group>

        <Form.Group controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            name="lastName"
            value={lastName}
            onChange={this.handleChange}
            type="text"
            placeholder="Last Name"
          />
        </Form.Group>

        <Button onClick={this.handleSubmit} variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default withRouter(PatientForm);
