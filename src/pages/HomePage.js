import React from "react";
import { Form, Button, Table, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

export default class HomePage extends React.Component {
  state = {
    places: [],
    tickets: [],
  };
  componentDidMount = () => {
    this.getPlaces();
    this.getBookedTickets();
  };
  async getPlaces() {
    try {
      const { data } = await axios.get("http://localhost:4000/api/place");
      this.setState({ places: data });
    } catch (error) {
      console.log(error);
    }
  }
  onChange(e, key) {
    this.setState({ [key]: e.target.value });
  }
  onSearchTrain = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/train?fromStationCode=${this.state.fromStationCode}&toStationCode=${this.state.toStationCode}`
      );
      this.setState({ trains: data });
    } catch (error) {
      console.error(error);
    }
  };
  checkAvailablity = async (train) => {
    try {
      const AuthStr = "Bearer ".concat(localStorage.getItem("token"));
      const { data } = await axios.post(
        "http://localhost:4000/api/booking/availablity",
        {
          trainId: train._id,
          journyDate: this.state.journyDate,
        },
        { headers: { Authorization: AuthStr } }
      );
      console.log(data);
      alert("available tickets: " + data.count);
    } catch (error) {
      console.log(error);
    }
  };
  bookTicket = async (train) => {
    try {
      const AuthStr = "Bearer ".concat(localStorage.getItem("token"));
      const { data } = await axios.post(
        "http://localhost:4000/api/booking",

        {
          trainId: train._id,
          journyDate: this.state.journyDate,
          numberOfTickets: 1,
        },
        { headers: { Authorization: AuthStr } }
      );
      this.getBookedTickets();
    } catch (error) {
      console.log(error);
    }
  };
  getBookedTickets = async () => {
    try {
      const AuthStr = "Bearer ".concat(localStorage.getItem("token"));
      const { data } = await axios.get("http://localhost:4000/api/booking", {
        headers: { Authorization: AuthStr },
      });
      this.setState({ tickets: data });
    } catch (error) {
      console.log(error);
    }
  };
  cancelTicket = async (ticket) => {
    try {
      const AuthStr = "Bearer ".concat(localStorage.getItem("token"));
      axios.put();
      const { data } = await axios.put(
        `http://localhost:4000/api/booking/${ticket._id}`,
        {},
        {
          headers: { Authorization: AuthStr },
        },
        {}
      );
      this.getBookedTickets();
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <div className="container">
        <div className="container-small">
          <h3>Search Train here </h3>
        </div>
        <Form onSubmit={this.onSearchTrain}>
          <Row>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select From</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => this.onChange(e, "fromStationCode")}
                  value={this.state.fromStationCode}
                >
                  <option value=""></option>
                  {this.state.places.map((p, i) => (
                    <option key={i} value={p.code}>
                      {p.name},{p.code}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>Select to </Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => this.onChange(e, "toStationCode")}
                  value={this.state.toStationCode}
                >
                  <option value=""></option>
                  {this.state.places.map((p, i) => (
                    <option key={i} value={p.code}>
                      {p.name},{p.code}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formtrain">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => this.onChange(e, "journyDate")}
                />
              </Form.Group>
            </Col>
            <Col className="pt-2">
              <Button variant="primary" className="mt-4" type="submit">
                searchTrain
              </Button>
            </Col>
          </Row>
        </Form>
        <div className="container-fluid">
        <div className="container-small">
          <h3>Train List </h3>
        </div>
          {this.state.trains && this.state.trains.length > 0 && (
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>From </th>
                  <th>To </th>
                  <th>Departure</th>
                  <th>Arival at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.trains &&
                  this.state.trains.map((train, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{train.name}</td>
                        <td>{train.number}</td>
                        <td>{train.fromStationCode}</td>
                        <td>{train.toStationCode}</td>
                        <td>{train.startTime}</td>
                        <td>{train.endTime}</td>
                        <td>
                          <button onClick={() => this.checkAvailablity(train)}>
                            checkAvailablity
                          </button>
                          <button onClick={() => this.bookTicket(train)}>
                            book
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
        </div>
        <div className="container-fluid">
        <div className="container-small">
          <h3>Booking List</h3>
        </div>
          {this.state.tickets && this.state.tickets.length > 0 && (
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>status</th>
                  <th>Booked At</th>
                  <th>Journy Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tickets.map((ticket, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{ticket._id}</td>
                      <td>{ticket.isActive ? "confirmed" : "cancelled"}</td>
                      <td>{ticket.bookedAt }</td>
                      <td>{ticket.journyDate }</td>
                      <td>
                        {ticket.isActive && (
                          <button onClick={() => this.cancelTicket(ticket)}>
                            cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    );
  }
}
