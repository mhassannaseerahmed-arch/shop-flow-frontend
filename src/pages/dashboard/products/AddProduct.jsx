import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../../services/api";

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        billingCycle: "Monthly",
        status: "Active"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await productService.create(formData);
            navigate("/dashboard/products");
        } catch (err) {
            const msg = typeof err.response?.data === 'string' 
                ? err.response.data 
                : err.response?.data?.message || "Failed to create product. Please try again.";
            setError(msg);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">Create New Product</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Define a new offering for your customers. This will be available for subscription immediately.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
                    <div className="p-8 space-y-8">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* General Info Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-2">
                                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </span>
                                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider text-xs">Product Information</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="name">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3"
                                        placeholder="e.g. Premium Monthly Plan"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                                        placeholder="What's included in this plan? e.g. 24/7 Support, Unlimited Projects..."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Pricing Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-2">
                                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </span>
                                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider text-xs">Pricing & Strategy</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="price">Price (USD)</label>
                                    <div className="mt-1 relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            id="price"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="block w-full pl-8 rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 lg:text-lg py-3"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="billingCycle">Billing Cycle</label>
                                    <select
                                        id="billingCycle"
                                        name="billingCycle"
                                        value={formData.billingCycle}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 py-3"
                                    >
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                        <option>One-time</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Availability Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-2">
                                <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </span>
                                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider text-xs">Availability</h3>
                            </div>
                            <div className="max-w-xs">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 py-3"
                                >
                                    <option>Active</option>
                                    <option>Draft</option>
                                    <option>Archived</option>
                                </select>
                            </div>
                        </section>
                    </div>

                    {/* Form Actions */}
                    <div className="p-8 bg-gray-50 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/products")}
                            className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Launch Product
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
