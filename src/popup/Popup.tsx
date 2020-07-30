import React, { useState, useEffect } from "react";
import "./Popup.scss";
import List from './components/List';
import BaseInput from "./components/BaseInput";
import WbIncandescentTwoToneIcon from '@material-ui/icons/WbIncandescentTwoTone';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import classNames from 'classnames';
import { getChromeStorageApi, addChromeStorageApi } from './../utils/chromeRequest/index';

type TOption ={
  label: string,
  value: string,
  checked?: boolean,
};

type TOptions = TOption[] | undefined;

export default function Popup(any) {

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

  const addItem = (value: string) => {
    if (value && value.length > 0) {
      setOptions((prevOptions: TOptions) => {
        let label = Number(prevOptions[String(prevOptions.length - 1)].label) + 1;
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
    chrome.permissions.contains({
      permissions: ['tabs'],
      origins: ['https://www.youtube.com/*']
    }, function(results) {
      console.log('permissions', results)
    })
    chrome.permissions.getAll(function(results) {
      console.log(results)
    })
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
    <button onClick={getToDoList}>PUsh to Test</button>
    <div className="horizontalCenter">
      <p>Enable URL Monitoring</p>
      <p className="hoverpointer"
      data-tip="Enable / Disable URL monitoring to improve productivity"
      onClick={toggleUrlMontoring}
      >{( monitoring ? <WbIncandescentIcon color="primary" style={{fontSize: '50px', color: 'yellow'}}/> :
      <WbIncandescentIcon color="disabled" style={{fontSize: '50px'}}/>)}</p>
      
    </div>
    <div className="horizontalCenter">
    <BaseInput 
        
        htmlId="TODO-INPUT"
        name="TODO-INPUT"
        label="Add your todo!"
        onChange={onChangeHandler}
        onKeyDown={onEnterPress}
        placeholder="placeholder"
        value={value}
      />
      <button onClick={()=> {addItem(value)}}>+</button>
    </div>
    <div>
      <List options={options} removeItem={removeItem} />
    </div>
    
  </div>);
}


