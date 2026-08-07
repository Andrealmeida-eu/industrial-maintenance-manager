// components/Modal.tsx
import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Bloquear scroll
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Foco no modal quando aberto (acessibilidade)
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      ></div>

      {/* Container central */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
        {/* Modal real */}
        <div
          ref={modalRef}
          className={`inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${sizeClasses[size]}`}
          tabIndex={-1}
        >
          {/* Cabeçalho */}
          {title && (
            <div className="border-b border-gray-200 bg-primary px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <h3
                  id="modal-title"
                  className="text-lg font-medium leading-6 text-white"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  className="rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={onClose}
                  aria-label="Fechar modal"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="px-4 py-5 sm:p-6">{children}</div>

          {/* Rodapé (opcional) */}
          {!title && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal