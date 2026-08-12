import { Link } from "react-router-dom";
import { path } from "../../routes/paths";
import { useClerk, UserButton, useUser } from '../../clerk';
import { Icon } from '@iconify/react';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();

    return (
        <nav className="fixed top-0 w-full z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 md:px-12">
                <Link to={path.HOME} className="flex items-center gap-2 group">
                    <div className="bg-[#9810fa] p-1.5 rounded-md">
                        <Icon icon="lucide:zap" className="text-white text-xl" />
                    </div>
                    <span className="text-gray-900 font-bold text-2xl tracking-tight">
                        Quick<span className="text-[#9810fa]">GPT</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to={path.DASHBOARD} className="hidden cursor-pointer md:block text-sm font-medium text-gray-600 hover:text-[#9810fa]">Dashboard</Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    ) : (
                        <button
                            onClick={() => openSignIn()}
                            className="bg-[#9810fa] cursor-pointer text-white px-6 py-2 text-sm font-semibold rounded-md hover:bg-[#7b0cd4] transition-all"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;