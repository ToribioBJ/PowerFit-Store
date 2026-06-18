import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>404</h1>
        <h2 style={subtitleStyle}>PÁGINA NO ENCONTRADA</h2>
        <p style={descriptionStyle}>
          Lo sentimos, el suplemento o la sección que estás buscando no existe, ha sido movida o está temporalmente fuera de stock.
        </p>
        <Link to="/" className="btn-primary" style={btnStyle}>
          Regresar al Inicio
        </Link>
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#0F0F0F',
  color: '#FFFFFF',
  padding: '24px',
  textAlign: 'center',
  fontFamily: "'Inter', sans-serif",
};

const contentStyle: React.CSSProperties = {
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '8rem',
  fontWeight: 900,
  lineHeight: 1,
  color: '#00E676',
  textShadow: '0 0 30px rgba(0, 230, 118, 0.4)',
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1.5rem',
  fontWeight: 800,
  letterSpacing: '0.05em',
  color: '#FFFFFF',
  margin: 0,
  textTransform: 'uppercase',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#BDBDBD',
  lineHeight: 1.6,
  marginBottom: '16px',
};

const btnStyle: React.CSSProperties = {
  textDecoration: 'none',
};

export default NotFound;
