import { FC, ReactNode } from 'react';
import { FaUser, FaUserPlus, FaMusic, FaChalkboardTeacher, FaCalendarAlt, FaClock, FaChartBar, FaFileInvoiceDollar, FaHome, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import Link from 'next/link';
import { FaPencil } from 'react-icons/fa6';
import { Layout } from '@/components';



interface CardProps {
    title: string;
    icon: any;
    route: string;
    description: string;
}

interface ShortcutProps {
    text: string;
    icon: any;
    route: string;
}

interface ActivityProps {
    type: string;
    description: string;
    date: string;
}

interface AlertProps {
    id: number;
    tipo: string;
    titulo: string;
    descricao: string;
    prioridade: string;
    link: string;
}

interface AulaAgendadaProps {
    id: number;
    dataHora: string;
    alunoNome: string;
    professorNome: string;
    instrumentoNome: string;
    status: string;
    duracao: string;
}

interface HomePageProps {
    title: string;
    subtitle: string;
    isMobile: boolean;
    main: string;
    icon?: ReactNode;
    image?: ReactNode;
    operacoesPrincipais: CardProps[];
    aulasAgendadas?: AulaAgendadaProps[];
    children?: ReactNode;
    layout?: ReactNode;
    useLayout: boolean;
}

export const HomePage: FC<HomePageProps> = ({
    layout,
    title,
    isMobile,
    subtitle,
    main,
    icon,
    image,
    operacoesPrincipais,
    children,
    useLayout = true
}) => {
    const content = (
        <>
        <section className="section " style={{padding: '0.2em'}} >
                <div className="container" >
                    {/* Hero Banner */}
                    <div className="hero is-small has-secundary-custom has-text-centered mb-6">
                        <div className="hero-body">
                            <span className="icon is-large mb-4">
                              {  icon || image}
                            </span>
                            <h1 className="title is-2 has-text-descrition-cinza-custom has-text-weight-bold">
                                {title}
                            </h1>
                            <p className="subtitle is-5 mt-9" style={{fontStyle:'italic'}}>
                                {isMobile ? '' : subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Main Operations Grid */}
                    <div className="mb-9" >
                        <h2 className="menu-label" style={{ color: "#555", fontSize: "1.2rem", fontWeight: "bold" }}>
                            <span className="icon-text">
                                <span>{main}</span>
                            </span>
                        </h2>
                        <div className="columns is-multiline is-half is-mobile is-hovered ">
                            {operacoesPrincipais.map((op, index) => (
                                <div key={index} className="column is-8-mobile is-4-tablet is-1-desktop mb-4">
                                    <Link href={op.route} className="box-card-custom is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style={{padding: 'none'}}>
                                        <span className="iconHomeEscola is-large mb-3 ">
                                            {op.icon}
                                        </span>
                                        <h3 className="title is-5 has-text-weight-semibold">
                                            {op.title}
                                        </h3>
                                        <p className="subtitle is-6 has-text-grey has-text-centered mt-2 mb-2">
                                            {isMobile ? '' : op.description}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Quick Actions and Recent Activities */}
                    <div className="column  is-multiline">
                       

                        <div>{children}</div> {/* Aqui o conteúdo do CardsAvisos será renderizado */}

                    </div>
                </div>
            </section>

            <style jsx global>{`
                .column.is-8-mobile {
                    flex: auto;
                }
                .iconHomeEscola {
                    color: #555;
                }
                .box-card-custom {
                    border-radius: 10px;
                    padding: 1.5rem;
                    background: #ffffff;
                    transition: all 0.3s ease;
                    min-height: 180px;
                    max-height: 180px;
                    text-decoration: none;
                }
                .box-card-custom:hover {
                    border: 6px solid transparent;

                    transform: translateY(-6px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                }

                .box-card-custom:hover .iconHomeEscola {
                    color: #001178;

        
                }


                .button.is-primary.is-outlined:hover {
                    background-color: #A33100;
                    color: #fff;
                    border-color: #A33100;
                }
                @media (max-width: 768px) {
                    .hero-body {
                        padding: 1.5rem;
                    }
                    .title.is-2 {
                        font-size: 1.75rem !important;
                    }
                    .subtitle.is-5 {
                        font-size: 1rem !important;
                    }
                             .box-card-custom {
                    border-radius: 10px;
                    padding: 0rem;
                    background: #ffffff;
                    transition: all 0.3s ease;
                    min-height: 60px;
                    max-height: 120px;
                    text-decoration: none;
                }
                }
            `}</style>

            </>
    );

if(!useLayout){
    return content
}

if(layout){
    return layout
}



    return (
        <Layout titulo="" style={{ boxShadow: 'none' }}>
            {content}
        </Layout>
    );
};

export default HomePage;
