import { useState, useRef, useEffect } from 'react';

export function useAudioRecording() {
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);
  const [chunks, setChunks] = useState([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) {
          setChunks(prev => [...prev, e.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setChunks([]);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Could not start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Add this function to reset the recording state
  const resetRecording = () => {
    setRecording(false);
    setRecordingTime(0);
    setAudioBlob(null);
    // Reset any other state variables related to recording
  };

  return {
    recording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording // Export the new function
  };
}