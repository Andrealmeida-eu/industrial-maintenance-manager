// components/AuthorFooter.tsx
import React from 'react';
import { DividerGradient } from '../divisor';

interface AuthorFooterProps {
  authorName?: string;
  className?: string;
  currentYear?: number;
  showYear: boolean

}

const AuthorFooter: React.FC<AuthorFooterProps> = ({
  authorName = 'Seu Nome',
  className = '',
  currentYear = new Date().getFullYear(),
  showYear = false
}) => {
  return (
    <footer className={`author-footer ${className}`}>
      <div className="footer-content" >
        <DividerGradient />
        <p className="footer-text is-italic">
          Desenvolvido por <span className="author-name">{authorName + " "}</span>{showYear && (
            <span className="is-size-7 has-text-grey">
              &copy; {currentYear}
            </span>
          )}
        </p>

      </div>

      <style jsx>{`
        .author-footer {
          padding: 2rem 1rem;
          margin-top: 3rem;
          
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #666, transparent);
          margin: 0 auto 1.5rem auto;
        }

        .footer-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                       Roboto, Oxygen, Ubuntu, sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          color: #6B7280;
          letter-spacing: 0.025em;
          line-height: 1.5;
          margin: 0;
        }

        .author-name {
          font-weight: 500;
          color: #374151;
          transition: color 0.2s ease;
        }

        .author-name:hover {
          color: #111827;
        }

        @media (max-width: 768px) {
          .author-footer {
            padding: 1.5rem 1rem;
            margin-top: 2rem;
          }
          
          .footer-text {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Adicionando a fonte Inter via Google Fonts */}

    </footer>
  );
};

export default AuthorFooter;