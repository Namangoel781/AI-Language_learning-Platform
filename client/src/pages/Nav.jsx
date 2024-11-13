import { useState, useEffect } from "react";
import { Home, Languages, LogIn, LogOut, BookCheck } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/user", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:3000/refresh-session", {
        withCredentials: true,
      });
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-gray-900 z-40 shadow-lg fixed top-0 w-full z-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex-shrink-0">
            <span className="motion-preset-seesaw  text-2xl font-extrabold text-white cursor-pointer">
              LinguaLearn
            </span>
          </a>
          <div className="flex items-center space-x-6">
            <a
              href="/"
              className=" text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-1" />
              <span>Home</span>
            </a>
            <a
              href="/select-language"
              className=" text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition-all duration-200"
            >
              <Languages className="w-5 h-5 mr-1" />
              <span>Language</span>
            </a>
            <a
              href="/lessons"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition-all duration-200"
            >
              <BookCheck className="w-5 h-5 mr-1" />
              <span>Lessons</span>
            </a>
            {user ? (
              <div className="flex items-center space-x-6">
                <span className="text-gray-200 font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-md font-medium flex items-center transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition-all duration-200"
              >
                <LogIn className="w-5 h-5 mr-1" />
                <span>Login</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
