-- Add quality_score column to diagnostics table
ALTER TABLE public.diagnostics 
ADD COLUMN quality_score INTEGER DEFAULT NULL;

-- Add constraint to ensure score is between 0-100
ALTER TABLE public.diagnostics 
ADD CONSTRAINT check_quality_score 
CHECK (quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 100));

-- Add index for quality score queries
CREATE INDEX idx_diagnostics_quality_score 
ON public.diagnostics(quality_score);

COMMENT ON COLUMN public.diagnostics.quality_score IS 'Score de qualidade do plano e precificação (0-100)';