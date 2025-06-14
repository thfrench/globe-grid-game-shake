
-- Update the handle_new_user function to default to NULL display_name (which shows as "Anonymous")
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NULL);
  RETURN NEW;
END;
$$;

-- Update your existing profile to have NULL display_name so it shows "Anonymous"
UPDATE public.profiles 
SET display_name = NULL 
WHERE id = auth.uid();
