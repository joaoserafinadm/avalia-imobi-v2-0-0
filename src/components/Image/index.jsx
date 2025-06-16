// Image.js - Componente separado
import React from 'react';

const Image = ({ 
  imageUrl, 
  alt = "Imagem", 
  height = "120px", 
  width = "100%",
  borderRadius = "0"
}) => {
  const containerStyle = {
    position: 'relative',
    width: width,
    height: height,
    overflow: 'hidden',
    borderRadius: borderRadius,
    backgroundColor: '#f0f2f5'
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(20px)',
    transform: 'scale(1.1)',
    opacity: 0.3
  };

  const foregroundStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain'
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      <div style={foregroundStyle}>
        <img 
          src={imageUrl} 
          alt={alt}
          style={imageStyle}
        />
      </div>
    </div>
  );
};

export default Image;