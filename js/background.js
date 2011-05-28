/* Background JS for sunjer */
var CURRENT_VERSION = "1.1";

var currTabId;
var contextMenuId = null;

var elements = {
    styles: {},
    
    options: {
        useShortcutKey: true,
        shortcutKey: 77, // keydown code for 'm'
        shortcutMetaKey: 'alt',
        mode: 'Basic',
        sync: false,
        //		contextMenu: true,
        livePreviewColorPicker: false
    }
    
// indices of enabled accordions in panel. by default, all are enabled
};

// Initialize
//
function init() {
    attachListeners();
    loadOptionsIntoelements();
//
//
//    if (elements.options.sync) {
//        loadSyncId();
//        attachSyncListeners();
//    }
}

//// Open release notes. Only done for major releases
////
//function openReleaseNotes() {
//    chrome.tabs.create({ url: "http://sunjer.me/releases", selected: true }, null);
//}

// Update version string in localStorage
//
function updateVersion() {
    if (!localStorage.version) {
        updateVersionString();
        return true;
    }

    if (parseInt(localStorage.version) < 1) {
        upgradeTo1();
    }

    if (localStorage.version != CURRENT_VERSION) {
        updateVersionString();
        openReleaseNotes();
    }
}

function updateVersionString() {
    console.log("Updating to version " + CURRENT_VERSION);
    localStorage.version = CURRENT_VERSION;
}

// Upgrade to version 1
// Mostly legacy code now, since almost everyone should already be updated to 1.0
//
function upgradeTo1() {
    console.log("Upgrading data model to version 1.0");
	
    var first = false;
	
    // upgrading to the new data model
    for (var url in elements.styles) {

        // if it is already in the new format, do nothing
        // this may happen when sync is enabled
        // and upgrade is taking place after an upgrade has already taken place at another computer

        if (!first) {
            first = elements.styles[url];
            // ideally, there should me a more foolproof check
            if (first['_rules']) {
                console.log("Data model already at v1");
                return;
            }
        }
		
        var rules = elements.styles[url];
        elements.styles[url] = {};
        elements.styles[url]['_rules'] = rules;
    }
	
    // save to localStorage
    updateStylesInDataStore();
	
    // update data in bookmark as well
    pushStyles();
}

// Listen to requests from tabs and page action
//
function attachListeners() {
    chrome.pageAction.onClicked.addListener(onPageIconClick);
    
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {		
        if (tab.url.match("^http") == "http" && tab.url.indexOf("https://chrome.google.com/extensions") == -1) {
            chrome.pageAction.show(tabId);
            disablePageIcon(tab);
        }
    });

    chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
        chrome.tabs.get(tabId, function(tab) {
            refreshPageIcon(tab);
        });
    });
    
    chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
        switch (request.name) {
            case "getMenuData"   	:
                getMenuData(request.query,sendResponse);
//                sendResponse();
                break;

            case "enablePageIcon"   	:
                enablePageIcon(sender.tab);
                sendResponse({});
                break;
            
            case "disablePageIcon" 	 	:
                disablePageIcon(sender.tab);
                sendResponse({});
                break;
            
            case "copyToClipboard"  	:
                copyToClipboard(request.text);
                sendResponse({});
                break;
            
            case "save"             	:
                save(request.url, request.rules, request.data);
                sendResponse({});
                break;

            case "doesStyleExist"   	:
                sendResponse(doesStyleExist(request.url));
                break;

            case "transfer"         	:
                transfer(request.source, request.destination);
                sendResponse({});
                break;
            
            case "getRulesForPage"  	:
                sendResponse(getRulesForPage(request.url));
                break;
            
            case "fetchOptions"     	:
                sendResponse({
                options: elements.options,
                enabledAccordions: elements.enabledAccordions
            });
            break;

            case "saveAccordionState"	:
                saveAccordionState(request.enabledAccordions);
                sendResponse({});
                break;
			
            case "savePreference"		:
                savePreference(request.preference);
                sendResponse({});
                break;
			
            case "getPreference"		:
                sendResponse(getPreference(request.preferenceName));
                break;

            case "pushStyles"			:
                pushStyles();
                sendResponse({});
                break;
        }
    });
}


// Toggle CSS editing when page icon is clicked
function onPageIconClick(tab) {
    chrome.tabs.sendRequest(tab.id, {
        name: "toggle"
    }, function(response) {
        if(response.status)
            enablePageIcon(tab);
        else
            disablePageIcon(tab);
    });
}

function refreshPageIcon(tab) {
    chrome.tabs.sendRequest(tab.id, {
        name: "status"
    }, function(response) {
        if(response.status)
            enablePageIcon(tab);
        else
            disablePageIcon(tab);
    });
}

