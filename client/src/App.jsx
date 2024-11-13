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

const App = () => {
  const [formData, setFormData] = useState({
    nativeLanguage: "",
    learningLanguage: "",
    proficiencyLevel: "",
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
        setIsAuthenticated(response.data.isAuthenticated);
        setUser(response.data.user);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-pulse space-y-4 w-1/2">
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
        {/* Route for /select-language, only accessible if user needs language setup */}
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

        {/* Home route, accessible only if the user is authenticated */}
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

        {/* Login route */}
        <Route path="/login" element={<Login />} />
        <Route path="/lessons" element={<LessonList />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;
