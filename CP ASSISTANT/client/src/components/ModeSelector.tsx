import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModeSelectorProps {
  activeMode: 'debug' | 'explain';
  setActiveMode: (mode: 'debug' | 'explain') => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, setActiveMode }) => {
  return (
    <Card className="bg-darklight shadow-lg overflow-hidden">
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-2 relative">
          {/* Background Indicator */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={false}
            animate={{
              x: activeMode === 'debug' ? 0 : '100%',
              width: '50%',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="h-full w-full bg-primary/20 rounded-md" />
          </motion.div>

          {/* Debug Mode Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setActiveMode('debug')}
                  className={`relative z-10 flex flex-col items-center justify-center py-6 transition-all duration-200 ${
                    activeMode === 'debug' 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  <motion.div
                    animate={{ scale: activeMode === 'debug' ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col items-center"
                  >
                    <i className="fas fa-bug mb-2 text-2xl"></i>
                    <span className="font-medium">Debug Mode</span>
                  </motion.div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fix and optimize your buggy or TLE code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Explain Mode Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setActiveMode('explain')}
                  className={`relative z-10 flex flex-col items-center justify-center py-6 transition-all duration-200 ${
                    activeMode === 'explain' 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  <motion.div
                    animate={{ scale: activeMode === 'explain' ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col items-center"
                  >
                    <i className="fas fa-lightbulb mb-2 text-2xl"></i>
                    <span className="font-medium">Explain Mode</span>
                  </motion.div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Understand algorithms and solution approaches</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeSelector;