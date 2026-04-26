import { motion } from "framer-motion";

export default function Pricing() {
    return (
        <div className="py-20 px-8 bg-gray-50 text-center">
            <h2 className="text-3xl font-bold mb-12">Pricing</h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                <div className="p-6 border rounded-2xl">
                    <h3 className="text-lg font-semibold">Starter</h3>
                    <p className="text-4xl my-4">$0</p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-6 rounded-2xl bg-black text-white shadow-xl"
                >
                    <h3 className="text-lg font-semibold">Pro</h3>
                    <p className="text-4xl my-4">$49</p>
                    <button className="bg-white text-black px-4 py-2 rounded-lg">
                        Start Trial
                    </button>
                </motion.div>

                <div className="p-6 border rounded-2xl">
                    <h3 className="text-lg font-semibold">Enterprise</h3>
                    <p className="text-4xl my-4">$229</p>
                </div>

            </div>
        </div>
    );
}