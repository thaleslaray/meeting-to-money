import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface PromptTemplate {
  id: string;
  key: string;
  name: string;
  description: string | null;
  content: string;
  default_content: string;
  updated_at: string;
}

export default function AdminPrompts() {
  const { isAdmin, isLoading } = useIsAdmin();
  const queryClient = useQueryClient();
  const [editedContents, setEditedContents] = useState<Record<string, string>>({});
  
  const { data: prompts } = useQuery({
    queryKey: ['prompt-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as PromptTemplate[];
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from('prompt_templates')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      toast.success('Prompt atualizado com sucesso!');
      setEditedContents({});
    },
    onError: (error) => {
      console.error('Error updating prompt:', error);
      toast.error('Erro ao atualizar prompt');
    },
  });
  
  const restoreMutation = useMutation({
    mutationFn: async ({ id, defaultContent }: { id: string; defaultContent: string }) => {
      const { error } = await supabase
        .from('prompt_templates')
        .update({ content: defaultContent, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      toast.success('Prompt restaurado para o padrão!');
      setEditedContents({});
    },
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const getContent = (prompt: PromptTemplate) => {
    return editedContents[prompt.id] ?? prompt.content;
  };
  
  const handleContentChange = (promptId: string, newContent: string) => {
    setEditedContents(prev => ({ ...prev, [promptId]: newContent }));
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Gerenciar Prompts de IA</h1>
        </div>
        <p className="text-muted-foreground">
          Personalize os prompts utilizados pelas edge functions de análise e geração de planos.
        </p>
      </div>
      
      <Tabs defaultValue={prompts?.[0]?.key} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {prompts?.map(prompt => (
            <TabsTrigger key={prompt.key} value={prompt.key}>
              {prompt.name.replace('Prompt de ', '').replace(' (System)', '')}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {prompts?.map(prompt => (
          <TabsContent key={prompt.key} value={prompt.key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{prompt.name}</CardTitle>
                <CardDescription>{prompt.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={getContent(prompt)}
                  onChange={(e) => handleContentChange(prompt.id, e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Digite o prompt do sistema..."
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateMutation.mutate({ 
                      id: prompt.id, 
                      content: getContent(prompt) 
                    })}
                    disabled={updateMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => restoreMutation.mutate({ 
                      id: prompt.id, 
                      defaultContent: prompt.default_content 
                    })}
                    disabled={restoreMutation.isPending}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restaurar Padrão
                  </Button>
                </div>
                
                {prompt.updated_at && (
                  <p className="text-xs text-muted-foreground">
                    Última atualização: {new Date(prompt.updated_at).toLocaleString('pt-BR')}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
