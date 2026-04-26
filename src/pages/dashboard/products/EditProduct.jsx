import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../../services/api";

export default function EditProduct() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        billingCycle: "Monthly",
        status: "Active"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.getOne(id);
                setFormData(res.data);
            } catch (err) {
                setError("Failed to fetch product details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await productService.update(id, formData);
            navigate("/dashboard/products");
        } catch (err) {
            const msg = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || "Failed to update product.";
            setError(msg);
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-10">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Edit Product
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
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="price">Price (USD)</label>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="billingCycle">Billing Cycle</label>
                                <select
                                    id="billingCycle"
                                    name="billingCycle"
                                    value={formData.billingCycle}
                                    onChange={handleChange}
                                >
                                    <option>Monthly</option>
                                    <option>Yearly</option>
                                    <option>One-time</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <div className="mt-1">
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option>Active</option>
                                    <option>Draft</option>
                                    <option>Archived</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/products")}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Update Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
