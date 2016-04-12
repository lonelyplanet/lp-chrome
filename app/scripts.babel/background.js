'use strict';

// chrome.browserAction.setBadgeText({text: '\'Allo'});
// 
function navigate(url) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    if (!tabs) return;

    chrome.tabs.update(tabs[0].id, {
      url: url
    });
  });
}

let timer;
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fetch(`https://www.lonelyplanet.com/search.json?q=${text}`)
        .then((response) => response.json())
        .then((results) => {
          suggest(results.map((r) => {
            return {
              content: `https://www.lonelyplanet.com/${r.slug}`,
              description: r.name.replace(/\&/, " and ")
            };
          }));
        });
    }, 200);
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    if (text.indexOf("http") > -1) {
      navigate(text);
    } else {
      navigate(`https://www.lonelyplanet.com/search?q=${text}`)
    }
  });

chrome.omnibox.onInputCancelled.addListener(() => {
  return false;
});



chrome.omnibox.setDefaultSuggestion({
  description: 'lp: Search Lonely Planet for %s'
});
