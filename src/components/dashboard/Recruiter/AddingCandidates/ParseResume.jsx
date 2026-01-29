// import React, { useEffect, useRef, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { fabric } from "fabric";

// // Import the PDF worker correctly
// import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// const ParseResume = ({ file }) => {
//     const canvasRef = useRef(null);
//     const fabricCanvasRef = useRef(null);
//     const [numPages, setNumPages] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [pdfFile, setPdfFile] = useState(null);

//     useEffect(() => {
//         if (!file) {
//             console.warn("No PDF file provided, using default sample file.");
//             setPdfFile("/sample.pdf"); // Provide a default PDF
//         } else {
//             setPdfFile(file);
//         }
//     }, [file]);

//     useEffect(() => {
//         if (!canvasRef.current || fabricCanvasRef.current) return;

//         console.log("Initializing Fabric.js Canvas...");
//         const fabricCanvas = new fabric.Canvas(canvasRef.current);
//         fabricCanvasRef.current = fabricCanvas;

//         return () => {
//             console.log("Cleaning up Fabric.js Canvas...");
//             fabricCanvas.dispose();
//             fabricCanvasRef.current = null;
//         };
//     }, []);

//     const enableFreeDraw = () => {
//         if (!fabricCanvasRef.current) {
//             console.error("❌ Fabric canvas is not initialized!");
//             return;
//         }

//         console.log("Enabling free draw...");
//         const fabricCanvas = fabricCanvasRef.current;
//         fabricCanvas.isDrawingMode = true;
//         fabricCanvas.freeDrawingBrush.width = 5;
//         fabricCanvas.freeDrawingBrush.color = "red";
//         setIsEditing(true);
//     };

//     return (
//         <div>
//             <h1>Edit Resume Here</h1>

//             {pdfFile ? (
//                 <Document
//                     file={pdfFile}
//                     onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                 >
//                     <Page pageNumber={1} canvasRef={canvasRef} />
//                 </Document>
//             ) : (
//                 <p style={{ color: "red" }}>No PDFF file specified.</p>
//             )}

//             <canvas ref={canvasRef} width={600} height={800} />

//             <button onClick={enableFreeDraw} disabled={isEditing}>
//                 Enable Editing
//             </button>
//         </div>
//     );
// };

// export default ParseResume;
