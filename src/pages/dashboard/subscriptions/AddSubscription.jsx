import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService, productService, paymentService } from "../../../services/api";

export default function AddSubscription() {
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        productId: "",
        status: "Active"
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stripeLoading, setStripeLoading] = useState(false);
    const [fetchingProducts, setFetchingProducts] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAll();
                const activeProducts = res.data.filter(p => p.status === 'Active');
                setProducts(activeProducts);
                if (activeProducts.length > 0) {
                    setFormData(prev => ({ ...prev, productId: activeProducts[0]._id }));
                }
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setFetchingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productId) {
            setError("Please select a product.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await subscriptionService.create(formData);
            navigate("/dashboard/subscriptions");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create subscription.");
            setLoading(false);
        }
    };

    const handleStripePay = async () => {
        if (!formData.productId || !formData.customerEmail) {
            setError("Please fill in email and select a product first.");
            return;
        }
        setStripeLoading(true);
        setError("");
        try {
            const res = await paymentService.createCheckoutSession({
                productId: formData.productId,
                customerEmail: formData.customerEmail,
                customerName: formData.customerName
            });
            // Redirect to Stripe Checkout URL
            window.location.href = res.data.url;
        } catch (err) {
            const msg = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || "Stripe Checkout failed. Ensure you have a valid Secret Key in .env";
            setError(msg);
            setStripeLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Create New Subscription
                    </h2>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="customerName">Customer Name</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    id="customerName"
                                    required
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="customerEmail">Customer Email</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    id="customerEmail"
                                    required
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="productId">Select Product</label>
                            {fetchingProducts ? (
                                <div className="animate-pulse h-10 bg-gray-100 rounded-md"></div>
                            ) : products.length === 0 ? (
                                <p className="text-sm text-red-500 font-medium">No active products found. Create a product first.</p>
                            ) : (
                                <select
                                    id="productId"
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleChange}
                                >
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} - ${p.price}/{p.billingCycle}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/subscriptions")}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || stripeLoading || fetchingProducts || products.length === 0}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Manual Activation"}
                            </button>
                            <button
                                type="button"
                                onClick={handleStripePay}
                                disabled={loading || stripeLoading || fetchingProducts || products.length === 0}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {stripeLoading ? "Processing..." : "Pay with Stripe ✨"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <p className="mt-4 text-xs text-center text-gray-400">
                Tip: "Manual Activation" creates the subscription immediately without payment.
            </p>
        </div>
    );
}
