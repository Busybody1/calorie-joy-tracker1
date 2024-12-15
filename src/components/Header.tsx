import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            <span className="text-[#30dcec]">CaloFree Tracker</span>{" "}
            <span className="text-sm text-gray-700">by BusyBody</span>
          </h1>
          <div className="relative group ml-10">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <img 
              src="/lovable-uploads/ae8fa472-3077-4aa3-8e68-e70a39bf6637.png"
              alt="BusyBody Logo" 
              className="relative h-8 w-auto cursor-pointer rounded-full hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 rounded-full"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 rounded-full"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;