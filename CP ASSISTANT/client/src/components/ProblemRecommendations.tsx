import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useUser } from '@/context/UserContext';
import LoadingIndicator from './LoadingIndicator';

interface Problem {
  id: number;
  problemId: string;
  problemTitle: string;
  problemUrl: string;
  difficulty: number;
  tags: string[];
  source: string;
  status: string;
}

const ProblemRecommendations: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: problems, isLoading } = useQuery({
    queryKey: ['/api/problem-recommendations/user', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await apiRequest(`/api/problem-recommendations/user/${user.id}`);
        return response;
      } catch (error) {
        console.error('Error fetching problem recommendations:', error);
        return [];
      }
    },
    enabled: !!user
  });
  
  const { data: codeforcesProfile } = useQuery({
    queryKey: ['/api/codeforces-profiles/user', user?.id],
    queryFn: async () => {
      if (!user) return null;
      try {
        const response = await apiRequest(`/api/codeforces-profiles/user/${user.id}`);
        return response;
      } catch (error) {
        return null;
      }
    },
    enabled: !!user
  });
  
  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      if (!user || !codeforcesProfile) {
        throw new Error('User or Codeforces profile not found');
      }
      return apiRequest('/api/problem-recommendations/generate', {
        method: 'POST',
        data: {
          userId: user.id,
          handle: codeforcesProfile.handle,
          count: 5
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/problem-recommendations/user', user?.id] });
      toast({
        title: 'Recommendations Generated',
        description: 'New problem recommendations have been generated based on your profile'
      });
      setIsGenerating(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations. Please try again.',
        variant: 'destructive'
      });
      setIsGenerating(false);
    }
  });
  
  const generateRecommendations = () => {
    if (!codeforcesProfile) {
      toast({
        title: 'Codeforces Profile Required',
        description: 'Please link your Codeforces profile first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    generateRecommendationsMutation.mutate();
  };
  
  const updateProblemStatus = async (problemId: number, status: string) => {
    if (!user) return;
    
    try {
      await apiRequest(`/api/problem-recommendations/${problemId}`, {
        method: 'PATCH',
        data: {
          status,
          solvedOn: status === 'solved' ? new Date().toISOString() : null
        }
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/problem-recommendations/user', user?.id] });
      
      toast({
        title: 'Status Updated',
        description: `Problem marked as ${status}`
      });
    } catch (error) {
      console.error('Error updating problem status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update problem status',
        variant: 'destructive'
      });
    }
  };
  
  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty < 1200) return 'text-green-400';
    if (difficulty < 1600) return 'text-teal-400';
    if (difficulty < 2000) return 'text-blue-400';
    if (difficulty < 2400) return 'text-purple-400';
    if (difficulty < 2800) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const renderProblems = () => {
    if (!problems || problems.length === 0) {
      return (
        <div className="text-center p-8">
          <i className="fas fa-code-branch text-4xl text-gray-500 mb-2"></i>
          <p className="text-gray-400">No problem recommendations yet</p>
          {codeforcesProfile && (
            <Button
              onClick={generateRecommendations}
              className="mt-4"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles mr-2"></i>
                  Generate Recommendations
                </>
              )}
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {problems.map((problem: Problem) => (
          <div
            key={problem.id}
            className="border border-gray-700 rounded-lg p-4 hover:bg-dark/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <a
                  href={problem.problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-primary transition-colors"
                >
                  <span className="font-mono">{problem.problemId}</span> - {problem.problemTitle}
                </a>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                  {problem.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 3 && (
                    <Badge variant="outline">+{problem.tags.length - 3}</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-2 sm:mt-0">
                {problem.status !== 'solved' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-400 hover:text-green-500"
                    onClick={() => updateProblemStatus(problem.id, 'solved')}
                  >
                    <i className="fas fa-check mr-1"></i>
                    Solved
                  </Button>
                )}
                {problem.status !== 'attempted' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-yellow-400 hover:text-yellow-500"
                    onClick={() => updateProblemStatus(problem.id, 'attempted')}
                  >
                    <i className="fas fa-clock mr-1"></i>
                    Attempted
                  </Button>
                )}
                {problem.status !== 'favorited' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-pink-400 hover:text-pink-500"
                    onClick={() => updateProblemStatus(problem.id, 'favorited')}
                  >
                    <i className="fas fa-heart mr-1"></i>
                    Favorite
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-center mt-6">
          <Button
            onClick={generateRecommendations}
            disabled={isGenerating || !codeforcesProfile}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-sync mr-2"></i>
                Get New Recommendations
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="bg-darklight shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <i className="fas fa-laptop-code text-blue-500"></i>
          Problem Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!user ? (
          <div className="text-center p-8">
            <i className="fas fa-user-lock text-4xl text-gray-500 mb-2"></i>
            <p className="text-gray-400">Sign in to get personalized problem recommendations</p>
          </div>
        ) : !codeforcesProfile ? (
          <div className="text-center p-8">
            <i className="fas fa-link-slash text-4xl text-gray-500 mb-2"></i>
            <p className="text-gray-400">Link your Codeforces profile to get problem recommendations</p>
          </div>
        ) : isLoading ? (
          <LoadingIndicator text="Loading recommendations..." />
        ) : (
          renderProblems()
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemRecommendations;