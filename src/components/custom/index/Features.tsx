import { TrendingUp, Trophy } from "lucide-react";
import { PiShieldCheckLight } from "react-icons/pi";

const features = [
    {
        icon: TrendingUp,
        title: "Monitoramento",
        description: "Monitore a saúde do seu rebanho em tempo real",
    },
    {
        icon: Trophy,
        title: "Produtividade",
        description: "Aumente a produtividade da fazenda com dados precisos",
    },
    {
        icon: PiShieldCheckLight,
        title: "Confiabilidade",
        description: "Plataforma confiável para decisões seguras",
    },
];

const Features = () => {
    return (
        <section className="py-16 md:py-24 bg-bg-alternative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-4">
                                        <Icon className="text-primary" size={55} strokeWidth={1} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
