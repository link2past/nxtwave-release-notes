
import { useTheme } from "next-themes";

export function Logo() {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-12 dark:filter dark:drop-shadow-[0_0_0.3rem_#ffffff70] transition-all duration-300">
        <img
          src={`/lovable-uploads/${
            theme === 'dark'
              ? '8c65e666-6798-4534-9667-b3c7fdd98a33.png' 
              : 'ba9e62ce-3ed4-44e5-b603-800ee7886021.png'
          }`}
          alt="NXT WAVE Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-xl font-semibold">Release Notes</h1>
    </div>
  );
}
