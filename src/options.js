// Saves options to chrome.storage
function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    origins: [],
    permissions: []
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function getPermission() {
  chrome.permissions.request({
    permissions: ['tabs'],
    origins: ["https://www.reddit.com/*","https://www.youtube.com/*" ]
}, function(granted) {
    if (granted) {
        chrome.runtime.sendMessage({permission: "granted"})
    } else {
        alert("denied " + granted)
    }
})
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
// function restore_options() {
//   // Use default value color = 'red' and likesColor = true.
//   chrome.storage.sync.get({
//     favoriteColor: 'red',
//     likesColor: true
//   }, function(items) {
//     document.getElementById('color').value = items.favoriteColor;
//     document.getElementById('like').checked = items.likesColor;
//   });
// }
// document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('getPermission').addEventListener('click', getPermission);