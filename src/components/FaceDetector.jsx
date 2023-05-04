import { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Typography, Box, Stack, Button } from '@mui/material';

function FaceDetector() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [faceData, setFaceData] = useState([]);

  useEffect(() => {
    startVideo();
    videoRef && loadModels();
    videoRef.current.style.display = 'none';
  }, []);

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => {
      faceDetection();
    });
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const faceDetection = async () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
      faceapi.matchDimensions(canvasRef.current, {
        width: 540,
        height: 350,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 540,
        height: 350,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

      // store face detection values in state with timestamp
      setFaceData((prevData) => [
        ...prevData,
        {
          timestamp: new Date().getTime(),
          detections: detections.map((detection) => ({
            expressions: detection.expressions,
            probability: detection.probability,
          })),
        },
      ]);
    }, 1000);
  };

  // save faceData to a JSON file
  useEffect(() => {
    

    setInterval(() => {
      
    }, 30000);
  }, [faceData]);

  const downloadData = () => {
    const dataStr = JSON.stringify(faceData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'faceData.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Box sx={{ p: 2, justifyContent: 'center' }}>
    <Typography variant="h6" align="center" gutterBottom> AI FACE DETECTION </Typography>
    <Stack direction="row" justifyContent="center" alignItems="center">
    <Box sx={{ width: 'fit-content', height: 'fit-content' }}>
    <video crossOrigin='anonymous' ref={videoRef} autoPlay ></video>
    </Box>
    <Box sx={{ width: 40, height: 50 }}>
    <canvas ref={canvasRef} width="40" height="50" />
    </Box>
    <Box sx={{ width: 40, height: 50 }}>
        <Button variant="contained" onClick={downloadData}>
          Download JSON
        </Button>
      </Box>
    </Stack>
    </Box>
    );
}

export default FaceDetector;
