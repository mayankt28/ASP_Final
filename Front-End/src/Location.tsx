import { Component } from "react";

type LocationProps = {
  title: string;
  type: string;
  floors: any;
  fallbackBuilding: any;
};

type LocationState = {
  occupancy: number;
  selectedFloor: number;
};

class Location extends Component<LocationProps, LocationState> {
  mapTypeToIcon(type: string) {
    let typesmall = type.toLowerCase();
    switch (typesmall) {
      case "study":
        return "book";
      case "sports":
        return "directions_bike";
      case "gym":
        return "directions_run";
      case "entertainment":
        return "local_movies";
      case "relax":
        return "live_tv";
      case "food":
        return "local_pizza";
      case "administrative":
        return "supervisor_account";
      case "office":
        return "domain";
      default:
    }
  }

  constructor(props: LocationProps) {
    super(props);
    if (this.props.floors.length > 0) {
      let occupancy =
        ((this.props.floors[0].occupancy * 100) / this.props.floors[0].max) | 0;
      this.state = {
        occupancy: occupancy,
        selectedFloor: this.props.floors[0].floorNumber,
      };
    } else {
      this.state = { occupancy: -1, selectedFloor: -1 };
    }
  }

  componentDidMount(): void {}

  updateOccupancy(event: any) {
    console.log({
      occupancy: event.target.dataset.occupancy,
      selectedFloor: event.target.dataset.floor,
    });
    console.log(this);
  }

  render() {
    let occupancyWidget;
    let warning: any = "";
    if (this.state.occupancy >= 90) {
      occupancyWidget = (
        <span className="badge red darken-2 white-text pulse">
          {this.state.occupancy}% occupied
        </span>
      );
      warning = (
        <p className="red-text">
          The selected floor has very little to no vacancy, please visit{" "}
          {this.props.fallbackBuilding}
        </p>
      );
    } else if (this.state.occupancy >= 0) {
      occupancyWidget = (
        <span className="badge blue darken-2 white-text">
          {this.state.occupancy}% occupied
        </span>
      );
    } else {
      occupancyWidget = "";
    }

    let floors = this.props.floors.map((f: any) => {
      let occupancy = ((f.occupancy * 100) / f.max) | 0;
      let selectedcolor =
        this.state.selectedFloor == f.floorNumber
          ? this.state.occupancy >= 90
            ? "red-text"
            : "blue-text"
          : "";
      return (
        <i
          className={"material-icons " + selectedcolor}
          style={{ marginRight: "2px" }}
          data-occupancy={occupancy}
          data-floor={f.floorNumber}
          onClick={(event: any) => {
            this.setState({
              occupancy: event.target?.dataset.occupancy,
              selectedFloor: event.target?.dataset.floor,
            });
          }}
        >
          filter_{f.floorNumber}
        </i>
      );
    });
    return (
      <ul className="collection-item avatar">
        <i className="material-icons circle blue-text white">
          {this.mapTypeToIcon(this.props.type)}
        </i>
        {occupancyWidget}
        <span className="title">{this.props.title}</span>
        <p>
          {this.props.type}
          <br />
          {warning}
        </p>
        <p className="grey-text floor_container" style={{ marginTop: "10px" }}>
          {floors}
        </p>
      </ul>
    );
  }
}

export default Location;
