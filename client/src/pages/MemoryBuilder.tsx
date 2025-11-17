import { useState } from 'react';
import { Plus, Image, Users, MapPin, Heart, Book, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BottomNav } from '@/components/BottomNav';
import { EmptyState } from '@/components/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaUploader } from '@/components/MediaUploader';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Memory } from '@shared/schema';

const memoryCategories = [
  { value: 'life_story', label: 'Life Story', icon: Book },
  { value: 'photo', label: 'Photos', icon: Image },
  { value: 'people', label: 'People', icon: Users },
  { value: 'places', label: 'Places', icon: MapPin },
  { value: 'routine', label: 'Routine', icon: Heart },
  { value: 'sensitive', label: 'Sensitive Topics', icon: AlertTriangle },
];

export default function MemoryBuilder() {
  const { currentPatient } = usePatient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('life_story');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: activeTab,
    mediaFiles: [] as File[],
  });

  const { data: memories, isLoading } = useQuery<Memory[]>({
    queryKey: currentPatient ? [`/api/memories/${currentPatient.id}`] : [],
    enabled: !!currentPatient,
  });

  const createMemoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest<Memory>('POST', '/api/memories', data);
    },
    onSuccess: () => {
      if (currentPatient) {
        queryClient.invalidateQueries({ queryKey: [`/api/memories/${currentPatient.id}`] });
      }
      toast({
        title: 'Memory added!',
        description: 'Your memory has been saved successfully.',
      });
      setIsDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        content: '',
        category: activeTab,
        mediaFiles: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient || !formData.title) {
      toast({
        title: 'Missing information',
        description: 'Please provide at least a title for the memory.',
        variant: 'destructive',
      });
      return;
    }

    createMemoryMutation.mutate({
      patientId: currentPatient.id,
      type: formData.category,
      title: formData.title,
      description: formData.description,
      content: formData.content,
      category: formData.category,
      mediaUrls: [],
    });
  };

  const filteredMemories = memories?.filter((m) => m.type === activeTab) || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Memory Builder</h1>
            <p className="text-muted-foreground mt-1">Preserve precious moments</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl h-12" data-testid="button-add-memory">
                <Plus className="h-4 w-4 mr-2" />
                Add Memory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Memory</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {memoryCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Give this memory a title"
                    className="h-12 rounded-xl"
                    data-testid="input-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this memory..."
                    className="rounded-xl min-h-24"
                    data-testid="input-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Details</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Add more details about this memory..."
                    className="rounded-xl min-h-32"
                    data-testid="input-content"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Media (Optional)</Label>
                  <MediaUploader
                    onUpload={(files) => setFormData({ ...formData, mediaFiles: files })}
                    maxFiles={5}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-xl"
                    disabled={createMemoryMutation.isPending}
                    data-testid="button-save-memory"
                  >
                    {createMemoryMutation.isPending ? 'Saving...' : 'Save Memory'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted/50 rounded-xl">
            {memoryCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-lg data-[state=active]:bg-background py-3"
                  data-testid={`tab-${cat.value}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {memoryCategories.map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="rounded-xl">
                      <CardContent className="p-4 h-24" />
                    </Card>
                  ))}
                </div>
              ) : filteredMemories.length > 0 ? (
                <div className="space-y-3">
                  {filteredMemories.map((memory) => (
                    <Card key={memory.id} className="rounded-xl hover-elevate" data-testid={`memory-card-${memory.id}`}>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground mb-2">{memory.title}</h3>
                        {memory.description && (
                          <p className="text-sm text-muted-foreground mb-3">{memory.description}</p>
                        )}
                        {memory.content && (
                          <p className="text-sm text-foreground">{memory.content}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={cat.icon}
                  title={`No ${cat.label} Yet`}
                  description={`Start building memories in the ${cat.label.toLowerCase()} category.`}
                  action={{
                    label: 'Add First Memory',
                    onClick: () => {
                      setFormData({ ...formData, category: cat.value });
                      setIsDialogOpen(true);
                    },
                  }}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
