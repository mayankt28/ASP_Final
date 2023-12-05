import "./signup.css";
import { useState } from "react";
import "materialize-css/dist/css/materialize.min.css";
// import { Cookies } from "universal-cookie";
import { useNavigate } from "react-router";
import { register } from "./Backend";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [passwordVerification, setPasswordVerification] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["jwtToken"]);

  const onSignUp = (event: any) => {
    document.getElementById("submitBtn")?.setAttribute("disabled", "true");
    if (password != passwordVerification) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password in both the input fields were not same.",
        allowOutsideClick: false,
      });
      document.getElementById("submitBtn")?.removeAttribute("disabled");
      return;
    }
    register(firstName, lastName, "1997-06-15", email, password).then((val) => {
      if (val[0]) {
        setCookie("jwtToken", val[1]);
        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: val[1],
          allowOutsideClick: false,
        });
      }
      document.getElementById("submitBtn")?.removeAttribute("disabled");
    });
  };

  return (
    <div className="signup_root">
      <form className="signup-form" action="javascript:void(0);">
        <h1>Sign Up</h1>
        <div className="form-field">
          <i className="fas fa-user"></i>
          <input
            type="text"
            name="email"
            id="email"
            pattern="^[a-zA-Z0-9_-]{1,16}$"
            placeholder="Enter email "
            className="white-text"
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="email">Email address</label>
        </div>
        <div className="form-field">
          <i className="fas fa-user"></i>
          <input
            type="text"
            name="first_name"
            id="first_name"
            pattern="^[A-Za-z ]{5, 30}$"
            placeholder="Enter first name"
            className="white-text"
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="first_name">First Name</label>
        </div>
        <div className="form-field">
          <i className="fas fa-user"></i>
          <input
            type="text"
            name="last_name"
            id="last_name"
            pattern="^[A-Za-z ]{5, 30}$"
            placeholder="Enter last name"
            className="white-text"
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="last_name">Last Name</label>
        </div>
        <div className="form-field">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
            className="white-text"
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-field">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password_verification"
            id="password_verification"
            className="white-text"
            placeholder="Enter password again"
            onChange={(event) => setPasswordVerification(event.target.value)}
          />
          <label htmlFor="password_verification">Password (verification)</label>
        </div>
        <button
          type="submit"
          value="SignUp"
          className="btn"
          id="submitBtn"
          onClick={onSignUp}
        >
          SignUp
        </button>
        <div style={{ textAlign: "center", marginTop: "1em" }}>
          Already have an account? <a href="/login">Log In</a>
        </div>
      </form>
    </div>
  );
}
