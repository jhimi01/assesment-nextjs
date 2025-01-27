'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookie } from './useCookie';

export default function useLoggedInUser() {
  const [user, setUser] = useState(null); // user data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error handling
  const [refetch, setRefetch] = useState(false); // refetch state
  const { getCookie } = useCookie({ key: 'Token', days: 7 });
  const token = getCookie();
  

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // start loading
      setError(null); // clear previous errors

      try {
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://localhost:5000/api/auth/loggedin-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data); // set user data
      } catch (err) {
        setError(err.message || 'An error occurred while fetching user data');
      } finally {
        setLoading(false); // finish loading
      }
    };

    if (refetch || user === null) {
      fetchUserData(); // fetch data when refetch is true or when user is not loaded yet
      setRefetch(false); // reset refetch state
    }
  }, [refetch, token, user]); // dependencies

  return { user, loading, error, refetch: () => setRefetch(true) }; // return the hook data
}
