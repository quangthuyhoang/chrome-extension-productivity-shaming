import { getChromeStorageApi, updateChromeStorageApi, checkPermissions} from './utils/chromeRequest';
var count = 0;

// check current tabid for url change - done

  // saves current tabid in state in case user moves to different tab? 

// if matches to filter list execute scripts - done

// scripts check if the current tabid finishes loading,

// one current tab finishes loading inject modal scripts - done

// TODO: add feature to persist url monitoring setting when closing or opening browser
chrome.storage.sync.get(['urlMonitoring'], function(object) {
  
  if(object && object['urlMonitoring']) {
    chrome.webNavigation.onBeforeNavigate.addListener(enableUrlMonitoring)
  }
})

chrome.permissions.getAll(function(results) { console.log('all permissions', results)})

chrome.runtime.onMessage.addListener(function(request) {
  // if (request.modal){
  //   chrome.tabs.executeScript({
  //     // code: 'document.body.style.backgroundColor="orange"'
  //     file: 'js/modal.js'
  //   });
  // }

  // console.log('request ' + request.type)

  
  if (!request.urlMonitoring) {
    
    // chrome.webNavigation.onBeforeNavigate.removeListener(enableUrlMonitoring)
    // chrome.webNavigation.onDOMContentLoaded.removeListener(enableUrlMonitoring)
    console.log('remove listeners')
    chrome.webNavigation.onCompleted.removeListener(enableUrlMonitoring)
    // console.log(chrome.tabs.onUpdated)
    chrome.tabs.onUpdated.removeListener(modalScriptInjection);
  }

  if (request.urlMonitoring) {
    // chrome.webNavigation.onDOMContentLoaded.addListener(enableUrlMonitoring)
    chrome.webNavigation.onCompleted.addListener(enableUrlMonitoring)
  }

  // if (request.permission == "disable") {
  //   chrome.webNavigation.onBeforeNavigate.removeListener(enableUrlMonitoring)
  // }

  // if (request.permission == "granted") {
  //   chrome.webNavigation.onBeforeNavigate.addListener(enableUrlMonitoring)
  // }
});
if(chrome.runtime.lastError) {
  console.log('some runtime errror: ' + chrome.runtime.lastError.message);
};

var modalScriptInjection = function(tab, changeInfo) {
  console.log('modal inejction tabs', tab)
  if (changeInfo?.status === "complete") {
    console.log('inject modal scripts')
    chrome.tabs.executeScript({
      file: 'js/modal.js'
    }, function(results) {
      console.log('execute scripts for modal')
    });
  }
}

function tabStatus(){
  // return new Promise((resolve, reject) => {
    chrome.tabs.onUpdated.addListener(modalScriptInjection)
    // chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      // modalScriptInjection({tabId, changeInfo, tab}, chrome)
    //   modalScriptInjection({tabId, changeInfo, tab})
    // });
    // chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    //   if (changeInfo?.status === "complete") {
    //     console.log('inject modal scripts', tabId, changeInfo, tab)
    //     chrome.tabs.executeScript({
    //       // code: "alert('hey')" //'document.body.style.backgroundColor="orange"'
    //       file: 'js/modal.js'
    //     }, function(results) {
    //       console.log('execute scripts for modal', tab)
    //     });
    //   }
    
    // })
  // })
}

function enableUrlMonitoring({url, ...rest}) {
  checkPermissions([url], function(results) {
    console.log("resulsts", results, url)
    if(results) { // think of a better way to reduce multiple calls
      if(count < 1) { // why doesn't it thing pop up
        tabStatus()
        // chrome.tabs.executeScript({
        //   // code: "alert('hey')" //'document.body.style.backgroundColor="orange"'
        //   file: 'js/modal.js'
        // }, function(results) {
        //   console.log('execute scripts for modal')
        // });
        // injectModalToCurrentWindow();
        // getAllWindows().then(logger).catch(logger)
        // createWindow().then(res => console.log(res)).catch(err => console.error(err));
        // alert('shame')
      }; // Add pop box instead of alert
      count++;
      setTimeout(function(){
        count = 0;
      }, 10000) // TODO: add configurable settimeout, but with default to be maybe a couple of hrs
    }
  
})
}
function logger(obj) {
  console.log(obj)
}

function getAllWindows(){
  return new Promise((resolve, reject) => {
    chrome.windows.getAll(function(windows) {
      if (windows && windows.length > 0) {
        resolve(windows)
      } else {
        reject({error: true, message: windows})
      }
    })
  })
}

function createWindow() {
  return new Promise((resolve, reject) => {
    chrome.windows.create({
    
      url: chrome.extension.getURL('dialog.html'),
      type: 'popup',
      focused: true,
      height: 300,
      width: 300
      // incognito, top, left, ...
    }, function(window) {
      if(window) {
        resolve(window);
      } else {
        reject(`window did not exist`)
      }
    });
  })
}

function injectModalToCurrentWindow(){
  chrome.browserAction.onClicked.addListener(function (tab) {
      // for the current tab, inject the "inject.js" file & execute it
      chrome.tabs.executeScript(tab.id, {
          
          file: 'js/urlFilter.js'
      });
  });
}



// function renderReminder() {
//   // check if tabid already exist
//   getChromeStorageApi('currentDialogId', (results) => {
//     console.log('got the id from storage ' + results['currentDialogId'])
//     if(results && results['currentDialogId']) {
//       const windowsId = results['currentDialogId'];
//       console.log('results exist')
//       chrome.windows.get(3668, {}, (window) => {

//       console.log('here', window)
      
//         if(window) {
//           const str = JSON.stringify(window)
//           console.log(window.id + " " + window.focused + " " + str)
//         } else {
//           chrome.tabs.create({
//             url: chrome.extension.getURL('dialog.html'),
//             active: false
//           }, function(tab) {
            
//             chrome.storage.sync.set({'currentDialogId': tab.id},()=> {
//               chrome.windows.create({
//                 tabId: tab.id,
//                 type: 'popup',
//                 focused: true
//                 // incognito, top, left, ...
//           });
//           console.log('saved ' +tab.id)
//             })
            
//             // After the tab has been created, open a window to inject the tab
//             console.log('pop up window ' + tab.id)
//         })
//           console.log('no id ' + window)
//         }
//       })
//       chrome.windows.update(windowsId, { focused: true})
//       // console.log('focused ' + windowsId)
//     } else { // pop up new window
//       chrome.tabs.create({
//         url: chrome.extension.getURL('dialog.html'),
//         active: false
//       }, function(tab) {
//         // console.log(tab.id)
      //   chrome.storage.sync.set({'currentDialogId': tab.id},()=> {
      //     chrome.windows.create({
      //       tabId: tab.id,
      //       type: 'popup',
      //       focused: true
      //       // incognito, top, left, ...
      // });
      //   })
//         // After the tab has been created, open a window to inject the tab
        
//     });
//     }
//   })

//   // if not

//   // return 
// }