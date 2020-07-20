var count = 0;
chrome.runtime.onMessage.addListener(function(request) {
  // alert('request ' + request.type)
  if (request.type === 'request_password') {
      chrome.tabs.create({
          url: chrome.extension.getURL('dialog.html'),
          active: false
      }, function(tab) {
          // After the tab has been created, open a window to inject the tab
          chrome.windows.create({
              tabId: tab.id,
              type: 'popup',
              focused: true
              // incognito, top, left, ...
          });
      });
  }

  if (request.permission == "granted") {
  
    chrome.webNavigation.onBeforeNavigate.addListener(function({url, ...rest}) {
      checkPermissions(url, function(results) {
        console.log("resulsts", results)
        if(results) { // think of a better way to reduce multiple calls
          if(count < 1) {alert('details ' + url + " count " + count)}; // Add pop box instead of alert
          count++;
          setTimeout(function(){
            count = 0;
          }, 10000) // TODO: add configurable settimeout, but with default to be maybe a couple of hrs
        }
      
    })
  //  chrome.tabs.onActivated.addListener(function(activeInfo) {
  //    chrome.tabs.get(activeInfo.tabId, function(tab) {
      // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
      //   if(changeInfo.url) {
      //     getPermissions(changeInfo.url, function(results) {
      //       if(results) {
      //         alert('test ' + changeInfo.url + " " + results)
      //       }
            
      //     })
         
      //   }
        
      // })
    
    //   chrome.tabs.create({
    //     url: chrome.extension.getURL('dialog.html'),
    //     active: false
    // }, function(tab) {
    //     // After the tab has been created, open a window to inject the tab
    //     chrome.windows.create({
    //         tabId: tab.id,
    //         type: 'popup',
    //         focused: true
    //         // incognito, top, left, ...
    //     });
    // });
    //    chrome.tabs.executeScript({
    //   code: ` alert('granted 2 '  ${+ tab.url})`,
    //   // file: 'js/open-dialog.js'
    // })
    //  })
   })
  }
});
function setPassword(password) {
  // Do something, eg..:
  console.log(password);
};

function checkPermissions(url, cb) {
  chrome.permissions.contains({
    permissions: ['tabs'],
    origins: [url]
  }, function(results) {
    return cb(results)
  } )
}

if(chrome.runtime.lastError) {
  alert('some runtime errror: ' + chrome.runtime.lastError.message)
};