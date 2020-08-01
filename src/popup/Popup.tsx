import React, { useState, useEffect } from "react";
import "./Popup.scss";
import List from './components/List';
import BaseInput from "./components/BaseInput";
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import PostAddIcon from '@material-ui/icons/PostAdd';
import classNames from 'classnames';
import { getChromeStorageApi,updateChromeStorageApi, logger, addChromeStorageApi, checkPermissions } from './../utils/chromeRequest/index';
import { makeStyles } from '@material-ui/core/styles';
import { createWindow } from './../background';
import { TOption } from '../utils/types'
const useStyles = makeStyles({
  BaseInput_autoWidth: {
    // 'input': {
      width: '430px',
    // }
  },
  addButton: {
    right: '35px',
    position: 'absolute',
    top: '22px',
  }
})


type TOptions = TOption[] | undefined;

export default function Popup(any) {

  const classes = useStyles();

  const [ value, setValue ] = useState<string>('');
  const [ options, setOptions ] = useState<TOptions>([]);
  const [ monitoring, setMonitoring ] = useState<boolean>(false);

  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    // chrome.runtime.sendMessage({ popupMounted: true });

    getChromeStorageApi(['todos', 'urlMonitoring'], (results) => {
      const { todos, urlMonitoring} = results;
  
      const initializedTodos = todos ? todos : options;
      const initializedMonitoring = urlMonitoring ? urlMonitoring : false;

      setMonitoring(initializedMonitoring);
      setOptions(initializedTodos);
    })
  }, []);

  const onChangeHandler = ({ target: {value}}) => {
    setValue(value)
  }

  const onEnterPress = ({which, keyCode, key}) => {
    let keyNumber = which ? which : keyCode;
    if(keyNumber === 13 || key === "Enter") {
      addItem(value);
    }
  }

  const updateItem = (item: TOption) => {
    setOptions(prevOptions => {
      
       const newOptions = prevOptions
       .map(option => option.label === item.label ? item : option);

       updateChromeStorageApi('todos', newOptions, null)
       .catch(err => console.error(err));

       return newOptions;
    })
  }

  const addItem = (value: string) => { // figure out why
    if (value && value.length > 0) {
      setOptions((prevOptions: TOptions) => {
        const lIndex = prevOptions.length === 0 ? 1 : prevOptions.length
        let label = 0
        if(!prevOptions || prevOptions.length != 0 ) {
          label = Number(prevOptions[String(prevOptions.length - 1)].label) + 1;
        }
        
        const item: TOption = { label: label.toString() , value };
      
        chrome.storage.sync.set({'todos': [...prevOptions, item]}, () => {
          console.log('todos added: ', [...prevOptions, item])
        })
        return [...prevOptions, item];
      })
      setValue('');
    }
  };

  const removeItem = (label: string) => {
    setOptions(prevOptions => {
      const newOptions = prevOptions
      .filter(option => label !== option.label);
      chrome.storage.sync.set({'todos': newOptions}, () => {
        console.log('todos added: ',newOptions)
      })
      return newOptions;
    })
  }

  const getToDoList = () => {
    chrome.runtime.sendMessage({modal: true});
    // createWindow();
    // checkPermissions(['all'], function(granted) {
    //   console.log('check', granted)
    // })
    getChromeStorageApi(['urlMonitoring', 'todos'], (results) => {
      console.log('got the results', results)
    })
  }
  
  const toggleUrlMontoring = () => {
    setMonitoring(prevState => {
      let newState = !prevState;
      chrome.storage.sync.set({'urlMonitoring': newState}, ()=> {
        console.log('url')
        chrome.runtime.sendMessage({urlMonitoring: newState});
        
      })
      return newState;
    })
  }

  
  // TODO: add edit popup container to edit todo items
// store todo items somewhere
  return (<div className="popupContainer">
    {/* TODO: Add BIG Be Productive Mode / Enable URL monitoring Button */}
    <div>

    </div>
    <button onClick={getToDoList}>PUsh to Test</button>
    <div className="horizontalCenter">

      <p className="hoverpointer"
      data-tip="Enable / Disable URL monitoring to improve productivity"
      onClick={toggleUrlMontoring}
      style={{width: '55px', margin: '0 auto'}}
      >{( 
        monitoring ? 
      <WbIncandescentIcon color="primary" 
        style={{fontSize: '50px', color: 'yellow'}}
      /> :
      <WbIncandescentIcon color="disabled" 
        style={{fontSize: '50px'}}/>
        )}
      </p>
      
    </div>
    <div 
    // className="horizontalCenter"
    style={{height: '70px',
      position: 'relative',
      paddingLeft: '40px',
      paddingRight: '35px',
      width: 'auto',
      overflow: 'hidden'
    }}
    >
      
   
    <BaseInput 
    style={{width: '430px'}}
        className={classes.BaseInput_autoWidth}
        htmlId="TODO-INPUT"
        name="TODO-INPUT"
        label="Add your todo!"
        onChange={onChangeHandler}
        onKeyDown={onEnterPress}
        placeholder="placeholder"
        value={value}
      />
      <span
      //  onClick={()=> {addItem(value)}}
      style={{
        // height: '50px', float: 'right', 
      right: '35px', position: 'absolute', top: '27px'}}>
        <button style={{height: '30px'}} onClick={()=> {addItem(value)}}>
          {/* <PostAddIcon color="primary" style={{fontSize: '20px'}}/> */}
          +
        </button>
      </span>
     
    </div>
    <div>
      <List options={options} removeItem={removeItem} onUpdate={updateItem}/>
    </div>
    
  </div>);
}


