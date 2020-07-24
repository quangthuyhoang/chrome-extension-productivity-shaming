import React from 'react';
import Label from '../Label';
import './index.scss';
import classNames from 'classnames';

interface IBaseInput {
  htmlId: string,
  name: string,
  label?: string,
  type?: 'text' | 'number' | 'password' | 'checkbox',
  required?: boolean,
  onChange: (params: any) => void,
  placeholder?: string,
  value?: any,
  error?: string,
  success?: boolean,
  message?: string,
  children?: Node,
  checked?: boolean,
  classes?: any
}

/** Text input with integrated label to enforce consistency in layout, error display, label placement, and required field marker. */
function BaseInput({
  htmlId, 
  name, 
  label, 
  type = "text", 
  required = false,
   onChange, 
   placeholder, 
   value, 
   error,
   success,
   message,
  children,
  classes, 
    ...props}: any) {
      
  return (
    <div style={{marginBottom: 16}}>
      {label ? <Label htmlFor={htmlId} label={label} required={required} /> : ''}
      <input
      className={classNames("effect-24")}
        id={htmlId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // style={error && {border: 'solid 1px red'}}
        {...props}/>
        <span className="focus-border">
            	<i></i>
            </span>
        {children}
        
      {error && <div className="error" style={{color: 'red'}}>{message}</div>}
      {success && <div className="success" >{message}</div>}
    </div>
  );
};

export default BaseInput;
