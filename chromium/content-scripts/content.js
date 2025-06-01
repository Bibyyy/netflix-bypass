const script = document.createElement('script');
script.src = chrome.runtime.getURL('content-scripts/inject.js');
(document.head || document.documentElement).appendChild(script);
script.onload = () => script.remove();