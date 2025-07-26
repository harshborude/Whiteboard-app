import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3030/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProfile(data.user);
        } else {
          setError(data.message || 'Failed to fetch profile');
          navigate('/login');
        }
      } catch (err) {
        setError('An error occurred while fetching profile');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 font-semibold text-xl">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Hello, {profile.name} 👋</h1>
        <p className="text-gray-700 mb-2">Email: {profile.email}</p>
        <p className="text-gray-500 text-sm">Account created: {new Date(profile.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default Profile;
