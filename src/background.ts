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
    // chrome.webNavigation.onBeforeNavigate.addListener(enableUrlMonitoring)
    chrome.tabs.onUpdated.addListener(modalScriptInjection);
  }
})

chrome.permissions.getAll(function(results) { console.log('all permissions', results)})

chrome.runtime.onMessage.addListener(function(request) {

  if (request.tabListener) {
    console.log('enable tablistener')
    chrome.tabs.onUpdated.hasListener(tabsOnUpdatedListener);
    chrome.tabs.onUpdated.addListener(tabsOnUpdatedListener);
  }
console.log('request', request)
  
  if (!request.urlMonitoring) {
    
    // chrome.webNavigation.onBeforeNavigate.removeListener(enableUrlMonitoring)
    chrome.tabs.onUpdated.removeListener(modalScriptInjection);
    // chrome.webNavigation.onDOMContentLoaded.removeListener(enableUrlMonitoring)
    console.log('remove listeners')
    // chrome.webNavigation.onCompleted.removeListener(enableUrlMonitoring)
    // console.log(chrome.tabs.onUpdated)
    // chrome.tabs.onUpdated.removeListener(modalScriptInjection);
    // chrome.tabs.onUpdated.removeListener(loggerListener);
    
  }
  // enable url monitoring - add listener to start referencing urls from permissions origins
  if (request.urlMonitoring) {
    chrome.tabs.onUpdated.addListener(modalScriptInjection);

    // chrome.webRequest.onBeforeRequest.addListener(
    //   webRequestListener, // callback
    //   webRequestFilter, // filter arguments
    //   opt_extraInfoSpec // optional extra info arguments
    //   )
    // chrome.webNavigation.onCompleted.addListener(enableUrlMonitoring)
    // chrome.webNavigation.onCompleted.addListener(loggerListener)
    // chrome.tabs.onUpdated.addListener(modalScriptInjection) // adding this line here allows first pop up after enabling monitoring to work, but disabling doesn't work

  }

 
});
if(chrome.runtime.lastError) {
  console.log('some runtime errror: ' + chrome.runtime.lastError.message);
};

var modalScriptInjection = function(tabid, changeInfo, tab) {
  checkPermissions([tab.url], function(results) {
    console.log('injection check ', results)
    if (results) {
      console.log('modal inejction tabs', tabid, 'changeInfo', changeInfo, 'tab',tab)
      if (changeInfo?.status === "complete" || tab.status === "complete") {
        console.log('inject modal scripts')
        chrome.tabs.executeScript({
          file: 'js/modal.js'
        }, function(results) {
          console.log('execute scripts for modal')
        });
      }
    }
  })
  
}


function tabStatus(){

    chrome.tabs.onUpdated.addListener(modalScriptInjection);
    chrome.tabs.onUpdated.addListener(loggerListener)

}

function tabsOnUpdatedListener(...params) {
  console.log('tabs', params);
}

function loggerListener(...params) {
  console.log('logger', params)
}

function webRequestListener(...params) {
  console.log('webRequest', params);
  chrome.runtime.sendMessage({tabListener: true})
}

var webRequestFilter = { urls: ["<all_urls>"]};
var opt_extraInfoSpec = [];

function enableUrlMonitoring({url, ...rest}) {
  checkPermissions([url], function(results) {
    console.log("resulsts", results, url)
    if(results) { // think of a better way to reduce multiple calls
      tabStatus()
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

export function createWindow() {
  const h = window.outerHeight;
const w = window.outerWidth;
  return new Promise((resolve, reject) => {
    chrome.windows.create({
    
      url: chrome.extension.getURL('dialog.html'),
      type: 'popup',
      focused: true,
      height: 600,
      width: 800
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