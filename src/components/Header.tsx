import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            CaloFree Tracker
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 rounded-full">
            Login
          </Button>
          <img 
            src={logo} 
            alt="BusyBody Logo" 
            className="h-8 w-8 rounded-full shadow-sm object-cover border-2 border-primary/20"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;