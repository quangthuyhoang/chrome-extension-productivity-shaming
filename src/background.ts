var count = 0;
// TODO: add feature to persist url monitoring setting when closing or opening browser
chrome.storage.sync.get(['urlMonitoring'], function(object) {
  
  if(object && object['urlMonitoring']) {
    chrome.webNavigation.onBeforeNavigate.addListener(enableUrlMonitoring)
    console.log('callback ', object)
    // return callback(object);
  }
})

chrome.permissions.getAll(function(results) { console.log('all permissions', results)})

chrome.runtime.onMessage.addListener(function(request) {
  // alert('request ' + request.type)
  console.log('request', request)
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
  
  if (!request.urlMonitoring) {
    chrome.webNavigation.onBeforeNavigate.removeListener(enableUrlMonitoring)
  }

  if (request.urlMonitoring) {
    console.log('enable url monitoring')
    chrome.webNavigation.onBeforeNavigate.addListener(enableUrlMonitoring)
  }

  if (request.permission == "disable") {
    console.log('disable')
    chrome.webNavigation.onBeforeNavigate.removeListener(enableUrlMonitoring)
  }

  if (request.permission == "granted") {
    console.log('enable url monitoring')

    chrome.webNavigation.onBeforeNavigate.addListener(enableUrlMonitoring)
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

function enableUrlMonitoring({url, ...rest}) {
  checkPermissions(url, function(results) {
    console.log("resulsts", results, url)
    if(results) { // think of a better way to reduce multiple calls
      if(count < 1) {alert('details ' + url + " count " + count)}; // Add pop box instead of alert
      count++;
      setTimeout(function(){
        count = 0;
      }, 10000) // TODO: add configurable settimeout, but with default to be maybe a couple of hrs
    }
  
})
}