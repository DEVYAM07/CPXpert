import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { wsManager } from '@/lib/websocket';
import LoadingIndicator from './LoadingIndicator';
import { useUser } from '@/context/UserContext';

interface CodeforcesProfileProps {
  userId: number;
}

const CodeforcesProfile: React.FC<CodeforcesProfileProps> = ({ userId }) => {
  const [handle, setHandle] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [searchedProfile, setSearchedProfile] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [isRealTimeUpdatesActive, setIsRealTimeUpdatesActive] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Fetch existing profile
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['/api/codeforces-profiles/user', userId],
    queryFn: async () => {
      try {
        const response = await apiRequest(`/api/codeforces-profiles/user/${userId}`);
        return response;
      } catch (error) {
        return null;
      }
    },
    refetchInterval: 60000  // Refresh every minute
  });
  
  const isLinked = !!profile;
  
  // Setup WebSocket event listener for profile updates
  useEffect(() => {
    const unsubscribe = wsManager.onCodeforcesProfileUpdate((data) => {
      if (data.userId === userId) {
        console.log('Received profile update via WebSocket, refetching...');
        refetch();
      }
    });
    
    return () => {
      unsubscribe();
      // Stop real-time updates when component unmounts
      if (isRealTimeUpdatesActive) {
        wsManager.stopCodeforcesProfileUpdates(userId);
      }
    };
  }, [userId, refetch, isRealTimeUpdatesActive]);
  
  // Search for a Codeforces profile
  const searchCodeforcesProfile = async () => {
    if (!handle) {
      toast({
        title: 'Error',
        description: 'Please enter a Codeforces handle',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSearching(true);
    setIsError(false);
    setSearchedProfile(null);
    
    try {
      console.log(`Searching Codeforces profile: ${handle}`);
      const response = await apiRequest(`/api/codeforces/search?handle=${handle}`);
      console.log('CF profile search response:', response);
      setSearchedProfile(response);
    } catch (error) {
      console.error('Error searching Codeforces profile:', error);
      setIsError(true);
      toast({
        title: 'Search Failed',
        description: 'Could not find Codeforces profile',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Link a Codeforces profile to user account
  const linkCodeforcesProfile = async () => {
    if (!handle && !searchedProfile) {
      toast({
        title: 'Error',
        description: 'Please enter a Codeforces handle or search for a profile first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLinking(true);
    const profileHandle = searchedProfile ? searchedProfile.handle : handle;
    
    try {
      console.log(`Linking Codeforces profile: ${profileHandle} for user ${userId}`);
      
      const response = await apiRequest('/api/codeforces-profiles', {
        method: 'POST',
        data: {
          userId,
          handle: profileHandle
        }
      });
      
      console.log('CF profile link response:', response);
      refetch();
      
      toast({
        title: 'Profile Linked',
        description: `Successfully linked Codeforces profile: ${profileHandle}`,
      });
      
      // Start real-time updates
      wsManager.startCodeforcesProfileUpdates(userId, profileHandle);
      setIsRealTimeUpdatesActive(true);
      
      // Clear search state
      setSearchedProfile(null);
      setHandle('');
    } catch (error) {
      console.error('Error linking Codeforces profile:', error);
      toast({
        title: 'Link Failed',
        description: 'Could not link Codeforces profile',
        variant: 'destructive'
      });
    } finally {
      setIsLinking(false);
    }
  };
  
  // Add a toggle button for real-time updates in the profile view
  const toggleRealTimeUpdates = () => {
    if (isRealTimeUpdatesActive) {
      wsManager.stopCodeforcesProfileUpdates(userId);
      setIsRealTimeUpdatesActive(false);
      toast({
        title: 'Real-time updates disabled',
        description: 'Codeforces profile updates will no longer be received in real-time'
      });
    } else {
      if (profile) {
        wsManager.startCodeforcesProfileUpdates(userId, profile.handle);
        setIsRealTimeUpdatesActive(true);
        toast({
          title: 'Real-time updates enabled',
          description: 'Your Codeforces profile will be updated in real-time'
        });
      }
    }
  };
  
  // ... rest of component rendering logic ...
};

export default CodeforcesProfile;