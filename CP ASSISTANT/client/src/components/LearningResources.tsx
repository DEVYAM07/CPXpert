import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import LoadingIndicator from './LoadingIndicator';

interface LearningResource {
  id: number;
  title: string;
  description: string;
  url: string;
  resourceType: string;
  tags: string[];
  difficulty: string;
  source: string;
}

const LearningResources: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/learning-resources'],
    queryFn: async () => {
      const response = await apiRequest('/api/learning-resources');
      return response;
    }
  });
  
  const getUniqueValues = (field: 'tags' | 'difficulty' | 'resourceType'): string[] => {
    if (!resources) return [];
    
    if (field === 'tags') {
      const allTags = resources.flatMap((resource: LearningResource) => resource.tags);
      return [...new Set(allTags)];
    }
    
    const values = resources.map((resource: LearningResource) => 
      field === 'difficulty' ? resource.difficulty : resource.resourceType
    );
    return [...new Set(values)].filter(Boolean);
  };
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const filteredResources = resources ? resources.filter((resource: LearningResource) => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => resource.tags.includes(tag));
    
    const matchesDifficulty = !selectedDifficulty || 
      resource.difficulty === selectedDifficulty;
    
    const matchesType = !selectedType || 
      resource.resourceType === selectedType;
    
    return matchesTags && matchesDifficulty && matchesType;
  }) : [];
  
  const getResourceIcon = (type: string): string => {
    switch (type) {
      case 'video': return 'play-circle';
      case 'tutorial': return 'book-open';
      case 'blog': return 'rss';
      case 'editorial': return 'file-text';
      case 'course': return 'graduation-cap';
      case 'book': return 'book';
      default: return 'link';
    }
  };
  
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-blue-500/20 text-blue-400';
      case 'advanced': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const renderFilters = () => (
    <div className="space-y-4 mb-6">
      <div>
        <h4 className="text-sm font-medium mb-2">Topics</h4>
        <div className="flex flex-wrap gap-2">
          {getUniqueValues('tags').map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Difficulty</h4>
          <div className="flex gap-2">
            {getUniqueValues('difficulty').map(difficulty => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(
                  selectedDifficulty === difficulty ? null : difficulty
                )}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Type</h4>
          <div className="flex gap-2">
            {getUniqueValues('resourceType').map(type => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(
                  selectedType === type ? null : type
                )}
              >
                <i className={`fas fa-${getResourceIcon(type)} mr-1`}></i>
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {(selectedTags.length > 0 || selectedDifficulty || selectedType) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedTags([]);
            setSelectedDifficulty(null);
            setSelectedType(null);
          }}
        >
          <i className="fas fa-times mr-1"></i>
          Clear Filters
        </Button>
      )}
    </div>
  );
  
  const renderResources = () => {
    if (filteredResources.length === 0) {
      return (
        <div className="text-center p-8">
          <i className="fas fa-filter-circle-xmark text-4xl text-gray-500 mb-2"></i>
          <p className="text-gray-400">No resources match your filters</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource: LearningResource) => (
          <Card key={resource.id} className="bg-dark hover:bg-dark/70 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-3 rounded-md">
                  <i className={`fas fa-${getResourceIcon(resource.resourceType)} text-primary text-xl`}></i>
                </div>
                
                <div className="flex-1">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-lg hover:text-primary transition-colors"
                  >
                    {resource.title}
                  </a>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {resource.source && (
                      <Badge variant="secondary">
                        {resource.source}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-2">{resource.description}</p>
                  
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary mt-3 hover:underline"
                  >
                    View Resource
                    <i className="fas fa-external-link ml-1"></i>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="bg-darklight shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <i className="fas fa-graduation-cap text-green-500"></i>
          Learning Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingIndicator text="Loading learning resources..." />
        ) : (
          <>
            {renderFilters()}
            {renderResources()}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningResources;