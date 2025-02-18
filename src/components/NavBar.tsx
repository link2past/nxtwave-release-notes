
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Download, LogOut, Moon, Sun, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useTheme } from "next-themes";
import { useUserRole } from "@/contexts/UserRoleContext";

export function NavBar() {
  const defaultLogo = "/lovable-uploads/8c65e666-6798-4534-9667-b3c7fdd98a33.png";
  const [logo, setLogo] = useState<string>(() => localStorage.getItem('navLogo') || defaultLogo);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { role } = useUserRole();

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

  const resetToDefaultLogo = () => {
    setLogo(defaultLogo);
    localStorage.setItem('navLogo', defaultLogo);
    toast({
      title: "Logo reset",
      description: "The logo has been reset to default.",
    });
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    // Trigger download from Index page
    const downloadButton = document.querySelector('[aria-label="Download as CSV"]') as HTMLButtonElement;
    if (downloadButton) {
      downloadButton.click();
    } else {
      toast({
        title: "Download unavailable",
        description: "Please navigate to the main page to download release notes.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="relative group w-24 h-12">
              <img
                src={logo}
                alt="NXT WAVE Logo"
                className="w-full h-full object-contain rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-md">
                <label className="cursor-pointer p-1 hover:bg-white/20 rounded">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="h-4 w-4" />
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={resetToDefaultLogo}
                >
                  ↺
                </Button>
              </div>
            </div>
            <h1 className="text-xl font-semibold">Release Notes</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {role === 'admin' ? 'Admin Mode' : 'User Mode'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
