import { motion } from "framer-motion";

const features = [
    { title: "Smart Catalog", desc: "Manage products easily" },
    { title: "Subscriptions", desc: "Recurring billing system" },
    { title: "Analytics", desc: "Track performance" },
];

export default function Features() {
    return (
        <div className="py-20 px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
                Everything you need
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -8 }}
                        className="p-6 border rounded-2xl bg-white shadow-sm hover:shadow-xl transition"
                    >
                        <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                        <p className="text-gray-500 text-sm">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}