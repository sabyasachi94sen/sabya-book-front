
import { RouterProvider } from '@tanstack/react-router';
import { Login } from './component/login';
import router from './routes';
import axios from 'axios';
import { base_url } from './baseUrl';
import getLocalStorage from './helpers/getLocalStorage';
import ErrorHandle from './utils/errorHandle';

if (typeof window != "undefined") {
  axios.defaults.baseURL = base_url;
  axios.defaults.headers.common["Accept"] = "application/json";
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

  var data = getLocalStorage("user");
  if (data) {
    const user = JSON.parse(data);
    const { token } = user;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  else
    delete axios.defaults.headers.common["Authorization"];

  axios.interceptors.response.use((res) => {
    return res;
  },
    async (err) => {
      ErrorHandle(err)
      throw err;
    }
  )
}

function App() {
  return (
    <>
      {/* <RouterProvider router={router} /> */}
      <div>
        Hello World
      </div>
    </>
  );
}

export default App;
