import { useAuth } from "../../context/AuthContext";

export default function Settings() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white shadow sm:rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                        <div className="mt-5 border-t border-gray-200 pt-5">
                            <dl className="divide-y divide-gray-200">
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.name || 'Loading...'}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.email || 'Loading...'}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Administrator</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* API Keys Section (Mock) */}
                <div className="bg-white shadow sm:rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">API Keys</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Use these keys to authenticate your requests with the ShopFlow API.</p>
                        </div>
                        <div className="mt-5">
                            <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center border border-gray-200">
                                <code className="text-blue-600 font-mono">sk_test_51Mz...789</code>
                                <button className="text-blue-600 text-sm font-medium hover:text-blue-500">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
