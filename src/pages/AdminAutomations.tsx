import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAutomations } from "@/hooks/useAutomations";
import { useCreateAutomation, CreateAutomationData } from "@/hooks/useCreateAutomation";
import { useUpdateAutomation } from "@/hooks/useUpdateAutomation";
import { useDeleteAutomation } from "@/hooks/useDeleteAutomation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AutomationForm } from "@/components/admin/AutomationForm";
import { Plus, Search, Edit, Trash2, Copy } from "lucide-react";
import { Automation } from "@/hooks/useAutomations";

const AdminAutomations = () => {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: automations, isLoading } = useAutomations();
  const createMutation = useCreateAutomation();
  const updateMutation = useUpdateAutomation();
  const deleteMutation = useDeleteAutomation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (adminLoading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const sectors = [...new Set(automations?.map(a => a.sector) || [])];

  const filteredAutomations = automations?.filter(automation => {
    const matchesSearch = 
      automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSector = sectorFilter === "all" || automation.sector === sectorFilter;
    const matchesImpact = impactFilter === "all" || automation.impact === impactFilter;
    const matchesComplexity = complexityFilter === "all" || automation.complexity === complexityFilter;

    return matchesSearch && matchesSector && matchesImpact && matchesComplexity;
  });

  const handleCreate = (data: CreateAutomationData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleUpdate = (data: CreateAutomationData) => {
    if (editingAutomation) {
      updateMutation.mutate(
        { id: editingAutomation.id, data },
        {
          onSuccess: () => {
            setEditingAutomation(null);
            setIsFormOpen(false);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
        },
      });
    }
  };

  const handleDuplicate = (automation: Automation) => {
    const duplicateData: CreateAutomationData = {
      name: `${automation.name} (Cópia)`,
      description: automation.description,
      sector: automation.sector,
      impact: automation.impact,
      complexity: automation.complexity,
      estimated_days: automation.estimated_days,
      tools: automation.tools,
      keywords: automation.keywords,
    };
    createMutation.mutate(duplicateData);
  };

  const getImpactBadge = (impact: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      low: { label: "Baixo", className: "bg-blue-100 text-blue-800 border-blue-200" },
      medium: { label: "Médio", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      high: { label: "Alto", className: "bg-red-100 text-red-800 border-red-200" },
    };
    return variants[impact] || variants.medium;
  };

  const getComplexityBadge = (complexity: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      easy: { label: "Fácil", className: "bg-green-100 text-green-800 border-green-200" },
      moderate: { label: "Moderada", className: "bg-orange-100 text-orange-800 border-orange-200" },
      advanced: { label: "Avançada", className: "bg-purple-100 text-purple-800 border-purple-200" },
    };
    return variants[complexity] || variants.moderate;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Banco de Automações</h1>
          <p className="text-muted-foreground">
            Gerencie as automações disponíveis para diagnósticos
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{automations?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alto Impacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {automations?.filter(a => a.impact === 'high').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Média de Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {automations?.length 
                  ? Math.round(automations.reduce((acc, a) => acc + a.estimated_days, 0) / automations.length)
                  : 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Setores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sectors.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
            <CardDescription>Encontre automações específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, descrição ou palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={impactFilter} onValueChange={setImpactFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os impactos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os impactos</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>

              <Select value={complexityFilter} onValueChange={setComplexityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as complexidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as complexidades</SelectItem>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="moderate">Moderada</SelectItem>
                  <SelectItem value="advanced">Avançada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="mb-6 flex justify-end">
          <Button onClick={() => { setEditingAutomation(null); setIsFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Automação
          </Button>
        </div>

        {/* Automations List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Carregando automações...
            </CardContent>
          </Card>
        ) : filteredAutomations?.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhuma automação encontrada
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAutomations?.map((automation) => {
              const impactBadge = getImpactBadge(automation.impact);
              const complexityBadge = getComplexityBadge(automation.complexity);
              
              return (
                <Card key={automation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{automation.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">{automation.sector}</Badge>
                          <Badge variant="outline" className={impactBadge.className}>
                            {impactBadge.label}
                          </Badge>
                          <Badge variant="outline" className={complexityBadge.className}>
                            {complexityBadge.label}
                          </Badge>
                          <Badge variant="secondary">{automation.estimated_days} dias</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(automation)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingAutomation(automation);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(automation.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{automation.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Ferramentas: </span>
                        <span className="text-sm text-muted-foreground">{automation.tools}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {automation.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAutomation ? "Editar Automação" : "Nova Automação"}
              </DialogTitle>
              <DialogDescription>
                {editingAutomation 
                  ? "Atualize os dados da automação"
                  : "Adicione uma nova automação ao banco"}
              </DialogDescription>
            </DialogHeader>
            <AutomationForm
              initialData={editingAutomation ? {
                name: editingAutomation.name,
                description: editingAutomation.description,
                sector: editingAutomation.sector,
                impact: editingAutomation.impact,
                complexity: editingAutomation.complexity,
                estimated_days: editingAutomation.estimated_days,
                tools: editingAutomation.tools,
                keywords: editingAutomation.keywords,
              } : undefined}
              onSubmit={editingAutomation ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingAutomation(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta automação? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default AdminAutomations;
