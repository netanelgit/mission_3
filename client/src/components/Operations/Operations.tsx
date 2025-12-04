import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccountOperationById } from "../../Services/apiService";
import type { AccountOperation } from "../../Services/apiService";

export default function Operations() {
    const { accountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();
    const [operations, setOperations] = useState<AccountOperation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOperations() {
            if (!accountId) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getAccountOperationById(Number(accountId));
                setOperations(data);
            } catch (err) {
                console.error("Failed to fetch operations:", err);
                setError("Failed to load operations. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchOperations();
    }, [accountId]);

    const getOperationTypeColor = (type: string): string => {
        switch (type.toLowerCase()) {
            case "deposit":
                return "bg-green-100 text-green-800 border-green-200";
            case "withdrawal":
                return "bg-red-100 text-red-800 border-red-200";
            case "loan":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("he-IL", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "Asia/Jerusalem",
        });
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("he-IL", {
            style: "currency",
            currency: "ILS",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="mt-4 text-gray-700 font-medium">Loading operations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                                    <svg
                                        className="w-6 h-6 text-indigo-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Account Operations
                                    </h1>
                                    <p className="text-indigo-100 text-sm">
                                        Account ID: {accountId}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back
                            </button>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50">
                        <div className="bg-white rounded-xl p-4 border-l-4 border-green-600 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Total Deposits</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {operations.filter((op) => op.typeOperation === "deposit").length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-l-4 border-red-600 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Total Withdrawals</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {operations.filter((op) => op.typeOperation === "withdrawal").length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-l-4 border-indigo-600 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Total Loan</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {operations.filter((op) => op.typeOperation === "loan").length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {operations.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No Operations Found
                        </h3>
                        <p className="text-gray-600">
                            There are no operations for this account yet.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Interest</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Monthly Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {operations.map((operation, index) => (
                                        <tr
                                            key={operation.id}
                                            className={`hover:bg-gray-50 transition duration-150 ${
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                #{operation.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getOperationTypeColor(
                                                        operation.typeOperation
                                                    )}`}
                                                >
                                                    {operation.typeOperation.charAt(0).toUpperCase() +
                                                        operation.typeOperation.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {formatCurrency(operation.sumMoney)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(operation.dateOperation)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {operation.Interest !== null
                                                    ? `${operation.Interest}%`
                                                    : "----"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {operation.sumPayments !== null
                                                    ? formatCurrency(operation.sumPayments)
                                                    : "----"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
