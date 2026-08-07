import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import {FaHome, FaClipboardList, FaToolbox } from 'react-icons/fa';
import {
    FiMenu
} from 'react-icons/fi';



export const Menu: React.FC = () => {

    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [showMenuDesktop, setShowMenuDesktop] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
        bancada: false,
        estoque: false,

    });

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSubMenu = (menu: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const tenant = "Manutenção Elétrica"



    return (
        <>

            <button
                className="button is-#6a1b9a is-hidden-tablet"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                    position: "fixed",
                    top: "30px",
                    left: isMenuOpen ? "130px" : "10px",
                    zIndex: 100,
                    background: "none",
                    border: "none",
                    padding: "8px",
                }}
                aria-label="Menu"
            >
                <span className="icon">
                    {isMenuOpen ? (
                        <FiMenu />
                        // <img src="/icons/colapsar.svg" alt="Fechar menu" style={{ width: '24px', height: '24px' }} />
                    ) : (
                        // <img src="/icons/expandir.svg" alt="Abrir menu" style={{ width: '24px', height: '24px' }} />
                        <FiMenu />
                    )}
                </span>
            </button>


            {isDesktop && (
                <button
                    className="button is-white is-hidden-mobile"
                    onClick={() => setShowMenuDesktop(!showMenuDesktop)}
                    style={{
                        position: "fixed",
                        top: "10px",
                        left: `${!showMenuDesktop ? '140px' : '240px'}`,
                        zIndex: 100,
                        background: "none",
                        border: "none",
                        padding: "1px",
                    }}
                    aria-label="Menu Desktop"
                >
                    <span className="icon">
                        {showMenuDesktop ? (
                            ''
                           
                        ) : (

                            <FiMenu />

                        )}
                    </span>
                </button>
            )}


            {showMenuDesktop && isDesktop && (
                <div
                    className="is-overlay"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        position: "fixed",
                        zIndex: 100,
                    }}
                    onClick={() => {
                        setIsMenuOpen(false)
                        setShowMenuDesktop(false)
                    }
                    }
                />
            )}

            {isMenuOpen && !isDesktop && (
                <div
                    className="is-overlay"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        position: "fixed",
                        zIndex: 100,
                    }}
                    onClick={() => {
                        setIsMenuOpen(false)
                        setShowMenuDesktop(false)
                    }
                    }
                />
            )}


            <aside
                className="column is-3 is-narrow-mobile is-fullheight section"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    width: "280px",
                    zIndex: 100,
                    transition: "transform 0.3s ease-in-out",
                    backgroundColor: "#fdfdfc",
                    color: "#555",
                    transform: isDesktop
                        ? (showMenuDesktop ? 'translateX(0)' : 'translateX(-100%)')
                        : (isMenuOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
                    overflowY: "auto"
                }}
            >
                <div style={{ padding: "1rem", borderBottom: "1px solid #34495e" }}>
                    <p className="menu-label" style={{ color: "#555", fontSize: "1.2rem", fontWeight: "bold" }}>
                        {tenant}
                    </p>
                </div>

                <ul className="menu-list" style={{ padding: "0.5rem" }}>

                     <li>
                        <div
                            className="menu-item"
                            onClick={() => router.push("/")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.9em 0.7em",
                                borderRadius: "4px",
                                cursor: "pointer",
                                margin: "0.25em 0",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <span className="icon" style={{ marginRight: "0.5em" }}><FaHome /> </span>
                                Inicio                            
                            </span>
                        </div>
                        
                    </li>

                    <li>
                        <div
                            className="menu-item"
                            onClick={() => toggleSubMenu('bancada')}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.9em 0.7em",
                                borderRadius: "4px",
                                cursor: "pointer",
                                margin: "0.25em 0",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <span className="icon" style={{ marginRight: "0.5em" }}><FaToolbox /> </span>
                                Manutenção                          
                            </span>
                        </div>
                         {expandedItems.bancada && 
                            <ul style={{ marginLeft: "1.5em", borderLeft: "1px solid #34495e", paddingLeft: "0.5em" }}>
                                <MenuItens href="/eaut/apotamentos" label="Apontamentos" />
                                <MenuItens href="/eaut/equips" label="Equipamentos" />
                                <MenuItens href="/eaut/workOrder" label="Gestão Bancada" />
                            </ul>
                        }
                     
                    </li>

                    <li>
                        <div
                            className="menu-item"
                            onClick={() => router.push('/eaut/inventary-control')}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.9em 0.7em",
                                borderRadius: "4px",
                                cursor: "pointer",
                                margin: "0.25em 0",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <span className="icon" style={{ marginRight: "0.5em" }}><FaClipboardList /> </span>
                                Gestão de Estoque                            
                            </span>
                        </div>
                     
                     
                        
                    </li>

                    

                </ul>
            </aside>


        </>
    );
};

interface MenuItensProps {
    href: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: any;
}

const MenuItens: React.FC<MenuItensProps> = ({ href, label, icon }) => {
    return (
        <li>
            <Link href={href} passHref>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5em 0.43em",
                    borderRadius: "4px",
                    color: "#555",
                    textDecoration: "none",
                    margin: "0.1em 0",
                }}>
                    {icon && <span className="icon" style={{ marginRight: "0.5em" }}>{icon}</span>}
                    {label}
                </div>
            </Link>
        </li>
    );
};
