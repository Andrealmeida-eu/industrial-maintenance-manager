import { Menu } from '@/components/layout/menu'
import { ReactNode } from 'react';
import SimpleAuthorFooter from '../common/signature';
import AuthorFooter from '../common/signature';


interface LayoutProps {
    titulo?: string;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;


}
export const Layout: React.FC<LayoutProps> = (props) => {
    return (
        <div className="app" style={{

        }}>
            <section className="main-content columns is-fullheight" style={{ boxShadow: 'none'}}>
                <Menu />

                <div className="container column is-10" style={{ padding: '0rem' }}>

                    <div className="section" >
                        <div className="card" style={{ boxShadow: 'none' }}>
                            <div className="card-header" style={{ boxShadow: 'none' }}>
                                <div style={{ padding: "1rem" }}>
                                    <p className="menu-label" style={{
                                        color: "#555", fontSize: "1rem", fontWeight: "bold", textAlign: 'left', 
                                        marginLeft: '46px',  
                                        paddingLeft: '0'
                                    }}>
                                        {props.titulo}
                                    </p>
                                </div>

                            </div>

                            <div className="card-content" style={{ boxShadow: 'none !important' }}>
                                <div>
                                    {props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>

            <AuthorFooter
                authorName="André Almeida"
                className="has-border-top-light"
                showYear={true}
            />
        </div>
    )
}