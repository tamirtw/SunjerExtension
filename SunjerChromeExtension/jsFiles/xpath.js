(function() {
	var current = null;
	var originalOutline = null;
	
	function parseElement(el) {
		var parent = el.parentElement, index = 0, count = 0;

		if (parent != null)
			for(var i = 0; i < parent.children.length; i++) {
				var child = parent.children.item(i);
				if (child.nodeName == el.nodeName) count++;
				if (child == el) index = count; 
			}
		
		return el.nodeName.toLowerCase() + ((index > 1) ? '[' + index + ']' : '');
	}

	document.addEventListener('contextmenu', function(e) {
		if (e.which == 3) {
			current = e.srcElement;
		}
	});
	
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.xpathIt) {
			var el = current, path = "";
			
			while(el != null) {
				path = parseElement(el) + ((path != "") ? "/" : "") + path;
				el = el.parentElement;
			}
			
			originalOutline = current.style.outline;
			current.style.outline = '4px solid #07C';

			sendResponse({ path: '/' + path });
		} else if (request.hideHighlight) {
			current.style.outline = originalOutline;
			originalOutline = null;
		}
	});
})();