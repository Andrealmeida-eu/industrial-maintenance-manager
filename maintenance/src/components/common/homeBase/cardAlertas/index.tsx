import React from 'react';
import Link from 'next/link';
import { FaUser, FaUserPlus, FaMusic, FaChalkboardTeacher, FaCalendarAlt, FaClock, FaChartBar, FaFileInvoiceDollar, FaHome, FaExclamationTriangle, FaBell } from 'react-icons/fa';


interface AlertProps {
    id: number;
    tipo: string;
    titulo: string;
    descricao: string;
    prioridade: string;
    link: string;
}

interface AlertasPendenciasProps {
    alertasPendencias: AlertProps[];
    getAlertIcon: (tipo: string) => any;  // Função para pegar o ícone com base no tipo
    getPriorityClass: (prioridade: string) => string;  // Função para pegar a classe de prioridade
}

export const AlertasPendencias: React.FC<AlertasPendenciasProps> = ({
    alertasPendencias,
    getAlertIcon,
    getPriorityClass,
}) => {
    return (
        <div className="column is-25-mobile is-4-tablet" style={{ minWidth: '30vw' }}>
            <div className="box" style={{ borderRadius: '10px', padding: '1.5rem', boxShadow: 'none' }}>
                <h2 className="title is-6 has-text-weight-bold mb-5">
                    <span className="icon-text">
                        <span className="icon has-text-danger mt-5">
                            {/* Ícone fixo ou personalizado */}
                            <FaBell size={24} />
                        </span>
                        <span className="menu-label" style={{ color: "#555", fontSize: "1.2rem", fontWeight: "bold", marginLeft: '4px' }}>
                            Alertas e Pendências
                        </span>
                    </span>
                </h2>
                <div className="content">
                    {alertasPendencias.map((alerta) => (
                        <Link href={alerta.link} key={alerta.id}>
                            <div className={`notificationHomeEscola ${getPriorityClass(alerta.prioridade)} is-light mb-3 mt-1 is-clickable`}>
                                <div className="is-flex has-text-descrition-cinza-custom is-align-items-center" style={{ borderRadius: '10px', padding: '0.5rem', boxShadow: 'none' }}>
                                    <span className="icon mr-3">
                                        {/* Chamando a função para retornar o ícone correto */}
                                        {getAlertIcon(alerta.tipo)}
                                    </span>
                                    <div>
                                        <p className="has-text-weight-bold mb-1">{alerta.titulo}</p>
                                        <p className="is-size-7">{alerta.descricao}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlertasPendencias;
