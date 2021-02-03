import { useState, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useCurrentUser } from "../UserContext";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setCurrentUser } = useCurrentUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("yay submit please!");
    try {
      const { data } = await axios.post(
        `http://localhost:3000/users/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(data);
      setCurrentUser({ currentUser: data });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
      </Form.Group>

      <Button onClick={handleSubmit} variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default SignInForm;
