import { useNavigate } from 'react-router-dom';
import { path } from '../../routes/paths';
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react';

export const Hero = () => {
    const navigate = useNavigate();

    const handleStartCreating = () => {
        navigate(path.DASHBOARD);
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAFBFF]">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-100/60 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-purple-100/60 blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/80 blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center px-6 pt-24 pb-12">

                {/* 2. Animated Announcement Badge */}
                <div className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm mb-10 transition-all hover:border-indigo-300 cursor-pointer">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />


                    <span onClick={() => navigate(path.CODE_GENERATOR)} className="text-xs font-semibold text-slate-600 tracking-wide">
                        New: AI Code Generation is here
                    </span>
                    <ArrowRight size={14} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* 3. The "Power" Headline */}
                <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] max-w-6xl">
                    Your AI-powered <br />
                    <span className="relative inline-block">
                        <span className="relative z-10 bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            creative studio
                        </span>
                        {/* Abstract underline decoration */}
                        <div className="absolute bottom-2 left-0 w-full h-3 bg-indigo-100 -z-10 rounded-full opacity-60" />
                    </span>
                </h1>

                {/* 4. Elegant Subheading */}
                <p className="mt-8 text-slate-600 text-center text-lg md:text-xl max-w-2xl leading-relaxed font-normal">
                    One platform for all your AI needs. Generate articles, summarize text, create code, design custom images, and swap backgrounds in seconds. Create and share your content instantly.
                </p>

                {/* 5. High-Contrast Action Area */}
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <button
                        onClick={handleStartCreating}
                        className="w-full sm:w-auto px-8 cursor-pointer py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Start Creating Free <Sparkles size={18} />
                    </button>

                    <button onClick={() => navigate("https://www.youtube.com/@manojbelbasay")} className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border cursor-pointer border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <PlayCircle size={18} className="text-indigo-600" />
                        Watch Demo
                    </button>
                </div>

                {/* 6. Social Proof / User Avatars */}
                <div className="mt-16 flex flex-col items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <img
                                key={i}
                                className="h-10 w-10 rounded-full border-4 border-white object-cover shadow-sm ring-1 ring-slate-100"
                                src={`https://i.pravatar.cc/100?img=${i + 15}`}
                                alt="User"
                            />
                        ))}
                        <div className="h-10 w-10 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 ring-1 ring-slate-100">
                            +2k
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                        Loved by <span className="text-slate-900 font-bold">12,000+</span> modern teams
                    </p>
                </div>

            </div>
        </div>
    );
};