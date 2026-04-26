import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
    LayoutDashboard, 
    Package, 
    CreditCard, 
    Users, 
    FileText,
    Settings, 
    LogOut 
} from "lucide-react";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menu = [
        { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
        { name: "Products", path: "/dashboard/products", icon: Package },
        { name: "Subscriptions", path: "/dashboard/subscriptions", icon: CreditCard },
        { name: "Customers", path: "/dashboard/customers", icon: Users },
        { name: "Billing", path: "/dashboard/billing", icon: FileText },
        { name: "Settings", path: "/dashboard/settings", icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col">
            <div className="flex items-center h-16 px-6 border-b border-gray-800">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    ShopFlow
                </span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {menu.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isActive 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs">
                        {user?.name?.substring(0, 2).toUpperCase() || "JD"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name || "Jane Doe"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || "store@example.com"}</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
