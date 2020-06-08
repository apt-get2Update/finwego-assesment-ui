import React from "react";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";

export default class PlacesPage extends React.Component {
  state = {
    email: "",
    password: "",
  };
  clearData() {
    this.setState({ email: "", password: "" });
  }
  onChange(e, key) {
    this.setState({ [key]: e.target.value });
  }
  onLogin = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `https://finwego-assesment-api.herokuapp.com/api/auth/login`,
        this.state
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      this.props.history.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div className="container">
        <Form onSubmit={this.onLogin}>
          <Form.Group controlId="formPlace">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="email"
              value={this.state.email}
              onChange={(e) => this.onChange(e, "email")}
            />
          </Form.Group>
          <Form.Group controlId="placeCode">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={this.state.password}
              onChange={(e) => this.onChange(e, "password")}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <div>
          <Link to="/register">if your new user register</Link>
        </div>
      </div>
    );
  }
}
