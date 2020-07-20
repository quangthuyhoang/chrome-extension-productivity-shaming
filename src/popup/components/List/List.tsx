import React, { useState } from "react";
import './List.scss';
import classNames from 'classnames';

function ListItem(props: any) {
  const { option, children, removeItem } = props;
  const [ itemChecked, setChecked ] = useState<boolean | undefined>(false);
  const handleRemove = (option) => {
    removeItem(option!.label)
  }
// TODO: add material ui themes to make prettier and get icons
// TODO: add edit button
  return (
    <>
      <input 
        type="checkbox" 
        name={`${option!.label}`}
        checked={option?.checked ? option.checked : itemChecked} 
        onChange={({target: {checked}}) => {setChecked(checked)}}/>
        <span className={classNames('label', {'cross-out': itemChecked })}>{children ? children : option!.value}</span> 
      <span className="ListItem__closeButton" onClick={(e)=> {handleRemove(option)}}>&times;</span>
    </>
  )
}

function List(props: any){
  const { 
    options, 
    removeItem,

    children,
  } = props;
  return (
    <div>
      <ul>
        {
          options && options.map((option) => {
            return (
            <li className="listItem" key={`${option.label}`}>
              {children ? children : <ListItem option={option} removeItem={removeItem} />}
              
            </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default List;