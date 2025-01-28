import { useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const useCookie = ({ key, days = 7, defaultValue }) => {
  const [cookieValue, setCookieValue] = useState(() => cookies.get(key) || defaultValue);

  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);

  const setCookie = (value) => {
    cookies.set(key, value, { path: '/', expires: expirationDate });
    setCookieValue(value); // Update state
  };

  const getCookie = () => cookies.get(key); // Simplified

  const removeCookie = () => {
    cookies.remove(key, { path: '/' });
    setCookieValue(undefined);
  };

  return {
    cookieValue,
    setCookie,
    getCookie,
    removeCookie,
  };
};


// import { useState } from "react";
// import Cookies from "universal-cookie";

// const cookies = new Cookies();

// export const useCookie = (props) => {
//   const { key, days = 7, defaultValue } = props;
//   const [cookieValue, setCookieValue] = useState(() => cookies.get(key));

//   const expirationDate = new Date();
//   expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);

//   const OPTIONS = {
//     path: "/",
//     sameSite: "strict",
//     expires: expirationDate,
//   };

//   const setCookie = (value) => {
//     cookies.set(key, value, OPTIONS);
//     setCookieValue(value);
//   };

//   const getCookie = () => {
//     if (!cookies.get(key)) {
//       setCookie(defaultValue);
//     }
//     return cookies.get(key);
//   };

//   const updateCookie = (value) => {
//     setCookie(value);
//   };

//   const removeCookie = () => {
//     cookies.remove(key, { path: "/" });
//     setCookieValue(undefined);
//   };

//   return {
//     setCookie,
//     getCookie,
//     updateCookie,
//     removeCookie,
//     cookieValue,
//   };
// };
