
-- Enable Row Level Security on the high_scores table
ALTER TABLE public.high_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read high scores (for global leaderboard)
CREATE POLICY "Anyone can view high scores" 
  ON public.high_scores 
  FOR SELECT 
  USING (true);

-- Allow anyone to insert high scores (for submitting scores)
CREATE POLICY "Anyone can insert high scores" 
  ON public.high_scores 
  FOR INSERT 
  WITH CHECK (true);
