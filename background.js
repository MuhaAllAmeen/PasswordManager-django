// import {axiosaddCredentialsToDatabase} from './src/utils.js'
// import './src/utils.js'

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const [currenttab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  let cookies;
  await chrome.cookies.getAll({
    domain: "127.0.0.1",
    name:'csrftoken'
  }, function (theCookies) {
      cookies = theCookies[0].value
      chrome.tabs.sendMessage(tabId, 
        { 
        action: "readInputs",
        tabDetails: currenttab,
        csrftoken : cookies
      }, 
        function(response) {
        console.log('Background script received response:', response);
      });  });
  
    
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action == 'post') {
    console.log('Attempting to fetch with URL:', 'http://localhost:8000/add');
    console.log('Request body:', msg);

    fetch('http://localhost:8000/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': msg.csrftoken,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: new URLSearchParams({
        'website': msg.url,
        'username': msg.email,
        'password': msg.password
      }),
    })
    .then(response => {
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      return response.text();
    })
    .then(data => {
      console.log('Response data:', data);
      sendResponse({success: true, data: data});
    })
    .catch(error => {
      console.error('Fetch error:', error);
      sendResponse({success: false, error: error.message});
    });

    return true; // Indicates that the response is sent asynchronously
  }
});
