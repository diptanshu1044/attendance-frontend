import React from 'react';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left section */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-2"
          >
            <Menu size={20} />
          </Button>
          
          <div className="hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                leftIcon={<Search size={16} />}
                className="w-96"
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Search for mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
          >
            <Search size={20} />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;