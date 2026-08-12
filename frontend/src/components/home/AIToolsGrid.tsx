import { useNavigate } from "react-router-dom";
import { AiToolsData } from "../../assets/assets";
import { ArrowUpRight } from "lucide-react";

export const AITools = () => {
    const navigate = useNavigate();

    const handleSubmit = (path: string, isUpcoming?: boolean) => {
        if (isUpcoming) return;
        navigate(path);
    };

    return (
        <section className="relative py-24 bg-[#F8FAFC] overflow-hidden">
            {/* Background accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-24 left-10 w-72 h-72 bg-indigo-100/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-24 right-10 w-72 h-72 bg-purple-100/50 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                        The Toolbox
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        POWERED BY{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                            AI
                        </span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Stop switching between different apps. Generate content, design visuals,
                        and enhance images instantly.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {AiToolsData.map(({ title, description, Icon, path, bg, tag, pro }) => {
                        const isUpcoming = tag === "Upcoming";

                        return (
                            <div
                                key={title}
                                onClick={() => handleSubmit(path, isUpcoming)}
                                className={`group relative ${isUpcoming ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                                    }`}
                            >
                                {/* Hover glow */}
                                <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-100 to-purple-100 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition" />

                                <div className="relative h-full bg-white p-8 rounded-[1.4rem] border border-slate-200 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl overflow-hidden">

                                    {/* Tag */}
                                    {tag && (
                                        <span
                                            className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full
                      ${tag === "New" && "bg-green-500 text-white"}
                      ${tag === "Upcoming" && "bg-slate-400 text-white"}
                      ${tag === "Popular" && "bg-indigo-500 text-white"}`}
                                        >
                                            {tag}
                                        </span>
                                    )}
                                    {pro && (
                                        <span
                                            className={`absolute bottom-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full
                        bg-amber-400 text-white`}
                                        >
                                            Pro
                                        </span>
                                    )}

                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-inner"
                                        style={{
                                            background: `linear-gradient(135deg, ${bg.from}, ${bg.to})`,
                                        }}
                                    >
                                        <Icon className="w-7 h-7 text-white stroke-[1.5]" />
                                    </div>

                                    {/* Title */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {title}
                                        </h3>
                                        {!isUpcoming && (
                                            <div className="p-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        {description}
                                    </p>

                                    {/* Progress line */}
                                    <div className="mt-6 h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-0 group-hover:w-full transition-all duration-700" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* <div className="mt-20 text-center">
                    <p className="text-slate-400 text-sm italic">
                        More tools being added every week...
                    </p>
                </div> */}
            </div>
        </section>
    );
};
