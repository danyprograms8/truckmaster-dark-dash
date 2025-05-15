
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Calendar, 
  Settings,
  LogOut 
} from 'lucide-react';

type SidebarLink = {
  title: string;
  path: string;
  icon: React.ElementType;
};

const sidebarLinks: SidebarLink[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Loads",
    path: "/loads",
    icon: Truck,
  },
  {
    title: "Drivers",
    path: "/drivers",
    icon: Users,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar: React.FC = () => {
  const currentPath = window.location.pathname;
  
  const handleLogout = () => {
    console.log("Logging out...");
    // Add actual logout logic here
  };

  return (
    <aside className="h-screen w-64 bg-truckmaster-darker flex flex-col">
      <div className="p-5">
        <h1 className="text-2xl font-bold text-white">TruckMaster</h1>
      </div>
      
      <nav className="mt-8 px-4 flex-1">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <li key={link.title}>
                <Link 
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-truckmaster-purple text-white" 
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 bg-truckmaster-darker mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-truckmaster-gray-dark flex items-center justify-center text-white font-medium">
            TU
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Test User</span>
            <span className="text-xs text-gray-400">test@example.com</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-fit px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
