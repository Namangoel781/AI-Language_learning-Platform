// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Phases = ({ languageId, setPhaseId }) => {
//   const [phases, setPhases] = useState([]);

//   useEffect(() => {
//     if (!languageId) return;

//     const fetchPhases = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/languages/${languageId}/phases`
//         );
//         setPhases(response.data);
//       } catch (error) {
//         console.error("Error fetching phases:", error);
//       }
//     };

//     fetchPhases();
//   }, [languageId]);

//   return (
//     <div>
//       <h2>Select a Phase</h2>
//       <ul>
//         {phases.map((phase) => (
//           <li key={phase.id} onClick={() => setPhaseId(phase.id)}>
//             {phase.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Phases;
