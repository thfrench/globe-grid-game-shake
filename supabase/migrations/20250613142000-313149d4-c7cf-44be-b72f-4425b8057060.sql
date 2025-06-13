
-- Add foreign key constraint to link high_scores.user_id to profiles.id
ALTER TABLE public.high_scores 
ADD CONSTRAINT fk_high_scores_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
