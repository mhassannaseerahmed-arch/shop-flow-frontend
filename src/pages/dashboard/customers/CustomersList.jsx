import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { customerService } from "../../../services/api";

export default function CustomersList() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await customerService.getAll();
                setCustomers(res.data);
            } catch (err) {
                console.error("Failed to fetch customers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await customerService.delete(id);
                setCustomers(customers.filter(c => c._id !== id));
            } catch (err) {
                console.error("Failed to delete customer", err);
                alert("Failed to delete customer.");
            }
        }
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-800";
            case "Lead": return "bg-blue-100 text-blue-800";
            case "Churned": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        A list of all users in your account including their name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-4">
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="bg-white border focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/dashboard/customers/new"
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Customer
                    </Link>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading customers...</td></tr>
                        ) : filteredCustomers.length === 0 ? (
                            <tr><td colSpan="5" className="py-8 text-center text-gray-500">No customers found matching "{searchTerm}"</td></tr>
                        ) : filteredCustomers.map((person) => (
                            <tr key={person._id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {person.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.company || '-'}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusStyle(person.status)}`}>
                                        {person.status}
                                    </span>
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4">
                                    <Link to={`/dashboard/customers/${person._id}`} className="text-blue-600 hover:text-blue-900">
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(person._id)}
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
