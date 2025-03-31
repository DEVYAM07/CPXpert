import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const [location] = useLocation();
  const { user, logout } = useUser();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <header className="py-4 border-b border-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
              CP Assist
            </a>
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link href="/">
              <a className={`hover:text-primary transition-colors ${
                location === '/' ? 'text-primary' : 'text-gray-300'
              }`}>
                Home
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={`hover:text-primary transition-colors ${
                location === '/dashboard' ? 'text-primary' : 'text-gray-300'
              }`}>
                Dashboard
              </a>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <span>{user.displayName || user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <a className="w-full cursor-pointer">
                      <i className="fas fa-laptop-code mr-2"></i>
                      Dashboard
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="w-full cursor-pointer">
                      <i className="fas fa-user mr-2"></i>
                      Profile
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link href="/signin">
                <a>Sign in</a>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;