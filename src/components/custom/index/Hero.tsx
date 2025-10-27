import {Button} from "@/components/ui/button";
import heroImage from "../../../../public/images/hero-cow.jpg";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <section id="inicio" className="relative min-h-screen flex items-center pt-16">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage}
                    alt="Gado em fazenda moderna"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"/>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                        Transforme a Gestão da Sua Fazenda com Tecnologia
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                        Tenha controle completo sobre a saúde, alimentação e desempenho do seu rebanho.
                        Registre animais, acompanhe a dieta, mortalidade e tome decisões com base em dados reais.
                    </p>
                    <Button asChild variant="default" size="lg" className="text-lg px-8 py-6 h-auto">
                        <Link href="/cadastro">
                            Faça seu cadastro agora
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
