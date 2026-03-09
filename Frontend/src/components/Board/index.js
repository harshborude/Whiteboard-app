import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import { updateCanvas } from "../../utils/api";
import classes from "./index.module.css";

function Board() {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const navigate = useNavigate();
  const {
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo,
    redo,
  } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxContext);

  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };

  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  };

  const handleMouseUp = () => {
    boardMouseUpHandler();
    // Removed auto-save from here to rely on the manual Save button
  };


  const handleSave = async () => {
    try {
      const canvasId = window.location.pathname.split('/').pop();
      await updateCanvas(canvasId, elements);
      alert("Canvas saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save canvas.");
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      alert("Please enter an email address.");
      return;
    }
    
    try {
      const canvasId = window.location.pathname.split('/').pop();
      const token = localStorage.getItem('token');
      const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';
      
      const res = await fetch(`${BACKEND_URL}/canvas/share/${canvasId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetEmail: shareEmail })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to share canvas');

      alert("Share request sent successfully!");
      setShowShareDropdown(false);
      setShareEmail('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 50, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowShareDropdown(!showShareDropdown)} 
            style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', borderRadius: '4px', cursor: 'pointer', height: 'fit-content' }}
          >
            Share With
          </button>
          
          {showShareDropdown && (
            <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '8px', width: '250px' }}>
              <input 
                type="email" 
                placeholder="Enter user email..." 
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px', outline: 'none' }}
              />
              <button 
                onClick={handleShare}
                style={{ padding: '8px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
              >
                Send Request
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate('/profile')} 
          style={{ padding: '8px 16px', backgroundColor: '#374151', color: 'white', borderRadius: '4px', cursor: 'pointer', height: 'fit-content' }}
        >
          Go to Dashboard
        </button>
        <button 
          onClick={handleSave} 
          style={{ padding: '8px 16px', backgroundColor: '#2563EB', color: 'white', borderRadius: '4px', cursor: 'pointer', height: 'fit-content' }}
        >
          Save
        </button>
      </div>
      
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
