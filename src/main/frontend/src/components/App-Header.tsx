import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, useLogout } from "@/lib/auth";
import { Columns, Search, Bell, ChevronDown, LogOut, User } from "lucide-react";

export function AppHeader() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: auth } = useAuth();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const user = auth?.user;

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Columns className="h-8 w-8" />
              <h1 className="text-xl font-bold">ProjectFlow</h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-blue-200 transition-colors duration-200">
                Boards
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search boards, cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/20 text-white placeholder-white/70 border-white/30 w-64 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-white/70" />
            </div>
            
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">
                3
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 text-white hover:bg-white/20">
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:block font-medium">{user?.name || "User"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
