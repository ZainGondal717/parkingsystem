import prisma from "@/lib/prisma";
import { Users, Car, TrendingUp, AlertCircle } from "lucide-react";

async function getStats() {
    // Fetch actual counts from MongoDB via Prisma
    const [totalUsers, totalAdmins] = await Promise.all([
        prisma.user.count(),
        prisma.admin.count(),
    ]);

    return [
        { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Admin Accounts", value: totalAdmins.toLocaleString(), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
        { label: "Active Sessions", value: "0", icon: Car, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
        { label: "System Alerts", value: "0", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
    ];
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <div className="text-sm text-gray-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm">
                    Auto-syncing with MongoDB
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Real-time Data Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Database Entries</h2>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">Live Connection</span>
                </div>
                <div className="p-8 text-center text-gray-500">
                    <p className="mb-2">Your dashboard is now live-fetching data from MongoDB.</p>
                    <p className="text-sm">Add documents to your collections to see stats update.</p>
                </div>
            </div>
        </div>
    );
}
