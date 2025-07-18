"use client"; // Important in Next.js App Router

import React, { useEffect, useRef, useState } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";

const FatigueDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cvReady, setCvReady] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const eyeClosedFrames = useRef(0);
  const faceAwayFrames = useRef(0);
  const alertTriggered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ Only load once
    const loadOpenCV = () => {
      if (document.getElementById("opencvjs")) return;

      const script = document.createElement("script");
      script.id = "opencvjs";
      script.src = "https://docs.opencv.org/master/opencv.js";
      script.async = true;
      script.onload = () => {
        window.cv["onRuntimeInitialized"] = () => {
          console.log("✅ OpenCV ready");
          setCvReady(true);
        };
      };
      document.body.appendChild(script);
    };

    loadOpenCV();
  }, []);

  useEffect(() => {
    if (!cvReady) return;

    const cv = window.cv;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const faceCascade = new cv.CascadeClassifier();
    const eyeCascade = new cv.CascadeClassifier();

    const loadCascadesAndStart = async () => {
      await faceCascade.loadAsync("/haarcascade_frontalface_default.xml");
      await eyeCascade.loadAsync("/haarcascade_eye.xml");

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
      });

      const processFrame = () => {
        if (video.readyState !== 4) return requestAnimationFrame(processFrame);

        const src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
        const gray = new cv.Mat();
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        src.data.set(imageData.data);
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        const faces = new cv.RectVector();
        const eyes = new cv.RectVector();
        const msize = new cv.Size(0, 0);
        faceCascade.detectMultiScale(gray, faces, 1.3, 5, 0, msize, msize);

        let eyesDetected = false;
        let faceCentered = false;

        for (let i = 0; i < faces.size(); i++) {
          const face = faces.get(i);
          const x = face.x,
            y = face.y,
            w = face.width,
            h = face.height;

          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, w, h);

          const faceCx = x + w / 2;
          if (faceCx > canvas.width * 0.3 && faceCx < canvas.width * 0.7) {
            faceCentered = true;
          }

          const roiGray = gray.roi(face);
          eyeCascade.detectMultiScale(roiGray, eyes);
          for (let j = 0; j < eyes.size(); j++) {
            const eye = eyes.get(j);
            ctx.strokeStyle = "green";
            ctx.strokeRect(x + eye.x, y + eye.y, eye.width, eye.height);
            eyesDetected = true;
          }

          roiGray.delete();
        }

        // Check fatigue
        if (!eyesDetected) eyeClosedFrames.current++;
        else eyeClosedFrames.current = 0;

        if (!faceCentered) faceAwayFrames.current++;
        else faceAwayFrames.current = 0;

        if (
          (eyeClosedFrames.current > 20 || faceAwayFrames.current > 20) &&
          !alertTriggered.current
        ) {
          setAlertVisible(true);
          alertTriggered.current = true;
          playBeep();
        } else if (
          eyeClosedFrames.current === 0 &&
          faceAwayFrames.current === 0
        ) {
          setAlertVisible(false);
          alertTriggered.current = false;
        }

        src.delete();
        gray.delete();
        faces.delete();
        eyes.delete();

        requestAnimationFrame(processFrame);
      };

      requestAnimationFrame(processFrame);
    };

    loadCascadesAndStart();
  }, [cvReady]);

  const playBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 1.5);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Fatigue Detection
      </Typography>
      {alertVisible && (
        <Alert severity="error" sx={{ mb: 2 }}>
          ALERT: Wake Up or Look Ahead!
        </Alert>
      )}
      <Box position="relative">
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ width: "100%" }} />
      </Box>
    </Container>
  );
};

export default FatigueDetector;
