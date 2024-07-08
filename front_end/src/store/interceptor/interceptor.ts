import axios from 'axios';
import URL from 'shared/functions/getURL';
import { signOut } from '../actions/User';
import Cookies from 'js-cookie';
const interceptor = (store) => {
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      if (config.url?.startsWith(`${URL()}`)) {
        const state = store.getState();

        if (state.user.jwt) {
          config.headers['Authorization'] = 'Bearer ' + state.user.jwt;
        } else {
          let token: string = Cookies.get('accessToken') || '';
          if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
          }
        }
      }

      // Do something before request is sent
      return config;
    },
    function (error) {
      console.log('music axios request error');
      console.log(error);

      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      // Do something with response error
      if (error?.response?.status === 403) {
        console.log('403 ERROR AUTH JWT!');
        store.dispatch(signOut());
        const publicKeyStr = localStorage.getItem('player_public_key') ?? '';
        const pub_key_signature =
          localStorage.getItem('player_public_key_signature_v2') ?? '';
        const userId = localStorage.getItem('userId') ?? '';
        const privateKeyStr = localStorage.getItem('player_private_key') ?? '';
        localStorage.clear();
        Cookies.remove('accessToken');
        if (publicKeyStr)
          localStorage.setItem('player_public_key', publicKeyStr);
        if (pub_key_signature)
          localStorage.setItem(
            'player_public_key_signature_v2',
            pub_key_signature
          );
        if (userId) localStorage.setItem('userId', userId);
        if (privateKeyStr)
          localStorage.setItem('player_private_key', privateKeyStr);
        // store.history.push("/");
        window.location.reload();
      }
      return Promise.reject(error);
    }
  );
};

export default {
  interceptor
};
