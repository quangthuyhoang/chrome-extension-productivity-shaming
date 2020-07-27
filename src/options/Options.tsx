import React, { useState, useEffect } from "react";
import Label from './../popup/components/Label/Label';
import classNames from 'classnames';
import BaseInput from './../popup/components/BaseInput/BaseInput';
import { Button, Icon } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Dropdown from './components/Dropdown/Dropdown';
import Grid from '@material-ui/core/Grid';
import Header from './components/Header';
import { getPermission, 
  removePermissions, 
  updateChromeStorageApi, 
  checkPermissions, 
  checkUrlsFor, 
  getChromeStorageApi } from './../utils/chromeRequest/index';
import { Toolbar } from "material-ui";


const styles = theme => ({
  iconSmall: {
    fontSize: 20,
  },
  gridRow: {
    margin: '25px 25px 0px 25px'
  },
});




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
          }
        })
        .catch(err => { 
          console.error(`permissions denied:  ${err}`); 
          setSaveStatus(false); 
          setMessage(`permissions denied`); 
          setError(true); 
        })
      }
      
    })
  }


  const enableUrlMonitoringPermissions = () => {
    getChromeStorageApi('origins', function(results) {
      let query = results ? results['origins']['origins'] : null;
      
      checkPermissions(['all'], function(granted) {
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
      if(results) {
        checkPermissions(['all'], (permissions) => {
          setOptions(permissions['origins'])
        })
      }
    })
  }
  return (
    <div>
       
      <Container
        maxWidth="sm" 
        style={{
          paddingLeft: '0', 
          paddingRight: '0', 
          paddingBottom: '25px', 
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)', 
          marginTop: '25px'
          }}
      >
      <Header />
        <div style={{paddingLeft: '24', paddingRight: '24'}}> 
        <Grid item xs={12} className={classes.gridRow}>
          <BaseInput 
            htmlId="urlinput" 
            name="urlinput" 
            label="Add distracting website you want to avoid to improve productivity" 
            onChange={handleChange}
            success={saveStatus}
            message={message}
            error={error}
            placeholder="ex: https://www.reddit.com/"
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
        </Grid>
          
        <Grid item xs={12} className={classes.gridRow}>
          <Dropdown 
            width={550} 
            options={options} 
            onDelete={handleRemoveOption} 
            label="View and edit extension permission"
          />
        </Grid>
      </div>
      </Container>
       </div>
  )
}

export default withStyles(styles)(Options);

