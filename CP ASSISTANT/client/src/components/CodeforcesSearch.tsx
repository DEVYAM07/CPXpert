import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getCodeforcesRankColor } from '@/lib/utils';
import LoadingIndicator from './LoadingIndicator';

const CodeforcesSearch: React.FC = () => {
  const [handle, setHandle] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  
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
    setProfile(null);
    
    try {
      console.log(`Searching Codeforces profile: ${handle}`);
      const response = await apiRequest(`/api/codeforces/search?handle=${handle}`);
      console.log('CF profile search response:', response);
      setProfile(response);
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
  
  return (
    <Card className="bg-darklight">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Codeforces Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Enter Codeforces handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchCodeforcesProfile()}
              />
            </div>
            <Button
              onClick={searchCodeforcesProfile}
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {isSearching ? (
            <LoadingIndicator text="Searching Codeforces profile..." />
          ) : isError ? (
            <div className="text-center py-4">
              <i className="fas fa-exclamation-circle text-3xl text-red-500 mb-2"></i>
              <p className="text-red-400">Could not find Codeforces profile</p>
            </div>
          ) : profile ? (
            <div className="bg-dark rounded-lg p-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="font-mono text-2xl font-bold">
                  <a 
                    href={`https://codeforces.com/profile/${profile.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {profile.handle}
                  </a>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Current Rating</p>
                  <p className={`text-xl font-bold ${getCodeforcesRankColor(profile.rank)}`}>
                    {profile.rating || 'Unrated'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Max Rating</p>
                  <p className={`text-xl font-bold ${getCodeforcesRankColor(profile.maxRank)}`}>
                    {profile.maxRating || 'Unrated'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Rank</p>
                  <p className={`font-medium ${getCodeforcesRankColor(profile.rank)}`}>
                    {profile.rank || 'Unrated'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Problems Solved</p>
                  <p className="font-medium">{profile.problemsSolved || 0}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <a
                  href={`https://codeforces.com/profile/${profile.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center"
                >
                  View Full Profile
                  <i className="fas fa-external-link ml-1"></i>
                </a>
              </div>
            </div>
          ) : null}
          
          <p className="text-xs text-gray-400">
            <i className="fas fa-info-circle mr-1"></i>
            Sign in to link your Codeforces profile for personalized recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeforcesSearch;