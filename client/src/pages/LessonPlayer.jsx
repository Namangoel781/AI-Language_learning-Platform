import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import ReactPlayer from "react-player";
import Navbar from "./Nav";

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

        console.log("Video Data:", response.data.lesson); // Check the response data
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
    return <div className="text-white">Loading video...</div>;
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
        <main className="max-w-5xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          <div className="relative aspect-video">
            {/* Use ReactPlayer for YouTube URL */}
            {video.video_url.includes("youtube.com") ? (
              <ReactPlayer
                url={video.video_url}
                controls
                className="w-full h-full object-cover rounded-lg"
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
          <p className="mt-4 text-gray-300">{video.description}</p>
        </main>
      </div>
    </>
  );
};
