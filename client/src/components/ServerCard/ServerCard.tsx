import { useState } from "react";
import { replaceServerStatus } from "../../Services/apiService";
import type { Servers } from "../../Services/apiService";

interface ServerCardProps {
    server: Servers;
    onStatusUpdate: (updatedServer: Servers) => void;
}

export default function ServerCard({ server, onStatusUpdate }: ServerCardProps) {
    const [isToggling, setIsToggling] = useState(false);
    const isActive = server.status === "active";

    const handleToggle = async () => {
        if (isToggling) return;

        setIsToggling(true);
        try {
            const updatedServer = await replaceServerStatus(server.id);
            onStatusUpdate(updatedServer);
        } catch (err) {
            // console.error("Failed to toggle server status:", err);
            alert("אירעה שגיאה בעדכון השרת");
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-lg border border-slate-200 px-5 py-2.5 shadow-sm hover:shadow transition-all duration-150">
            <div className="flex items-center justify-between gap-4">

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-800 truncate">
                        {server.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                        {server.ip} · {server.hosting_company}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Created: {new Date(server.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>

                {/* Right: Status Badge and Toggle Switch */}
                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium
                        ${isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {isActive ? "ON" : "OFF"}
                    </span>

                    {/* Toggle Switch */}
                    <button
                        onClick={handleToggle}
                        disabled={isToggling}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                        aria-label={isActive ? "Turn off" : "Turn on"}
                    >
                        <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200
                            ${isActive ? "translate-x-5" : "translate-x-0.5"}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
