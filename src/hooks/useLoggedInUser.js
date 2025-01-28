'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookie } from './useCookie';

export default function useLoggedInUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const { getCookie } = useCookie({ key: 'Token', days: 7 });
  const token = getCookie();
  

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) throw new Error('No token found');

        const response = await axios.get('/api/login', {
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
      fetchUserData();
      setRefetch(false); // reset refetch state
    }
  }, [refetch, token, user]);

  return { user, loading, error, refetch: () => setRefetch(true) };
}
