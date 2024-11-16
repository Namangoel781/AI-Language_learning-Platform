import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "./Nav";

const languages = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "German", label: "German" },
  { value: "French", label: "French" },
  { value: "Spanish", label: "Spanish" },
];

export default function LanguageSelection() {
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [learningLanguage, setLearningLanguage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:3000/refresh-session", {
        withCredentials: true,
      });
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Save language preferences
      await axios.post(
        "http://localhost:3000/api/users/set-languages",
        {
          native_language: nativeLanguage,
          learning_language: learningLanguage,
        },
        {
          withCredentials: true,
        }
      );

      // Step 2: Complete language setup and set `needs_language_setup` to false
      const userId = 9; // Replace with dynamic userId if needed

      await axios.post(
        "http://localhost:3000/api/complete-language-setup",
        {
          userId: userId,
          nativeLanguage: nativeLanguage,
          learningLanguage: learningLanguage,
        },
        { withCredentials: true }
      );

      // Step 3: Notify success
      toast.success(
        "Your language preferences have been saved and setup completed.",
        {
          position: "top-right", // Correct position string
          autoClose: 3000,
        }
      );

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "http://localhost:5173/"; // Adjust the URL based on your app's routing
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving languages or completing language setup:",
        error
      );

      // Step 4: Handle error
      toast.error(
        "There was an error saving your languages or completing the setup. Please try again.",
        {
          position: "top-right", // Correct position string
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              <Globe className="inline-block mr-2 mb-1" />
              Select Your Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Native Language
                </label>
                <Select onValueChange={setNativeLanguage} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your native language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Learning Language
                </label>
                <Select onValueChange={setLearningLanguage} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the language you want to learn" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Save Preferences
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
