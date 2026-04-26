import { motion } from "framer-motion";

export default function Hero() {
    return (
        <div className="text-center py-28 px-6 relative overflow-hidden">

            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white opacity-40" />

            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold leading-tight mb-6 relative z-10"
            >
                Build Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    Subscription Empire
                </span>
            </motion.h1>

            <p className="text-gray-500 max-w-lg mx-auto mb-8 relative z-10">
                Modern SaaS platform to manage products, subscriptions, and growth.
            </p>

            <div className="flex justify-center gap-4 relative z-10">
                <button className="bg-black text-white px-6 py-3 rounded-lg">
                    Start Free
                </button>
                <button className="border px-6 py-3 rounded-lg">
                    Live Demo
                </button>
            </div>
        </div>
    );
}