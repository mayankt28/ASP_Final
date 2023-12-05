import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import Sidebar from "./Sidenav";
import map from "./map.jpg";
import "./home.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export default function HomePage() {
  let [cookie, _, removeCookie] = useCookies(["jwtToken"]);
  const navigate = useNavigate();
  if (!cookie.jwtToken || cookie.jwtToken === "") {
    navigate("/");
  }

  return (
    <div>
      <div className="content row">
        <div className="home_root">
          <div className="col s3">
            <Sidebar jwtToken={cookie.jwtToken} />
          </div>
          <div className="col s9 center-align map-container">
            <img src={map} />
          </div>
        </div>
      </div>
      <div className="fixed-action-btn">
        <a
          className="btn-floating btn-large red"
          onClick={() => {
            removeCookie("jwtToken");
            navigate("/");
          }}
        >
          <i className="large material-icons">exit_to_app</i>
          <p>Log Out</p>
        </a>
      </div>
    </div>
  );
}
