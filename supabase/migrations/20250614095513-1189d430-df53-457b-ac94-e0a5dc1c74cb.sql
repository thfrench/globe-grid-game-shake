
-- Add foreign key relationship between high_scores and profiles
ALTER TABLE public.high_scores 
ADD CONSTRAINT fk_high_scores_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
