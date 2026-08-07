import { FaGuitar, FaMusic } from "react-icons/fa";

export const DividerGradient: React.FC = () => {
 return (
    <div 
      className="my-6"
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%)',
        opacity: 0.3
      }}
    />
  );
};



export const DividerWithIcon: React.FC = () => {
  return (
    <div className="my-6 is-flex is-align-items-center is-justify-content-center">
      <div style={{ flex: 1, height: '1px', backgroundColor: '#f0f0f0' }} />
      <div className="mx-3">
        <FaGuitar size={24} color="#667eea" opacity={0.5} />
      </div>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#f0f0f0' }} />
    </div>
  );
};