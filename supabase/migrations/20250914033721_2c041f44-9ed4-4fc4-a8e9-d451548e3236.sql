-- Create custom types
CREATE TYPE device_type AS ENUM ('mobile', 'laptop');
CREATE TYPE device_status AS ENUM ('under_repair', 'repaired', 'not_repaired');
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create shops table
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brands table  
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  device_type device_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create devices table
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id),
  model TEXT NOT NULL,
  repair_date DATE NOT NULL DEFAULT CURRENT_DATE,
  issue_description TEXT,
  repair_cost DECIMAL(10,2) DEFAULT 0,
  technician_notes TEXT,
  status device_status NOT NULL DEFAULT 'under_repair',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notes table for voice/text analysis
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'text',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Allow authenticated users to manage shops" ON public.shops FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage brands" ON public.brands FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage devices" ON public.devices FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage payments" ON public.payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage notes" ON public.notes FOR ALL TO authenticated USING (true);

-- Profile policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert initial mobile brands
INSERT INTO public.brands (name, device_type) VALUES
('ALCATEL', 'mobile'), ('ASUS', 'mobile'), ('BENCO', 'mobile'), ('BLACKBERRY', 'mobile'),
('CONDOR', 'mobile'), ('COOLPAD', 'mobile'), ('ELEPHONE', 'mobile'), ('GIONEE', 'mobile'),
('GOOGLE PIXEL', 'mobile'), ('HOTWAV', 'mobile'), ('HTC', 'mobile'), ('HUAWEI', 'mobile'),
('INFINIX', 'mobile'), ('IPAD', 'mobile'), ('IPHONE', 'mobile'), ('ITEL', 'mobile'),
('INFOCUS', 'mobile'), ('JIO', 'mobile'), ('LAVA', 'mobile'), ('LENOVO', 'mobile'),
('LG', 'mobile'), ('MAXTRON', 'mobile'), ('MEIZU', 'mobile'), ('MICROMAX', 'mobile'),
('MICROSOFT', 'mobile'), ('MOTOROLA', 'mobile'), ('NEFFOS', 'mobile'), ('NOKIA', 'mobile'),
('NOTHING PHONE', 'mobile'), ('ONEPLUS', 'mobile'), ('OPPO', 'mobile'), ('PRESTIGIO', 'mobile'),
('RAZER', 'mobile'), ('REALME', 'mobile'), ('SAMSUNG', 'mobile'), ('SHARP', 'mobile'),
('SONY', 'mobile'), ('TECNO', 'mobile'), ('TEXET', 'mobile'), ('UMIDIGI', 'mobile'),
('VESTEL', 'mobile'), ('VIVO', 'mobile'), ('XIAOMI', 'mobile'), ('XOLO', 'mobile'), ('ZTE', 'mobile');

-- Insert initial laptop brands
INSERT INTO public.brands (name, device_type) VALUES
('Acer', 'laptop'), ('Apple', 'laptop'), ('ASUS', 'laptop'), ('Dell', 'laptop'),
('HP', 'laptop'), ('Lenovo', 'laptop'), ('Microsoft', 'laptop'), ('Razer', 'laptop'),
('Samsung', 'laptop'), ('MSI', 'laptop'), ('Gigabyte', 'laptop'), ('Toshiba', 'laptop'),
('Sony', 'laptop'), ('Alienware', 'laptop'), ('Framework', 'laptop'), ('Surface', 'laptop');