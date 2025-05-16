import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LayoutSelection = ({ setSelectedLayout }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const layouts = [
    {
      id: "layoutA",
      title: "Layout A",
      poses: 4,
      arrangement: "vertical"
    },
    {
      id: "layoutB",
      title: "Layout B",
      poses: 3,
      arrangement: "vertical"
    },
    {
      id: "layoutC", 
      title: "Layout C",
      poses: 1,
      arrangement: "single"
    },
    {
      id: "layoutD",
      title: "Layout D",
      poses: 2,
      arrangement: "vertical"
    }
  ];

  const handleLayoutSelection = (layoutId) => {
    setSelected(layoutId);
    setSelectedLayout(layoutId);
    
    // Small delay to give a visual effect that the layout has been selected
    setTimeout(() => {
      navigate("/photobooth");
    }, 300);
  };

  // Function to render pose boxes according to the layout
  const renderPoseBoxes = (layout) => {
    const boxes = [];
    
    if (layout.arrangement === "single") {
      // Layout C: only 1 box, ditempatkan di bagian atas
      return (
        <div className="single-box-container">
          <div className="pose-box"></div>
          <div style={{ flex: 1 }}></div>
        </div>
      );
    } else {
      // Layout A, B, and D: vertical with different number of poses
      for (let i = 0; i < layout.poses; i++) {
        boxes.push(
          <div key={i} className="pose-box"></div>
        );
      }
      return <div className="vertical-box-container">{boxes}</div>;
    }
  };

  return (
    <div className="layout-selection-container">
      <h1>Choose Your Photo Layout</h1>
      <p>Select a photo layout that matches your preference</p>
      
      <div className="layout-grid-container">
        <div className="layout-row">
          <div 
            className={`layout-box ${selected === "layoutA" ? 'selected' : ''}`}
            onClick={() => handleLayoutSelection("layoutA")}
          >
            <div className="layout-preview">
              {renderPoseBoxes(layouts[0])}
            </div>
            <div className="layout-label">Layout A</div>
          </div>
          
          <div 
            className={`layout-box ${selected === "layoutB" ? 'selected' : ''}`}
            onClick={() => handleLayoutSelection("layoutB")}
          >
            <div className="layout-preview">
              {renderPoseBoxes(layouts[1])}
            </div>
            <div className="layout-label">Layout B</div>
          </div>
        </div>
        
        <div className="layout-row">
          <div 
            className={`layout-box ${selected === "layoutC" ? 'selected' : ''}`}
            onClick={() => handleLayoutSelection("layoutC")}
          >
            <div className="layout-preview">
              {renderPoseBoxes(layouts[2])}
            </div>
            <div className="layout-label">Layout C</div>
          </div>
          
          <div 
            className={`layout-box ${selected === "layoutD" ? 'selected' : ''}`}
            onClick={() => handleLayoutSelection("layoutD")}
          >
            <div className="layout-preview">
              {renderPoseBoxes(layouts[3])}
            </div>
            <div className="layout-label">Layout D</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutSelection; 