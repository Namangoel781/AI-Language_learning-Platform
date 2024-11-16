import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import ReactPlayer from "react-player";
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

export const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/lessons/${id}`,
          { withCredentials: true }
        );

        if (response.data.lesson && response.data.lesson.video_url) {
          setVideo(response.data.lesson);
        } else {
          setError("Video URL not found.");
        }
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!video) {
    return <div className="text-white">Video not found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="p-4">
          <Link
            to="/lessons"
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            <ArrowLeft className="mr-2" /> Back to Lessons
          </Link>
        </div>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{video.title}</h1>
          <div className="relative aspect-video mb-4">
            {video.video_url.includes("youtube.com") ? (
              <ReactPlayer
                url={video.video_url}
                controls
                className="react-player w-full h-full rounded-lg"
                width="100%"
                height="100%"
              />
            ) : (
              <video
                src={video.video_url}
                controls
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => console.error("Error loading video:", e)}
              />
            )}
          </div>
          <p className="mt-4 text-gray-300 text-sm sm:text-base">
            {video.description}
          </p>
        </main>
      </div>
    </>
  );
};
