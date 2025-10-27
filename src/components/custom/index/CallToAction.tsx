import cattleBanner from "../../../../public/images/cattle-banner.jpg";
import Image from "next/image";

const CallToAction = () => {
    return (
        <section className="relative py-24 md:py-32">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={cattleBanner}
                    alt="Rebanho de gado"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-primary-foreground">
                    Transforme seu gado em qualidade para todas as necessidades
                </h2>
            </div>
        </section>
    );
};

export default CallToAction;
