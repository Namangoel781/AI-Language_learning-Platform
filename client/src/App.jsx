import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import LanguageSelection from "./pages/LanguageLearningApp";
import axios from "axios";
import Home from "./pages/Home";
import { LessonList } from "./pages/LessonList";
import { VideoPlayer } from "./pages/LessonPlayer";
import AudioRecorder from "./pages/AudioRecorder";

const App = () => {
  const [formData, setFormData] = useState({
    nativeLanguage: "",
    learningLanguage: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/check-auth",
          {
            withCredentials: true,
          }
        );
        const userData = response.data.user;
        setIsAuthenticated(response.data.isAuthenticated);
        setUser({
          ...userData,
          needsLanguageSetup: userData.needs_language_setup,
        });
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const completeLanguageSetup = async () => {
      if (user?.needsLanguageSetup) {
        try {
          // Call the complete language setup API
          await axios.post(
            "http://localhost:3000/api/complete-language-setup",
            {
              userId: user.id,
              nativeLanguage: formData.nativeLanguage,
              learningLanguage: formData.learningLanguage,
            },
            { withCredentials: true }
          );

          // Update the user state to reflect the changes
          setUser((prevUser) => ({
            ...prevUser,
            needsLanguageSetup: false,
          }));

          console.log("Language setup completed.");
        } catch (error) {
          console.error("Error completing language setup:", error);
        }
      }
    };

    if (isAuthenticated && user?.needsLanguageSetup) {
      completeLanguageSetup();
    }
  }, [isAuthenticated, user, formData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-pulse space-y-4 w-1/2">
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/select-language"
          element={
            isAuthenticated && user?.needsLanguageSetup ? (
              <LanguageSelection
                formData={formData}
                setFormData={setFormData}
              />
            ) : isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.needsLanguageSetup ? (
                <Navigate to="/select-language" />
              ) : (
                <Home />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/practice-1"
          element={
            isAuthenticated ? (
              user?.needsLanguageSetup ? (
                <Navigate to="/select-language" />
              ) : (
                <AudioRecorder />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/lessons"
          element={
            isAuthenticated ? (
              user?.needsLanguageSetup ? (
                <Navigate to="/select-language" />
              ) : (
                <LessonList />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/video/:id"
          element={
            isAuthenticated ? (
              user?.needsLanguageSetup ? (
                <Navigate to="/select-language" />
              ) : (
                <VideoPlayer />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
