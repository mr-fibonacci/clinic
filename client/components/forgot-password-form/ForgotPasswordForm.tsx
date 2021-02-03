import { useState, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("yay submit please!");
    try {
      const { data } = await axios.post(
        `http://localhost:3000/users/forgotpassword`,
        {
          email,
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

      <Button onClick={handleSubmit} variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ForgotPasswordForm;
