import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import CodeEditor from './CodeEditor';
import AIResponse from './AIResponse';
import { wsManager } from '@/lib/websocket';
import { useUser } from '@/context/UserContext';
import LoadingIndicator from './LoadingIndicator';

const ExplainMode: React.FC = () => {
  const [problemStatement, setProblemStatement] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  // Setup WebSocket event listeners
  useEffect(() => {
    const unsubscribeExplain = wsManager.onExplainResponse((data) => {
      setResponse(data.response);
      setIsLoading(false);
    });
    
    const unsubscribeError = wsManager.onError((error) => {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
      setIsLoading(false);
    });
    
    const unsubscribeConnection = wsManager.onConnectionStateChange((connected) => {
      setIsConnected(connected);
    });
    
    return () => {
      unsubscribeExplain();
      unsubscribeError();
      unsubscribeConnection();
    };
  }, [toast]);

  const handleSubmit = () => {
    if (!problemStatement.trim()) {
      toast({
        title: 'Missing Problem Statement',
        description: 'Please enter a problem statement to continue',
        variant: 'destructive'
      });
      return;
    }
    
    if (!solutionCode.trim()) {
      toast({
        title: 'Missing Solution Code',
        description: 'Please enter the code you want explained',
        variant: 'destructive'
      });
      return;
    }
    
    if (!isConnected) {
      toast({
        title: 'Connection Error',
        description: 'WebSocket is not connected. Please try again later',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    // Send explain request via WebSocket
    wsManager.sendExplainRequest(
      problemStatement,
      solutionCode,
      language,
      user?.id
    );
  };

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <Card className="mb-6 bg-darklight shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500"></i>
            Explain Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="problem-statement">Problem Statement</Label>
              <Textarea
                id="problem-statement"
                placeholder="Enter the competitive programming problem statement here..."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="h-32 bg-dark border-gray-700"
              />
            </div>
            
            <div>
              <Label htmlFor="solution-code">Solution Code</Label>
              <CodeEditor
                language={language}
                value={solutionCode}
                onChange={setSolutionCode}
                setLanguage={setLanguage}
              />
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !isConnected}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Explain This Solution
                </>
              )}
            </Button>
            
            {!isConnected && (
              <p className="text-yellow-500 text-sm text-center">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                WebSocket connection lost. Trying to reconnect...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <LoadingIndicator text="AI is analyzing the solution..." />
      ) : response ? (
        <AIResponse response={response} />
      ) : null}
    </div>
  );
};

export default ExplainMode;