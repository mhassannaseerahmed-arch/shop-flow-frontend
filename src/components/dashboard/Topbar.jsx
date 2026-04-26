export default function Topbar() {
    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-8 z-10 sticky top-0">
            <div className="flex-1 flex">
                <div className="w-full max-w-md relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 sm:text-sm">🔍</span>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                        placeholder="Search products, orders, or customers..."
                    />
                </div>
            </div>

            <div className="ml-4 flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                    🔔
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Help
                </button>
            </div>
        </div>
    );
}
