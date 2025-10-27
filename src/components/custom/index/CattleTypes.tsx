import { Card, CardContent } from "@/components/ui/card";
import {ChevronLeft} from "lucide-react";
import cattleHerd from "../../../../public/images/cattle-herd.jpg"
import cowPremium from "../../../../public/images/cow-premium.png";
import cowHealthy from "../../../../public/images/cow-healthy.png";
import cowQuality from "../../../../public/images/cow-quality.png";
import Image from "next/image";

const cattleTypes = [
    {
        image: cowPremium,
        title: "Gado Premium",
        description: "Dê início a transformação de seu gado em animais saudáveis e de alta qualidade, ideais para produção de laticínios e carne.",
    },
    {
        image: cowHealthy,
        title: "Gado Saudável",
        description: "Mantenha a saúde em dia de seus animais com os registros de vacinações da plataforma.",
    },
    {
        image: cowQuality,
        title: "Gado de Qualidade",
        description: "Comece a organizar e mapear os dados da sua fazenda, tornando seus registros de animais mais confiáveis.",
    },
];

const CattleTypes = () => {
    return (
        <section className="py-16 md:py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex flex-col lg:flex-row items-stretch gap-8 lg:gap-0">
                    {/* Left Side - Text and Herd Image with Diagonal Cut */}
                    <div className="lg:w-[52%] flex flex-col space-y-4 relative z-10">
                        {/* Text Container with Arrow Detail */}
                        <div className="bg-primary text-primary-foreground p-8 rounded-3xl relative shadow-lg">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                                Registre diversas informações sobre seu Gado
                            </h2>

                            {/* Arrow Detail */}
                            <div className="absolute right-2 bottom-2 flex opacity-40">
                                <ChevronLeft className="w-12 h-12" strokeWidth={2} />
                                <ChevronLeft className="w-12 h-12 -ml-8" strokeWidth={2} />
                                <ChevronLeft className="w-12 h-12 -ml-8" strokeWidth={2} />
                                <ChevronLeft className="w-12 h-12 -ml-8" strokeWidth={2} />
                                <ChevronLeft className="w-12 h-12 -ml-8" strokeWidth={2} />
                            </div>

                            <p className="text-primary-foreground/90 mb-0">
                                Temos o orgulho de oferecer uma seleção diversificada de gado dentro da plataforma, registre diferentes tipos de gado para atender às suas necessidades específicas de produção e gestão.<br/><br/> Seja para carne, leite ou trabalho, nossa plataforma facilita o gerenciamento eficiente do seu rebanho.
                            </p>
                        </div>

                        {/* Image with Diagonal Cut */}
                        <div className="relative h-64 lg:h-80 overflow-hidden rounded-3xl ">
                            <Image
                                src={cattleHerd}
                                alt="Rebanho de gado"
                                className="w-full h-full object-cover"
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0% 100%)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Side - Cattle Type Cards with Overlap */}
                    <div className="lg:w-[45%] lg:-ml-18 relative z-20 space-y-4 lg:space-y-3 lg:pl-8">
                        {cattleTypes.map((type, index) => (
                            <Card
                                key={index}
                                className="bg-card border-primary overflow-hidden hover:shadow-2xl transition-all duration-300 shadow-lg"
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
                                            <Image
                                                src={type.image}
                                                alt={type.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">
                                                {type.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {type.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CattleTypes;
