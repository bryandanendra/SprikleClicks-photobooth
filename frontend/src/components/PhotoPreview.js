import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* N */
/* Mofusand frame */
const drawMofusandFrame = (ctx, canvas) => {
  const frameImg = new Image();
  frameImg.src = '/mofusand-frame.png';
  
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  };
};

/* Crayon Shin Chan Frame */
const drawShinChanFrame = (ctx, canvas) => {
  const frameImg = new Image();
  frameImg.src = '/shin-chan.png';
  
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  };
};

/* Miffy Frame */
const drawMiffyFrame = (ctx, canvas) => {
  const frameImg = new Image();
  frameImg.src = '/miffy-frame.png';
  
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  };
};

/* Mess Booth Frame */
const drawMessBoothFrame = (ctx, canvas) => {
  const frameImg = new Image();
  frameImg.src = '/mess-booth.png';
  
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  };
};

const frames = {
  none: {
    draw: (ctx, x, y, width, height) => {}, 
  },
  pastel: {
    draw: (ctx, x, y, width, height) => {
      const drawSticker = (x, y, type) => {
        switch(type) {
          case 'star':
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'heart':
            ctx.fillStyle = "#cc8084";
            ctx.beginPath();
            const heartSize = 22;
            ctx.moveTo(x, y + heartSize / 4);
            ctx.bezierCurveTo(x, y, x - heartSize / 2, y, x - heartSize / 2, y + heartSize / 4);
            ctx.bezierCurveTo(x - heartSize / 2, y + heartSize / 2, x, y + heartSize * 0.75, x, y + heartSize);
            ctx.bezierCurveTo(x, y + heartSize * 0.75, x + heartSize / 2, y + heartSize / 2, x + heartSize / 2, y + heartSize / 4);
            ctx.bezierCurveTo(x + heartSize / 2, y, x, y, x, y + heartSize / 4);
            ctx.fill();
            break;
          case 'flower':
            ctx.fillStyle = "#FF9BE4";
            for(let i = 0; i < 5; i++) {
              ctx.beginPath();
              const angle = (i * 2 * Math.PI) / 5;
              ctx.ellipse(
                x + Math.cos(angle) * 10,
                y + Math.sin(angle) * 10,
                8, 8, 0, 0, 2 * Math.PI
              );
              ctx.fill();
            }
            // Center of flower
            ctx.fillStyle = "#FFE4E1";
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'bow':
            ctx.fillStyle = "#f9cee7";
            // Left loop
            ctx.beginPath();
            ctx.ellipse(x - 10, y, 10, 6, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
            // Right loop
            ctx.beginPath();
            ctx.ellipse(x + 10, y, 10, 6, -Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
            // Center knot
            ctx.fillStyle = "#e68bbe";
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            break;
        }
      };

         // Top left corner
         drawSticker(x + 11, y + 5, 'bow');
         drawSticker(x - 18, y + 95, 'heart');
         
         // Top right corner
         drawSticker(x + width - 160, y + 10, 'star');
         drawSticker(x + width - 1, y + 50, 'heart');
         
         // Bottom left corner
         drawSticker(x + 120, y + height - 20, 'heart');
         drawSticker(x + 20, y + height - 20, 'star');
         
         // Bottom right corner
         drawSticker(x + width - 125, y + height - 5, 'bow');
         drawSticker(x + width - 10, y + height - 45, 'heart');
       }
     },

  
  cute: {
    draw: (ctx, x, y, width, height) => {
      const drawStar = (centerX, centerY, size, color = "#FFD700") => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for(let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const point = i === 0 ? 'moveTo' : 'lineTo';
          ctx[point](
            centerX + size * Math.cos(angle),
            centerY + size * Math.sin(angle)
          );
        }
        ctx.closePath();
        ctx.fill();
      };

      const drawCloud = (centerX, centerY) => {
        ctx.fillStyle = "#87CEEB";
        const cloudParts = [
          { x: 0, y: 0, r: 14 },
          { x: -6, y: 2, r: 10 },
          { x: 6, y: 2, r: 10 },
        ];
        cloudParts.forEach(part => {
          ctx.beginPath();
          ctx.arc(centerX + part.x, centerY + part.y, part.r, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      // Draw decorations around the frame
        // Top corners
        drawStar(x + 150, y + 18, 15, "#FFD700");
        drawCloud(x + 20, y + 5);
        drawStar(x + width - 1, y + 45, 12, "#FF69B4");
        drawCloud(x + width - 80, y + 5);

        // Bottom corners
        drawCloud(x + 150, y + height - 5);
        drawStar(x + 0, y + height - 65, 15, "#9370DB");
        drawCloud(x + width - 5, y + height - 85);
        drawStar(x + width - 120, y + height - 5, 12, "#40E0D0");
   }
  },

  mofusandImage: {
    draw: (ctx, x, y, width, height) => {
    }
  }, 

  shinChanImage: {
    draw: (ctx, x, y, width, height) => {
    }
  },

  miffyImage: {
    draw: (ctx, x, y, width, height) => {
    }
  },

  messBoothImage: {
    draw: (ctx, x, y, width, height) => {
    }
  }
};

// Konfigurasi layout
const layoutConfig = {
  layoutA: {
    poses: 4,
    name: "Layout A",
    description: "4 vertical photos",
    style: "vertical"
  },
  layoutB: {
    poses: 3,
    name: "Layout B",
    description: "3 vertical photos",
    style: "vertical"
  },
  layoutC: {
    poses: 1,
    name: "Layout C",
    description: "1 photo",
    style: "vertical"
  },
  layoutD: {
    poses: 2,
    name: "Layout D",
    description: "2 vertical photos",
    style: "vertical"
  }
};

const PhotoPreview = ({ capturedImages, selectedLayout = "layoutA" }) => {
  const stripCanvasRef = useRef(null);
  const navigate = useNavigate();
  const [stripColor, setStripColor] = useState("white");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [email, setEmail] = useState("");  
  const [status, setStatus] = useState(""); 
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrCodeStatus, setQrCodeStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // to add pop up qr code
  const [copied, setCopied] = useState(false);

  // Get current layout configuration
  const currentLayout = layoutConfig[selectedLayout] || layoutConfig.layoutA;
  
  // Reset frame selection if layout changes and currently using Miffy or Mess Booth frames
  useEffect(() => {
    if (selectedLayout !== "layoutA" && (selectedFrame === "miffyImage" || selectedFrame === "messBoothImage")) {
      setSelectedFrame("none");
    }
  }, [selectedLayout, selectedFrame]);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => console.error("Failed to copy:", err));
  };

  // Determine photo count based on selected layout
  const getPhotoCount = () => {
    switch(selectedLayout) {
      case "layoutA":
        return 4;
      case "layoutB":
        return 3;
      case "layoutC":
        return 1;
      case "layoutD":
        return 2;
      default:
        return 4;
    }
  };

  // Generate photo strip with explicit parameters that will be monitored
  const generatePhotoStrip = useCallback(() => {
    const canvas = stripCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
  
    const imgWidth = 400;  // Image width: 400 pixels
    const imgHeight = 300; // Image height: 300 pixels
    const borderSize = 40;  // Border size: 40 pixels
    const photoSpacing = 20;  // Space between images: 20 pixels
    const textHeight = 50;   // Text height: 50 pixels
    
    // Get photo count according to layout
    const photoCount = getPhotoCount();
    
    // Calculate total strip height and width
    const canvasWidth = imgWidth + borderSize * 2;
    const canvasHeight = (imgHeight * photoCount) + (photoSpacing * (photoCount - 1)) + (borderSize * 2) + textHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  
    ctx.fillStyle = stripColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    let imagesLoaded = 0;
    
    // Create a function to draw the text after all images have loaded
    const drawText = () => {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      ctx.fillStyle = (stripColor === "black" || stripColor === "800000") ? "#FFFFFF" : "#000000";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      
      ctx.fillText("SprinkleClicks  " + timestamp, canvas.width / 2, canvasHeight - borderSize * 1);
  
      ctx.fillStyle = (stripColor === "black" || stripColor === "800000") 
        ? "rgba(255, 255, 255, 0.5)" 
        : "rgba(0, 0, 0, 0.5)";
      ctx.font = "12px Arial";  
      ctx.textAlign = "center";
      ctx.fillText(
          "© 2025",
          canvas.width - borderSize,
          canvasHeight - borderSize / 2
      );
      
      // Add layout text
      ctx.font = "16px Arial";
      ctx.fillStyle = (stripColor === "black" || stripColor === "800000") ? "#FFFFFF" : "#000000";
      ctx.textAlign = "left";
      
      // Draw the frame if selected
      if (selectedFrame === "mofusandImage") {
        drawMofusandFrame(ctx, canvas);
      } else if (selectedFrame === "shinChanImage") {
        drawShinChanFrame(ctx, canvas);
      } else if (selectedFrame === "miffyImage") {
        drawMiffyFrame(ctx, canvas);
      } else if (selectedFrame === "messBoothImage") {
        drawMessBoothFrame(ctx, canvas);
      } else if (selectedFrame in frames) {
        frames[selectedFrame].draw(ctx, borderSize, borderSize, imgWidth, imgHeight * photoCount + photoSpacing * (photoCount - 1));
      }
    };
    
    // Only use images according to the selected layout
    const imagesToDisplay = capturedImages.slice(0, photoCount);
    
    if (imagesToDisplay.length === 0) {
      drawText();
      return;
    }
    
    // Display photos in vertical layout
    imagesToDisplay.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const xOffset = borderSize;
        const yOffset = borderSize + index * (imgHeight + photoSpacing);
        
        const imageRatio = img.width / img.height;
        const targetRatio = imgWidth / imgHeight;
        
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let sourceX = 0;
        let sourceY = 0;
        
        if (imageRatio > targetRatio) {
            sourceWidth = sourceHeight * targetRatio;
            sourceX = (img.width - sourceWidth) / 2;
        } else {
            sourceHeight = sourceWidth / targetRatio;
            sourceY = (img.height - sourceHeight) / 2;
        }
        
        ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight, 
            xOffset, yOffset, imgWidth, imgHeight      
        );

        imagesLoaded++;
        if (imagesLoaded === imagesToDisplay.length) {
          drawText();
        }
      };
      
      img.onerror = () => {
        console.error("Error loading image at index", index);
        imagesLoaded++;
        if (imagesLoaded === imagesToDisplay.length) {
          drawText();
        }
      };
    });
  }, [capturedImages, selectedLayout, stripColor, selectedFrame, getPhotoCount]);

  useEffect(() => {
    // Always generate photo strip when parameters change
    generatePhotoStrip();
  }, [generatePhotoStrip]);

  const downloadPhotoStrip = () => {
    const link = document.createElement("a");
    link.download = "photostrip.png";
    link.href = stripCanvasRef.current.toDataURL("image/png");
    link.click();
  };

  const generateQRCode = async () => {
    try {
      setIsGeneratingQR(true);
      setQrCodeStatus("Generating QR code...");
      setQrCodeUrl(""); 
      
      // Optimize the canvas image before sending
      const canvas = stripCanvasRef.current;
      
      // Create a smaller version of the image for QR code generation
      const optimizedCanvas = document.createElement('canvas');
      const targetWidth = 800; // Reduced from original size
      const aspectRatio = canvas.height / canvas.width;
      const targetHeight = targetWidth * aspectRatio;
      
      optimizedCanvas.width = targetWidth;
      optimizedCanvas.height = targetHeight;
      
      // Draw original canvas content to the smaller canvas
      const ctx = optimizedCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);
      
      // Use lower quality JPEG for faster upload (0.7 is good balance of quality vs size)
      const optimizedImageData = optimizedCanvas.toDataURL("image/jpeg", 0.6);
      
      // Add a timeout to ensure UI updates before the network request
      setTimeout(async () => {
        try {
          const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
          
          // Step 2: Send the optimized image to the server
          const response = await axios.post(`${BACKEND_URL}/generate-qr-code`, {
            imageData: optimizedImageData
          });
          
          if (response.data.success) {
            setQrCodeUrl(response.data.qrCodeDataUrl);
            setQrCodeStatus("Scan this QR code to view and download your photo strip!");
          } else {
            setQrCodeStatus(`Error: ${response.data.message}`);
          }
        } catch (error) {
          console.error("Error generating QR code:", error);
          setQrCodeStatus("Failed to generate QR code. Please try again.");
        } finally {
          setIsGeneratingQR(false);
        }
      }, 100); // Small timeout for UI update
    } catch (error) {
      console.error("Error preparing image:", error);
      setQrCodeStatus("Failed to prepare image. Please try again.");
      setIsGeneratingQR(false);
    }
  };
  
  return (
    <div className="preview-container">
      <div className="preview-header">
        <h1>Your Photo Results</h1>
        {/* <div className="layout-info">
          <h3>Layout {currentLayout ? selectedLayout.slice(-1) : 'A'} - {currentLayout ? currentLayout.description : '4 vertical photos'}</h3>
          <p>{currentLayout ? currentLayout.poses : 4} Photos in 1 Print</p>
        </div> */}
      </div>
      
      <div className="photo-preview">
        {/* Individual image preview hidden */}
        
        <div className="control-section">
          <h3>Customize your photo strip</h3>
    
          <p className="section-title">Background Color</p>
          <div className="color-options">
            <button onClick={() => setStripColor("white")}>White</button>
            <button onClick={() => setStripColor("black")}>Black</button>
            <button onClick={() => setStripColor("#f6d5da")}>Pink</button>
            <button onClick={() => setStripColor("#dde6d5")}>Green</button>
            <button onClick={() => setStripColor("#adc3e5")}>Blue</button>
            <button onClick={() => setStripColor("#FFF2CC")}>Yellow</button>
            <button onClick={() => setStripColor("#dbcfff")}>Purple</button>
            <button onClick={() => setStripColor("#800000")}>Dark Red</button>
            <button onClick={() => setStripColor("#845050")}>Burgundy</button>
          </div>
    
          <p className="section-title">Stickers</p>
          <div className="frame-options">
            <button onClick={() => setSelectedFrame("none")}>No Stickers</button>
            <button onClick={() => setSelectedFrame("pastel")}>Girlypop</button>
            <button onClick={() => setSelectedFrame("cute")}>Cute</button>
            <button onClick={() => setSelectedFrame("mofusandImage")}>Mofusand</button>
            <button onClick={() => setSelectedFrame("shinChanImage")}>Shin Chan</button>
            {selectedLayout === "layoutA" && (
              <>
                <button onClick={() => setSelectedFrame("miffyImage")}>Miffy</button>
                <button onClick={() => setSelectedFrame("messBoothImage")}>Mess Booth</button>
              </>
            )}
          </div>
        </div>
        
        <div className="photostrip-container" style={{ margin: "20px auto", textAlign: "center" }}>
          <h3>Your Photo Strip</h3>
          <canvas ref={stripCanvasRef} className="photo-strip" style={{ maxWidth: "100%", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} />
        </div>
    
        <div className="control-section">
          <div className="action-buttons">
            <button onClick={downloadPhotoStrip}>📥 Download Photo</button>
            <button onClick={generateQRCode} disabled={true}>
              {isGeneratingQR ? "Generating..." : "🔗 Download via QR Code"}
            </button>
            <button onClick={() => navigate("/photobooth")}>🔄 Take New Photos</button>
          </div>

          {/* Email section commented out
          <div className="email-section">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendPhotoStripToEmail}>Send to Email</button>
            <p className="status-message">{status}</p>
          </div>
           */}

          {qrCodeUrl && (
            <div className="qr-code-section">
              <h3>QR Code</h3>
              <p>{qrCodeStatus}</p>
              <img 
                src={qrCodeUrl} 
                alt="QR Code for photo access" 
                style={{ 
                  maxWidth: "200px", 
                  margin: "10px auto", 
                  display: "block",
                  border: "1px solid #ddd",
                  padding: "10px",
                  background: "white",
                  borderRadius: "5px"
                }} 
              />

              <button onClick={() => copyToClipboard(qrCodeUrl)}>Copy Link</button>
              {copied && <p style={{ color: "green", fontSize: "14px" }}>Link copied!</p>}
              
              <p style={{ fontSize: "12px", color: "#666", margin: "10px 0" }}>
                This link will expire in 24 hours
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PhotoPreview;