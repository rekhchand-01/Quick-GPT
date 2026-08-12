import { Link, useNavigate } from 'react-router-dom';
import { sidebarLinks } from '../../const/sidebarLinks';
import { useUser, UserButton } from '../../clerk';
import { path } from '../../routes/paths';
import type { SidebarLink, SidebarProps } from '../../types';
import { Icon } from '@iconify/react';
import { X } from 'lucide-react';

const Sidebar: React.FC<SidebarProps> = ({ currentPath, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user } = useUser();

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const SidebarItem: React.FC<{ link: SidebarLink }> = ({ link }) => {
        const isActive = currentPath === link.path;
        const { Icon, name, tag } = link;

        return (
            <div
                onClick={() => handleNavigation(link.path)}
                className={`flex items-center space-x-3 p-3 text-sm rounded-md mx-2 mb-1 cursor-pointer transition-colors
        ${isActive
                        ? 'bg-purple-600 text-white font-medium shadow-sm shadow-purple-200'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
            >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
                {tag && (
                    <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {tag}
                    </span>
                )}
            </div>
        );
    };


    return (
        <div
            className={`flex flex-col w-66 h-full bg-white border-r border-gray-200
                transition-transform duration-300 ease-in-out
                fixed inset-y-0 left-0 z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:flex`}
        >
            {/* Logo Section */}
            <div className="flex items-center justify-between py-5 px-4 border-b border-gray-100">
                <Link to={path.HOME} className="flex items-center gap-2 group">
                    <div className="bg-[#9810fa] p-1.5 rounded-md">
                        <Icon icon="lucide:zap" className="text-white text-xl" />
                    </div>
                    <span className="text-gray-900 font-bold text-xl tracking-tight">
                        Quick<span className="text-[#9810fa]">GPT</span>
                    </span>
                </Link>
                <button onClick={onClose} className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto pt-4">
                {sidebarLinks.map((link) => (
                    <SidebarItem key={link.id} link={link} />
                ))}
            </nav>

            {/* --- POLITE SYSTEM NOTE --- */}
            <div className="mx-2 sm:mx-4 mb-4 p-2 sm:p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Icon icon="lucide:message-circle" className="text-sm" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Support</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                    Facing an issue? I'm here to help. Reach out anytime for assistance!                  <a
                        href="mailto:manojbelbase56@gmail.com?subject=QuickGPT%20Feedback&body=Hi%20there%2C%20I%27m%20facing%20an%20issue%20with..."
                        className="block mt-1.5 text-[#9810fa] font-bold hover:underline transition-all"
                    >
                        Email me directly →
                    </a>
                </p>
            </div>

            {/* Footer User Info */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <div className="overflow-hidden">
                        <div className="font-bold text-sm text-gray-900 truncate">
                            {user?.fullName || "Guest User"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;