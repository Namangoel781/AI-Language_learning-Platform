// import React, { useState, useEffect } from "react";
// import LanguageForm from "./LanguageLearningApp";
// import LessonDisplay from "./LessonList";
// import CongratulationsDialog from "./ContratulationsDialog";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// const ProgressiveLanguageLearningApp = () => {
//   const [formData, setFormData] = useState({
//     nativeLanguage: "",
//     learningLanguage: "",
//     proficiencyLevel: "",
//   });
//   const [currentLevel, setCurrentLevel] = useState("Beginner");
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
//   const [showLessons, setShowLessons] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [showCongratulations, setShowCongratulations] = useState(false);
//   const [completedLevels, setCompletedLevels] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [phases, setPhases] = useState([]);
//   const [lessons, setLessons] = useState([]);

//   useEffect(() => {
//     const fetchLanguages = async () => {
//       try {
//         const response = await fetch("/api/languages");
//         const languagesData = await response.json();
//         setLanguages(languagesData);
//       } catch (error) {
//         console.error("Error fetching languages:", error);
//       }
//     };

//     fetchLanguages();
//   }, []);

//   useEffect(() => {
//     if (formData.nativeLanguage) {
//       const fetchPhases = async () => {
//         try {
//           const response = await fetch(
//             `/api/phases/${formData.nativeLanguage}`
//           );
//           const phasesData = await response.json();
//           setPhases(phasesData);
//         } catch (error) {
//           console.error("Error fetching phases:", error);
//         }
//       };

//       fetchPhases();
//     }
//   }, [formData.nativeLanguage]);

//   const handlePhaseSelection = async (phaseId) => {
//     try {
//       const response = await fetch(`/api/phases/${phaseId}/lessons`);
//       const lessonsData = await response.json();
//       setLessons(lessonsData);
//     } catch (error) {
//       console.error("Error fetching lessons:", error);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowLessons(true);
//     setCurrentLevel(formData.proficiencyLevel || "Beginner");
//     setCurrentLessonIndex(0);
//   };

//   const handleNextLesson = () => {
//     if (currentLessonIndex < lessons.length - 1) {
//       setCurrentLessonIndex((prevIndex) => prevIndex + 1);
//     } else {
//       setCompletedLevels((prev) => [...prev, currentLevel]);
//       setShowCongratulations(true);
//       if (currentLevel !== "Advanced") {
//         const nextLevel =
//           currentLevel === "Beginner" ? "Intermediate" : "Advanced";
//         setCurrentLevel(nextLevel);
//         setCurrentLessonIndex(0);
//       }
//     }
//   };

//   const handlePreviousLesson = () => {
//     if (currentLessonIndex > 0) {
//       setCurrentLessonIndex((prevIndex) => prevIndex - 1);
//     }
//   };

//   const currentLesson = lessons[currentLessonIndex];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-blue-800">
//           Progressive Language Learning
//         </h1>
//         <p className="text-center text-gray-600">
//           Embark on your language journey
//         </p>

//         {!showLessons ? (
//           <LanguageForm
//             formData={formData}
//             setFormData={setFormData}
//             languages={languages}
//             phases={phases}
//             onSubmit={handleSubmit}
//             onPhaseSelect={handlePhaseSelection}
//           />
//         ) : (
//           <Accordion type="single" collapsible>
//             <AccordionItem value="lessons">
//               <AccordionTrigger>Lessons</AccordionTrigger>
//               <AccordionContent>
//                 <LessonDisplay
//                   currentLesson={currentLesson}
//                   currentLessonIndex={currentLessonIndex}
//                   availableLessons={lessons}
//                   progress={progress}
//                   onNext={handleNextLesson}
//                   onPrevious={handlePreviousLesson}
//                 />
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         )}
//       </div>

//       {/* <CongratulationsDialog
//         open={showCongratulations}
//         onClose={() => {
//           setShowCongratulations(false);
//           setCurrentLessonIndex(0);
//         }}
//         currentLevel={currentLevel}
//       /> */}
//     </div>
//   );
// };

// export default ProgressiveLanguageLearningApp;
