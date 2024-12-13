import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">CaloFree Tracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            Login
          </Button>
          <img src="/placeholder.svg" alt="BusyBody Logo" className="h-8 w-8" />
        </div>
      </div>
    </header>
  );
};

export default Header;