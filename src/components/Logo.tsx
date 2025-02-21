
import { useTheme } from "next-themes";

export function Logo() {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-12 dark:filter dark:drop-shadow-[0_0_0.3rem_#ffffff70] transition-all duration-300">
        <img
          src={`/lovable-uploads/63db8ac2-b1fb-4d05-a4dc-38861a9d6ed9.png`}
          alt="NXT WAVE Logo"
          className="w-full h-full object-contain brightness-0 invert dark:brightness-100 dark:invert-0"
        />
      </div>
      <h1 className="text-xl font-semibold">Release Notes</h1>
    </div>
  );
}
