import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Trash2, LayoutDashboard, ChevronRight, Sparkles } from "lucide-react";
import { AIResponseParser } from "ai-response-parser";
import { useUser } from "../../clerk";
import { useDashboardBot } from "../../hooks/useDashboardBot";
import { DashboardBotForm } from "./DashboardBotForm";

const DashboardAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const { mutateAsync: sendMessage } = useDashboardBot();

    const suggestions = [
        { label: "Check Usage", q: "How many creations have I made?", icon: "📊" },
        { label: "Get Insights", q: "Give me insights on my dashboard", icon: "💡" },
        { label: "Summarize", q: "Summarize my last blog", icon: "📝" },
        { label: "Capabilities", q: "What can you do?", icon: "🤖" },
    ];

    // 1. Eye-Catcher Logic: Show hint after landing
    useEffect(() => {
        const timer = setTimeout(() => setShowHint(true), 2000);
        const hideTimer = setTimeout(() => setShowHint(false), 10000);
        return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleAction = async (text: string) => {
        if (!text.trim() || isTyping) return;
        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setIsTyping(true);

        try {
            const reply = await sendMessage({
                message: text,
                userFullName: user?.fullName || "User",
            });
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Error processing request." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* --- VISUAL TOOLTIP (Eye-Catcher) --- */}
            {!isOpen && showHint && (
                <div
                    onClick={() => setIsOpen(true)}
                    className="mb-4 mr-2 cursor-pointer group animate-in slide-in-from-right-5 fade-in duration-500"
                >
                    <div className="bg-white border border-indigo-100 px-4 py-3 rounded-2xl rounded-br-none shadow-[0_10px_40px_-10px_rgba(79,70,229,0.2)] flex items-center gap-3">
                        <div className="bg-indigo-50 p-1.5 rounded-lg">
                            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight leading-none mb-1">AI Suggestion</p>
                            <p className="text-xs font-semibold text-slate-700">"Summarize my dashboard usage"</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
                            className="ml-2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* --- FLOATING ACTION BUTTON --- */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative group flex items-center cursor-pointer gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-black transition-all hover:scale-105 border border-slate-700 overflow-hidden"
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform"></div>

                    <div className="relative">
                        <LayoutDashboard className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                    </div>
                    <span className="font-semibold text-sm tracking-wide">Assistant<span className="text-indigo-400 ml-1">(Beta)</span></span>
                </button>
            )}

            {/* --- SIDEBAR CHAT WINDOW --- */}
            <div className={`
                fixed top-0 right-0 h-full bg-slate-50 border-l border-slate-200 shadow-2xl transition-all duration-500 ease-in-out flex flex-col
                ${isOpen ? "w-full md:w-[420px]" : "translate-x-full"}
            `}>
                {/* Header */}
                <div className="px-5 py-4 border-b border-indigo-50 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                            <Bot className="w-5 h-5 text-white animate-float-gentle" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-none">Assistant<span className="text-indigo-500 ml-1 text-[10px] uppercase font-black">Beta</span></h3>
                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Dashboard Context Active
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-x-2">
                        <button onClick={() => setMessages([])} className="p-2 hover:bg-slate-100 rounded-lg transition-colors group" title="Clear Chat">
                            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors group">
                            <X className="w-4 h-4 text-slate-500 group-hover:text-slate-900" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                                    <Sparkles className="w-3 h-3" /> New Capability
                                </div>
                                <h4 className="text-2xl font-extrabold text-slate-900 mb-2">
                                    Hello, {user?.firstName || "there"}
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    I have access to your dashboard data. Ask me to summarize your activity or check your usage limits.
                                </p>
                            </div>

                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Insights</p>
                            <div className="grid grid-cols-1 gap-3">
                                {suggestions.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAction(item.q)}
                                        className="flex cursor-pointer items-center justify-between p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all group active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl group-hover:scale-125 transition-transform">{item.icon}</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                                                <p className="text-xs text-slate-500">{item.q}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${m.role === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100"
                                        : "bg-white border border-slate-200 text-black rounded-tl-none"
                                        }`}>
                                        <AIResponseParser content={m.content} textColor={m.role === "user" ? "text-indigo-50" : "text-slate-800"} />
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start animate-pulse">
                                    <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400">Analyzing you database...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Floating Suggestions */}
                {messages.length > 0 && !isTyping && (
                    <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap bg-white/50 border-t border-slate-100">
                        {suggestions.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleAction(item.q)}
                                className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm transition-all shadow-sm"
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-4 bg-white border-t border-slate-100">
                    <DashboardBotForm onSend={handleAction} isPending={isTyping} />
                </div>
            </div>
        </div>
    );
};

export default DashboardAssistant;