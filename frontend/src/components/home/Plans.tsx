import { PricingTable } from "../../clerk";
import { Zap, ShieldCheck, Sparkles, CheckCircle } from "lucide-react";

const Plans = () => {
    return (
        <section className="relative py-20 lg:py-32 bg-[#FAFBFF] overflow-hidden flex flex-col items-center justify-center">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-br from-indigo-100/40 to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-purple-100/40 to-transparent blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] px-6 lg:px-12">

                {/* 2. Content Row: Title + Table */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">

                    {/* Left Column: Text Content (Stacks on top on mobile) */}
                    <div className="w-full lg:w-1/3 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                            <Sparkles size={14} className="text-indigo-600" />
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Pricing Plans</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                            Simple <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Fair Pricing.</span>
                        </h2>

                        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto lg:mx-0">
                            Choose the plan that fits your ambition. No hidden fees,
                            cancel your subscription at any time.
                        </p>

                        {/* Feature List (Unique to Row Layout) */}
                        <div className="hidden lg:flex flex-col gap-4 mt-10">
                            {[
                                { icon: ShieldCheck, text: "Secure payment processing", color: "text-green-500" },
                                { icon: Zap, text: "Instant access to all tools", color: "text-amber-500" },

                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-700 font-semibold group">
                                    <div className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform`}>
                                        <item.icon size={18} className={item.color} />
                                    </div>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Pricing Table */}
                    <div className="w-full lg:w-2/3 relative">

                        <PricingTable />
                    </div>
                </div>

                {/* 3. Mobile Social Proof / Trust (Only visible on small screens) */}
                <div className="mt-12 flex lg:hidden justify-center items-center gap-6 opacity-50 text-xs font-bold uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><ShieldCheck size={14} /> Secure</span>
                    <span className="flex items-center gap-1"><Zap size={14} /> Fast</span>
                    <span className="flex items-center gap-1"><CheckCircle size={14} /> Verified</span>
                </div>

            </div>
        </section>
    );
};

export default Plans;