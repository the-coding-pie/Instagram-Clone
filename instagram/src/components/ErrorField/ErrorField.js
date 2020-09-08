import React from 'react';

import './ErrorField.css';

const ErrorField = ({ error }) => {
  return (
    <p className="error_field">
      {error}
    </p>
  );
}

export default ErrorField;