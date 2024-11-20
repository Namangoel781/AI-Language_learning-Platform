import { useState, useEffect } from "react";
import {
  Home,
  Languages,
  LogIn,
  LogOut,
  BookCheck,
  Menu,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add a loading state
  const navigate = useNavigate();

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
      if (user) {
        axios.get("http://localhost:3000/refresh-session", {
          withCredentials: true,
        });
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      setIsLoggingOut(true);
      const response = await axios.get("http://localhost:3000/auth/logout", {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.status === 200) {
        // Clear user data and navigate after logout
        setUser(null);
        navigate("/login", { replace: true });
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred during logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <a href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-white cursor-pointer">
              LinguaLearn
            </span>
          </a>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Menu */}
          <div
            className={`hidden md:flex items-center space-x-6 ${
              isMenuOpen ? "block" : "hidden"
            } md:block`}
          >
            <a
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
            >
              <Home className="w-5 h-5 mr-1" />
              <span>Home</span>
            </a>
            <a
              href="/select-language"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
            >
              <Languages className="w-5 h-5 mr-1" />
              <span>Language</span>
            </a>

            <a
              href="/practice-1"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
            >
              <ShieldCheck className="w-5 h-5 mr-1" />
              <span>Practice With AI</span>
            </a>
            {user ? (
              <div className="flex items-center space-x-6">
                <span className="text-gray-200 font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`${
                    isLoggingOut ? "cursor-not-allowed" : ""
                  } text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-md font-medium flex items-center transition`}
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
              >
                <LogIn className="w-5 h-5 mr-1" />
                <span>Login</span>
              </a>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pt-2">
            <a
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
            >
              <Home className="w-5 h-5 mr-1" />
              <span>Home</span>
            </a>
            <a
              href="/select-language"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
            >
              <Languages className="w-5 h-5 mr-1" />
              <span>Language</span>
            </a>
            <a
              href="/lessons"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
            >
              <BookCheck className="w-5 h-5 mr-1" />
              <span>Lessons</span>
            </a>
            <a
              href="/practice-1"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
            >
              <ShieldCheck className="w-5 h-5 mr-1" />
              <span>Practice With AI</span>
            </a>
            {user ? (
              <div className="flex flex-col items-start space-y-2">
                <span className="text-gray-200 font-medium px-3 py-2">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut} // Disable button when logging out
                  className={`${
                    isLoggingOut ? "cursor-not-allowed" : ""
                  } text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-md font-medium flex items-center transition`}
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium flex items-center transition"
              >
                <LogIn className="w-5 h-5 mr-1" />
                <span>Login</span>
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
