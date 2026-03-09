import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';

  useEffect(() => {
    const fetchProfileAndCanvases = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch profile
        const profileRes = await fetch(`${BACKEND_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error(profileData.message || 'Failed to fetch profile');
        setProfile(profileData.user);

        // Fetch canvases
        const canvasRes = await fetch(`${BACKEND_URL}/canvas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const canvasData = await canvasRes.json();
        if (!canvasRes.ok) throw new Error(canvasData.message || 'Failed to fetch canvases');
        setCanvases(canvasData);

        // Fetch share requests
        const requestsRes = await fetch(`${BACKEND_URL}/canvas/requests`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const requestsData = await requestsRes.json();
        if (!requestsRes.ok) throw new Error(requestsData.message || 'Failed to fetch requests');
        setRequests(requestsData);
      } catch (err) {
        setError(err.message);
        navigate('/login');
      }
    };

    fetchProfileAndCanvases();
  }, [navigate, token, BACKEND_URL]);

  const handleCreateCanvas = async () => {
    if (!newCanvasName.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/canvas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCanvasName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create canvas');

      setCanvases((prev) => [...prev, data]);
      setNewCanvasName('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/canvas/accept/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to accept request');

      // Remove from requests and add to canvases
      setRequests((prev) => prev.filter((req) => req._id !== id));
      setCanvases((prev) => [...prev, data.canvas]);
      alert('Request accepted!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/canvas/reject/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reject request');

      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCanvas = async (id) => {
    if (!window.confirm("Are you sure you want to delete this canvas?")) return;
    
    try {
      const res = await fetch(`${BACKEND_URL}/canvas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete canvas');

      setCanvases((prev) => prev.filter((canvas) => canvas._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Hello, {profile.name}</h1>
        <p className="text-gray-700 mb-1">Email: {profile.email}</p>
        <p className="text-gray-500 text-sm mb-4">
          Account created: {new Date(profile.createdAt).toLocaleString()}
        </p>

        {/* Incoming Requests Section */}
        {requests.length > 0 && (
          <div className="my-6 p-4 border rounded-lg bg-yellow-50">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Incoming Requests</h2>
            <div className="flex flex-col gap-3">
              {requests.map((req) => (
                <div key={req._id} className="flex justify-between items-center p-3 bg-white shadow-sm rounded border">
                  <div>
                    <h3 className="font-medium">{req.name}</h3>
                    <p className="text-sm text-gray-600">From: {req.owner?.name} ({req.owner?.email})</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(req._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="my-6">
          <h2 className="text-2xl font-semibold mb-4">Your Canvases</h2>

          {/* Create Canvas Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter canvas name"
              className="flex-1 px-4 py-2 border rounded shadow-sm focus:outline-none"
              value={newCanvasName}
              onChange={(e) => setNewCanvasName(e.target.value)}
            />
            <button
              onClick={handleCreateCanvas}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
            >
              Create Canvas
            </button>
          </div>

          {/* Canvas List */}
          {canvases.length === 0 ? (
            <p className="text-gray-500">No canvases available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {canvases.map((canvas) => (
                <div
                  key={canvas._id}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-medium text-blue-700 mb-2">{canvas.name}</h3>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(canvas.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last updated: {new Date(canvas.updatedAt).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    Owner: {canvas.owner?.name || 'Unknown'}
                  </p>
                  
                  {/* Updated buttons container */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/canvas/load/${canvas._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Go to Canvas
                    </button>
                    <button
                      onClick={() => handleDeleteCanvas(canvas._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;