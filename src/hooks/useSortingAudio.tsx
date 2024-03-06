import { useEffect, useRef } from "react";
import SortingIterationStep from "../types/sortingIterationStep";
import { Note, NotePlayer } from "../utils/audio";

// export default function useSortingAudio(
//   iterationSteps: SortingIterationStep[]
// ) {

// //   useEffect(() => {
// //     synth.stop();

// //     const notes: Note[] = [];
// //     const ctx = synth.ctx;

// //     for (let step of iterationSteps) {
// //       notes.push(note);
// //     }
// //     console.log("playing");
// //     synth.play(notes, 0.1);
// //   });
// // }
