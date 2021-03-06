/**
  * sunjer.chrome
  * 
  * Methods sending / receving messages from background.html
  **/

sunjer.chrome = {
    getMenuData: function(request, callback) {
        chrome.extension.sendRequest({
            name: "getMenuData",
            query: request
        }, function(response) {
            callback(response);
        });
    },
    setIcon: function(value) {
        if (value)
            chrome.extension.sendRequest({
                name: "enablePageIcon"
            }, function(){});
        else
            chrome.extension.sendRequest({
                name: "disablePageIcon"
            }, function(){});
    },
    
    // send request to background.html to copy text
    copyToClipboard: function(text) {
        chrome.extension.sendRequest({
            name: "copyToClipboard",
            text: text
        }, function(){});
    },
    
    // save all rules for a page
    save: function(url, rules, data) {
        chrome.extension.sendRequest({
            name: "save",
            rules: rules,
            url: url ,
            data: data
        }, function(){});
    },

    doesStyleExist: function(url, callback) {
        chrome.extension.sendRequest({
            name: "doesStyleExist",
            url:url
        }, callback);
    },

    install: function(url, rules, id) {
        chrome.extension.sendRequest({
            name: "install",
            rules: rules,
            url: url,
            id: id
        }, function(){});
    },
    
    // transfer all rules for src url to dest url
    transfer: function(src, dest) {
        chrome.extension.sendRequest({
            name: "transfer",
            source: src,
            destination: dest
        }, function(){});
    },
    
    // send request to fetch options from datastore
    fetchOptions: function() {
        chrome.extension.sendRequest({
            name: "fetchOptions"
        }, function(response) {
            initialize(response);
        });
    },
    
    saveAccordionState: function(enabledAccordions) {
        chrome.extension.sendRequest({
            name: "saveAccordionState",
            enabledAccordions: enabledAccordions
        }, function(){});
    },

    savePreference: function(name, value) {
        chrome.extension.sendRequest({
            name: "savePreference",
            preference: {
                name: name,
                value: value
            }
        }, function(){});
    },
	
    getPreference: function(name, callback) {
        chrome.extension.sendRequest({
            name: "getPreference",
            preferenceName: name
        }, function(response) {
            callback(response.value);
        });
    },

    pushStyles: function() {
        chrome.extension.sendRequest({
            name: "pushStyles"
        }, function(){});
    }
}

// Listen to requests from background.html
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
            
		
        if (request.name === "status") {            
            if (window != window.top)
                return;
            sendResponse({
                status: sunjer.status
            });
        }
		
        else if (request.name === "toggle")
        {
            if (window != window.top)
                return;
			
            sunjer.toggle();
            sendResponse({
                status: sunjer.status
            });
        }

        else if (request.name === "setOptions")
        {
            sunjer.setOptions(request.options);
            sendResponse({});
        }

        else if (request.name === "openWidget")
        {
            sunjer.contextmenu.openWidget();
            sendResponse({});
        }

        else if (request.name === "searchSocial") {
            if (!window.top)
                return;
            sunjer.contextmenu.searchSocial();
        }

        else if (request.name === "shareStyleOnSocial") {
            if (!window.top)
                return;
            sunjer.contextmenu.shareStyleOnSocial();
        }

        else if (request.name === "toggleStyle") {
            if (!window.top)
                return;
            sunjer.style.toggle();
        }
    }
    );