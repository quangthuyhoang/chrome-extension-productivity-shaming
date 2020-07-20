// // if (confirm('Open dialog for testing?'))
//     // chrome.runtime.sendMessage({type:'request_password'});
// (function(window){
//     window.onload = (ev) => {
//         chrome.runtime.sendMessage({permission: "granted"})
//         // chrome.permissions.request({
//         //     permissions: ['tabs'],
//         //     origins: ["https://*/*"]
//         // }, function(granted) {
//         //     if (granted) {
//         //         chrome.runtime.sendMessage({permission: "granted"})
//         //     } else {
//         //         alert("denied")
//         //     }
//         // })
//     }
// })(window);

// chrome.tabs.create({
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

alert('open dialog')