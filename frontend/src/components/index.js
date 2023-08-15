import Header from "../views/Home/Header.jsx";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main/Main";
import Cart from "./Cart/Cart";
import UserProfile from "./UserProfile";
import axios from "axios";

export { callAPIDish, Header, Login, Register, Main, Cart, UserProfile };
let API_URL = "https://backend-cvjhefcki-phanducmanhk65.vercel.app";

export default function callAPIDish(endpoint, method = "GET", body) {
  return axios({
    method,
    url: `${API_URL}/${endpoint}`,
    data: body,
  }).catch((err) => {
    console.log(err);
  });
}
