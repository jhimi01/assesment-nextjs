'use client';
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
