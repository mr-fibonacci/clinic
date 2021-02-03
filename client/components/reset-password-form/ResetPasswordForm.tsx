import { useState, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const SignInForm = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("yay submit please!");
    try {
      const { data } = await axios.post(
        `http://localhost:3000/users/resetpassword`,
        {
          password,
        },
        { withCredentials: true }
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form>
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