// Update page icon to indicate that sunjer is not visible
//
function disablePageIcon(tab) {
    // if a style is applied to the current page
    //
    if (doesStyleExist(tab.url)) {
        chrome.pageAction.setIcon({
            tabId: tab.id,
            path: "images/icons/sunjer_active.png"
        });
    }
	
    else {
        chrome.pageAction.setIcon({
            tabId: tab.id,
            path: "images/icons/sunjer.png"
        });
    }
	
    chrome.pageAction.setTitle({
        tabId: tab.id,
        title: "Click to start editing using sunjer"
    });
}

// Update page icon to indicate that sunjer is visible
//
function enablePageIcon(tab) {
    chrome.pageAction.setIcon({
        tabId: tab.id,
        path: "images/icons/sunjer_active.png"
    });
    chrome.pageAction.setTitle({
        tabId: tab.id,
        title: "Click to stop editing using sunjer"
    });
}

function getMenuData(query,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/app.json", true);
    xhr.onreadystatechange = function() {   
        if (xhr.readyState == 4) {
                callback(xhr.responseText);
            // innerText does not let the attacker inject HTML elements.
//            document.getElementById("resp").innerText = xhr.responseText;
        }
    }
    xhr.send();
}

// Save all rules for a page
function save(url, rules, data) {
    if (!url || url == "")
        return;

    if (rules) {
        elements.styles[url] = {};
        elements.styles[url]['_rules'] = rules;
    }
    else
        delete elements.styles[url];
		
    // if there is meta data, store it in the social object
    if (data != undefined) {
        elements.styles[url]['_social'] = {};
        elements.styles[url]['_social'].id = data.id;
        elements.styles[url]['_social'].timestamp = data.timestamp;
    }
	
    updateStylesInDataStore();
}

// Transfer rules for source URL to destination URL
function transfer(source, destination) {
    if (elements.styles[source]) 
    {
        elements.styles[destination] = elements.styles[source];
        updateStylesInDataStore();
    }
}

// Save all styles
function saveStyles(styles) {
    if (styles)
        elements.styles = styles;
    updateStylesInDataStore();
}

// Save all styles in localStorage and elements
function saveStylesLocally(styles) {
    if (styles)
        elements.styles = styles;
    var jsonString = JSON.stringify(elements.styles);
    localStorage['sunjer_styles'] = jsonString;
}

// Styles from both objects are merged
// for common properties, s2 is given priority over s1
//
function mergeStyles(s1, s2) {
    if (!s2) {
        return s1;
    }

    for (var url in s1) {
        if (s2[url]) {
            for (var selector in s1[url]['_rules']) {
                if (s2[url]['_rules'][selector]) {
                    for (var property in s1[url]['_rules'][selector]) {
                        s2[url]['_rules'][selector][property] = s1[url]['_rules'][selector][property];
                    }
                }
                else
                    s2[url]['_rules'][selector] = s1[url]['_rules'][selector];
            }
            s1[url]['_social'] = s2[url]['_social'];
        }
        else
            s2[url] = s1[url];
    }

    return s2;
}

// Update styles in localStorage
function updateStylesInDataStore() {
    var jsonString = JSON.stringify(elements.styles);
    localStorage['sunjer_styles'] = jsonString;
}

// Load styles from localStorage into elements
function loadStylesIntoelements() {
    if (localStorage['sunjer_styles']) {
        try {
            elements.styles = JSON.parse(localStorage['sunjer_styles']);
        }
        catch(e) {
            console.log(e);
            elements.styles = {};
        }
    }
}

// If sync is enabled, push styles to cloud
function pushStyles() {
    if (elements.options.sync) {
        saveSyncData(elements.styles);
    }
}

// Load options from localStorage into background elements
function loadOptionsIntoelements() {
    for (var option in elements.options)
    {
        var dataStoreValue = localStorage['sunjer_option_' + option];
        if (dataStoreValue) {
            if (dataStoreValue == "true" || dataStoreValue == "false")
                elements.options[option] = (dataStoreValue == 'true');
            else
                elements.options[option] = dataStoreValue;
        }
        else
            localStorage['sunjer_option_' + option] = elements.options[option];
    }
}

// Save an option
function saveOption(name, value) {
    elements.options[name] = value;
    localStorage['sunjer_option_' + name] = value;
    propagateOptions();

    // option specific code
    if (name === "contextMenu" && value === false)
        removeContextMenu();
    else if (!contextMenuId)
        createContextMenu();
}

// Returns if a style already exists for the given page
//
function doesStyleExist(aURL) {
    for (var url in elements.styles)
    {
        if (aURL.trim().indexOf(url) != -1) {
            return true;
        }
    }

    return false;
}

