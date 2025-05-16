import React from "react";
import { useNavigate } from "react-router-dom";

/* S */
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome!</h1>
      <p>
        Choose from our 4 different layouts (A, B, C, D) with varying numbers of poses! <br />
        Select your countdown time (1, 3, 5, or 10 seconds) for each photo – no retakes! <br />
        Get ready with your best poses and have fun!
      </p>
      <p>
        After the session is complete, you can download a digital copy and share the fun!
      </p>
      <button onClick={() => navigate("/layout-selection")}>START</button>
    </div>
  );
};

export default Welcome;
