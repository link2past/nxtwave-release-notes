
import { useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { NavbarActions } from "./NavbarActions";

export function NavBar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          {!isAuthPage && <NavbarActions />}
        </div>
      </div>
    </nav>
  );
}
