import React, { useState, useEffect } from "react";
import Label from './../popup/components/Label/Label';
import classNames from 'classnames';
import BaseInput from './../popup/components/BaseInput/BaseInput';
import { Button, Icon } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Dropdown from './components/Dropdown/Dropdown';

const bu = ["https://www.icefilms-info.com/*", "https://www.reddit.com/*", "https://www.youtube.com/*"]

const styles = theme => ({
  iconSmall: {
    fontSize: 20,
  },
})

function Options({classes, ...props}) {
  const [ urlInput, setUrlInput ] = useState<string>('');
  const [ saveStatus, setSaveStatus ] = useState<boolean>(false);
  const [ error , setError ] = useState<string>('');

  const handleChange = ({target: {value}}) => {
    setUrlInput(value);
    setSaveStatus(false);
    
  }
// TODO: access the storage item to execute the option popup

  const handleSave = (key) => {
    checkPermissions(['all'], function({permissions, origins}) {
      const permissionOption = Object.assign( //TODO: rewrite to be more reusable
        {}, 
        { 
          permissions,
          origins: [...origins, urlInput]
        }
      );
      getPermission(permissionOption).then(granted => {
        if (granted) {
          chrome.runtime.sendMessage({permission: "granted"})
          updateChromeStorageApi('permissionOption',permissionOption, function(results) {
            if(results.error) {
              console.error(results.error) // TODO: add error validation 
              // setError(results.error);
            }
            console.log(`${results['origins']} saved`);
            // setError('');
            setSaveStatus(true);
          })
          
        }
      })
      .catch(err => console.error(`permissions denied`))
    })
  }

  // temp test getPermissions
  const enableUrlMonitoringPermissions = () => {
    getChromeStorageApi('permissions', function(results) {
      let query = results ? results['origins'] : null;
      console.log(query, results['origins'])
      checkPermissions(query, function(granted) {
        if (granted) {
          chrome.runtime.sendMessage({permission: "granted"});
      } else {
          alert("denied " + granted);
      }
      })
    })
  }
  return (
    <div>
      <Container maxWidth="sm">
        <form>
          <Label htmlFor="options" label="origins option"/>
          <select>
            <option>1</option>
            <option>2</option>
            <option>2</option>
          </select>
          <Dropdown options={bu}/>
        </form>
        <form>
          <BaseInput 
            htmlId="urlinput" 
            name="urlinput" 
            label="Add URL" 
            onChange={handleChange}
            success={saveStatus}
            message="saved"
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
     {/* Add Dropdown selection to remove existing origins here */}
      
        Test
        <Button onClick={()=>{enableUrlMonitoringPermissions()}}>Turn on URL monitoring</Button>
        <Button onClick={()=>{removePermissions({origins: ["https://www.xkcd.com/*"]}, (results) => console.log(results))}}>Remove permissions</Button>
        <Button onClick={()=>{getChromeStorageApi('origins', null)}}>Get Storage options</Button>
        <Button onClick={()=>{checkPermissions(['all'], (res) => console.log(res))}}>Get All Permissions options</Button>
       </div>
  )
}

export function updateChromeStorageApi(key: string, value: any, callback) {
  chrome.storage.sync.get(key, function(result) {
    let storageBlob = result;
    if(!result[key]) {
      return callback({error: `${value} does not exist`});
    } else {
      storageBlob[key] = value; //TODO: add feature to check diff and only add / remove new item
    }

    return chrome.storage.sync.set(storageBlob, callback(storageBlob))
  })
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
      return callback(object);
    }
  })
}

export function getPermission({permissions = ['tabs'], origins}) {
  return new Promise((resolve, reject) => {
    chrome.permissions.request({
      permissions,
      origins
  }, function(granted) {
      if (granted) {
          return resolve({permissions, origins});
      } else {
        return reject(granted);
      }
  })
  }) 
}

export function removePermissions(permissions, callback) {
  chrome.permissions.remove(permissions, function(result) {
    return callback(result)
  })
}

export function checkPermissions(urls: string[], cb: Function | null) {
  if(urls[0]?.toLowerCase() === 'all') {
    return chrome.permissions.getAll(function(permissions){
      return cb(permissions);
    });
  }
  chrome.permissions.contains({
    permissions: ['tabs'],
    origins: urls
  }, function(granted) {
    return cb(granted)
  } )
}

export default withStyles(styles)(Options);

