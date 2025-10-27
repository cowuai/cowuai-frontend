const About = () => {
    return (
        <section id="sobre" className="py-16 md:py-24 bg-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-lg">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Sobre a CowUai</h2>
                        <p className="text-lg leading-relaxed text-primary-foreground/90 text-justify">
                            A CowUai é uma plataforma inovadora desenvolvida para transformar a gestão de fazendas
                            de gado. Combinamos tecnologia de ponta com conhecimento do agronegócio para oferecer
                            ferramentas que aumentam a produtividade, melhoram a saúde do rebanho e facilitam a
                            tomada de decisões baseadas em dados reais. Nossa missão é empoderar produtores rurais
                            com soluções digitais que tornam a gestão da fazenda mais eficiente e lucrativa.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;