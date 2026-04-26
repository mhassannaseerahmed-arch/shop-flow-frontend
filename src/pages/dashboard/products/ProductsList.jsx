import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { productService } from "../../../services/api";

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAll();
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.delete(id);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                console.error("Failed to delete product", err);
                alert("Failed to delete product. It might be linked to active subscriptions.");
            }
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your products, pricing, and subscription models.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-4">
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-white border focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/dashboard/products/new"
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subscribers</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">MRR</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="6" className="py-8 text-center text-gray-500">Loading products...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan="6" className="py-8 text-center text-gray-500">No products found matching "{searchTerm}"</td></tr>
                        ) : filteredProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {product.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                        product.status === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.subscribers}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${(product.price * product.subscribers).toFixed(2)}</td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4">
                                    <Link to={`/dashboard/products/${product._id}`} className="text-blue-600 hover:text-blue-900">
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product._id)}
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
