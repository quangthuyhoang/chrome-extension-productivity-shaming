import React from 'react';

interface ILabel {
  htmlFor: string,
  label: string,
  required?: boolean
}

/** Label */
function Label({htmlFor, label, required}: ILabel) {
  return (
    <label style={{display: 'block'}} htmlFor={htmlFor}>
      {label} {required && <span style={{color: 'red'}}> *</span>}
    </label>
  )
}

export default Label;
