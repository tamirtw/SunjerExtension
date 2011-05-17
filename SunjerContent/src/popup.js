var RELEASE = true, VERSION = "3.6.1.30941";function localStorageString(a, b) {
  var c = localStorage[a];
  return c ? c : b
}
function localStorageInt(a, b) {
  var c = localStorage[a];
  return c ? parseInt(c, 10) : b
}
function setLocalStorageValue(a, b) {
  localStorage[a] = b
}
function loadPasswordOptions() {
  var a = {};
  a.type = localStorageString("password_type", "random");
  a.length = localStorageInt("password_length", 14);
  a.symbols = localStorageInt("password_symbols", 0);
  a.digits = localStorageInt("password_digits", 2);
  a.avoidAmb = localStorageInt("password_avoidAmb", 1) ? true : false;
  a.allowRepeats = localStorageInt("password_allowRepeats", 1) ? true : false;
  a.separator = localStorageString("password_separator", "-");
  return a
}
function savePasswordOptions(a) {
  if(a) {
    setLocalStorageValue("password_type", a.type);
    setLocalStorageValue("password_length", a.length);
    setLocalStorageValue("password_symbols", a.symbols);
    setLocalStorageValue("password_digits", a.digits);
    setLocalStorageValue("password_avoidAmb", a.avoidAmb ? 1 : 0);
    setLocalStorageValue("password_allowRepeats", a.allowRepeats ? 1 : 0);
    setLocalStorageValue("password_separator", a.separator)
  }
}
;var ALPHA_ALL = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], NUMBERS_ALL = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], SYMBOLS_ALL = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "|", "[", "]", "{", "}", "'", "\\", '"', ";", ":", ".", ",", "<", ">", "?", 
"/", "~", "`"], ALPHA_NONAMBIGIOUS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "T", "U", "V", "W", "X", "Y", "Z"], NUMBERS_NONAMBIGIOUS = ["2", "3", "4", "6", "7", "8", "9"], SYMBOLS_NONAMBIGIOUS = ["@", "#", "$", "%", "^", "&", "*", "(", ")", "+", "=", "[", "]", "{", "}", ";", ":", ".", ",", "<", ">", "?", "/"];
function getRandomInt(a) {
  return Math.floor(Math.random() * a)
}
var VOWELS = ["a", "e", "i", "o", "u", "y"], UNITS_1 = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "x", "z"], UNITS_2 = ["ch", "gh", "ph", "rh", "sh", "th", "wh", "qu", "sp", "rt"];
function getVowel() {
  return VOWELS[getRandomInt(VOWELS.length)]
}
function getUnit1() {
  return UNITS_1[getRandomInt(UNITS_1.length)]
}
function getUnit2() {
  return UNITS_2[getRandomInt(UNITS_2.length)]
}
function pronounceablePassword(a, b) {
  if(a < 5) {
    a = 5
  }
  if(b == null) {
    b = "-"
  }
  for(var c = [], d = 0;d < a / 4;++d) {
    c.push(getUnit1() + getVowel() + getUnit2());
    c.push(getUnit2() + getVowel() + getUnit1())
  }
  for(d = 0;d < a / 3;++d) {
    c.push(getUnit2() + getVowel());
    c.push(getUnit1() + getVowel() + getUnit1() + getVowel())
  }
  for(d = 0;d < a / 2;++d) {
    c.push(getUnit1() + getVowel())
  }
  d = [];
  for(var e = a;c.length > 0 && e > 0;) {
    var f = getRandomInt(c.length), g = c[f];
    c.splice(f, 1);
    if(g.length < e - 2) {
      d.push(g);
      d.push(b === "0" ? NUMBERS_ALL[getRandomInt(10)] : b);
      e -= g.length + b.length
    }
    if(e == 2) {
      d.push(getUnit1());
      d.push(getVowel());
      e = 0
    }
    if(e == 3) {
      d.push(getUnit1());
      d.push(getVowel());
      d.push(getUnit1());
      e = 0
    }
    if(e == 4) {
      d.push(getUnit2());
      d.push(getVowel());
      d.push(getUnit1());
      e = 0
    }
  }
  return d.join("")
}
function buildRandomString(a, b, c, d) {
  for(var e = [], f = 0;f < c;++f) {
    if(e.length == 0) {
      e = [].concat(b)
    }
    var g = getRandomInt(e.length), h = a.length == 0 ? 0 : getRandomInt(a.length);
    a.splice(h, 0, e[g]);
    d || e.splice(g, 1)
  }
}
function randomPassword(a, b, c, d, e) {
  var f = [];
  if(a < 0) {
    a = 8
  }
  if(b < 0) {
    b = 0
  }
  if(c < 0) {
    c = 0
  }
  if(b > a) {
    b = a
  }
  if(c > a) {
    c = a
  }
  if(b + c > a) {
    c = a - b
  }
  a = a - b - c;
  if(a < 0) {
    a = 0
  }
  buildRandomString(f, d ? ALPHA_NONAMBIGIOUS : ALPHA_ALL, a, e);
  buildRandomString(f, d ? NUMBERS_NONAMBIGIOUS : NUMBERS_ALL, b, e);
  buildRandomString(f, d ? SYMBOLS_NONAMBIGIOUS : SYMBOLS_ALL, c, e);
  return f.join("")
}
function generatePassword(a) {
  if(a.type === "pronounceable") {
    return pronounceablePassword(a.length, a.separator)
  }
  return randomPassword(a.length, a.digits, a.symbols, a.avoidAmb, a.allowRepeats)
}
function calculatePasswordStrength(a) {
  if(a == null) {
    return 0
  }
  var b = a.length - 3;
  if(b < 0) {
    return 2
  }
  var c = b * 3, d = a.toLowerCase().replace("4", "a").replace("1", "l").replace("3", "e").replace("7", "t").replace("5", "s").replace("0", "o");
  d = d.replace(/[^a-z]/, "");
  if(d.length > 0 && dictionaryWords.indexOf(d) >= 0) {
    c = (b - d.length) * 3
  }
  if(c < 0) {
    c = 0
  }
  if(a.match(/[a-z]/)) {
    c += c * 0.2
  }
  if(a.match(/[A-Z]/)) {
    c += c * 0.2
  }
  if(a.match(/ \t/)) {
    c += c * 0.2
  }
  if(a.match(/[$+<=>^`|~]/)) {
    c += c * 0.2
  }
  if(a.match(/[!"%'(),-.\/:;?\]\[\\{}]/)) {
    c += c * 0.2
  }
  if(a.match(/[0-9]/)) {
    c += c * 0.2
  }
  if(c > 100) {
    c = 100
  }
  return Math.floor(c)
}
function descriptionForPasswordStrength(a) {
  if(a <= 10) {
    return AGLocalized("Terrible", "Password strength — Terrible")
  }
  if(a <= 20) {
    return AGLocalized("Weak", "Password strength — Weak")
  }
  if(a <= 40) {
    return AGLocalized("Fair", "Password strength — Fair")
  }
  if(a <= 60) {
    return AGLocalized("Good", "Password strength — Good")
  }
  if(a <= 90) {
    return AGLocalized("Excellent", "Password strength — Excellent")
  }
  return AGLocalized("Fantastic", "Password strength — Fantastic")
}
function createNewPasswordObject(a, b) {
  var c = generateUUID(), d = a ? a : "", e = d.match(/^[^:]+:\/\/([^\/]+)/);
  e = e ? e[1] : "";
  var f = e.replace(/^.*\.([^.]+\.[^.]+)$/, "$1");
  return{typeName:"passwords.Password", uuid:c, locationKey:f, location:d, title:e, secureContents:{password:b}}
}
function U4() {
  return((1 + Math.random()) * 65536 | 0).toString(16).substring(1).toUpperCase()
}
function generateUUID() {
  return[U4(), U4(), U4(), U4(), U4(), U4(), U4(), U4()].join("")
}
  this.json = a
}
function fullyQualifiedURL(a) {
  if(!a) {
    return null
  }
  if(a.indexOf("http") == 0) {
    return a
  }
  var b = window.location.protocol + "//" + window.location.hostname;
  if(window.location.port && window.location.port != "") {
    b += ":" + window.location.port
  }
  b += a;
  return b
}
OPLogin.prototype = {secureContents:function() {
  return this.json.secureContents || {}
}, htmlAction:function() {
  return this.secureContents().htmlAction || ""
}, htmlID:function() {
  return this.secureContents().htmlID || ""
}, matchesActionNameID:function(a, b, c) {
  var d = this.secureContents();
  return d.htmlAction && fullyQualifiedURL(d.htmlAction) == fullyQualifiedURL(a) && d.htmlName && d.htmlName == b && d.htmlID && d.htmlID == c
}, matchesActionName:function(a, b) {
  var c = this.secureContents();
  return c.htmlAction && fullyQualifiedURL(c.htmlAction) == fullyQualifiedURL(a) && c.htmlName && c.htmlName == b
}, matchesActionID:function(a, b) {
  var c = this.secureContents();
  return c.htmlAction && fullyQualifiedURL(c.htmlAction) == fullyQualifiedURL(a) && c.htmlID && c.htmlID == b
}, matchesAction:function(a) {
  if(!a || a == "") {
    return false
  }
  return fullyQualifiedURL(a) == fullyQualifiedURL(this.htmlAction())
}, matchesName:function(a) {
  var b = this.secureContents();
  return b.htmlName && b.htmlName == a
}, textFieldNames:function() {
  result = {};
  for(var a = this.fields(), b = 0;b < a.length;++b) {
    var c = a[b];
    if(c.name != "") {
      if(c.type == "T" || c.type == "P") {
        result[c.name] = c
      }
    }
  }
  return result
}, fields:function() {
  return this.secureContents().fields
}, fieldDesignatedAs:function(a) {
  var b = this.fields();
  if(!b) {
    return null
  }
  for(var c = 0;c < b.length;++c) {
    var d = b[c];
    if(d.designation === a) {
      return d
    }
  }
  return null
}, title:function() {
  return this.json.title
}, location:function() {
  return this.json.location
}, username:function() {
  var a = this.fieldDesignatedAs("username");
  return a ? a.value : ""
}, password:function() {
  var a = this.fieldDesignatedAs("password");
  return a ? a.value : ""
}, hasUsername:function() {
  return this.username().length > 0
}, hasPassword:function() {
  return this.password().length > 0
}, fieldsOfType:function(a) {
  var b = this.fields();
  if(!b) {
    return[]
  }
  for(var c = [], d = 0;d < b.length;++d) {
    var e = b[d].type;
    e && a.indexOf(e) >= 0 && c.push(b[d])
  }
  return c
}, passwordFields:function() {
  return this.fieldsOfType(["P"])
}, textFields:function() {
  return this.fieldsOfType(["T", "U"])
}, autosubmitValue:function() {
  if(this.json.openContents && this.json.openContents.autosubmit) {
    return this.json.openContents.autosubmit
  }
  return null
}, autosubmitAlways:function() {
  return this.autosubmitValue() === "always"
}, autosubmitNever:function() {
  return this.autosubmitValue() === "never"
}, autosubmitDefault:function() {
  return!this.autosubmitAlways() && !this.autosubmitNever()
}, isChangePasswordForm:function() {
  var a = this.passwordFields();
  if(a.length === 3) {
    var b = a[0].value, c = a[1].value, d = a[2].value;
    if(b === c && b === 3) {
      return false
    }
    var e = {};
    if(b.length > 0) {
      e[b] = ""
    }
    if(c.length > 0) {
      e[c] = ""
    }
    if(d.length > 0) {
      e[d] = ""
    }
    if(e.length == 2) {
      return true
    }
  }
  if(this.textFields().length > 0) {
    return false
  }
  if(a.length === 2) {
    return a[0].value === a[1].value
  }
  return false
}, isRegistrationForm:function() {
  if(this.isChangePasswordForm()) {
    return false
  }
  if(this.htmlAction().match(/(signup|register)/i)) {
    return true
  }
  if(this.htmlID().match(/(signup|register)/i)) {
    return true
  }
  var a = this.passwordFields();
  if(a.length != 2) {
    return false
  }
  return a[0].value === a[1].value
}};function OPPassword(a) {
  this.json = a
}
OPPassword.prototype = {secureContents:function() {
  return this.json.secureContents
}, title:function() {
  return this.json.title
}, location:function() {
  return this.json.location
}, password:function() {
  var a = this.secureContents().password;
  return a ? a : ""
}};var KEY_ARROW_LEFT = 37, KEY_ARROW_UP = 38, KEY_ARROW_RIGHT = 39, KEY_ARROW_DOWN = 40, KEY_PAGE_UP = 33, KEY_PAGE_DOWN = 34, KEY_END = 35, KEY_HOME = 36, KEY_ENTER = 13, KEY_ESC = 27, KEY_1 = 49, KEY_2 = 50, KEY_3 = 51, KEY_4 = 52, KEY_TAB = 9, tabUndefined = "tabUndefined", tabLogins = "tabLogins", tabIdentities = "tabIdentities", tabWallet = "tabWallet", tabPassGen = "tabPassGen";
tabPassHistory = "tabPassHistory";
var thisParentWindowId = thisPlugin = null, localized_strings = {};
function AGLocalized(a) {
  if(localized_strings.en == null) {
    return a
  }
  var b = navigator.language.substring(0, 2);
  (b = localized_strings[b][a]) || (b = a);
  return b
}
function escapeHTML(a) {
  if(!a) {
    return""
  }
  return a.replace(/&/mg, "&amp;").replace(/</mg, "&lt;").replace(/>/mg, "&gt;")
}
function titleMatchesCharCode(a, b) {
  if(a == null || a.length == 0) {
    return false
  }
  return a.charAt(0).toLowerCase() === String.fromCharCode(b).toLowerCase()
}
function TabBar() {
  this.selectedTabId = tabLogins;
  this.tabState = {tabUndefined:{name:"Undefined"}, tabLogins:{name:"Logins", pillIndex:0, pills:[{name:"pillLogins", actionName:"fillLoginAction", selectedRow:-1, listView:true, detailView:false, search:false, loadItems:function() {
    return eval(thisPlugin.itemsOfType("webforms.WebForm", tabBar.url))
  }}, {name:"pillSearch", actionName:"goAndFillAction", selectedRow:-1, listView:true, detailView:false, search:true, twoLines:true, loadItems:function() {
    return eval(thisPlugin.itemsOfType("webforms.WebForm"))
  }}]}, tabWallet:{name:"wallet", title:"Credit Cards", actionName:"fillCreditCardAction", selectedRow:-1, listView:true, detailView:false, loadItems:function() {
    return eval(thisPlugin.itemsOfType("wallet.financial.CreditCard"))
  }}, tabIdentities:{name:"identities", title:"Identities", actionName:"fillIdentityAction", selectedRow:-1, listView:true, detailView:false, loadItems:function() {
    return eval(thisPlugin.itemsOfType("identities.Identity"))
  }}, tabPassGen:{name:"passGen", title:"Generate Password", generatedPassword:"", actionName:"fillPasswordAction"}, tabPassHistory:{name:"passHistory", title:"Password History", listView:true, detailView:false, actionName:"fillPasswordFromHistory", loadItems:function() {
    return eval(thisPlugin.itemsOfType("passwords.Password", tabBar.url))
  }, actionName:"fillPasswordAction"}}
}
TabBar.prototype = {autoSelect:function() {
  var a = chrome.extension.getBackgroundPage().autoSelectPopupView;
  if(a) {
    console.log("auto selection: %s", a);
    chrome.extension.getBackgroundPage().autoSelectPopupView = undefined;
    if(a == "goAndFill") {
      this.selectedTabId = "tabLogins";
      this.tabState.tabLogins.pillIndex = 1
    }
  }
}, currentTabState:function() {
  if(thisPlugin.isLocked()) {
    return{name:"locked"}
  }
  return this.tabState[this.selectedTabId]
}, currentState:function() {
  var a = this.currentTabState();
  if(a.pills) {
    return a.pills[a.pillIndex]
  }
  return a
}, updateView:function() {
  this.autoSelect();
  if(thisPlugin.isLocked()) {
    $("#lock").removeClass("unlock");
    $("#lockedDoor").removeClass("outLeft");
    $("#lockedDoor").show()
  }else {
    $("#lockedDoor").hide();
    var a = this.currentState();
    if(!a.allItems && a.loadItems) {
      a.allItems = a.loadItems();
      a.items = a.allItems
    }
    if(this.currentTabState().pills && a.listView) {
      $("#fillOptions>header>h2").hide();
      $("#fillOptions>header>ul").show();
      $("#fillOptions>header>span.right").hide();
      if(this.currentTabState().pillIndex === 0) {
        $("#fillOptions>header>ul>li:first").addClass("selected");
        $("#fillOptions>header>ul>li:last").removeClass("selected")
      }else {
        $("#fillOptions>header>ul>li:first").removeClass("selected");
        $("#fillOptions>header>ul>li:last").addClass("selected")
      }
    }else {
      $("#fillOptions>header>h2").text(a.title);
      $("#fillOptions>header>h2").show();
      $("#fillOptions>header>ul").hide();
      $("#fillOptions>header>span.right").show()
    }
    if(a.listView) {
      this.itemList.updateView()
    }else {
      if(a.detailView) {
        this.detailView.updateView()
      }else {
        a.name === "passGen" ? this.passGen.updateView() : console.log("Invalid state: " + a)
      }
    }
  }
}, selectTab:function(a) {
  $("#tabBar>li").removeClass("selected");
  $("#" + a).addClass("selected");
  a == "tabPassHistory" && $("#tabPassGen").addClass("selected");
  this.selectedTabId = a;
  if(thisPlugin == null) {
    console.log("Plugin object not available")
  }else {
    var b = this.currentState();
    if(b.loadItems) {
      $("#items").hide();
      $("#details").hide();
      $("#btnBack").hide();
      b.listView && tabBar.detailView.animateOut();
      b.detailView && tabBar.detailView.animateIn();
      $("#items").show();
      $("#details").show();
      $("#btnBack").show()
    }
    this.updateView();
    switch(a) {
      case tabPassGen:
        $("#passGen").show();
        $("#details").hide();
        $("#passDetails").hide();
        $("#items").hide();
        break;
      case tabLogins:
      ;
      case tabWallet:
      ;
      case tabIdentities:
        $("#details").show();
        $("#passDetails").hide();
        $("#items").show();
        $("#passGen").hide();
        break;
      case tabPassHistory:
        $("#details").hide();
        $("#passDetails").show();
        $("#items").show();
        $("#passGen").hide()
    }
  }
}, changeStateToListView:function() {
  var a = this.currentState();
  a.detailView = false;
  a.listView = true;
  this.updateView();
  tabBar.detailView.animateOut()
}, changeStateToDetailView:function() {
  var a = this.currentState();
  a.detailView = true;
  a.listView = false;
  this.updateView();
  tabBar.detailView.animateIn()
}, reloadForURL:function(a) {
  this.url = a;
  if(thisPlugin.isLocked()) {
    this.updateView()
  }else {
    a = this.selectedTabId;
    if(a === tabUndefined) {
      a = tabLogins
    }
    this.selectTab(a)
  }
}, fillSelectedItem:function() {
  var a = tabBar.currentState();
  if(a.name === "passGen") {
    var b = createNewPasswordObject(this.url, a.generatedPassword);
    thisPlugin.saveObject(JSON.stringify(b));
    a.selectedUuid = b.uuid
  }
  a.selectedUuid && this.itemClicked(a.selectedUuid)
}, itemClicked:function(a) {
  var b = null, c = this.currentState();
  b = thisPlugin.jsonForUuid(a);
  if(c.name === "pillSearch") {
    b = (new Function("return (" + b + ")"))();
    chrome.extension.sendRequest({name:c.actionName, details:{uuid:b.uuid, locationKey:b.locationKey}});
    chrome.tabs.create({url:b.location})
  }else {
    chrome.tabs.getSelected(thisParentWindowId, function(d) {
      chrome.tabs.sendRequest(d.id, {action:c.actionName, object:b, autosubmit:thisPlugin.isAutosubmitEnabled()}, function() {
      })
    })
  }
  setTimeout(function() {
    window.close()
  }, 30)
}};TabBar.prototype.itemList = {loadEmptyListForState:function(a) {
  a.selectedRow = -1;
  var b, c;
  switch(a.name) {
    case "pillLogins":
    ;
    case "pillSearch":
      b = AGLocalized("No Logins Saved");
      c = AGLocalized("You can create a new item by logging into any website and 1Password will automatically ask to save it for you. Alternatively, you can use the Save New Login button below.");
      break;
    case tabWallet:
      b = AGLocalized("No Credit Cards Saved");
      c = AGLocalized("You can create a new credit card in 1Password application.");
      break;
    case tabIdentities:
      b = AGLocalized("No Identities Saved");
      c = AGLocalized("You can create a new identity in 1Password application.")
  }
  $("#noItems>h3").text(b);
  $("#noItems>p").text(c);
  $("#noItemsSaveLoginButton").toggle(a.name == "pillLogins");
  $("#noItems").show();
  $("#searchBar").hide();
  $("#scrolling").hide()
}, loadListForState:function(a) {
  $("#noItems").hide();
  a.twoLines ? $("#scrolling>ul").addClass("twoLines") : $("#scrolling>ul").removeClass("twoLines");
  if(a.search) {
    $("#searchBar").show();
    $("#searchBar>input").focus();
    a.items = a.allItems.filter(function(e, f, g) {
      if(!g[f].title || !a.searchByLowerCase) {
        return true
      }
      if(g[f].title.toLowerCase().indexOf(a.searchByLowerCase) !== -1) {
        return true
      }
      if((e = g[f].location) && e.toLowerCase().indexOf(a.searchByLowerCase) !== -1) {
        return true
      }
      return false
    })
  }else {
    a.items = a.allItems;
    $("#searchBar").hide()
  }
  var b = false;
  if(!a.listHTML) {
    b = [];
    for(var c = 0;c < a.items.length;++c) {
      var d = a.items[c];
      b.push('<li id="' + d.uuid + '">');
      b.push('<img class="disclosureArrow" src="images/disclosure-arrow.png" />');
      b.push(escapeHTML(d.title));
      if(a.twoLines) {
        b.push("<br />");
        b.push('<span class="secondary">');
        b.push(escapeHTML(d.location));
        b.push("</span>")
      }
      b.push("</li>")
    }
    a.listHTML = b.join("");
    b = true
  }
  if(b || $("#items").attr("displayed_state") !== a.name) {
    $("#scrolling>ul")[0].innerHTML = a.listHTML;
    $("#items").attr("displayed_state", a.name)
  }
  $("#itemListSaveLoginButton").toggle(a.name == "pillLogins");
  $("#scrolling").show();
  $("#scrolling").css("top", a.name == "pillSearch" ? 44 : 0);
  setTimeout(function() {
    tabBar.itemList.selectRow(tabBar.itemList.selectedRow())
  }, 1)
}, updateView:function() {
  var a = tabBar.currentState();
  if(a.listView) {
    (a.items == null || a.items.length == 0) && !a.search ? this.loadEmptyListForState(a) : this.loadListForState(a)
  }
}, selectedRow:function() {
  return tabBar.currentState().selectedRow
}, setSelectedRow:function(a) {
  var b = tabBar.currentState();
  b.selectedUuid = a >= 0 && a < b.items.length ? b.items[a].uuid : null;
  b.selectedRow = a
}, selectRow:function(a) {
  var b = tabBar.currentState().items;
  if(a < 0) {
    a = 0
  }
  if(a >= b.length) {
    a = b.length - 1
  }
  a != this.selectedRow() && $("#scrolling>ul>li").removeClass("selected");
  if(a >= 0) {
    b = b[a].uuid;
    $("#" + b).addClass("selected");
    this.setSelectedRow(a);
    a = $("#scrolling")[0];
    b = document.getElementById(b);
    if(b.offsetTop < a.scrollTop) {
      a.scrollTop = b.offsetTop
    }
    if(b.offsetTop + b.offsetHeight > a.scrollTop + a.offsetHeight) {
      a.scrollTop = b.offsetTop + b.offsetHeight - a.offsetHeight
    }
  }
}, chooseItemWithCharCode:function(a) {
  var b = tabBar.currentState();
  if(b.listView) {
    for(var c = this.selectedRow(), d = c + 1;d < b.items.length;++d) {
      if(titleMatchesCharCode(b.items[d].title, a)) {
        this.selectRow(d);
        return false
      }
    }
    for(d = 0;d < c;++d) {
      if(titleMatchesCharCode(b.items[d].title, a)) {
        this.selectRow(d);
        return false
      }
    }
    return true
  }
}};function getCreditCardType(a, b) {
  return{visa:"Visa", mc:"Mastercard", amex:"American Express", diners:"Diners", discover:"Discover", jcb:"JCB", solo:"Solo", "switch":"Switch", maestro:"Maestro", visaelectron:"Visa Electron", carteblanche:"Carte Blanche"}[a[b]]
}
function getCountry(a, b) {
  return a[b]
}
function getPhone(a, b) {
  var c = a[b + "_country"], d = a[b + "_area"], e = a[b + "_exchange"], f = a[b + "_local"], g = [];
  c && g.push(c);
  d && g.push(d);
  e && g.push(e);
  f && g.push(f);
  return g.join("-")
}
function getDate(a, b) {
  var c = a[b + "_dd"], d = a[b + "_mm"], e = a[b + "_yy"];
  if(c && d && e) {
    return e + "-" + d + "-" + c
  }
  return null
}
function getSex(a, b) {
  return{male:"Male", female:"Female"}[a[b]]
}
function getMMYY(a, b) {
  var c = a[b + "_mm"], d = a[b + "_yy"];
  if(c && d) {
    return c + "/" + d
  }
  return null
}
function concealedValue() {
  for(var a = "", b = 0;b < 10;b++) {
    a += "&bull;"
  }
  return a
}
function detailedFieldLi(a) {
  if(a) {
    var b = "", c = "", d = a.value;
    if(a.type == "P") {
      b = ' data-value="' + escapeHTML(a.value) + '"';
      d = concealedValue();
      c = '<input type="button" class="button small showreveal" value="reveal" />'
    }
    return'<li><span class="label">' + escapeHTML(a.name) + '</span><span class="detail"' + b + ">" + d + "</span>" + c + "</li>"
  }
}
TabBar.prototype.detailView = {showLogin:function(a) {
  a = new OPLogin((new Function("return " + thisPlugin.jsonForUuid(a)))());
  $("#fillOptions>header>h2").text(AGLocalized("Login Details"));
  $("#detailsTitle").text(a.title());
  $("#detailsURL").text(a.location());
  $("#detailsUsername span.detail").text(a.username());
  $("#detailsPassword span.detail").html(concealedValue());
  $("#detailsPassword span.detail").data("value", a.password());
  $("#detailsPassword>input").val(AGLocalized("reveal"));
  var b = a.secureContents().notesPlain;
  if(b && b.length > 0) {
    $("#detailsNote span.detail").text(b);
    $("#detailsNote").show()
  }else {
    $("#detailsNote").hide()
  }
  a = a.fields();
  b = [];
  for(var c = 0;c < a.length;++c) {
    b.push(detailedFieldLi(a[c]))
  }
  $("#detailsFields").html(b.join(""));
  $(".showreveal").click(Items.togglePasswordVisibility);
  $("#detailsLogin").show();
  $("#detailsFields").show();
  $("#details>h4").show()
}, showPassword:function(a) {
  a = new OPPassword((new Function("return " + thisPlugin.jsonForUuid(a)))());
  $("#fillOptions>header>h2").text(AGLocalized("Generated Password"));
  $("#passDetailsTitle").text(a.title());
  $("#passDetailsURL").text(a.location());
  $("#passDetailsPassword span.detail").text(a.password());
  if((a = a.secureContents().notesPlain) && a.length > 0) {
    $("#passDetailsNote span.detail").text(a);
    $("#passDetailsNote").show()
  }else {
    $("#passDetailsNote").hide()
  }
  $("#passDetailsLogin").show();
  $("#passDetails>h4").show()
}, buildFieldSet:function(a, b) {
  for(var c = [], d = 0;d < b.length;++d) {
    var e = b[d], f = null;
    (f = e.getValue ? e.getValue(a, e.name) : a[e.name]) && f.length > 0 && c.push('<li><span class="label">' + escapeHTML(e.label) + '</span><span class="detail">' + escapeHTML(f) + "</span></li>")
  }
  return c.join("")
}, showObjectWithTemplate:function(a, b) {
  var c = (new Function("return " + thisPlugin.jsonForUuid(a)))();
  $("#detailsTitle").text(c.title);
  $("#detailsURL").text("");
  for(var d = [], e = 0;e < b.length;++e) {
    d.push("<ul>");
    d.push(this.buildFieldSet(c.secureContents, b[e]));
    d.push("</ul>")
  }
  $("#detailsDynamic").html(d.join(""));
  $("#detailsLogin").hide();
  $("#detailsFields").hide();
  $("#details>h4").hide()
}, showWalletItem:function(a) {
  this.showObjectWithTemplate(a, [[{name:"cardholder", label:"Cardholder"}, {name:"type", label:"Type", getValue:getCreditCardType}, {name:"ccnum", label:"Number"}, {name:"cvv", label:"Card Code"}, {name:"expiry", label:"Expiry Date", getValue:getMMYY}, {name:"validFrom", label:"Valid From", getValue:getMMYY}], [{name:"notesPlain", label:"Note"}]]);
  $("#fillOptions>header>h2").text(AGLocalized("Credit Card Details"))
}, showIdentity:function(a) {
  this.showObjectWithTemplate(a, [[{name:"firstname", label:"First Name"}, {name:"initial", label:"Initial"}, {name:"lastname", label:"Last Name"}, {name:"sex", label:"Sex", getValue:getSex}, {name:"birthdate", label:"Birthdate", getValue:getDate}, {name:"occupation", label:"Occupation"}, {name:"company", label:"Company"}, {name:"department", label:"Department"}, {name:"jobtitle", label:"Job Title"}], [{name:"notesPlain", label:"Notes"}], [{name:"country", label:"Country", getValue:getCountry}, {name:"state", 
  label:"State"}, {name:"address1", label:"Address 1"}, {name:"address2", label:"Address 2"}, {name:"city", label:"City"}, {name:"zip", label:"Zip/Postal"}], [{name:"defphone", label:"Phone", getValue:getPhone}, {name:"homephone", label:"Home", getValue:getPhone}, {name:"cellphone", label:"Cell Phone", getValue:getPhone}, {name:"busphone", label:"Bus. Phone", getValue:getPhone}], [{name:"username", label:"Username"}, {name:"reminderq", label:"Reminder Q"}, {name:"remindera", label:"Reminder A"}, 
  {name:"email", label:"Email"}, {name:"website", label:"Website"}, {name:"icq", label:"ICQ"}, {name:"skype", label:"Skype"}, {name:"aim", label:"AIM"}, {name:"yahoo", label:"Yahoo"}, {name:"msn", label:"MSN"}, {name:"forumsig", label:"Forum Sig"}]]);
  $("#fillOptions>header>h2").text(AGLocalized("Identity Details"))
}, showForUuid:function(a) {
  if(a) {
    tabBar.currentState().listView = false;
    if(tabBar.selectedTabId === tabLogins) {
      this.showLogin(a)
    }else {
      if(tabBar.selectedTabId === tabWallet) {
        this.showWalletItem(a)
      }else {
        if(tabBar.selectedTabId === tabIdentities) {
          this.showIdentity(a)
        }else {
          tabBar.selectedTabId === tabPassHistory && this.showPassword(a)
        }
      }
    }
  }else {
    console.log("Invalid object uuid")
  }
}, updateView:function() {
  var a = tabBar.currentState();
  console.log("Showing details for %s", a.selectedUuid);
  this.showForUuid(a.selectedUuid)
}, animateIn:function() {
  $("#btnBack").show();
  $("#details").removeClass("outRight");
  $("#items").addClass("outLeft");
  $("#btnBack").removeClass("outRight")
}, animateOut:function() {
  $("#details").addClass("outRight");
  $("#items").removeClass("outLeft");
  $("#btnBack").addClass("outRight")
}, scroll:function(a) {
  document.getElementById("details").scrollTop += a
}};TabBar.prototype.passGen = {updatePasswordGeneratorTab:function() {
  $("#passwordLength").text("" + $("#passwordLengthRange").val());
  $("#passwordSymbols").text("" + $("#passwordSymbolsRange").val());
  $("#passwordDigits").text("" + $("#passwordDigitsRange").val());
  var a = tabBar.currentState().generatedPassword;
  $("#password").val(a);
  var b = calculatePasswordStrength(a);
  $("#meterFull").width(b + "%");
  $("#passwordStrengthDesc").text(descriptionForPasswordStrength(b));
  document.getElementById("meterFull").className = b < 10 ? "terrible" : b < 20 ? "weak" : b < 40 ? "fair" : b < 60 ? "good" : b < 90 ? "excellent" : "fantastic";
  b = "16px";
  if(a.length <= 25) {
    b = "16px"
  }else {
    if(a.length <= 27) {
      b = "15px"
    }else {
      if(a.length <= 30) {
        b = "14px"
      }else {
        if(a.length <= 32) {
          b = "13px"
        }else {
          if(a.length <= 38) {
            b = "12px"
          }else {
            if(a.length <= 44) {
              b = "10px"
            }else {
              if(a.length <= 47) {
                b = "9px"
              }else {
                if(a.length <= 50) {
                  b = "8px"
                }
              }
            }
          }
        }
      }
    }
  }
  $("#password").css("font-size", b)
}, updatePasswordOptions:function(a) {
  var b = loadPasswordOptions();
  if(a) {
    b.type = a
  }
  b.length = parseInt($("#passwordLengthRange").val(), 10);
  b.symbols = parseInt($("#passwordSymbolsRange").val(), 10);
  b.digits = parseInt($("#passwordDigitsRange").val(), 10);
  b.avoidAmb = document.getElementById("passwordAvoidAmb").checked;
  b.allowRepeats = document.getElementById("passwordRepeatChars").checked;
  b.separator = $("#separatorHyphen")[0].checked ? "-" : $("#separatorDigits")[0].checked ? "0" : "";
  savePasswordOptions(b);
  return b
}, regeneratePassword:function(a) {
  tabBar.currentState().generatedPassword = generatePassword(a);
  this.updatePasswordGeneratorTab()
}, updatePassGenView:function() {
  $("#passGen").show();
  $("#items").hide();
  $("#details").hide();
  $("#searchBar").hide();
  $("#optionsRandom").show();
  $("#optionsPronounceable").hide();
  var a = loadPasswordOptions();
  $("#passwordLengthRange").val(a.length);
  $("#passwordSymbolsRange").val(a.symbols);
  $("#passwordDigitsRange").val(a.digits);
  if(a.separator == "-") {
    document.getElementById("separatorHyphen").checked = true
  }else {
    if(a.separator == "0") {
      document.getElementById("separatorDigits").checked = true
    }else {
      document.getElementById("separatorNone").checked = true
    }
  }
  document.getElementById("passwordAvoidAmb").checked = a.avoidAmb;
  document.getElementById("passwordRepeatChars").checked = a.allowRepeats;
  if(a.type === "pronounceable") {
    $("#optionsPronounceable").show();
    $("#optionsRandom").hide();
    $("#tabPronounceable").addClass("selected");
    $("#tabRandom").removeClass("selected")
  }else {
    $("#optionsRandom").show();
    $("#optionsPronounceable").hide();
    $("#tabRandom").addClass("selected");
    $("#tabPronounceable").removeClass("selected")
  }
  this.regeneratePassword(a);
  this.updatePasswordGeneratorTab()
}, updatePasswordHistoryView:function() {
  $("#passGen").hide();
  $("#items").show();
  $("#details").hide();
  $("#searchBar").hide();
  $("#optionsRandom").hide();
  $("#optionsPronounceable").hide()
}, updateView:function() {
  tabBar.currentState().passwordHistory ? this.updatePasswordHistoryView() : this.updatePassGenView()
}};var LockScreen = {onPasswordInput:function() {
  $("#passwordEntry").removeClass("errorShow");
  return true
}, onPasswordChange:function(a) {
  if(thisPlugin.unlock($("#masterPassword").val())) {
    LockScreen.animateKeyhole();
    $("#masterPassword").blur();
    $("#masterPassword").val("")
  }else {
    $("#masterPassword")[0].select();
    $("#passwordEntry").addClass("errorShow")
  }
  a.stopImmediatePropagation();
  return false
}, animateKeyhole:function() {
  $("#lock").addClass("unlock");
  setTimeout(this.animateKeyholeDidEnd, 400)
}, animateKeyholeDidEnd:function() {
  $("#lockedDoor").addClass("outLeft");
  setTimeout(function() {
    tabBar.selectTab(tabBar.selectedTabId)
  }, 600)
}}, Popup = {selectTab:function() {
  tabBar.selectTab(this.id);
  return false
}, lock:function() {
  thisPlugin && thisPlugin.lock();
  setTimeout(function() {
    window.close()
  }, 30);
  return false
}, back:function() {
  tabBar.changeStateToListView();
  return false
}, onBlur:function() {
  if(navigator.userAgent.match(/Windows/)) {
    return true
  }
  if(RELEASE) {
    $("#masterPassword").blur();
    setTimeout(function() {
      window.close()
    }, 1)
  }
  return true
}, manualSaveLoginClicked:function() {
  chrome.tabs.getSelected(thisParentWindowId, function(a) {
    chrome.tabs.sendRequest(a.id, {action:"manualSaveAction"}, function() {
    })
  });
  setTimeout(function() {
    window.close()
  }, 30)
}}, Items = {onItemClick:function(a) {
  a.target && a.target.constructor === HTMLImageElement ? tabBar.changeStateToDetailView() : tabBar.itemClicked(this.id);
  return false
}, fillSelected:function() {
  tabBar.fillSelectedItem();
  return false
}, loginsPillClicked:function() {
  tabBar.currentTabState().pillIndex = 0;
  tabBar.updateView();
  return false
}, allLoginsPillClicked:function() {
  tabBar.currentTabState().pillIndex = 1;
  tabBar.updateView();
  return false
}, onItemMouseOver:function() {
  var a = this.id;
  if(!a) {
    return true
  }
  for(var b = tabBar.currentState(), c = 0;c < b.items.length;++c) {
    if(a === b.items[c].uuid) {
      tabBar.itemList.selectRow(c);
      break
    }
  }
  return true
}, togglePasswordVisibility:function() {
  var a = $(this), b = a.prev();
  if(a && b) {
    if(b.html() == "••••••••••") {
      b.html(b.data("value"));
      a.val(AGLocalized("conceal"))
    }else {
      b.html(concealedValue());
      a.val(AGLocalized("reveal"))
    }
  }
}}, PassGen = {regeneratePassword:function() {
  tabBar.passGen.regeneratePassword(tabBar.passGen.updatePasswordOptions());
  return false
}, updatePronounceableOptions:function() {
  tabBar.passGen.regeneratePassword(tabBar.passGen.updatePasswordOptions());
  return true
}, onPronounceableClicked:function() {
  $("#tabPronounceable").addClass("selected");
  $("#tabRandom").removeClass("selected");
  $("#optionsPronounceable").show();
  $("#optionsRandom").hide();
  tabBar.passGen.regeneratePassword(tabBar.passGen.updatePasswordOptions("pronounceable"))
}, onRandomClicked:function() {
  $("#tabRandom").addClass("selected");
  $("#tabPronounceable").removeClass("selected");
  $("#optionsRandom").show();
  $("#optionsPronounceable").hide();
  tabBar.passGen.regeneratePassword(tabBar.passGen.updatePasswordOptions("random"))
}, onPasswordInput:function() {
  var a = tabBar.currentState();
  if(a.name === "passGen") {
    a.generatedPassword = $("#password").val();
    $("#passwordLengthRange").val(a.generatedPassword.length);
    tabBar.passGen.updatePasswordGeneratorTab()
  }
  return true
}, onFillButtonClick:function() {
  tabBar.fillSelectedItem();
  return false
}, viewPasswordHistory:function() {
  tabBar.selectTab(tabPassHistory);
  return true
}};
function resizePopupToFit() {
  thisParentWindowId && chrome.windows.getLastFocused(function(a) {
    var b = document.body.clientWidth + 7, c = document.body.clientHeight + 52;
    chrome.windows.update(a.id, {width:b, height:c, left:screen.width / 2 - b / 2, top:screen.height / 2 - c / 2})
  })
}
function updatePopup(a, b) {
  if(thisPlugin = b) {
    thisParentWindowId = chrome.extension.getBackgroundPage().parentWindowId;
    chrome.tabs.getSelected(thisParentWindowId, function(c) {
      tabBar.reloadForURL(c ? c.url : null)
    });
    chrome.extension.getBackgroundPage().parentWindowId = null
  }
  $("#masterPassword").bind("input", LockScreen.onPasswordInput);
  $("#masterPassword").change(LockScreen.onPasswordChange);
  $(a).blur(Popup.onBlur);
  $("#tabBar>li").click(Popup.selectTab);
  $("#btnLock").click(Popup.lock);
  $("#btnBack").click(Popup.back);
  $("#fillOptions>header>ul>li:first").click(Items.loginsPillClicked);
  $("#fillOptions>header>ul>li:last").click(Items.allLoginsPillClicked);
  $("#noItemsSaveLoginButton").click(Popup.manualSaveLoginClicked);
  $("#items").delegate("ul>li", "click", Items.onItemClick);
  $("#items").delegate("ul>li", "mouseenter", Items.onItemMouseOver);
  $("#details>h3>img").click(Items.fillSelected);
  $("#passDetails>h3>img").click(Items.fillSelected);
  $("#itemListSaveLoginButton").click(Popup.manualSaveLoginClicked);
  $("#detailsPassword>input").click(Items.togglePasswordVisibility);
  $("#passwordLengthRange").change(PassGen.regeneratePassword);
  $("#passwordSymbolsRange").change(PassGen.regeneratePassword);
  $("#passwordDigitsRange").change(PassGen.regeneratePassword);
  $("#passwordAvoidAmb").change(PassGen.regeneratePassword);
  $("#passwordRepeatChars").change(PassGen.regeneratePassword);
  $("#separatorHyphen").click(PassGen.updatePronounceableOptions);
  $("#separatorDigits").click(PassGen.updatePronounceableOptions);
  $("#separatorNone").click(PassGen.updatePronounceableOptions);
  $("#tabPronounceable").click(PassGen.onPronounceableClicked);
  $("#tabRandom").click(PassGen.onRandomClicked);
  $("#password").bind("input", PassGen.onPasswordInput);
  $("#btnFillPassword").click(PassGen.onFillButtonClick);
  $("#passwordHistoryButton").click(PassGen.viewPasswordHistory);
  $(a).keypress(function(c) {
    var d = tabBar.currentState();
    if(d.search) {
      return true
    }
    if(d.listView) {
      return tabBar.itemList.chooseItemWithCharCode(c.charCode)
    }
    return true
  });
  $(a).keyup(function(c) {
    switch(c.keyCode) {
      case KEY_ESC:
        $("#masterPassword").blur();
        setTimeout(function() {
          a.close()
        }, 1);
        return false
    }
    c = tabBar.currentState();
    var d = $("#searchField")[0].value;
    if(c.search && c.searchBy !== d) {
      c.searchBy = d;
      c.searchByLowerCase = d.toLowerCase();
      c.listHTML = null;
      tabBar.updateView()
    }
    return true
  });
  $(a).keydown(function(c) {
    var d = tabBar.currentState();
    if(!d) {
      return true
    }
    switch(c.keyCode) {
      case KEY_ENTER:
        if(d.actionName) {
          tabBar.fillSelectedItem();
          return false
        }
        break;
      case KEY_TAB:
        c = tabBar.currentTabState();
        if(c.pills && d.listView) {
          c.pillIndex = 1 - c.pillIndex;
          tabBar.updateView();
          return false
        }
        break;
      case KEY_HOME:
        if(d.detailView) {
          tabBar.detailView.scroll(-5E3);
          return false
        }
        if(d.listView) {
          tabBar.itemList.selectRow(0);
          return false
        }
        break;
      case KEY_END:
        if(d.detailView) {
          tabBar.detailView.scroll(+5E3);
          return false
        }
        if(d.listView) {
          tabBar.itemList.selectRow(d.items.length + 1);
          return false
        }
        break;
      case KEY_ARROW_UP:
        if(d.detailView) {
          tabBar.detailView.scroll(-5);
          return false
        }
        if(d.listView) {
          tabBar.itemList.selectRow(tabBar.itemList.selectedRow() - 1);
          return false
        }
        break;
      case KEY_ARROW_DOWN:
        if(d.detailView) {
          tabBar.detailView.scroll(+5);
          return false
        }
        if(d.listView) {
          tabBar.itemList.selectRow(tabBar.itemList.selectedRow() + 1);
          return false
        }
        break;
      case KEY_PAGE_UP:
        if(d.detailView) {
          tabBar.detailView.scroll(-300);
          return false
        }
        if(d.listView) {
          tabBar.itemList.selectRow(tabBar.itemList.selectedRow() - 7);
          return false
        }
        break;
      case KEY_PAGE_DOWN:
        if(d.detailView) {
          tabBar.detailView.scroll(+300);
          return false
        }
        if(d.listView) {
          tabBar.itemList.selectRow(tabBar.itemList.selectedRow() + 7);
          return false
        }
        break;
      case KEY_ARROW_RIGHT:
        if(d.selectedUuid && d.listView && !d.search) {
          tabBar.changeStateToDetailView();
          return false
        }
        if(d.selectedUuid && d.search) {
          d = document.getElementById("searchField");
          if(d.selectionEnd == d.value.length) {
            tabBar.changeStateToDetailView();
            return false
          }
        }
        break;
      case KEY_ARROW_LEFT:
        if(d.detailView) {
          tabBar.changeStateToListView();
          return false
        }
        break;
      case KEY_1:
        if(c.metaKey && !c.shiftKey && !c.altKey && !c.ctrlKey) {
          tabBar.selectTab(tabLogins);
          return false
        }
        break;
      case KEY_2:
        if(c.metaKey && !c.shiftKey && !c.altKey && !c.ctrlKey) {
          tabBar.selectTab(tabIdentities);
          return false
        }
        break;
      case KEY_3:
        if(c.metaKey && !c.shiftKey && !c.altKey && !c.ctrlKey) {
          tabBar.selectTab(tabWallet);
          return false
        }
        break;
      case KEY_4:
        if(c.metaKey && !c.shiftKey && !c.altKey && !c.ctrlKey) {
          tabBar.selectTab(tabPassGen);
          return false
        }
    }
    return true
  })
}
window.updatePopup = updatePopup;