import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { useAuth } from "./useAuth";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ResumeViewer = ({ resume, onPrintScreenAttempt }) => {
    const { apiurl, userData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [numPages, setNumPages] = useState(null);
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === "PrintScreen" && onPrintScreenAttempt) {
                onPrintScreenAttempt();
            }
        };
        document.addEventListener("keydown", handleKeydown);
        return () => document.removeEventListener("keydown", handleKeydown);
    }, [onPrintScreenAttempt]);

    // Dynamic width calculation
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                // Subtract padding (P-4 is 16px on each side = 32px total)
                setContainerWidth(containerRef.current.offsetWidth - 12);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [userData?.role]); // Re-calculate if role changes (which might change the layout)

    const isClient = userData?.role === "client";
    const resumeSrc = resume ? `${apiurl}${resume}` : null;

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    const renderClientView = () => (
        <div
            ref={containerRef}
            className="w-full h-full overflow-y-auto bg-gray-50 flex flex-col items-center p-4 scrollbar-thin"
            style={{ userSelect: "none" }}
        >
            <Document
                file={resumeSrc}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="p-10">
                        <Spin tip="Rendering resume..." />
                    </div>
                }
                error={
                    <div className="text-red-500 p-10">
                        Failed to load resume.
                    </div>
                }
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <div
                        key={`page_${index + 1}`}
                        className="mb-6 shadow-md border border-gray-200"
                    >
                        <Page
                            pageNumber={index + 1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            width={containerWidth || 600}
                        />
                    </div>
                ))}
            </Document>
        </div>
    );

    const renderDefaultView = () => (
        <iframe
            src={resumeSrc}
            className="w-full h-full border-none"
            title="Resume PDF"
            onLoad={() => setLoading(false)}
        />
    );

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "#fff",
                position: "relative",
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {loading && !isClient && (
                <div className="absolute inset-0 flex justify-center items-center bg-white z-10">
                    <Spin tip="Loading resume..." />
                </div>
            )}

            {resume ? (
                isClient ? (
                    renderClientView()
                ) : (
                    renderDefaultView()
                )
            ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                    No resume available to display.
                </div>
            )}
        </div>
    );
};

export default ResumeViewer;