// Return CSS rules for a URL
function getRulesForPage(currUrl) {
    // this will contain the combined set of evaluated rules to be applied to the page.
    // longer, more specific URLs get the priority for each selector and property
    var rules = {};
    var url_for_page = '';

    for (var url in elements.styles)
    {
        var subUrls = url.split(',');
        var len = subUrls.length;
        var isFound = false;

        for (var i = 0; i < len; i++)
        {
            if (currUrl.indexOf(subUrls[i].trim()) != -1) {
                isFound = true;
                break;
            }
        }

        if (isFound || url == "*")
        {
            if (url.length > url_for_page.length)
                url_for_page = url;
            
            // iterate over each selector in styles
            for (var selector in elements.styles[url]['_rules']) {
	
                // if no rule exists for selector, simply copy the rule
                if (rules[selector] == undefined)
                    rules[selector] = cloneObject(elements.styles[url]['_rules'][selector]);

                // otherwise, iterate over each property
                else {
                    for (var property in elements.styles[url]['_rules'][selector])
                    {
                        if (rules[selector][property] == undefined || url == url_for_page)
                            rules[selector][property] = elements.styles[url]['_rules'][selector][property];
                    }
                }
            }
        }
    }

    if (rules != undefined)
        return {
            rules: rules,
            url: url_for_page
        };
    else
        return {
            rules: null,
            url: null
        };
}

// Propagate options to all open tabs
function propagateOptions() {
    sendRequestToAllTabs({
        name: 'setOptions',
        options: elements.options
    }, function(){});
}

// Send request to all opened tabs
function sendRequestToAllTabs(req){
    chrome.windows.getAll({
        populate: true
    }, function(windows) {
        var w_len = windows.length;
        for (var i = 0; i < w_len; i++)
        {
            var t_len = windows[i].tabs.length;
            for (var j = 0; j < t_len; j++)
            {
                chrome.tabs.sendRequest(windows[i].tabs[j].id, req, function(response){});
            }
        }
    });
}

// Save current accordion state into elements
function saveAccordionState(enabledAccordions) {
    elements.enabledAccordions = enabledAccordions;
    localStorage['sunjer_enabledAccordions'] = enabledAccordions;
}

// Load previous accordion state into elements
function loadAccordionState() {
    if (localStorage['sunjer_enabledAccordions'])
        elements.enabledAccordions = localStorage['sunjer_enabledAccordions'].split(',');
}

function savePreference(preference) {
    localStorage[preference.name] = preference.value;
}

function getPreference(preferenceName) {
    return {
        name: preferenceName,
        value: localStorage[preferenceName]
    };
}

// Initialize the right click context menu
function createContextMenu() {
    if (localStorage['sunjer_option_contextMenu'] === 'true') {
        contextMenuId = chrome.contextMenus.create({
            title: "sunjer",
            contexts: ['all']
        });
		
        chrome.contextMenus.create({
            title: "Style Element",
            contexts: ['all'],
            onclick: function() {
                sendRequestToCurrentTab("openWidget");
            },
            parentId: contextMenuId
        });
		
        contextMenuStatusId = chrome.contextMenus.create({
            title: "Toggle styling",
            contexts: ['all'],
            onclick: function() {
                sendRequestToCurrentTab("toggleStyle");
            },
            parentId: contextMenuId
        });
		
        chrome.contextMenus.create({
            title: "Search for styles...",
            contexts: ['all'],
            onclick: function() {
                sendRequestToCurrentTab("searchSocial");
            },
            parentId: contextMenuId
        });
    }
}

// Send a request to the current selected tab
function sendRequestToCurrentTab(msg) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {
            name: msg
        }, function() {});
    });	
}

// Remove the right click context menu
function removeContextMenu() {
    if (contextMenuId) {
        chrome.contextMenus.remove(contextMenuId);
        contextMenuId = null;
    }
}

window.addEventListener('load', function(){
    init();
});

// Utility methods

// Trim a string
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

// Copy to Clipboard
function copyToClipboard(text) {
    var copyTextarea = document.createElement('textarea');
    document.body.appendChild(copyTextarea);
    copyTextarea.value = text;
    copyTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(copyTextarea);
}

// Clone an object. from: http://my.opera.com/GreyWyvern/blog/show.dml/1725165
function cloneObject(obj) {
    var newObj = (obj instanceof Array) ? [] : {};
    for (i in obj) {
        if (obj[i] && typeof obj[i] == "object") {
            newObj[i] = cloneObject(obj[i]);
        } else newObj[i] = obj[i]
    }
    return newObj;
};