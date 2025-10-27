import { CiFacebook, CiInstagram, CiTwitter, CiLinkedin } from "react-icons/ci";import logo from "../../../../public/images/logo.svg";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Logo and Social */}
          <div className="space-y-6">
            <div className="bg-secondary/50 p-6 rounded-lg inline-block">
              <Image src={logo} alt="CowUai Logo" className="h-20 w-20" />
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              >
                <CiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              >
                <CiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              >
                <CiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              >
                <CiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Side - Contact */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Entre em Contato</h3>
            <p className="text-primary-foreground/90">+55 (34) 3333- 3333</p>
            <p className="text-primary-foreground/90">cowuai@gmail.com</p>
            <p className="text-primary-foreground/90">Uberaba/MG, Brasil</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-primary-foreground/70">CowUai © 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
