
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

export function NavBar() {
  const [logo, setLogo] = useState<string>(() => localStorage.getItem('navLogo') || '/placeholder.svg');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Ensure the image is loaded before updating state
      await new Promise<void>((resolve, reject) => {
        const img = document.createElement('img');
        img.src = publicUrl;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      setLogo(publicUrl);
      localStorage.setItem('navLogo', publicUrl);

      toast({
        title: "Logo updated",
        description: "Your navigation logo has been successfully updated.",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload the logo. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="relative group w-12 h-12">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain rounded-md"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="h-4 w-4" />
              </label>
            </div>
            <h1 className="text-xl font-semibold">Release Notes</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
