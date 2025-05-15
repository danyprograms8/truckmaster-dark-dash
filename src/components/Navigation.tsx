
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
  X 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/loads', label: 'Loads', icon: <Truck size={20} /> },
  { path: '/drivers', label: 'Drivers', icon: <Users size={20} /> },
  { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
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
          "bg-gray-900 border-r border-gray-800 min-h-screen h-full transition-all duration-300 z-40",
          isMobileMenuOpen 
            ? "fixed inset-y-0 left-0 w-64" 
            : "hidden lg:block lg:w-64 lg:min-w-64 lg:max-w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">TruckMaster</h1>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
              
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-300 hover:text-white hover:bg-gray-800",
                    isActive && "bg-truckmaster-purple text-white"
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                <span className="text-xs font-medium">TU</span>
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-medium truncate">Test User</div>
                <div className="text-xs text-gray-400 truncate">test@example.com</div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              className="flex items-center justify-start text-gray-300 hover:text-white hover:bg-gray-800 w-full"
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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
