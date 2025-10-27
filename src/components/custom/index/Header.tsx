"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import logo from "../../../../public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image src={logo} alt="CowUai Logo" className="h-12 w-12" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#inicio" className="text-primary-foreground hover:text-accent-foreground transition-colors">
                            Início
                        </a>
                        <a href="#sobre" className="text-primary-foreground hover:text-accent-foreground transition-colors">
                            Sobre
                        </a>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Button asChild variant="default" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                          <Link href="/login">Acesso</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-primary-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-4">
                        <a
                            href="#inicio"
                            className="block text-primary-foreground hover:text-accent-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Início
                        </a>
                        <a
                            href="#sobre"
                            className="block text-primary-foreground hover:text-accent-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sobre
                        </a>
                        <Button variant="default" className="w-full border-primary/30 text-primary-foreground hover:bg-primary-foreground/10">
                            Acesso
                        </Button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
