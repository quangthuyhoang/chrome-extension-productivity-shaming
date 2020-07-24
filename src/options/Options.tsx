import React, { useState, useEffect } from "react";
import Label from './../popup/components/Label/Label';
import classNames from 'classnames';
import BaseInput from './../popup/components/BaseInput/BaseInput';
import { Button, Icon } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Dropdown from './components/Dropdown/Dropdown';
import { getPermission, 
  removePermissions, 
  updateChromeStorageApi, 
  checkPermissions, 
  checkUrlsFor } from './../utils/chromeRequest/index';

const bu = ["https://www.icefilms-info.com/*", "https://www.reddit.com/*", "https://www.youtube.com/*"]

const styles = theme => ({
  iconSmall: {
    fontSize: 20,
  },
})

function Options({classes, ...props}) {
  const [ urlInput, setUrlInput ] = useState<string>('');
  const [ saveStatus, setSaveStatus ] = useState<boolean>(false);
  const [ error , setError ] = useState<boolean>(false);
  const [ options, setOptions ] = useState([]);
  const [message, setMessage] = useState('saved');

  useEffect(() => {
    checkPermissions(['all'], (res) => {
      if(res) {
        setOptions(res['origins']);
      }
    })
  }, [])

  const handleChange = ({target: {value}}) => {
    setUrlInput(value);
    setSaveStatus(false); // resets save status and message 
    setError(false)
    setMessage('saved'); // TODO: refactor reset status to its own function later and refactor entire with it
  }
// TODO: access the storage item to execute the option popup

  const handleSave = (key) => {
    checkPermissions(['all'], function({permissions, origins}) { 
      if(checkUrlsFor(origins, urlInput)) { // check if origin value / url already exists validation
        setError(true);
        setSaveStatus(false);
        setMessage(`Already exists`);
        return;
      } else { // save permission
        const permissionOption = Object.assign( // TODO: rewrite to be more reusable
          {}, 
          { 
            permissions,
            origins: [...origins, urlInput]
          }
        );
        getPermission(permissionOption).then(granted => { // confirm saved to chrome api permissions
          if (granted) {
            checkPermissions(['all'], (permissions) => {
              setOptions(permissions['origins'])
              setError(false);
              setMessage('saved');
              setSaveStatus(true);
            })
       
            chrome.runtime.sendMessage({permission: "granted"}) // execute script for url monitoring with updated permissions
            // updateChromeStorageApi('permissionOption',permissionOption, function(results) {
            // console.log('results', results)
            //   if(results.error) {
            //     console.error(results.error) 
            //     setSaveStatus(false);
            //     setMessage(results.error)
            //     setError(true);
            //   } else {
                // setError(false);
                // setMessage('saved');
                // setSaveStatus(true);
            //   }
              
            // })
            
          }
        })
        .catch(err => { console.error(`permissions denied:  ${err}`); setSaveStatus(false); setMessage(`permissions denied`); setError(true); })
      }
      
    })
  }


  const enableUrlMonitoringPermissions = () => {
    getChromeStorageApi('origins', function(results) {
      let query = results ? results['origins']['origins'] : null;
      
      checkPermissions(['all'], function(granted) {
        console.log('granted', granted)
        if (granted) {
          chrome.runtime.sendMessage({permission: "granted"});
      } else {
          alert("denied " + granted);
      }
      })
    })
  }

  const handleRemoveOption = (item) => {

    removePermissions({origins: [item]}, (results) => {
      console.log('results', results)
      if(results) {
        checkPermissions(['all'], (permissions) => {
          setOptions(permissions['origins'])
        })
      }
    })
  }
  return (
    <div>
      <Container maxWidth="sm">
        <form>
          <Label htmlFor="options" label="origins option"/>
        
          <Dropdown options={options} onDelete={handleRemoveOption}/>
        </form>
        <form>
          <BaseInput 
            htmlId="urlinput" 
            name="urlinput" 
            label="Add URL" 
            onChange={handleChange}
            success={saveStatus}
            message={message}
            error={error}
          />
          <Button 
            variant="contained" 
            size="small" 
            className={classes.button} 
            onClick={()=> {handleSave('origins')}}
          >
            <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
            Save
          </Button>
        </form>
      </Container>

      
        Test
        <Button onClick={()=>{enableUrlMonitoringPermissions()}}>Turn on URL monitoring</Button>
        <Button onClick={()=>{removePermissions({origins: ["https://www.reddit.com/*"]}, (results) => console.log(results))}}>Remove permissions</Button>
        <Button onClick={()=>{getChromeStorageApi('origins', null)}}>Get Storage options</Button>
        <Button onClick={()=>{checkPermissions(['all'], (res) => console.log(res))}}>Get All Permissions options</Button>
       </div>
  )
}

export function addChromeStorageApi(key: string, value: any, callback) {
  chrome.storage.sync.get(key, function(result) {
    let storageBlob = result;
    if(!result[key]) {
      storageBlob[key] = value;
    } else {
      storageBlob[key] = [...result[key], value];
    }

    chrome.storage.sync.set(storageBlob, callback(storageBlob))
  })
}

export function getChromeStorageApi(key: string = null, callback: Function | null  = null) { // null gets the entire object
  chrome.storage.sync.get(key, function(object) {
    console.log(object)
    if(callback) {
      console.log('callback ', object)
      return callback(object);
    }
  })
}

export default withStyles(styles)(Options);

