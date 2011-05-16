window.getPlugin = getPlugin;
function getPlugin() {
  return document.getElementById("onepassword_plugin")
}
var autoSelectPopupView = null, goAndFill = {}, parentWindowId = null, passwordsByHost = {}, allLogins = [], firstOmniboxLoginUuid = null;
function activatePopup() {
  passwordsByHost = {};
  chrome.windows.getLastFocused(function(a) {
    parentWindowId = a.id;
    a = chrome.extension.getURL("popup.html");
    var b = 400, c = 548;
    if(navigator.userAgent.match(/Windows/)) {
      b = 420;
      c = 562
    }
    chrome.windows.create({url:a, left:screen.width / 2 - b / 2, top:screen.height / 2 - c / 2, width:b, height:c, type:"popup"}, function() {
    })
  })
}
chrome.extension.onRequest.addListener(function(a, b, c) {
  b = a.name;
  console.log("Processing request " + b);
  if(b == "autosave") {
    var d = getPlugin();
    d != null && d.autosave(a.login);
    c({})
  }else {
    if(b === "generateIdentityPassword") {
      b = a.host;
      var f = passwordsByHost[b];
      if(!f) {
        passwordOptions = loadPasswordOptions();
        a = a.maxLength;
        if(a < passwordOptions.length) {
          passwordOptions.length = a
        }
        f = createNewPasswordObject(b, generatePassword(passwordOptions));
        getPlugin().saveObject(JSON.stringify(f))
      }
      c(f)
    }else {
      if(b === "openGoAndFillPopUp") {
        autoSelectPopupView = "goAndFill";
        activatePopup();
        c({})
      }else {
        if(b === "activatePopUp" || b === "openGoAndFillPopUp") {
          (d = getPlugin()) && chrome.windows.getLastFocused(function(g) {
            chrome.tabs.getSelected(g.id, function(e) {
              e = d.itemsOfType("webforms.WebForm", e.url);
              e = (new Function("return (" + e + ")"))();
              if(!d.isLocked() && e && e.length == 1) {
                e = (new Function("return (" + d.jsonForUuid(e[0].uuid) + ")"))();
                c({object:e, autosubmit:getPlugin().isAutosubmitEnabled()})
              }else {
                activatePopup();
                c({})
              }
            })
          })
        }else {
          if(b === "goAndFillAction") {
            goAndFill[a.details.locationKey] = a.details.uuid;
            c({})
          }else {
            console.log("Warning: no handler for '" + b + "'")
          }
        }
      }
    }
  }
});
function configHotKeys(a) {
  var b = getPlugin();
  if(b) {
    b = b.hotKeys();
    chrome.tabs.sendRequest(a, {action:"assignKeyboardShortcuts", object:b})
  }else {
    console.log("1Password plugin not loaded")
  }
}
chrome.tabs.onUpdated.addListener(function(a, b, c) {
  if(c.status === "complete") {
    configHotKeys(a);
    b = c.url.match(/:\/\/(.[^/]+)/)[1];
    a = null;
    for(var d in goAndFill) {
      if(b.indexOf(d) != -1) {
        a = goAndFill[d];
        delete goAndFill[d]
      }
    }
    if(a) {
      d = getPlugin();
      if(d != null) {
        a = d.jsonForUuid(a);
        chrome.tabs.sendRequest(c.id, {action:"fillLoginAction", object:a, autosubmit:d.isAutosubmitEnabled()}, function() {
        })
      }
    }
  }
});
function escapeHTML(a) {
  return a.replace("<", "&lt;", "gm").replace(">", "&gt;", "gm").replace("&", "&amp;", "gm")
}
function extractDomain(a) {
  if(a = a.match(/(.*?:\/\/(.[^/]+))/)) {
    return a[1]
  }
  return""
}
chrome.omnibox.onInputStarted.addListener(function() {
  allLogins = eval(getPlugin().itemsOfType("webforms.WebForm"));
  firstLoginUuid = null
});
chrome.omnibox.onInputChanged.addListener(function(a, b) {
  var c = [];
  if(getPlugin().isLocked()) {
    c.push({content:"Press Return to Unlock 1Password", description:"1Password is currently locked"})
  }else {
    if(a.length > 0) {
      var d = a.toLowerCase();
      firstOmniboxLoginUuid = null;
      for(var f = 0;f < allLogins.length;++f) {
        var g = allLogins[f], e = g.title, h = g.location;
        e || (e = "");
        h || (h = "");
        e = e.toLowerCase();
        h = h.toLowerCase();
        if(e.indexOf(d) >= 0 || h.indexOf(d) >= 0) {
          c.push({content:"Open " + g.title + "\n" + g.uuid, description:"<match>" + escapeHTML(g.title) + "</match> &lt;<url>" + extractDomain(h) + "</url>&gt;"});
          if(c.length == 1) {
            firstOmniboxLoginUuid = g.uuid
          }
        }
      }
    }
  }
  b(c)
});
function navigate(a) {
  chrome.tabs.getSelected(null, function(b) {
    chrome.tabs.update(b.id, {url:a})
  })
}
chrome.omnibox.onInputEntered.addListener(function(a) {
  if(getPlugin().isLocked() || a.trim() === "") {
    activatePopup()
  }else {
    var b = a.split("\n");
    a = null;
    if(a = b.length === 2 ? b[1] : firstOmniboxLoginUuid) {
      b = getPlugin().jsonForUuid(a);
      b = (new Function("return (" + b + ")"))();
      goAndFill[b.locationKey] = a;
      navigate(b.location)
    }else {
      activatePopup()
    }
  }
});
chrome.omnibox.setDefaultSuggestion({description:"<url><match>1Password:</match></url><dim> type </dim>Login<dim> name or press </dim>Return<dim> to show 1Password popup.</dim>"});
