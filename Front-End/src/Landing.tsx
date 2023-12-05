import "./App.css";
import { useState } from "react";
import "materialize-css/dist/css/materialize.min.css";
import { useNavigate } from "react-router";
import { logIn } from "./Backend";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function Landing() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["jwtToken"]);

  const onLogIn = (event: any) => {
    document.getElementById("submitBtn")?.setAttribute("disabled", "true");
    logIn(email, password).then((res) => {
      if (res[0]) {
        setCookie("jwtToken", res[1]);
        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res[1],
          allowOutsideClick: false,
        });
      }
      document.getElementById("submitBtn")?.removeAttribute("disabled");
    });
  };

  return (
    <div className="landing_root">
      <form className="login-form" action="javascript:void(0);">
        <h1>Login</h1>
        <div className="form-field">
          <i className="fas fa-user"></i>
          <input
            type="text"
            name="email"
            id="email"
            className="white-text"
            pattern="^[a-zA-Z0-9_-]{1,16}$"
            placeholder="Enter email address"
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-field">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password"
            id="password"
            className="white-text"
            placeholder="Enter password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button value="Login" className="btn" id="submitBtn" onClick={onLogIn}>
          Login
        </button>

        <div style={{ textAlign: "center", marginTop: "1em" }}>
          Do not have an acccount? <a href="signup">Create One</a>
        </div>
      </form>
    </div>
  );
}
