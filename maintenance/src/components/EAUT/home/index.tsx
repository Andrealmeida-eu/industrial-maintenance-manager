import {
    FaClipboardList,
    FaCogs,
    FaChartBar
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import mainLogo from "@/assets/main.png"
import { HomePage } from '@/components/common/homeBase';
import NotificationContainer from '@/components/common/notificacao/mutiplasNotifacoes';
import { FiLayers, FiTool } from 'react-icons/fi';
import { AiFillTool } from 'react-icons/ai';
import { FaToolbox } from 'react-icons/fa6';

export const HomeB = () => {
 
    const [isMobileView, setIsMobileView] = useState(false)


    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);



    return (
        <div style={{ margin: '50px' }}>

            <HomePage
                title={!isMobileView ? 'Manutenção Elétrica' : 'Manutenção'}
                isMobile={isMobileView}
                subtitle="Gestor de Manutenção de Bancada"
                image={

                    <Image
                        src={mainLogo}
                        alt=""
                        width={190}
                        height={150}
                        style={{
                            objectFit: 'contain',
                            maxWidth: '900%',
                            color: '#c99985'

                        }}
                    />
                }

                useLayout={false}
                main=''
                operacoesPrincipais={[
                    { title: 'Apontamento Diário', icon: <FiTool  size={28} />, route: '/eaut/apotamentos', description: 'Gestão dos Apontamentos' },
                    { title: 'Equipamentos', icon: <FaCogs  size={28} />, route: '/eaut/equips', description: 'Equipamentos Cadastrados' },
                    { title: 'Gestão Bancada', icon: <FaToolbox  size={28} />, route: '/eaut/workOrder', description: 'Painel Geral da bancada de manutenção' },
                    { title: 'Gestão Estoque', icon: <FaClipboardList size={28} />, route: '/eaut/inventary-control', description: 'Painel Geral Estoque interno' },
                   
                ]}
            >
                <div className="columns is-multiline">


                    <div className="column is-6-mobile is-4-tablet is-5-desktop">
                 
                    </div>
                </div>
            </HomePage>
        </div>
    );
};

export default HomeB;
