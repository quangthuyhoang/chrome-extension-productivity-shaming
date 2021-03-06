export function updateChromeStorageApi(key: string, value: any, callback) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({[key]: value}, ()=> {
      resolve({[key]: value})
    })
  })
  chrome.storage.sync.get(key, function(result) {
    let storageBlob = result;
    if(!result[key]) {
      const strVal = typeof value === 'object' ? JSON.stringify(value) : value;
      return callback({error: `${strVal} does not exist`});
    } else {
      storageBlob[key] = value; //TODO: add feature to check diff and only add / remove new item
    }

    return 
  })
}

export function addChromeStorageApi(key: string, value: any, callback) {
  // const sKey = key
  if(!key || key == null) {
    return callback({error: `key: ${key} is incorrect or not supplied`})
  } else {
    chrome.storage.sync.get(key, function(result) {
      let storageBlob = result;
      if(!result[key]) {
        storageBlob[key] = value;
      } else {
        storageBlob[key] = [...result[key], value];
      }
  
      // chrome.storage.sync.set({`${key}`: storageBlob[key]}, callback(storageBlob))
    })
  }
}

type TKey = string[] | string;

export function getChromeStorageApi(key: TKey = null, callback: Function | null  = null) { // null gets the entire object
  const sKey =  typeof key === 'string' ? [key] : key;
  chrome.storage.sync.get(sKey, function(object) {
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
      } else { // TODO: add validators to update reject message to include edge case where user forgot to add "/" afater .com or auto add it yourself
        return reject(`Something went wrong with updating chrome permissions`);
      }
  })
  })
}

export function removePermissions(permissions, callback = null) {
  console.log(permissions)
  chrome.permissions.remove(permissions, function(result) {
    if (callback) {
      return callback(result)
    }
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


export const compareUrlHostName = (url1, url2) => {
  const u1 = new URL(url1);
  const u2 = new URL(url2);
  return u1.host === u2.host;
}

export const checkUrlsFor = (arr, referenceElement) => {
  for(const el of arr) {
    if(compareUrlHostName(el, referenceElement)) {
      return true;
    }
  }
  return false;
}

export function modalScriptInjection(tabId, changeInfo, tab) {
  if (changeInfo?.status === "complete") {
    console.log('inject modal scripts', tabId, changeInfo, tab)
    chrome.tabs.executeScript({
      // code: "alert('hey')" //'document.body.style.backgroundColor="orange"'
      file: 'js/modal.js'
    }, function(results) {
      console.log('execute scripts for modal', tab)
    });
  }
}
// function findHighestZIndex(elem) // TODO: make function to get highest zIndex to cover everything
// {
//   var elems = document.getElementsByTagName(elem);
//   var highest = 0;
//   for (var i = 0; i < elems.length; i++)
//   {
//     var zindex = document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index");
//     if ((zindex > highest) && (zindex != 'auto'))
//     {
//       highest = zindex;
//     }
//   }
//   return highest;
// }