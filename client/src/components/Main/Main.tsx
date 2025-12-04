import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
    const navigate = useNavigate();
    const [accountId, setAccountId] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);

    const handleAddOperation = () => {
        if (!accountId) {
            setError("Please enter an account ID");
            return;
        }
        setError(null);
        navigate(`/add-operation/${accountId}`);
    };

    const handleViewOperations = () => {
        if (!accountId) {
            setError("Please enter an account ID");
            return;
        }
        setError(null);
        navigate(`/view-operations/${accountId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                        Account Management
                    </h1>
                    <p className="text-gray-600 mb-6 text-center">
                        Manage your account operations
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account ID
                        </label>
                        <input
                            type="number"
                            placeholder="Enter account ID"
                            value={accountId}
                            onChange={(e) => {
                                setAccountId(
                                    e.target.value === "" ? "" : Number(e.target.value)
                                );
                                setError(null);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleAddOperation}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Add Operation
                        </button>
                        <button
                            onClick={handleViewOperations}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            View Operations
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
