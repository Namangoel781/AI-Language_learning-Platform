import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlayCircle, Book, DollarSign, ArrowLeft } from "lucide-react";
import Navbar from "./Nav";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/courses");
        setCourses(response.data.data);
      } catch (err) {
        setError("Error fetching courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      if (selectedCourseId) {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:3000/api/videos/${selectedCourseId}`
          );
          if (response.data.success) {
            setVideos(response.data.data);
          } else {
            setError(response.data.message || "Failed to fetch videos.");
          }
        } catch (err) {
          setError("Failed to fetch videos. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVideos();
  }, [selectedCourseId]);

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleBackClick = () => {
    setSelectedCourseId(null);
    setVideos([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Loading...</h1>
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Error</h1>
          <div
            className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg"
            role="alert"
          >
            <strong className="font-bold">Oh no! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Courses and Videos
          </h1>
          {selectedCourseId ? (
            <div>
              <button
                onClick={handleBackClick}
                className="mb-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to Courses
              </button>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <PlayCircle className="mr-2" />
                Video List
              </h2>
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-800 rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <h3 className="font-bold text-xl mb-2 text-blue-300">
                          {video.title}
                        </h3>

                        <video
                          className="w-full rounded-lg"
                          controls
                          src={video.url}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  No videos found for this course.
                </p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Book className="mr-2" />
                Course List
              </h2>
              {courses.length === 0 ? (
                <p className="text-center text-gray-400">
                  No courses available
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <img
                        src={course.picurl}
                        alt={course.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-xl mb-2 text-blue-300">
                          {course.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {course.discription}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-bold text-lg flex items-center">
                            <DollarSign className="mr-1" size={18} />
                            {course.price}
                          </span>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center">
                            <PlayCircle className="mr-1" size={18} />
                            View Videos
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
