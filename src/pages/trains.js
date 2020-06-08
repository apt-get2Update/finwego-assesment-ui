import React from "react";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";

export default class TrainsPage extends React.Component {
  state = {
    list: [],
    places: [],
    train: {
      name: "",
      number: "",
      availableSheets: 10,
      fromStationCode: "",
      toStationCode: "",
      startTime: "",
      endTime: "",
    },
  };
  componentDidMount = async () => {
    const { data } = await axios.get("https://finwego-assesment-api.herokuapp.com/api/place");
    this.setState({ places: data });
    this.getTrains();
  };
  clearData() {
    this.setState({ train: { name: "",
    number: "",
    availableSheets: 10,
    fromStationCode: "",
    toStationCode: "",
    startTime: "",
    endTime: "", } });
  }
  async getTrains() {
    try {
      const { data } = await axios.get("https://finwego-assesment-api.herokuapp.com/api/train");
      console.log(data);
      this.setState({ list: data });
    } catch (error) {
      console.log(error);
    }
  }
  onChange(e, key) {
    const data = { ...this.state.train, [key]: e.target.value };
    this.setState({ train: data });
    console.log(data, key);
  }

  async savePace(event) {
    event.preventDefault();
    if (this.state.train._id) {
      const { data } = await axios.put(
        `https://finwego-assesment-api.herokuapp.com/api/train/${this.state.train._id}`,
        this.state.train
      );
    } else {
      const { data } = await axios.post(
        `https://finwego-assesment-api.herokuapp.com/api/train`,
        this.state.train
      );
    }
    this.clearData();
    this.getTrains();
  }
  editTrain(train) {
    this.setState({ train: train });
  }
  async deleteTrain(train) {
    const { data } = await axios.delete(
      `https://finwego-assesment-api.herokuapp.com/api/train/${train._id}`
    );
    this.getTrains();
  }

  render() {
    return (
      <div className="container">
        <Form onSubmit={(e) => this.savePace(e)}>
          <Form.Group controlId="formtrain">
            <Form.Label>train Name</Form.Label>
            <Form.Control
              type="text"
              trainholder="Enter train"
              value={this.state.train.name}
              onChange={(e) => this.onChange(e, "name")}
            />
            <Form.Text className="text-muted">
              Enter valid train name.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="trainCode">
            <Form.Label>train Code</Form.Label>
            <Form.Control
              type="text"
              trainholder="Enter Code"
              value={this.state.train.number}
              onChange={(e) => this.onChange(e, "number")}
            />
            <Form.Text className="text-muted">
              Enter valid train Number.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select From Station</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => this.onChange(e, "fromStationCode")}
              value={this.state.train.fromStationCode}
            >
              <option value=""></option>
              {this.state.places.map((p, i) => (
                <option key={i} value={p.code}>
                  {p.name},{p.code}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Select to Station</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => this.onChange(e, "toStationCode")}
              value={this.state.train.toStationCode}
            >
              <option value=""></option>
              {this.state.places.map((p, i) => (
                <option key={i} value={p.code}>
                  {p.name},{p.code}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

        <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="text"
              trainholder="Enter start time"
              value={this.state.train.startTime}
              onChange={(e) => this.onChange(e, "startTime")}
            />
          </Form.Group>
          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="text"
              trainholder="Enter End time"
              value={this.state.train.endTime}
              onChange={(e) => this.onChange(e, "endTime")}
            />
          </Form.Group>
          <Form.Group controlId="availableSheets">
            <Form.Label>Available Sheets</Form.Label>
            <Form.Control
              type="number"
              trainholder="Enter End time"
              value={this.state.train.availableSheets}
              onChange={(e) => this.onChange(e, "availableSheets")}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <div className="container-fluid">
          <Table striped bordered hover variant="light">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Number</th>
                <th>From station</th>
                <th>To station</th>
                <th>departure</th>
                <th>arival</th>
                <th>sheets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.list.map((train, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{train.name}</td>
                    <td>{train.number}</td>
                    <td>{train.fromStationCode}</td>
                    <td>{train.toStationCode}</td>
                    <td>{train.startTime}</td>
                    <td>{train.endTime}</td>
                    <td>{train.availableSheets}</td>
                    <td>
                      <button onClick={() => this.editTrain(train)}>
                        edit
                      </button>
                      <button onClick={() => this.deleteTrain(train)}>
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
