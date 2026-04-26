import { Routes, Route } from "react-router-dom";
import LandingLayout from "../components/layout/LandingLayout";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductsList from "../pages/dashboard/products/ProductsList";
import EditProduct from "../pages/dashboard/products/EditProduct";
import AddProduct from "../pages/dashboard/products/AddProduct";
import SubscriptionsList from "../pages/dashboard/subscriptions/SubscriptionsList";
import AddSubscription from "../pages/dashboard/subscriptions/AddSubscription";
import CustomersList from "../pages/dashboard/customers/CustomersList";
import AddCustomer from "../pages/dashboard/customers/AddCustomer";
import EditCustomer from "../pages/dashboard/customers/EditCustomer";
import InvoicesList from "../pages/dashboard/invoices/InvoicesList";
import Settings from "../pages/dashboard/Settings";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Pages wrapping with Navbar & Footer */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Internal SaaS Dashboard - Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id" element={<EditProduct />} />
          <Route path="subscriptions" element={<SubscriptionsList />} />
          <Route path="subscriptions/new" element={<AddSubscription />} />
          <Route path="customers" element={<CustomersList />} />
          <Route path="customers/new" element={<AddCustomer />} />
          <Route path="customers/:id" element={<EditCustomer />} />
          <Route path="billing" element={<InvoicesList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
