export function updateChromeStorageApi(key: string, value: any, callback) {
  chrome.storage.sync.get(key, function(result) {
    let storageBlob = result;
    if(!result[key]) {
      const strVal = typeof value === 'object' ? JSON.stringify(value) : value;
      return callback({error: `${strVal} does not exist`});
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
      console.log('callback ', object)
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