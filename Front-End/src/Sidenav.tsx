import { Component } from "react";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import university_logo from "./university_logo.png";
import Location from "./Location";
import {
  getBuildings,
  getBuildingsByType,
  getUserDetails,
  populateLeastOccupiedPlace,
} from "./Backend";

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

type SideBarProps = {
  jwtToken: string;
};
type SideBarState = {
  loadingUserDetails: boolean;
  loadingBuildingDetails: boolean;
  username: string;
  email: string;
  searchType: string;
  buildingList: any;
  isBuildingError: boolean;
  jwt: string;
  leastOccupiedBuildings: Map<String, String>;
};
class Sidebar extends Component<SideBarProps, SideBarState> {
  updateSearch: any;
  constructor(props: any) {
    super(props);
    // Initial state
    this.state = {
      loadingUserDetails: true,
      loadingBuildingDetails: true,
      username: "",
      email: "",
      buildingList: [],
      searchType: "",
      isBuildingError: false,
      jwt: this.props.jwtToken,
      leastOccupiedBuildings: new Map(),
    };

    this.handleBuildingResponse = this.handleBuildingResponse.bind(this);
    this.onAutoComplete = this.onAutoComplete.bind(this);
  }

  onAutoComplete(type: string) {
    getBuildingsByType(type, this.state.jwt).then(this.handleBuildingResponse);
  }

  handleBuildingResponse(response: any) {
    if (response === false) {
      this.setState({
        isBuildingError: true,
        loadingBuildingDetails: false,
        buildingList: [],
      });
    } else {
      this.setState({
        isBuildingError: false,
        loadingBuildingDetails: false,
        buildingList: response,
      });
    }
  }

  componentDidMount() {
    var sidenav: Element = document.querySelector(".sidenav") as Element;
    var autoCompleteElems = document.querySelectorAll(".autocomplete");
    var sidenavInstance = M.Sidenav.init(sidenav, {
      edge: "left",
      inDuration: 0,
    });
    var autoCompleteInstances = M.Autocomplete.init(autoCompleteElems, {
      data: {
        study: null,
        sports: null,
        gym: null,
        entertainment: null,
        relax: null,
        food: null,
        administrative: null,
        office: null,
      },
      onAutocomplete: this.onAutoComplete,
    });
    sidenavInstance.open();
    // Fetch Data
    getUserDetails(this.props.jwtToken)
      .then((val) => {
        this.setState({
          username: val[0],
          email: val[1],
          loadingUserDetails: false,
        });
      })
      .then(() => getBuildings(this.props.jwtToken))
      .then(this.handleBuildingResponse)
      .then(() => populateLeastOccupiedPlace(this.props.jwtToken))
      .then((e) => {
        console.log(e);
        this.setState({ leastOccupiedBuildings: e });
      });
  }

  render() {
    const {
      loadingUserDetails,
      loadingBuildingDetails,
      username,
      email,
      buildingList,
      searchType,
      leastOccupiedBuildings,
    } = this.state;
    let userView;

    let loadingViewUser = (
      <div
        className="progress white-text centre"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <div className="indeterminate"></div>
      </div>
    );
    let userNameView = (
      <a href="#name">
        <span className="white-text name">{username}</span>
      </a>
    );
    let emailView = (
      <a href="#email">
        <span className="white-text email">{email}</span>
      </a>
    );
    let signOutButton = (
      <i className="material-icons right white-text">exit_to_app</i>
    );
    let buildingListElement = buildingList.map((building: any) => {
      return (
        <li>
          <Location
            title={building.name}
            type={capitalizeFirstLetter(building.type)}
            floors={building.floors}
            fallbackBuilding={
              leastOccupiedBuildings.has(building.type)
                ? leastOccupiedBuildings.get(building.type)
                : "another location"
            }
          />
        </li>
      );
    });
    return (
      <div>
        <div>
          <h1>Welcome to the university explorer</h1>
        </div>
        <ul
          id="slide-out"
          className="sidenav sidenav-fixed collection"
          style={{ width: "25%" }}
        >
          <li>
            <div className="user-view">
              <div className="background blue darken-2"></div>
              <a href="#">
                <img className="circle" src={university_logo} />
                {loadingUserDetails ? (
                  loadingViewUser
                ) : (
                  <div>
                    {userNameView} {emailView}
                  </div>
                )}
              </a>
              {/* <a>{signOutButton}</a> */}
            </div>
          </li>
          <li>
            <div className="input-field col s12">
              <i className="material-icons prefix">search</i>
              <input
                type="text"
                id="autocomplete-input"
                className="autocomplete"
              />
              <label htmlFor="autocomplete-input">Search by type</label>
            </div>
          </li>
          <div className="collection">{buildingListElement}</div>
        </ul>
        <a
          href="#"
          data-target="slide-out"
          className="sidenav-trigger show-on-small"
        >
          <i className="material-icons">menu</i>
        </a>
      </div>
    );
  }
}

export default Sidebar;
