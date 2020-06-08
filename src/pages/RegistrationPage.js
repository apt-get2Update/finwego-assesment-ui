import React from "react";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";

export default class PlacesPage extends React.Component {
  state = {
    email: "",
    password: "",
  };
  onChange(e, key) {
    this.setState({ [key]: e.target.value });
  }

  onRegister = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/auth/register`,
        this.state
      );
      localStorage.setItem("token", data.token);
      this.props.history.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div className="container">
        <Form onSubmit={this.onRegister}>
          <Form.Group controlId="formPlace">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="first name"
              value={this.state.firstName}
              onChange={(e) => this.onChange(e, "firstName")}
            />
          </Form.Group>
          <Form.Group controlId="formPlace">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="lastName"
              value={this.state.lastName}
              onChange={(e) => this.onChange(e, "lastName")}
            />
          </Form.Group>
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
            login
          </Button>
        </Form>
      </div>
    );
  }
}
