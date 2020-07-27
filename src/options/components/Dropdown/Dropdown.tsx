import React, { useState, useEffect } from "react";
import Downshift from 'downshift';
import {makeStyles} from '@material-ui/core'
import Label from "../../../popup/components/Label";
import BaseInput from './../../../popup/components/BaseInput/BaseInput';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import classNames from 'classnames';
import './index.scss';

const useStyles = makeStyles({
  dropdownInput__container: {
    height: '45px',
    position: 'relative',
    border: '1px solid grey'
  },
  dropdownInput_children: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
  },
  dropdownInput__transparent: {
    color:'red',
    background: 'transparent',
    border: 'none',
    zIndex: 5,
    height: '100%'
  },
  dropdownInput_display: {
    fontSize: '1.3rem',
    margin: '3%',
    font: '15px/24px "Lato", Arial, sans-serif'
  },
  dropDownInput_background: {
    fontSize: '0.8rem',
    color: 'grey'
  },
  dropdown_Button: {
    height: '100%',
    width: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropdown_options: {position: 'absolute', zIndex: 2, backgroundColor: 'white'},
  left: {
    width: 'auto',
    overflow:'hidden',
  },
  right: {
    float: 'right',
    width:'50px',
  }
})

function DropdownInput({selectedItem, itemToString, inputValue, label, ...props}) {
  const classes = useStyles();
  const [ focus, setFocus ] = useState<boolean>(false);
  const [ value, setValue ] = useState<string>('');
   
  return (
    <>
      <Label htmlFor="permissions" label={label} />  
      <div className={classNames(classes.dropdownInput__container)}>
        <BaseInput 
          className={classNames(classes.dropdownInput_children, classes.dropdownInput__transparent)}
          htmlId="permissions"
          name="pemissions"
          type="text"
          value={inputValue}
          onChange={({target: {value}}) => {setValue(value)}}
          onFocus={()=>{setFocus(true); setValue('')}}
          onBlur={()=> { value && value.length > 0 ? setFocus(true) : setFocus(false)}}
          {...props}
        />
        {<span className={classNames(classes.dropdownInput_children, focus ? classes.dropDownInput_background : classes.dropdownInput_display)} >
          {selectedItem  && inputValue !== itemToString(selectedItem)? itemToString(selectedItem) : ''}
        </span>}
      </div>
      {inputValue == selectedItem}
    </>
  )
}

const defaultWidth = 200;

interface IProps {
  options: any[];
  label?: string;
  width?: number;
  onDelete?: (item: any) => void;
}

interface IState {}

const Dropdown = ({options, label, width, ...props}: IProps) => {

  const [ containerWidth, setContainerWidth ] = useState(defaultWidth);
  const classes = useStyles({containerWidth});
  const [secondary, setSecondary] = React.useState(false); //TODO: eventually expand to add optional secondary text
 
  useEffect(() => {
    setContainerWidth(this.container.offsetWidth); // ensures width of input and dropdown options matches
  }, [])

  const onDelete = (item) => {
    if(props.onDelete) {
      props.onDelete(item)
    }
  }

  return (
    <div>
      <Downshift
        itemToString={item => item ? item.description : ''}
      >
      {({
        getLabelProps,
      getInputProps,
      getToggleButtonProps,
      getMenuProps,
      getItemProps,
      isOpen,
      clearSelection,
      selectedItem,
      inputValue,
      highlightedIndex,
      toggleMenu,
      }) => (
        <div>
          <div style={{ height: '70px', width: width}}>
            <div className={classNames(classes.dropdown_Button, classes.right)}>
              {!isOpen ? (<KeyboardArrowDownIcon 
              {...getToggleButtonProps()} 
              onClick={()=>{toggleMenu()}}
              />) :
              (<KeyboardArrowUpIcon 
              {...getToggleButtonProps()} 
              onClick={()=>{toggleMenu()}}
              />)}
            </div>
            
            <div className={classes.left} ref={el => (this.container = el)}>
              <DropdownInput 
                label={label}
                inputValue={inputValue} 
                selectedItem={selectedItem} 
                itemToString={item => item ? item.description : ''} 
                {...getInputProps({
                  placeholder: 'type something'
                })}
              />
            </div>
          </div>
          { isOpen && 
            <div 
              className={classNames("dropdown__menu-shadow", classes.dropdown_options)} 
              style={{width: containerWidth}}>
              <List {...getMenuProps()}>
                {isOpen ?
                  options.map(option => {
                    return {description: option, id: option}
                  })
                  .filter((item) => !inputValue || item.description.includes(inputValue))
                  .map((item) => (
                    <ListItem key={item.id} {...getItemProps({item})}>
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.description}
                        // secondary={secondary ? 'Secondary text' : null}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={()=> {onDelete(item.description)}}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )) : ''
                }
              </List>
            </div> }
        </div>
      )}
      </Downshift>
    </div>
  )
}

export default Dropdown;