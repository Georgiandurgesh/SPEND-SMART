import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.webp";
import { Register, Login } from "../utils/Icons";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full px-4 sm:px-8 md:px-12 py-3 flex justify-between items-center bg-white/70 dark:bg-background/80 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center gap-x-4 cursor-pointer" onClick={() => navigate("/")}> 
        <img
          src={logo}
          alt="spend smart logo"
          className="w-10 h-10 md:w-14 md:h-14 rounded-full shadow-lg border-2 border-primary"
        />
        <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight font-outfit">
          Spend <span className="text-secondary">Smart</span>
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-x-6">
        <Button
          color="primary"
          className="font-semibold px-6 py-2 rounded-full shadow-md"
          startContent={<Register />}
          onPress={() => navigate("/register")}
          radius="full"
        >
          Register
        </Button>
        <Button
          color="secondary"
          variant="bordered"
          className="font-semibold px-6 py-2 rounded-full border-2"
          startContent={<Login />}
          onPress={() => navigate("/login")}
          radius="full"
        >
          Login
        </Button>
      </nav>
      {/* Mobile menu button */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-primary/10 transition"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-primary mb-1 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`block w-6 h-0.5 bg-primary mb-1 ${menuOpen ? "opacity-0" : ""}`}></span>
        <span className={`block w-6 h-0.5 bg-primary transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white dark:bg-background/90 rounded-xl shadow-lg flex flex-col items-center py-4 gap-y-4 animate-fade-in z-50">
          <Button
            color="primary"
            className="font-semibold w-full"
            startContent={<Register />}
            onPress={() => { setMenuOpen(false); navigate("/register"); }}
            radius="full"
          >
            Register
          </Button>
          <Button
            color="secondary"
            variant="bordered"
            className="font-semibold w-full"
            startContent={<Login />}
            onPress={() => { setMenuOpen(false); navigate("/login"); }}
            radius="full"
          >
            Login
          </Button>
        </div>
      )}
    </header>
  );
};

export default NavBar;
