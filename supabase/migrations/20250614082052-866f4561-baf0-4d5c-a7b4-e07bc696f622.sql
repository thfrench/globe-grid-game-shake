
-- Remove the foreign key constraint and user_id requirement from high_scores
ALTER TABLE public.high_scores DROP CONSTRAINT IF EXISTS fk_high_scores_user_id;

-- Add a player_name column and make user_id nullable
ALTER TABLE public.high_scores 
ADD COLUMN player_name TEXT,
ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies since we want public access
DROP POLICY IF EXISTS "Users can view their own scores" ON public.high_scores;
DROP POLICY IF EXISTS "Users can create their own scores" ON public.high_scores;
DROP POLICY IF EXISTS "Users can update their own scores" ON public.high_scores;
DROP POLICY IF EXISTS "Users can delete their own scores" ON public.high_scores;

-- Disable RLS to allow public access
ALTER TABLE public.high_scores DISABLE ROW LEVEL SECURITY;
