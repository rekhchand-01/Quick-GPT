import React from "react";
import { useUser } from "../clerk";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { tools } from "../const/toolsData";
import {
    ArrowUpRight,
    BarChart,
    CheckCircle2,
    Sparkles,
    Zap,
    Loader2,
} from "lucide-react";
import DashboardAssistant from "../components/dashboard/DashboardChatAssistant";

const Dashboard: React.FC = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    const {
        data: dashboardData,
        isLoading: dashboardLoading,
        isError,
    } = useDashboard();

    if (!isLoaded || dashboardLoading) {
        return (
            <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-purple-600" />
                    <p className="text-sm sm:text-base text-slate-600 font-medium">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (isError || !dashboardData) {
        return (
            <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-2 text-sm sm:text-base">
                        Failed to load dashboard
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-indigo-600 underline text-xs sm:text-sm"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const isPremium = dashboardData.plan === "premium";

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans relative pb-20">
            <div className="max-w-7xl mx-auto space-y-4 p-4 sm:p-6">

                {/* HEADER */}
                <header className="relative overflow-hidden bg-white border border-gray-200 
                p-5 sm:p-6 md:p-8 rounded-2xl shadow-sm 
                flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-6">

                    <div className="z-10 text-center md:text-left">
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight 
                        bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 
                        bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                            Ready to bring your ideas to life, {user?.firstName}?
                        </p>
                    </div>

                    <div className="z-10 flex items-center gap-3 sm:gap-4 bg-white/80 
                    p-3 sm:p-4 rounded-xl border border-slate-100 shadow-lg w-full sm:w-auto justify-between">
                        <div className="text-center">
                            <span className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest block">
                                Total Creations
                            </span>
                            <span className="text-xl w-fit sm:text-3xl font-bold text-slate-900">
                                {dashboardData.total_creations}
                            </span>
                        </div>

                        <button
                            onClick={() => navigate("/#plans")}
                            className="bg-slate-900 w-fit text-white px-4 sm:px-6 py-2.5 sm:py-3 
                            rounded-xl font-bold text-xs sm:text-sm 
                            hover:scale-105 active:scale-95 transition-all 
                            flex items-center gap-2 shadow-lg sm:w-auto justify-center"
                        >
                            {isPremium ? (
                                <>Pro Member</>
                            ) : (
                                <>
                                    <Sparkles size={14} className="text-amber-400" />
                                    Upgrade
                                </>
                            )}
                        </button>
                    </div>

                    <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 
                    bg-indigo-100 rounded-full blur-[80px] -mr-20 -mt-20 opacity-60" />
                </header>

                {/* TOOLS GRID */}
                <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        const isUpcoming = tool.tag === 'Upcoming';

                        return (
                            <button
                                key={tool.title}
                                onClick={() => !isUpcoming && navigate(tool.path)}
                                disabled={isUpcoming}
                                className={`group relative cursor-pointer bg-white border border-slate-200 p-5 sm:p-6 md:p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${isUpcoming
                                    ? 'opacity-60 cursor-not-allowed'
                                    : 'hover:shadow-2xl hover:shadow-indigo-200/40 hover:-translate-y-2'
                                    }`}
                            >
                                <div
                                    className={`${tool.color} text-white 
                                    p-4 sm:p-5 rounded-2xl mb-3 sm:mb-4 
                                    shadow-xl group-hover:rotate-12 transition-transform`}
                                >
                                    <Icon size={20} />
                                </div>

                                <span className="text-xs sm:text-sm font-bold text-slate-700">
                                    {tool.title}
                                </span>

                                {tool.tag && (
                                    <span
                                        className={`absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider
                                        ${tool.tag === 'New' && 'bg-green-100 text-green-700'}
                                        ${tool.tag === 'Popular' && 'bg-indigo-100 text-indigo-700'}
                                        ${tool.tag === 'Upcoming' && 'bg-slate-200 text-slate-600'}`}
                                    >
                                        {tool.tag}
                                    </span>
                                )}

                                {tool.pro && (
                                    <div className="absolute top-2 right-2">
                                        <Zap size={12} className="text-amber-400 fill-amber-400" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </section>


                {/* USAGE + UPGRADE SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                    {/* Usage Analysis */}
                    <div className="lg:col-span-7 bg-white border border-slate-200 
                    rounded-2xl p-6 sm:p-8 shadow-sm">

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <BarChart size={20} />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold">Usage Analysis</h2>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Analytics
                            </span>
                        </div>

                        <div className="space-y-6">
                            {dashboardData.creations_by_type.map((item) => (
                                <div key={item.type}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs sm:text-sm font-bold text-slate-700 capitalize">
                                            {item.type.replace(/-/g, " ")}
                                        </span>
                                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                            {item.count}
                                        </span>
                                    </div>

                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                                        <div
                                            className="h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(item.count / Math.max(dashboardData.total_creations, 1)) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upgrade Card */}
                    <div className="lg:col-span-5 relative group">
                        <div className="absolute inset-0 bg-liear-to-br from-indigo-600 to-violet-900 
                        rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />

                        <div className="relative h-full bg-slate-950 rounded-2xl 
                        p-6 sm:p-8 text-white flex flex-col justify-between 
                        border border-white/10 overflow-hidden">

                            <div>
                                <div className="w-12 h-12 bg-white/10 rounded-xl 
                                flex items-center justify-center mb-6">
                                    <Sparkles className="text-amber-300 w-6 h-6" />
                                </div>

                                <h3 className="text-2xl font-black leading-tight mb-4">
                                    Unlock The <br />
                                    <span className="text-indigo-400">Full Potential</span>
                                </h3>

                                <ul className="space-y-3">
                                    {[
                                        "Unlimited AI Generations",
                                        "Priority AI Processing",
                                        "Early Access to Beta Tools",
                                    ].map((feat) => (
                                        <li key={feat} className="flex items-center gap-3 text-xs text-slate-300">
                                            <div className="p-0.5 bg-indigo-500 rounded-full">
                                                <CheckCircle2 size={10} className="text-white" />
                                            </div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => navigate("/#plans")}
                                className="w-full mt-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 
                                rounded-xl font-bold text-sm transition-all shadow-xl 
                                flex items-center justify-center gap-2 group"
                            >
                                Go Premium Now
                                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FLOATING AI ASSISTANT */}
                <DashboardAssistant />

            </div>
        </div>
    );
};

export default Dashboard;