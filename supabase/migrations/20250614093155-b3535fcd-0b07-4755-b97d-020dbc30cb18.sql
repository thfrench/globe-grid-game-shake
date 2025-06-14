
-- Remove the foreign key constraint that's preventing session IDs from being stored
ALTER TABLE public.high_scores DROP CONSTRAINT IF EXISTS high_scores_user_id_fkey;

-- Also ensure RLS is disabled so anyone can insert scores
ALTER TABLE public.high_scores DISABLE ROW LEVEL SECURITY;
