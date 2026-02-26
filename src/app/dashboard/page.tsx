'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
    LayoutDashboard,
    History,
    CreditCard,
    LogOut,
    Cpu,
    Activity,
    Wallet,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/');
            } else {
                setUser(session.user);
            }
        };
        getUser();
    }, [router]);

    const { data: usage, isLoading: loadingUsage } = useQuery({
        queryKey: ['usage'],
        queryFn: async () => {
            const response = await api.get('/api/usage');
            return response.data.data;
        },
        enabled: !!user,
    });

    const { data: billing, isLoading: loadingBilling } = useQuery({
        queryKey: ['billing'],
        queryFn: async () => {
            const response = await api.get('/api/billing');
            return response.data.data;
        },
        enabled: !!user,
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (!user || loadingUsage || loadingBilling) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    // Transform data for chart
    const charData = usage?.map((log: any) => ({
        date: format(new Date(log.created_at), 'MMM dd'),
        tokens: log.tokens_count,
    })) || [];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">Q</div>
                    <span className="text-xl font-bold tracking-tight">Quixote AI</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl font-medium transition-all">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 rounded-xl transition-all">
                        <History className="w-5 h-5" /> Usage Logs
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 rounded-xl transition-all">
                        <CreditCard className="w-5 h-5" /> Billing
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors mt-auto"
                >
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
                <header className="flex justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Overview</h1>
                        <p className="text-gray-400">Welcome back, {user.email?.split('@')[0]}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-900/50 p-2 pr-4 rounded-full border border-gray-800">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <span className="hidden sm:inline text-sm font-medium text-gray-300">{user.email}</span>
                    </div>
                </header>

                {/* Top Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="glass-card p-6 flex items-start justify-between relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/5 rounded-full group-hover:bg-blue-600/10 transition-all" />
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-1">
                                <Cpu className="w-4 h-4" /> Total Tokens
                            </p>
                            <h3 className="text-3xl font-bold">{billing?.totalTokens?.toLocaleString() || 0}</h3>
                            <p className="text-blue-500 text-xs mt-2 flex items-center gap-1 font-medium">
                                <TrendingUp className="w-3 h-3" /> +12% from last month
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-start justify-between relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-600/5 rounded-full group-hover:bg-purple-600/10 transition-all" />
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-1">
                                <Wallet className="w-4 h-4" /> Current Bill
                            </p>
                            <h3 className="text-3xl font-bold text-green-400">
                                ${billing?.estimatedCost?.toFixed(2) || '0.00'}
                            </h3>
                            <p className="text-gray-500 text-xs mt-2 font-medium uppercase tracking-wider">USD - Pay-as-you-go</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-start justify-between relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-600/5 rounded-full group-hover:bg-orange-600/10 transition-all" />
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-1">
                                <Activity className="w-4 h-4" /> API Health
                            </p>
                            <h3 className="text-3xl font-bold text-blue-400">99.9%</h3>
                            <p className="text-blue-400/60 text-xs mt-2 font-medium">Stable Performance</p>
                        </div>
                    </div>
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 glass-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold">Usage Patterns</h4>
                            <div className="flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                                <span className="text-xs text-gray-500">Tokens Consumption</span>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charData}>
                                    <defs>
                                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#3b82f6' }}
                                    />
                                    <Area type="monotone" dataKey="tokens" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Side Info */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10 to-transparent">
                            <h4 className="text-lg font-bold mb-4">Tauri Support 📦</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                This dashboard is built with <b>Next.js (SSG)</b>, making it perfectly compatible with <b>Tauri</b>.
                            </p>
                            <div className="space-y-3">
                                <div className="text-xs text-gray-500 bg-gray-900 p-3 rounded-lg border border-gray-800">
                                    To port this to desktop, you would:
                                    <ol className="list-decimal ml-4 mt-2 space-y-1">
                                        <li>Change output to 'export' in next.config.ts</li>
                                        <li>Run <code>npm run build</code></li>
                                        <li>Initialize Tauri with <code>cargo tauri init</code></li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-blue-500/20">
                            <h4 className="text-lg font-bold mb-4">Recent Activity</h4>
                            <div className="space-y-4">
                                {usage?.slice(-3).reverse().map((log: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 border-b border-gray-800 pb-3 last:border-0">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                        <div className="flex-1">
                                            <p className="text-xs font-medium">{log.model_used}</p>
                                            <p className="text-[10px] text-gray-500">{format(new Date(log.created_at), 'kk:mm:ss')}</p>
                                        </div>
                                        <span className="text-xs font-bold text-gray-300">+{log.tokens_count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
