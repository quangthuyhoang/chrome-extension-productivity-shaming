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