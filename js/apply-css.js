/**
  * This content script injects any custom style for the page (if it exists) 
  * as soon as the document starts loading.
 **/

// temporaries used by sunjer.style.initialize()
var sunjerTempUrl;
var sunjerTempRules;

// send request to background.html to get sunjer rules for page
chrome.extension.sendRequest({ name: "getRulesForPage", url: window.location.href }, function(response) {
    sunjerTempUrl = response.url;
    sunjerTempRules = response.rules;
    var css = CSSUtils.crunchCSS(response.rules, true);
    if (css != "") {
        CSSUtils.injectCSS(css, "sunjer-css");
    }
});