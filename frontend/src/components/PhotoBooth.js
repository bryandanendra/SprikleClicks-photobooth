import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* G */
const PhotoBooth = ({ setCapturedImages, selectedLayout }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setImages] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [countdownTime, setCountdownTime] = useState(1); // Ubah default countdown ke 3 detik
  const [capturing, setCapturing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [cameraError, setCameraError] = useState(false);
  const [hasUserMediaPermission, setHasUserMediaPermission] = useState(false);

  // Layout configurations
  const layouts = {
    layoutA: { 
      poses: 4, 
      name: "Layout A",
      description: "4 vertical photos",
      labelId: "A"
    },
    layoutB: { 
      poses: 3, 
      name: "Layout B",
      description: "3 vertical photos",
      labelId: "B"
    },
    layoutC: { 
      poses: 1, 
      name: "Layout C",
      description: "1 photo",
      labelId: "C"
    },
    layoutD: { 
      poses: 2, 
      name: "Layout D",
      description: "2 vertical photos",
      labelId: "D"
    }
  };

  // Check if device supports getUserMedia
  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const getCameras = async () => {
    // Reset the error state
    setCameraError(false);
    
    try {
      // First check if we have permission
      if (!hasUserMediaPermission) {
        // Request basic camera access first to trigger permission dialog
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasUserMediaPermission(true);
      }
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
      
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting camera devices:", error);
      setCameraError(true);
    }
  };

  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!hasGetUserMedia()) {
      setCameraError(true);
      alert("Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Safari.");
      return;
    }
    
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|ipad|iphone|ipod|windows phone/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkMobile();
    
    // Try to get initial camera access
    getCameras();
  
    const handleVisibilityChange = () => {
      if (!document.hidden && hasUserMediaPermission) {
        startCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (selectedCamera && hasUserMediaPermission) {
      startCamera();
    }
  }, [selectedCamera, hasUserMediaPermission]);

  const startCamera = async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }

      setCameraError(false);

      const constraints = {
        audio: false,
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          facingMode: !selectedCamera ? "user" : undefined,
          width: { ideal: isMobile ? 1280 : 1280 }, 
          height: { ideal: isMobile ? 720 : 720 },
          frameRate: { ideal: 30 } 
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          setHasUserMediaPermission(true);
        } catch (err) {
          console.error("Error playing video:", err);
          setCameraError(true);
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(true);
      
      // Check specific error types for better user feedback
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert("Camera access was denied. Please allow camera access in your browser settings and try again.");
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        alert("No camera found. Please ensure your camera is connected and not in use by another application.");
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        alert("Camera is in use by another application. Please close other applications that might be using your camera.");
      } else {
        alert("Could not access your camera. Please ensure camera permissions are granted in your browser settings.");
      }
    }
  };

  // Manual camera request - can be triggered by user if automatic fails
  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasUserMediaPermission(true);
      getCameras();
    } catch (error) {
      console.error("Manual camera access request failed:", error);
      setCameraError(true);
      alert("Camera access was denied. Please check your browser settings and try again.");
    }
  };

  const handleCameraChange = (e) => {
    setSelectedCamera(e.target.value);
  };

  // apply fitler using canvas api
  const applyFilterToCanvas = (sourceCanvas, filterType) => {
    const ctx = sourceCanvas.getContext("2d");
    
    // Save the original image data before applying filters
    const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const data = imageData.data;
    
    switch(filterType) {
      case "grayscale(100%)":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        break;
      case "sepia(100%)":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      case "grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)":
        // vintage effect
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const factor = 1.2; 
          const r = Math.min(255, (avg - 128) * factor + 128 + 25);           
          data[i] = Math.min(255, r * 1.07); 
          data[i + 1] = Math.min(255, r * 0.95); 
          data[i + 2] = Math.min(255, r * 0.8); 
        }
        break;
      case "brightness(130%) contrast(105%) saturate(80%) blur(0.3px)":
        // soft effect
        for (let i = 0; i < data.length; i += 4) {
          const r = Math.min(255, data[i] * 1.3 * 1.05);
          const g = Math.min(255, data[i + 1] * 1.3 * 1.05);
          const b = Math.min(255, data[i + 2] * 1.3 * 1.05);
          const avg = (r + g + b) / 3;
          data[i] = r * 0.8 + avg * 0.2;
          data[i + 1] = g * 0.8 + avg * 0.2;
          data[i + 2] = b * 0.8 + avg * 0.2;
        }
        break;
      case "saturate(150%) contrast(110%) brightness(110%)":
        // vivid effect
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Increase saturation
          const avg = (r + g + b) / 3;
          data[i] = Math.min(255, (r - avg) * 1.5 + avg * 1.1);
          data[i + 1] = Math.min(255, (g - avg) * 1.5 + avg * 1.1);
          data[i + 2] = Math.min(255, (b - avg) * 1.5 + avg * 1.1);
        }
        break;
      case "hue-rotate(180deg)":
        // color inversion effect
        for (let i = 0; i < data.length; i += 4) {
          // Simple hue rotation by inverting colors
          data[i] = 255 - data[i];         // R
          data[i + 1] = 255 - data[i + 1]; // G
          data[i + 2] = 255 - data[i + 2]; // B
        }
        break;
      case "blur(3px) brightness(110%)":
        // Apply a simple blur effect
        const tempData = new Uint8ClampedArray(data);
        const radius = 3;
        
        for (let y = 0; y < sourceCanvas.height; y++) {
          for (let x = 0; x < sourceCanvas.width; x++) {
            let r = 0, g = 0, b = 0, count = 0;
            
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < sourceCanvas.width && ny >= 0 && ny < sourceCanvas.height) {
                  const idx = (ny * sourceCanvas.width + nx) * 4;
                  r += tempData[idx];
                  g += tempData[idx + 1];
                  b += tempData[idx + 2];
                  count++;
                }
              }
            }
            
            const idx = (y * sourceCanvas.width + x) * 4;
            data[idx] = Math.min(255, (r / count) * 1.1);
            data[idx + 1] = Math.min(255, (g / count) * 1.1);
            data[idx + 2] = Math.min(255, (b / count) * 1.1);
          }
        }
        break;
      default:
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return sourceCanvas;
  };
  

  // Countdown to take pictures automatically based on selected layout
  const startCountdown = () => {
    if (capturing) return;
    setCapturing(true);
  
    setImages([]);
    
    let photosTaken = 0;
    const newCapturedImages = [];
    const totalPoses = layouts[selectedLayout].poses;
    
    const captureSequence = async () => {
      if (photosTaken >= totalPoses) {
        setCountdown(null);
        setCapturing(false);

        try {
          setCapturedImages([...newCapturedImages]);
          setTimeout(() => {
            navigate("/preview");
          }, 300);
        } catch (error) {
          console.error("Error navigating to preview:", error);
          // If navigation fails, at least display the images
          setImages([...newCapturedImages]);
        }
        return;
      }
        
      let timeLeft = countdownTime;
      setCountdown(timeLeft);
  
      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
  
        if (timeLeft === 0) {
          clearInterval(timer);
          const imageUrl = capturePhoto();
          if (imageUrl) {
            newCapturedImages.push(imageUrl);
            setImages((prevImages) => [...prevImages, imageUrl]);
          }
          photosTaken += 1;
          setTimeout(captureSequence, 1000);
        }
      }, 1000);
    };
  
    captureSequence();
  };

  // Handle countdown time selection
  const handleCountdownChange = (e) => {
    setCountdownTime(parseInt(e.target.value, 10));
  };

  // Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
        const context = canvas.getContext("2d");

        const targetWidth = 1280;
        const targetHeight = 720;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const videoRatio = video.videoWidth / video.videoHeight;
        const targetRatio = targetWidth / targetHeight;
        
        let drawWidth = video.videoWidth;
        let drawHeight = video.videoHeight;
        let startX = 0;
        let startY = 0;

        if (videoRatio > targetRatio) {
            drawWidth = drawHeight * targetRatio;
            startX = (video.videoWidth - drawWidth) / 2;
        } else {
            drawHeight = drawWidth / targetRatio;
            startY = (video.videoHeight - drawHeight) / 2;
        }

        // Flip canvas for mirroring
        context.save();

        // Only use CSS filters on desktop
        if (!isMobile && filter != 'none') {
          context.filter = filter;
        }

        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(
            video,
            startX, startY, drawWidth, drawHeight,  
            0, 0, targetWidth, targetHeight        
        );
        context.restore();

       // mobile devices, apply filter manually with canvas api
       if (isMobile && filter !== 'none') {
        applyFilterToCanvas(canvas, filter);
       }

        return canvas.toDataURL("image/png");
    }
};

  // Render layout berdasarkan jenis layout
  const renderPreviewSide = () => {
    const layout = layouts[selectedLayout];
    
    // Untuk layout vertikal (semua layout sekarang vertikal)
    return (
      <div className={`preview-side preview-side-vertical poses-${layout.poses}`}>
        {capturedImages.map((image, index) => (
          <img 
            key={index} 
            src={image} 
            alt={`Captured ${index + 1}`} 
            className="side-preview"
          />
        ))}
        {/* Tambahkan placeholder untuk pose yang belum diambil */}
        {Array(layout.poses - capturedImages.length).fill(0).map((_, index) => (
          <div 
            key={`placeholder-${index}`} 
            className="side-preview-placeholder"
            data-number={capturedImages.length + index + 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="photo-booth">
      <div className="booth-header">
        <div className="camera-settings">
          <select 
            value={selectedCamera} 
            onChange={handleCameraChange} 
            className="camera-selector"
            disabled={cameras.length === 0 || cameraError}
          >
            {cameras.length > 0 ? (
              cameras.map(camera => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                </option>
              ))
            ) : (
              <option value="">No cameras found</option>
            )}
          </select>
        </div>

        <div className="layout-info">
          <h3>Layout {layouts[selectedLayout].labelId} - {layouts[selectedLayout].poses} Pose</h3>
          <p>{layouts[selectedLayout].description}</p>
        </div>
      </div>

      <div className="photo-container">
        {cameraError ? (
          <div className="camera-error">
            <p>Tidak dapat mengakses kamera. Ini mungkin karena:</p>
            <ul>
              <li>Izin kamera belum diberikan</li>
              <li>Kamera digunakan oleh aplikasi lain</li>
              <li>Masalah hardware atau browser</li>
            </ul>
            <button 
              onClick={requestCameraAccess} 
              className="camera-access-button"
            >
              Izinkan Akses Kamera
            </button>
            <button 
              onClick={getCameras} 
              className="camera-access-button"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="camera-container">
            {countdown !== null && <h2 className="countdown animate">{countdown}</h2>}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              disablePictureInPicture 
              disableRemotePlayback
              className="video-feed" 
              style={{ filter }}
            />        
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {renderPreviewSide()}
      </div>
      
      <div className="booth-controls">
        <div className="countdown-selector">
          <label htmlFor="countdown-time">Select Countdown Time:</label>
          <select 
            id="countdown-time" 
            value={countdownTime} 
            onChange={handleCountdownChange} 
            disabled={capturing || cameraError}
          >
            <option value="1">1 second</option>
            <option value="3">3 seconds</option>
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
          </select>
        </div>

        <div className="controls">
          <button 
            onClick={startCountdown} 
            disabled={capturing || cameraError} 
            className="capture-button"
          >
            {capturing ? "Capturing..." : `Take Photos (${layouts[selectedLayout].poses} poses)`}
          </button>
        </div>
      </div>

      <p className="filter-prompt">Select a filter before starting photo capture!</p>

      <div className="filters">
        <button onClick={() => setFilter("none")} disabled={capturing || cameraError}>No Filter</button>
        <button onClick={() => setFilter("grayscale(100%)")} disabled={capturing || cameraError}>Grayscale</button>
        <button onClick={() => setFilter("sepia(100%)")} disabled={capturing || cameraError}>Sepia</button>
        <button onClick={() => setFilter("grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)")} disabled={capturing || cameraError}>Vintage</button>
        <button onClick={() => setFilter("brightness(130%) contrast(105%) saturate(80%) blur(0.3px)")} disabled={capturing || cameraError}>Soft</button>
        <button onClick={() => setFilter("saturate(150%) contrast(110%) brightness(110%)")} disabled={capturing || cameraError}>Vivid</button>
        <button onClick={() => setFilter("hue-rotate(180deg)")} disabled={capturing || cameraError}>Invert</button>
        <button onClick={() => setFilter("blur(3px) brightness(110%)")} disabled={capturing || cameraError}>Dreamy</button>
      </div>
    </div>
  );
};

export default PhotoBooth;
