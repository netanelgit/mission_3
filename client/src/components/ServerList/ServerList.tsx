import { useState, useEffect } from "react";
import { getAllServers } from "../../Services/apiService";
import type { Server } from "../../Services/apiService";
import ServerCard from "../ServerCard/ServerCard";

export default function ServerList() {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortNewest, setSortNewest] = useState<boolean>(true);
    const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);

    useEffect(() => {
        fetchServers();
    }, []);

    async function fetchServers() {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllServers();
            setServers(data);
        } catch (err) {
            // console.error("Failed to fetch servers:", err);
            setError("Failed to load servers. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleServerStatusUpdate = (updatedServer: Server) => {
        setServers(prevServers =>
            prevServers.map(server =>
                server.id === updatedServer.id ? updatedServer : server
            )
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    <p className="mt-4 text-slate-600 text-sm">Loading servers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Connection Error</h3>
                    <p className="text-sm text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={fetchServers}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 text-sm"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const activeServers = servers.filter(s => s.status === "active").length;
    const inactiveServers = servers.filter(s => s.status === "inactive").length;

    // Filter servers if showActiveOnly is enabled
    const filteredServers = showActiveOnly
        ? servers.filter(s => s.status === "active")
        : servers;

    // Sort servers by created_at
    const sortedServers = [...filteredServers].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortNewest ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-6 sm:px-12 lg:px-20">
            {/* Container with max-width for centered content */}
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                            Server Dashboard
                        </h1>
                        <p className="text-slate-500 text-sm">Monitor and manage your infrastructure</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100 shadow-sm">
                            <p className="text-xs text-indigo-600 mb-1">Total</p>
                            <p className="text-2xl font-semibold text-indigo-700">{servers.length}</p>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200 shadow-sm">
                            <p className="text-xs text-emerald-600 mb-1">Active</p>
                            <p className="text-2xl font-semibold text-emerald-600">{activeServers}</p>
                        </div>

                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200 shadow-sm">
                            <p className="text-xs text-slate-500 mb-1">Inactive</p>
                            <p className="text-2xl font-semibold text-slate-600">{inactiveServers}</p>
                        </div>
                    </div>
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex justify-between items-center mb-4">
                    {/* Active Only Checkbox */}
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showActiveOnly}
                            onChange={(e) => setShowActiveOnly(e.target.checked)}
                            className="w-4 h-4 text-emerald-500 bg-white border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 cursor-pointer"
                        />
                        <span className="text-sm text-slate-700 font-medium">Show Active Only</span>
                    </label>

                    {/* Sort Button */}
                    <button
                        onClick={() => setSortNewest(!sortNewest)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium shadow-sm transition-colors duration-150"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        {sortNewest ? "Newest First" : "Oldest First"}
                    </button>
                </div>

                {/* Server Cards - Stacked Rows */}
                <div className="space-y-2">
                    {sortedServers.map(server => (
                        <ServerCard
                            key={server.id}
                            server={server}
                            onStatusUpdate={handleServerStatusUpdate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
