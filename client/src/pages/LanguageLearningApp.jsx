import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Globe } from "lucide-react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/api/users/set-languages",
        {
          native_language: nativeLanguage,
          learning_language: learningLanguage,
        },
        { withCredentials: true }
      );

      toast.success("Language preference saved successfully.", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => (window.location.href = "/"), 3000);
    } catch (error) {
      console.error("Error saving language preferences:", error);

      toast.error("Error saving language preferences. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
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
                <label>Native Language</label>
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
                <label>Learning Language</label>
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
