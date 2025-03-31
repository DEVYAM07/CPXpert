import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: { username: string; password: string; email?: string; displayName?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/status'],
    queryFn: async () => {
      try {
        const response = await apiRequest('/api/auth/status');
        return response.authenticated ? response.user : null;
      } catch (error) {
        return null;
      }
    }
  });
  
  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        data: { username, password }
      });
      
      await refetch();
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.username}!`
      });
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  const register = async (userData: { username: string; password: string; email?: string; displayName?: string }) => {
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        data: userData
      });
      
      await refetch();
      
      toast({
        title: 'Registration Successful',
        description: `Welcome, ${response.username}!`
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST'
      });
      
      // Clear user-related queries
      queryClient.invalidateQueries();
      
      toast({
        title: 'Logout Successful',
        description: 'You have been logged out'
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: 'Logout Failed',
        description: 'An error occurred during logout',
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  return (
    <UserContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};