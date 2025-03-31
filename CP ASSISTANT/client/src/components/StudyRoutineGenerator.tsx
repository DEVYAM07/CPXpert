import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { apiRequest } from '@/lib/queryClient';
import { useUser } from '@/context/UserContext';
import LoadingIndicator from './LoadingIndicator';

const TOPICS = [
  'Greedy Algorithms',
  'Dynamic Programming',
  'Graph Algorithms',
  'Number Theory',
  'Data Structures',
  'String Algorithms',
  'Geometry',
  'Binary Search',
  'Divide and Conquer',
  'Bit Manipulation'
];

const StudyRoutineGenerator: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentRating, setCurrentRating] = useState(1200);
  const [targetRating, setTargetRating] = useState(1800);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(10);
  const [contestParticipation, setContestParticipation] = useState('weekly');
  
  const createStudyRoutineMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/study-routines', {
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/study-routines/user', user?.id] });
      toast({
        title: 'Study Routine Created',
        description: 'Your personalized study routine has been generated successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to generate study routine. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  const handleTopicToggle = (topic: string) => {
    if (weakTopics.includes(topic)) {
      setWeakTopics(weakTopics.filter(t => t !== topic));
    } else {
      setWeakTopics([...weakTopics, topic]);
    }
  };
  
  const handleSubmit = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to generate a study routine',
        variant: 'destructive'
      });
      return;
    }
    
    createStudyRoutineMutation.mutate({
      userId: user.id,
      answers: {
        currentRating,
        targetRating,
        weakTopics,
        studyHoursPerWeek,
        contestParticipation
      },
      title: `Study Plan: ${currentRating} → ${targetRating}`,
      description: `Personalized study routine to improve from ${currentRating} to ${targetRating} rating`
    });
  };
  
  return (
    <Card className="bg-darklight shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <i className="fas fa-calendar-alt text-indigo-500"></i>
          Generate Study Routine
        </CardTitle>
      </CardHeader>
      <CardContent>
        {createStudyRoutineMutation.isPending ? (
          <LoadingIndicator text="Generating your personalized study routine..." />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Current Rating Range</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[currentRating]}
                  min={0}
                  max={3500}
                  step={100}
                  onValueChange={(value) => setCurrentRating(value[0])}
                  className="flex-1"
                />
                <span className="w-16 text-center font-medium">{currentRating}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Target Rating</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[targetRating]}
                  min={Math.max(currentRating + 100, 100)}
                  max={3500}
                  step={100}
                  onValueChange={(value) => setTargetRating(value[0])}
                  className="flex-1"
                />
                <span className="w-16 text-center font-medium">{targetRating}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Weak Topics (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TOPICS.map(topic => (
                  <div key={topic} className="flex items-center space-x-2">
                    <Checkbox
                      id={`topic-${topic}`}
                      checked={weakTopics.includes(topic)}
                      onCheckedChange={() => handleTopicToggle(topic)}
                    />
                    <label
                      htmlFor={`topic-${topic}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Study Hours Per Week</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[studyHoursPerWeek]}
                  min={1}
                  max={40}
                  step={1}
                  onValueChange={(value) => setStudyHoursPerWeek(value[0])}
                  className="flex-1"
                />
                <span className="w-16 text-center font-medium">{studyHoursPerWeek} hrs</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Contest Participation</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['weekly', 'biweekly', 'monthly'].map(option => (
                  <div
                    key={option}
                    className={`
                      border rounded-md p-3 cursor-pointer text-center
                      ${contestParticipation === option ? 'bg-primary/20 border-primary' : 'border-gray-700'}
                    `}
                    onClick={() => setContestParticipation(option)}
                  >
                    <div className="text-sm font-medium">
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!user}
            >
              <i className="fas fa-wand-magic-sparkles mr-2"></i>
              Generate Study Routine
            </Button>
            
            {!user && (
              <p className="text-yellow-500 text-sm text-center">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Sign in to save your personalized study routine
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyRoutineGenerator;