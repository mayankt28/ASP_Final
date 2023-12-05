import Cookies from "universal-cookie";
import axios, { AxiosError } from "axios";
import { error } from "console";

const backendHost = "http://127.0.0.1:3000";
const loginPath = backendHost + "/api/auth/login";
const registerPath = backendHost + "/api/auth/register";
const userDetailsPath = backendHost + "/api/user/getuserdetails";
const getBuildingsPath = backendHost + "/api/building/getBuildings";
const getBuildingsByTypePath = backendHost + "/api/building/getBuildingByType/";
const getBuildingsWithLeastOccupancy =
  backendHost + "/api/building/getBuildingWithLeastOccupancy/";

async function logIn(userName: string, password: string): Promise<any> {
  if (userName == "" || password == "") {
    return [false, "Username/Password cannot be empty"];
  }

  try {
    let response = await axios.post(
      loginPath,
      {
        email: userName,
        password: password,
      },
      { headers: { "Content-Type": "application/json" }, timeout: 1000 }
    );
    if (response.data.success) {
      return [true, response.data.token];
    }
  } catch (err: any) {
    console.log(err);
    return [false, err.response?.data?.error || err.message];
  }
}

async function populateLeastOccupiedPlace(jwtToken: string): Promise<any> {
  let types = [
    "study",
    "sports",
    "gym",
    "entertainment",
    "relax",
    "food",
    "administrative",
    "office",
  ];
  let promises = types.map(async (type) => {
    console.log("Network call for " + type);
    try {
      let response = await axios.get(getBuildingsWithLeastOccupancy + type, {
        headers: { Authorization: "Bearer " + jwtToken },
        timeout: 1000,
      });
      console.log("Correct response for " + type);
      console.log(type, response);
      return [type, response.data.name];
    } catch (err) {
      console.log("Invalid response for " + type);
      console.error(type, err);
      return [type, "another location."];
    }
  });
  let leastOccupiedBuildingsByType = await Promise.all(promises);
  let leastOccupiedBuilidingsMap = new Map<String, String>();
  leastOccupiedBuildingsByType.forEach((e) => {
    leastOccupiedBuilidingsMap.set(e[0], e[1]);
    console.log(e);
  });
  return leastOccupiedBuilidingsMap;
}

async function register(
  firstName: string,
  lastName: string,
  dob: string,
  email: string,
  password: string
): Promise<any> {
  if (email == "" || password == "") {
    return [false, "Email/Password cannot be empty"];
  }
  if (firstName == "" || lastName == "") {
    return [false, "FirstName/LastName cannot be empty"];
  }
  if (dob == "") {
    return [false, "Invalid DOB"];
  }
  try {
    let response = await axios.post(
      registerPath,
      {
        email: email,
        password: password,
        firstname: firstName,
        lastname: lastName,
        dob: dob,
      },
      { headers: { "Content-Type": "application/json" }, timeout: 1000 }
    );
    if (response.data.success) {
      return [true, response.data.token];
    }
  } catch (err: any) {
    console.log(err);
    return [false, err.response?.data?.error || err.message];
  }
}

async function getBuildings(jwtToken: string): Promise<any> {
  try {
    let response = await axios.get(getBuildingsPath, {
      headers: { Authorization: "Bearer " + jwtToken },
      timeout: 1000,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getBuildingsByType(
  type: string,
  jwtToken: string
): Promise<any> {
  try {
    let response = await axios.get(getBuildingsByTypePath + type, {
      headers: { Authorization: "Bearer " + jwtToken },
      timeout: 1000,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getUserDetails(jwtToken: string): Promise<any> {
  try {
    let response = await axios.get(userDetailsPath, {
      headers: { Authorization: "Bearer " + jwtToken },
      timeout: 1000,
    });
    if (response.data.success) {
      return [
        response.data.data.firstname + " " + response.data.data.lastname,
        response.data.data.email,
      ];
    }
  } catch (err) {
    console.log(err);
    return ["John Doe", "johndoe@gmail.com"];
  }
}

export {
  logIn,
  register,
  getUserDetails,
  getBuildings,
  getBuildingsByType,
  populateLeastOccupiedPlace,
};
