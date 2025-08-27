-- Create a test admin user for verification
INSERT INTO public.admin_users (id, role) 
VALUES ('22222222-2222-2222-2222-222222222222', 'admin') 
ON CONFLICT (id) DO NOTHING;