import React, { useState } from "react";
import './List.scss';
import classNames from 'classnames';

function ListItem(props: any) {
  const { option, children, removeItem, onUpdate } = props;
  const [ itemChecked, setChecked ] = useState<boolean | undefined>(false);
  const handleRemove = (option) => {
    removeItem(option!.label)
  }
  function handleChange({target: {checked}}) {
    const updatedItem = Object.assign(
      {}, 
      option, 
      {checked: checked}
    )
    
    onUpdate(updatedItem);
  }
// TODO: add material ui themes to make prettier and get icons
// TODO: add edit button
  return (
    <>
      <input 
        type="checkbox" 
        name={`${option!.label}`}
        checked={option?.checked ? option.checked : itemChecked} 
        onChange={handleChange}/>
        <span className={classNames('label', {'cross-out': itemChecked })}>
          {children ? children : option!.value}
        </span> 
      <span className="ListItem__closeButton" onClick={(e)=> {handleRemove(option)}}>
        &times;
      </span>
    </>
  )
}

function List(props: any){
  const { 
    options, 
    removeItem,
    onUpdate,
    children,
  } = props;
  return (
    <div>
      <ul>
        {
          options && options.map((option) => {
            return (
            <li className="listItem" key={`${option.label}`}>
              { children ? 
                children : 
                <ListItem 
                  option={option} 
                  removeItem={removeItem} 
                  onUpdate={onUpdate}
                />
              }
            </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default List;