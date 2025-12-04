import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addOperation } from "../../Services/apiService";

type OperationType = "deposit" | "withdrawal" | "loan";

export default function AddOperation() {
    const { accountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();
    const [accountID, setAccountID] = useState<number | "">("");
    const [typeOperation, setTypeOperation] = useState<OperationType | "">("");
    const [sumMoney, setSumMoney] = useState<number | "">("");
    const [sumPayments, setSumPayments] = useState<number | "">("");
    const [interest, setInterest] = useState<number | "">("");
    const [dateOperation, setDateOperation] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error">("success");
    const [touched, setTouched] = useState({
        typeOperation: false,
        sumMoney: false,
        interest: false,
        sumPayments: false,
    });

    useEffect(() => {
        if (accountId) {
            setAccountID(Number(accountId));
        }
    }, [accountId]);

    // Validation helpers
    const isTypeOperationValid = typeOperation !== "";
    const isSumMoneyValid = sumMoney !== "" && Number(sumMoney) > 0;
    const isInterestValid = typeOperation !== "loan" || (interest !== "" && Number(interest) >= 0);
    const isSumPaymentsValid = typeOperation !== "loan" || (sumPayments !== "" && Number(sumPayments) >= 1);

    const isFormValid = isTypeOperationValid && isSumMoneyValid && isInterestValid && isSumPaymentsValid;

    const getInputClass = (isValid: boolean, fieldTouched: boolean) => {
        const baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 transition duration-200 outline-none";
        if (fieldTouched && !isValid) {
            return `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClass} border-gray-300 focus:ring-indigo-500 focus:border-transparent`;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        console.log("Form submitted!");

        if (!accountID || !typeOperation || !sumMoney) {
            setMessageType("error");
            setMessage("Please fill all required fields (Account ID, Operation Type, and Amount).");
            return;
        }

        if (typeOperation === "loan" && (!interest || !sumPayments)) {
            setMessageType("error");
            setMessage("For loan operations, both Interest and Sum Payments are required.");
            return;
        }

        const payload = {
            accountID: Number(accountID),
            typeOperation,
            sumMoney: Number(sumMoney),
            sumPayments: sumPayments ? Number(sumPayments) : null,
            dateOperation: dateOperation || new Date().toISOString(),
            Interest: interest ? Number(interest) : null,
        };

        console.log("Sending payload:", payload);

        try {
            const result = await addOperation(payload);
            console.log("Operation result:", result);

            setMessageType("success");
            setMessage("Operation added successfully!");

            // Reset form
            setAccountID("");
            setTypeOperation("");
            setSumMoney("");
            setSumPayments("");
            setInterest("");
            setDateOperation(new Date().toISOString().split("T")[0]);
            setTouched({
                typeOperation: false,
                sumMoney: false,
                interest: false,
                sumPayments: false,
            });
        } catch (err) {
            console.error("Submit failed:", err);
            setMessageType("error");
            setMessage("Failed to add operation.");
        }
        
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/')}
                            className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
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
                            Back to Main
                        </button>
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-500 mb-1">Account ID</p>
                            <p className="text-2xl font-bold text-indigo-600">#{accountID}</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                            Add New Operation
                        </h2>
                        <p className="text-gray-600 text-center">
                            Enter operation information for your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Operation Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Operation Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={typeOperation}
                                onChange={(e) => setTypeOperation(e.target.value as OperationType | "")}
                                onBlur={() => setTouched({ ...touched, typeOperation: true })}
                                className={`${getInputClass(isTypeOperationValid, touched.typeOperation)} bg-white`}
                            >
                                <option value="">Select operation type...</option>
                                <option value="deposit">Deposit</option>
                                <option value="withdrawal">Withdrawal</option>
                                <option value="loan">Loan</option>
                            </select>
                            {touched.typeOperation && !isTypeOperationValid && (
                                <p className="mt-1 text-sm text-red-600">Please select an operation type</p>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={sumMoney}
                                    onChange={(e) =>
                                        setSumMoney(e.target.value === "" ? "" : Number(e.target.value))
                                    }
                                    onBlur={() => setTouched({ ...touched, sumMoney: true })}
                                    className={getInputClass(isSumMoneyValid, touched.sumMoney).replace("px-4", "pl-8 pr-4")}
                                />
                            </div>
                            {touched.sumMoney && !isSumMoneyValid && (
                                <p className="mt-1 text-sm text-red-600">Please enter a valid amount greater than 0</p>
                            )}
                        </div>

                        {/* Loan-specific fields */}
                        {typeOperation === "loan" && (
                            <div className="bg-indigo-50 p-4 rounded-lg space-y-4 border border-indigo-200">
                                <p className="text-sm font-medium text-indigo-900 mb-2">
                                    Loan Details
                                </p>

                                {/* Interest */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Interest (%) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="e.g., 5.5"
                                        value={interest}
                                        onChange={(e) =>
                                            setInterest(e.target.value === "" ? "" : Number(e.target.value))
                                        }
                                        onBlur={() => setTouched({ ...touched, interest: true })}
                                        className={getInputClass(isInterestValid, touched.interest)}
                                    />
                                    {touched.interest && !isInterestValid && (
                                        <p className="mt-1 text-sm text-red-600">Please enter a valid interest rate</p>
                                    )}
                                </div>

                                {/* Number of Payments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Monthly Payments <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="e.g., 12"
                                        value={sumPayments}
                                        onChange={(e) =>
                                            setSumPayments(
                                                e.target.value === "" ? "" : Number(e.target.value)
                                            )
                                        }
                                        onBlur={() => setTouched({ ...touched, sumPayments: true })}
                                        className={getInputClass(isSumPaymentsValid, touched.sumPayments)}
                                    />
                                    {touched.sumPayments && !isSumPaymentsValid && (
                                        <p className="mt-1 text-sm text-red-600">Please enter at least 1 payment</p>
                                    )}
                                    {sumMoney && sumPayments && interest && (
                                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Monthly payment: </span>
                                                <span className="text-indigo-700 font-semibold">
                                                    ${((Number(sumMoney) * (1 + Number(interest) / 100)) / Number(sumPayments)).toFixed(2)}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={dateOperation}
                                onChange={(e) => setDateOperation(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md ${
                                isFormValid
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            Add Operation
                        </button>
                    </form>

                    {/* Message */}
                    {message && (
                        <div
                            className={`mt-6 p-4 rounded-lg ${
                                messageType === "success"
                                    ? "bg-green-50 border border-green-200 text-green-800"
                                    : "bg-red-50 border border-red-200 text-red-800"
                            }`}
                        >
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
