import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import your board-related providers and components
import  BoardProvider  from '../store/BoardProvider';
import  ToolboxProvider  from '../store/ToolboxProvider';
import Toolbar from '../components/Toolbar/index';
import Board from '../components/Board/index';
import Toolbox from '../components/Toolbox/index';

function CanvasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCanvas = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3030/canvas/load/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Failed to load canvas');
          return;
        }

        setCanvas(data);
      } catch (err) {
        setError('An error occurred while loading the canvas');
      } finally {
        setLoading(false);
      }
    };

    fetchCanvas();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading canvas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 font-semibold text-xl">
        {error}
      </div>
    );
  }

  return (
    <BoardProvider initialCanvas = {canvas}>
      <ToolboxProvider>
        <Toolbar />
        <Board canvas={canvas} />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  );
}

export default CanvasPage;
