
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Menu, 
  X,
  Bell
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
};

// Optional grouping of navigation items
type NavGroup = {
  label?: string;
  items: NavItem[];
};

// Define the navigation groups
const navGroups: NavGroup[] = [
  {
    items: [
      { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
    ]
  },
  {
    label: 'Fleet Management',
    items: [
      { path: '/loads', label: 'Loads', icon: <Truck size={22} />, badge: 3 },
      { path: '/drivers', label: 'Drivers', icon: <Users size={22} /> },
    ]
  },
  {
    label: 'Planning',
    items: [
      { path: '/calendar', label: 'Calendar', icon: <Calendar size={22} /> },
      { path: '/settings', label: 'Settings', icon: <Settings size={22} /> },
    ]
  }
];

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log('User logged out');
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="flex lg:hidden items-center absolute left-4 top-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar for desktop and mobile (when open) */}
      <aside
        className={cn(
          "bg-gradient-to-b from-gray-900 to-gray-900/95 min-h-screen h-full transition-all duration-300 z-40 shadow-none",
          isMobileMenuOpen 
            ? "fixed inset-y-0 left-0 w-64" 
            : "hidden lg:block lg:w-64 lg:min-w-64 lg:max-w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-20 px-6">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">TruckMaster</h1>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-6 space-y-8">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {group.label && (
                <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {group.label}
                </h2>
              )}
              
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                  
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800/70 relative group",
                        isActive ? "bg-truckmaster-purple/20 text-white font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-truckmaster-purple before:rounded-r" : ""
                      )
                    }
                  >
                    <span className={`transition-transform duration-200 ${isActive ? 'text-truckmaster-purple scale-105' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    
                    {item.badge && (
                      <span className="ml-auto bg-truckmaster-red text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
              
              {groupIndex < navGroups.length - 1 && (
                <Separator className="my-5 bg-gray-800/50" />
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800/30">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border border-gray-700/50">
                <AvatarFallback className="bg-gray-800 text-sm text-white">TU</AvatarFallback>
              </Avatar>
              
              <div className="overflow-hidden">
                <div className="text-sm font-medium text-white truncate">Test User</div>
                <div className="text-xs text-gray-400 truncate">test@example.com</div>
              </div>
              
              <div className="ml-auto">
                <div className="h-2 w-2 rounded-full bg-green-500 ring-2 ring-green-500/30"></div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              className="flex items-center justify-start text-gray-300 hover:text-white hover:bg-gray-800/80 px-3 py-2 transition-colors duration-200 w-fit" 
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
