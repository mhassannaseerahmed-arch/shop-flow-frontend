import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { subscriptionService } from "../../../services/api";

export default function SubscriptionsList() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get("success")) {
            setAlert({ type: "success", message: "✨ Payment successful! New subscription is active." });
        }
        if (query.get("canceled")) {
            setAlert({ type: "error", message: "Payment was canceled. No charges were made." });
        }
        
        const fetchSubscriptions = async () => {
            try {
                const res = await subscriptionService.getAll();
                setSubscriptions(res.data);
            } catch (err) {
                console.error("Failed to fetch subscriptions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, [location.search]);

    const filteredSubscriptions = subscriptions.filter(sub => 
        sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this subscription?")) {
            try {
                await subscriptionService.cancel(id);
                setSubscriptions(subscriptions.map(s => s._id === id ? { ...s, status: 'Canceled' } : s));
            } catch (err) {
                console.error("Failed to cancel subscription", err);
                alert("Failed to cancel subscription.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to PERMANENTLY DELETE this subscription?")) {
            try {
                await subscriptionService.delete(id);
                setSubscriptions(subscriptions.filter(s => s._id !== id));
            } catch (err) {
                console.error("Failed to delete subscription", err);
                alert("Failed to delete subscription.");
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-800";
            case "Past Due": return "bg-red-100 text-red-800";
            case "Canceled": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {alert && (
                <div className={`p-4 rounded-lg border ${
                    alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {alert.message}
                </div>
            )}
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage active subscriptions, recurring revenue, and payment statuses.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            placeholder="Search subscribers..."
                            className="bg-white border focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto">
                        Export CSV
                    </button>
                    <Link
                        to="/dashboard/subscriptions/new"
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Create Subscription
                    </Link>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Customer</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Product</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount / Cycle</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Next Billing</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Manage</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="6" className="py-8 text-center text-gray-500">Loading subscriptions...</td></tr>
                        ) : filteredSubscriptions.length === 0 ? (
                            <tr><td colSpan="6" className="py-8 text-center text-gray-500">No subscriptions found matching "{searchTerm}"</td></tr>
                        ) : filteredSubscriptions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                                {sub.customerName.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">{sub.customerName}</div>
                                            <div className="text-gray-500 text-sm">{sub.customerEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                    {sub.product?.name || 'Deleted Product'}
                                    <div className="text-xs text-gray-500 mt-0.5">{sub._id}</div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusStyle(sub.status)}`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                    ${sub.product?.price?.toFixed(2) || '0.00'}
                                    <span className="text-xs text-gray-500 ml-1">({sub.product?.billingCycle})</span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : '-'}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4">
                                    {sub.status !== 'Canceled' && (
                                        <button 
                                            onClick={() => handleCancel(sub._id)}
                                            className="text-orange-600 hover:text-orange-900"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(sub._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
