import { Link } from "react-router-dom";
import { useAuth } from "../useAuth";

function NotificationMessage({ message }) {
    if (!message) return null;

    const idMatch = message.match(/id::(\d+)/);
    const linkMatch = message.match(/link::['"]?([\w/-]+)['"]?/);

    const jobId = idMatch ? idMatch[1] : null;
    const linkPath = linkMatch ? linkMatch[1] : null;

    const { userData } = useAuth();

    const cleanedMessage = message
        .replace(/id::\d*/g, "")
        .replace(/link::['"]?[\w/-]+['"]?/, "")
        .trim();

    // Split and remove any completely empty lines
    const lines = cleanedMessage
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    return (
        <div className="space-y-4">
            <div className="text-gray-700 leading-relaxed font-medium text-base">
                {lines.map((line, idx) => (
                    <div key={idx} className="mb-2 last:mb-0">
                        {line}
                    </div>
                ))}
            </div>

            {linkPath && (
                <div className="mt-6 pt-4 border-t border-blue-50">
                    <Link
                        to={`/${linkPath}${jobId ? `${jobId}` : ""}`}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100 group"
                    >
                        <span>Navigate to Source</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                            👉
                        </span>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default NotificationMessage;
