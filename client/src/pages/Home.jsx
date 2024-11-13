import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Brain, Briefcase, Music } from "lucide-react";
import Navbar from "./Nav";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-gray-800 text-white">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <main className="max-w-4xl mx-auto px-4 py-16 relative z-10">
          <div className="space-y-12">
            <h1 className="text-5xl md:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 animate-fade-in-down">
              Welcome to LinguaVerse
            </h1>

            <p className="text-xl md:text-2xl text-center text-gray-200 animate-fade-in-up">
              Embark on a journey of linguistic discovery and cultural
              exploration!
            </p>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-center text-slate-100 mb-6">
                Why Learn Different Languages?
              </h2>
              <ul className="space-y-4">
                {[
                  {
                    Icon: Brain,
                    text: "Expand cognitive abilities and enhance brain function",
                  },
                  {
                    Icon: Globe,
                    text: "Connect with diverse cultures and broaden your worldview",
                  },
                  {
                    Icon: Briefcase,
                    text: "Boost career opportunities in a globalized world",
                  },
                  {
                    Icon: Music,
                    text: "Enjoy literature, films, and music in their original language",
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200"
                  >
                    <item.Icon className="h-8 w-8 text-blue-400" />
                    <span className="text-lg text-gray-200">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <Link to="/lessons" passHref>
                <button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                    isHovered ? "" : ""
                  }`}
                >
                  Start Your Language Journey
                  <span
                    className={`absolute inset-0 bg-gradient-to-r from-slate-800 to-zinc-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                      isHovered ? "scale-150" : "scale-0"
                    }`}
                  ></span>
                  <ArrowRight className="inline-block ml-2 -mr-1 w-6 h-6" />
                </button>
              </Link>
            </div>
          </div>
        </main>

        <footer className="absolute bottom-4 left-0 right-0 text-center text-gray-400">
          © {new Date().getFullYear()} LinguaVerse. All rights reserved.
        </footer>
      </div>
    </>
  );
}
