import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div className="sticky top-0 backdrop-blur-lg bg-white/70 border-b z-50">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <h1 className="font-bold text-lg">ShopFlow</h1>

        <div className="hidden md:flex gap-6 text-sm text-gray-600">
          <span>Features</span>
          <span>Pricing</span>
          <span>Docs</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}