import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Play } from "lucide-react";
import Navbar from "./Nav";

const Loader = () => {
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
};

const defaultThumbnail =
  "https://via.placeholder.com/640x360.png?text=Video+Not+Available";

const getYouTubeThumbnail = (url) => {
  const youtubePattern =
    /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/))([^"&?\/\s]{11})/;
  const match = url.match(youtubePattern);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : defaultThumbnail;
};

const VideoCard = ({ video }) => {
  const thumbnailUrl =
    video.video_url && video.video_url.includes("youtube.com")
      ? getYouTubeThumbnail(video.video_url)
      : defaultThumbnail;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="relative aspect-video bg-gray-700 flex items-center justify-center group">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <Play className="w-16 h-16 text-white opacity-50 group-hover:opacity-100 transition-opacity duration-300 absolute" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm">{video.description}</p>
      </div>
    </div>
  );
};

// Main Component
export const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch lessons from the backend
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/lessons", {
          withCredentials: true,
        });
        setLessons(response.data.lessons); // Assign the lessons array from API response
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setError("Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (lessons.length === 0) {
    return <div className="text-white">No lessons available.</div>;
  }

  return (
    <>
      <Navbar />
      <div className=" min-h-screen bg-gradient-to-br  from-black via-slate-800 to-gray-800 text-white">
        <main className=" max-w-7xl mx-auto px-4 py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Language Learning Lessons
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {lessons.map((lesson) => (
              <Link
                to={`/video/${lesson.id}`}
                key={lesson.id}
                className="group"
              >
                <VideoCard video={lesson} />
              </Link>
            ))}
          </div>
        </main>

        <footer className="text-center text-gray-400 py-8">
          © {new Date().getFullYear()} LinguaVerse. All rights reserved.
        </footer>
      </div>
    </>
  );
};
