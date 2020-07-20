import React, { useState, useEffect } from "react";
import "./Popup.scss";
import List from './components/List';
import BaseInput from "./components/BaseInput";
import classNames from 'classnames';

const defaultOptions = [ {value: 'aq', label: '0', checked: false}, {label: '1', value: 'aq', checked: false}, {label: '2', value: 'aq', checked: false}, {label: '3', value: 'aq', checked: false}];

type TOption ={
  label: string,
  value: string,
  checked?: boolean,
};

type TOptions = TOption[] | undefined;

export default function Popup(any) {

  const [ value, setValue ] = useState<string>('');
  const [ options, setOptions ] = useState<TOptions>(defaultOptions);

  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
    var a;
    // TODO: add in
    chrome.runtime.sendMessage({ urls: ['www.google.com', 'abc.com', 'd']})
  }, []);

  const addItem = (value: string) => {
    setOptions((prevOptions: TOptions) => {
      let label = Number(prevOptions[String(prevOptions.length - 1)].label) + 1;
      const item: TOption = { label: label.toString() , value };
      return [...prevOptions, item];
    })
  };

  const removeItem = (label: string) => {
    setOptions(prevOptions => {
      const newOptions = prevOptions
      .filter(option => label !== option.label);
      return newOptions;
    })
  }

  const updateUrls = (url: string = 'https://www.youtube.com') => {
    chrome.runtime.sendMessage({ urls: [url]});
  }

  // TODO: add edit popup container to edit todo items

  return (<div className="popupContainer">
    <div className="horizontalCenter">
    <BaseInput 
        
        htmlId="TODO-INPUT"
        name="TODO-INPUT"
        label="Add your todo!"
        onChange={({target: {value}})=> setValue(value)}
        placeholder="placeholder"
      />
      <button onClick={()=> {addItem(value)}}>+</button>
      <button onClick={()=> {updateUrls()}}>Send URL</button>
    </div>
    <div>
      <List options={options} removeItem={removeItem} />
    </div>
    
  </div>);
}


