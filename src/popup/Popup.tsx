import React, { useState, useEffect } from "react";
import "./Popup.scss";
import List from './components/List';
import BaseInput from "./components/BaseInput";
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

  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    // chrome.runtime.sendMessage({ popupMounted: true });

    getChromeStorageApi('todos', (results) => {
      const initializedTodos = results['todos'] ? results['todos'] : options;
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

  const updateUrls = (url: string = 'https://www.youtube.com') => {
    chrome.runtime.sendMessage({ urls: [url]});
  }

  const getToDoList = () => {
    getChromeStorageApi('todos', (results) => {
      console.log('got the results', results)
    })
  }


  // TODO: add edit popup container to edit todo items
// store todo items somewhere
  return (<div className="popupContainer">
    {/* TODO: Add BIG Be Productive Mode / Enable URL monitoring Button */}
    <button onClick={getToDoList}>PUsh to Test</button>
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
      <button onClick={()=> {updateUrls()}}>Send URL</button>
    </div>
    <div>
      <List options={options} removeItem={removeItem} />
    </div>
    
  </div>);
}


