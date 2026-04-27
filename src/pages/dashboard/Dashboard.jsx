import { useState, useEffect } from "react";
import { dashboardService } from "../../services/api";
import {Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await dashboardService.getStats();
                setStats(res.data.stats);
                setChartData(res.data.charts.revenue);
                setActivities(res.data.recentActivities);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-outfit">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Real-time insights from your ShopFlow account.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.length > 0 ? stats.map((stat, idx) => (
                    <div key={idx} className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                            <dd className="mt-2 flex items-baseline justify-between">
                                <div className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    stat.trend === 'up' 
                                        ? "bg-green-100 text-green-800" 
                                        : stat.trend === 'down' ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                                }`}>
                                    {stat.change}
                                </span>
                            </dd>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-4 text-center py-10 bg-white rounded-xl border border-dashed">No data.</div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
                        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-wider">Projected LTV</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(v) => `$${v}`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="flow-root">
                        <ul className="-mb-8">
                            {activities.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No recent activity found.</p>
                            ) : activities.map((activity, idx) => (
                                <li key={activity.id}>
                                    <div className="relative pb-8">
                                        {idx !== activities.length - 1 ? (
                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                        ) : null}
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                                    activity.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                }`}>
                                                    <span className="text-white text-xs font-bold uppercase">{activity.user.charAt(0)}</span>
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-semibold text-gray-900">{activity.user}</span>{' '}
                                                        {activity.action}{' '}
                                                        <span className="font-semibold text-gray-900">{activity.target}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right text-xs whitespace-nowrap text-gray-400">
                                                    <time dateTime={activity.time}>{formatTime(activity.time)}</time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
