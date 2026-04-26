import { useState, useEffect } from "react";
import { invoiceService } from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InvoicesList() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await invoiceService.getAll();
                setInvoices(res.data);
            } catch (err) {
                console.error("Failed to fetch invoices", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const generatePDF = (invoice) => {
        const doc = new jsPDF();
        
        // Brand Identity
        doc.setFillColor(59, 130, 246); // Blue-600
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("ShopFlow", 14, 25);
        
        doc.setFontSize(10);
        doc.text("INVOICE", 180, 25, { align: "right" });

        // Metadata Header
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice Number: #${invoice.invoiceNumber}`, 14, 55);
        doc.text(`Date Issued: ${new Date(invoice.date).toLocaleDateString()}`, 14, 60);
        doc.text(`Status: ${invoice.status.toUpperCase()}`, 14, 65);

        // Bill To
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 14, 85);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(invoice.customerName, 14, 92);
        doc.text(invoice.customerEmail, 14, 98);

        // Line Items Table
        autoTable(doc, {
            startY: 110,
            head: [['Description', 'Unit Price', 'Total']],
            body: [
                [invoice.productName, `$${invoice.amount.toFixed(2)}`, `$${invoice.amount.toFixed(2)}`]
            ],
            styles: { fontSize: 10, cellPadding: 6 },
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            margin: { top: 110 }
        });

        // Summary Region
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Amount Due:", 140, finalY);
        doc.text(`$${invoice.amount.toFixed(2)}`, 196, finalY, { align: "right" });

        // Decorative Footer
        doc.setDrawColor(229, 231, 235);
        doc.line(14, 270, 196, 270);
        doc.setFontSize(9);
        doc.setTextColor(156, 163, 175);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for using ShopFlow. For billing inquiries, contact billing@shopflow.io", 105, 280, { align: "center" });

        doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    };

    const filteredInvoices = invoices.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-800";
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Void": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold leading-tight text-gray-900 font-outfit">Billing History</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        View and manage your customer invoices, payments, and billing status.
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
                    <div className="relative rounded-xl shadow-sm max-w-xs">
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="block w-full rounded-xl border-gray-200 py-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic">No invoices found.</td>
                            </tr>
                        ) : filteredInvoices.map((invoice) => (
                            <tr key={invoice._id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">#{invoice.invoiceNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{invoice.customerName}</div>
                                    <div className="text-xs text-gray-500">{invoice.customerEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{invoice.productName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${invoice.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusStyle(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => generatePDF(invoice)}
                                        className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 font-bold group"
                                    >
                                        <svg className="w-4 h-4 mr-1 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        PDF
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
