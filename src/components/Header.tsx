import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "../assets/logo.png";

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
          <img 
            src="/lovable-uploads/ae8fa472-3077-4aa3-8e68-e70a39bf6637.png"
            alt="BusyBody Logo" 
            className="h-8 w-auto mr-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          />
          <h1 className="text-xl font-bold">
            <span className="text-[#30dcec]">CaloFree Tracker</span>{" "}
            <span className="text-sm text-gray-700">by BusyBody</span>
          </h1>
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