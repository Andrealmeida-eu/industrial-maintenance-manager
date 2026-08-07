// components/MetricaCard.tsx
import React from 'react';

interface MetricaCardProps {
  titulo: string;
  valor: string | number;
  variacao?: string | number;
  cor?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link' | 'dark' | 'light';
  icone?: React.ReactNode;
  className?: string;
  mobileFullWidth?: boolean;
}

export const Card: React.FC<MetricaCardProps> = ({
  titulo,
  valor,
  variacao,
  cor = 'primary',
  icone,
  className = '',
  mobileFullWidth = true
}) => {
  const columnClasses = `
    column 
    ${mobileFullWidth ? 'is-12-mobile' : 'is-6-mobile'} 
    is-6-tablet 
    is-3-desktop
    ${className}
  `;

  return (
    <div className={columnClasses}>
      <div 
        className="box" 
        style={{ boxShadow: 'none', border: '1px solid #dbdbdb' }}
      >
        <div className="level is-mobile">
          <div className="level-left">
            {icone && (
              <div className={`icon has-text-${cor} is-small`}>
                {icone}
              </div>
            )}
          </div>
          <div className="level-right">
            
          </div>
        </div>
        <div className="content">
          <p className="title is-4 has-text-weight-bold">{valor}</p>
          <p className="subtitle is-6 has-text-grey">{titulo}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;