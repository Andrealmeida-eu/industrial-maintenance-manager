
import { FiUserPlus } from "react-icons/fi";
import { useState } from "react";

interface CustomButtonProps {
  icon?: React.ReactNode;
  text?: any;
  isMobile?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  title?: string
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  icon = <FiUserPlus />,
  text = "Adicionar Usuário",
  isMobile = false,
  onClick,
  className = "is-hidden-mobile",
  style = {},
  type = "button",
  disabled = false,
  title,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);



  const defaultStyle: React.CSSProperties = {
    backgroundColor: '#001178',
    border: 'none',
    color: '#ffffff',

  };

  const buttonStyle: React.CSSProperties = {
    ...defaultStyle,
    ...style,
    opacity: isActive ? 0.7 : isHovered ? 0.9 : 1,
    transition: 'all 0.3s ease',
    cursor: 'pointer',

  };


  return (
    <button
      title={title}
      type={type}
      disabled={disabled}
      className={`button is-info is-rounded is-responsive is-small-mobile ${className}`}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onClick={onClick}
      {...props}
    >
      <span className="icon">{icon}</span>
      {!isMobile && <span>{text}</span>}
    </button>
  );
};

export default CustomButton;