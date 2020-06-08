import React from "react";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";

export default class PlacesPage extends React.Component {
  state = {
    list: [],
    place: {
      name: "",
      code: "",
    },
  };
  componentDidMount = async () => {
    this.getPlaces();
  };
  clearData(){
      this.setState({place:{name:"",code:""}});
  }
  async getPlaces() {
    try {
      const { data } = await axios.get("http://localhost:4000/api/place");
      console.log(data);
      this.setState({ list: data });
    } catch (error) {
      console.log(error);
    }
  }
  onChange(e, key) {
    const data = { ...this.state.place, [key]: e.target.value };
    this.setState({ place: data });
    console.log(data, key);
  }

  async savePace(event) {
    event.preventDefault();
    if (this.state.place._id) {
      const { data } = await axios.put(
        `http://localhost:4000/api/place/${this.state.place._id}`,
        this.state.place
      );
    } else {
      const { data } = await axios.post(
        `http://localhost:4000/api/place`,
        this.state.place
      );
    }
    this.clearData();
    this.getPlaces();
  }
  editPlace(place) {
    this.setState({ place: place });
  }
  async deletePlace(place) {
    const { data } = await axios.delete(
      `http://localhost:4000/api/place/${place._id}`
    );
    this.getPlaces();
  }

  render() {
    return (
      <div className="container">
        <Form onSubmit={(e) => this.savePace(e)}>
          <Form.Group controlId="formPlace">
            <Form.Label>Place Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Place"
              value={this.state.place.name}
              onChange={(e) => this.onChange(e, "name")}
            />
            <Form.Text className="text-muted">
              Enter valid place name.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="placeCode">
            <Form.Label>Place Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Code"
              value={this.state.place.code}
              onChange={(e) => this.onChange(e, "code")}
            />
            <Form.Text className="text-muted">
              Enter valid place code.
            </Form.Text>
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
                <th>Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.list.map((place, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{place.name}</td>
                    <td>{place.code}</td>
                    <td>
                      <button onClick={() => this.editPlace(place)}>
                        edit
                      </button>
                      <button onClick={() => this.deletePlace(place)}>
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
