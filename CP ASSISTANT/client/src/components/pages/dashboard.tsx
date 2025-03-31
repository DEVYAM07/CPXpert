import React from 'react';
import { useUser } from '@/context/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ModeSelector from '@/components/ModeSelector';
import DebugMode from '@/components/DebugMode';
import ExplainMode from '@/components/ExplainMode';
import CodeforcesProfile from '@/components/CodeforcesProfile';
import CodeforcesSearch from '@/components/CodeforcesSearch';
import StudyRoutineGenerator from '@/components/StudyRoutineGenerator';
import ProblemRecommendations from '@/components/ProblemRecommendations';
import LearningResources from '@/components/LearningResources';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [activeMode, setActiveMode] = React.useState<'debug' | 'explain'>('debug');
  
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
          CP Assist
        </span>
        <span className="text-lg ml-2 opacity-75">Competitive Programming Assistant</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {user && (
            <Card className="bg-darklight">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Welcome</CardTitle>
                <CardDescription>
                  {user.displayName || user.username}
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          
          <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
          
          {user && (
            <CodeforcesProfile userId={user.id} />
          )}
          
          {!user && (
            <CodeforcesSearch />
          )}
          
          <Card className="bg-darklight">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-500 mt-1"></i>
                  <span>Use Debug Mode when your code has errors or TLE issues</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-500 mt-1"></i>
                  <span>Use Explain Mode to understand working solutions</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-500 mt-1"></i>
                  <span>Link your Codeforces profile for personalized recommendations</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-green-500 mt-1"></i>
                  <span>Create a study routine to improve systematically</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Modes */}
          <div>
            {activeMode === 'debug' ? <DebugMode /> : <ExplainMode />}
          </div>
          
          {/* Tabs for additional features */}
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="recommendations">
                <i className="fas fa-code-branch mr-2"></i>
                Problem Recommendations
              </TabsTrigger>
              <TabsTrigger value="study">
                <i className="fas fa-calendar-alt mr-2"></i>
                Study Planner
              </TabsTrigger>
              <TabsTrigger value="resources">
                <i className="fas fa-graduation-cap mr-2"></i>
                Learning Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendations">
              <ProblemRecommendations />
            </TabsContent>
            
            <TabsContent value="study">
              <StudyRoutineGenerator />
            </TabsContent>
            
            <TabsContent value="resources">
              <LearningResources />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;