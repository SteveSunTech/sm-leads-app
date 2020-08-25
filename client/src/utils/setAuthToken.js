import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token
    // console.log(axios.defaults.headers.common);
    // const res = await axios.get('/api/auth')
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    // console.log('delete')
  }

  // // Default config options
  // const defaultOptions = {
  //   // baseURL: <CHANGE-TO-URL>,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  // // Create instance
  // let instance = axios.create(defaultOptions);

  // // Set the AUTH token for any request
  // instance.interceptors.request.use(function (config) {
  //   const token = localStorage.getItem('token');
  //   config.headers.Authorization =  token ? `Bearer ${token}` : '';
  //   return config;
  // });



//   // Add a request interceptor
// axios.interceptors.request.use(function (config) {
//   // const token = store.getState().session.token;
//   config.headers.Authorization =  token;

//   return config;
// });
}

export default setAuthToken;