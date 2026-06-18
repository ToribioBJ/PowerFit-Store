import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Detalle del Producto</h1>
      <p>Viendo el producto con ID: {id}</p>
    </div>
  );
};

export default ProductDetail;
