import React from 'react';

const FormHeader = ({ title, description }) => {
  return (
    <div style={{ marginBottom: 30 }}>
      <h5>{title}</h5>
      <p className="text-muted">{description}</p>
    </div>
  );
};

export default FormHeader;
