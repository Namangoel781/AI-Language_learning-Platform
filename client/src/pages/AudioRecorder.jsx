import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Loader,
  Mic,
  Square,
  Pause,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import "../assets/WaveForm.css";
import Navbar from "./Nav";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [transcription, setTranscription] = useState("");
  const [generatedString, setGeneratedString] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);
  const [loading, setLoading] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => audioChunks.current.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        const formData = new FormData();
        formData.append("file", audioBlob, "audio.mp3");

        axios
          .post(
            "http://ailangtest.ap-south-1.elasticbeanstalk.com/process",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
          .then((response) => setTranscription(response.data))
          .catch((error) =>
            console.error("Error sending audio to backend:", error)
          );
      };

      setMediaRecorder(recorder);
      setRecording(true);
      recorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setPaused(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorder &&
      (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")
    ) {
      mediaRecorder.stop();
      setRecording(false);
      setPaused(false);
    }
  };

  const clearRecording = () => {
    setAudioUrl("");
    setTranscription("");
    setResult("");
    audioChunks.current = [];
  };

  const generateString = () => {
    setLoadingGenerate(true);
    axios
      .get("http://ailangtest.ap-south-1.elasticbeanstalk.com/generate", {
        params: { language },
      })
      .then((response) => setGeneratedString(response.data))
      .catch((error) => console.error("Error generating string:", error))
      .finally(() => setLoadingGenerate(false));
  };

  const checkResult = () => {
    if (!transcription || !generatedString) return;
    setLoading(true);
    axios
      .get("http://ailangtest.ap-south-1.elasticbeanstalk.com/ask", {
        params: {
          gen: generatedString,
          trans: transcription,
          language,
          targetLanguage,
        },
      })
      .then((response) => setResult(response.data))
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  };

  const formatResult = (resultText) => {
    // Split the result into parts based on common separators
    const parts = resultText.split(/[,.;]/).filter((part) => part.trim());

    return parts.map((part, index) => {
      // Determine the type of message for appropriate styling
      const isSuccess =
        part.toLowerCase().includes("correct") ||
        part.toLowerCase().includes("good");
      const isError =
        part.toLowerCase().includes("incorrect") ||
        part.toLowerCase().includes("wrong");

      let icon = (
        <AlertCircle className="inline-block w-5 h-5 mr-2 text-blue-400" />
      );
      let textColor = "text-blue-300";

      if (isSuccess) {
        icon = (
          <CheckCircle2 className="inline-block w-5 h-5 mr-2 text-emerald-400" />
        );
        textColor = "text-emerald-300";
      } else if (isError) {
        icon = <XCircle className="inline-block w-5 h-5 mr-2 text-rose-400" />;
        textColor = "text-rose-300";
      }

      return (
        <li key={index} className={`flex items-start mb-3 ${textColor}`}>
          {icon}
          <span className="mt-0.5">{part.trim()}</span>
        </li>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="min-h-screen transition-colors duration-300">
          <header className="sticky top-0 z-50 w-full bg-gray-900/90 border-b border-gray-700 shadow-md">
            <div className="container flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-100">
                Audio Recorder
              </h1>
              <nav className="flex items-center space-x-4">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 bg-gray-800 text-gray-100 border border-gray-700 hover:bg-gray-700 transition-colors">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-gray-100">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <Select
                  value={targetLanguage}
                  onValueChange={setTargetLanguage}
                >
                  <SelectTrigger className="w-32 bg-gray-800 text-gray-100 border border-gray-700 hover:bg-gray-700 transition-colors">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-gray-100">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </nav>
            </div>
          </header>

          <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <Card className="w-full max-w-lg bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8 space-y-6">
                <Button
                  onClick={generateString}
                  disabled={loadingGenerate}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-medium py-6 transition-colors duration-200 shadow-lg hover:shadow-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingGenerate ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    "Generate New Phrase"
                  )}
                </Button>

                {generatedString && (
                  <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <p className="text-gray-200">
                      <span className="text-gray-400 text-sm">Generated:</span>
                      <br />
                      {generatedString}
                    </p>
                  </div>
                )}

                <div className="flex justify-center items-center">
                  <Button
                    onClick={recording ? stopRecording : startRecording}
                    className="p-8 rounded-full bg-slate-900 hover:bg-slate-950 shadow-lg"
                  >
                    {recording ? (
                      <div className="wave-container">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                    ) : (
                      <Mic className="h-6 w-6 text-white" />
                    )}
                  </Button>
                </div>

                {audioUrl && (
                  <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}

                {transcription && (
                  <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <p className="text-gray-200">
                      <span className="text-gray-400 text-sm">
                        Transcription:
                      </span>
                      <br />
                      {transcription}
                    </p>
                  </div>
                )}

                <Button
                  onClick={checkResult}
                  disabled={!transcription || !generatedString}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2 ">
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Check Result"
                  )}
                </Button>

                {result && (
                  <div className="p-6 rounded-lg bg-gray-800/80 border border-gray-600 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">
                      Analysis Result
                    </h3>
                    <ul className="space-y-2 list-none">
                      {formatResult(result)}
                    </ul>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={clearRecording}
                  className="w-full border-gray-600 text-black hover:bg-slate-200 transition-colors duration-200"
                >
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
};

export default AudioRecorder;
