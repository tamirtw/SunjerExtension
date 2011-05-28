$(document).ready(function(e) {
	// let social know sunjer is installed
	sendAvailabilityMessage();
	
	// communication channel between sunjer social and the extension
	var $install_divs = $('.sunjer_install_div');

	if ($install_divs.length != 0) {

		// Bind listener for install event
		$install_divs.bind('sunjerInstallEvent', function(e) {
			console.log("sunjer: Install event received. Dispatching request.");
			
			var $post = $(e.target).closest('.post');

			var url = $.trim($post.find('.post_site').text());

			// first, let's check if a style already exists for the url
			sunjer.chrome.doesStyleExist(url, function(response) {
				
				// if yes, warn the user
				if (response) {
					console.log("Style for '" + url + "' already exists.");

					var customEvent = document.createEvent('Event');
					customEvent.initEvent('sunjerStyleExistsEvent', true, true);
					e.target.dispatchEvent(customEvent);
				}
				
				// else save the style
				else
					saveStyleFromSocial(e.target);	
			});
		});
		
		
		// Bind listener for overwrite installation (without checking if style already exists) 
		
		$install_divs.bind('sunjerOverwriteEvent', function(e) {
			console.log("sunjer: Overwrite event received. Dispatching request.");
			
			var $post = $(e.target).closest('.post');
			
			saveStyleFromSocial(e.target);
		});
	}
});


// Sends sunjer social an availability message
function sendAvailabilityMessage() {
	// get the first communication DIV in DOM
	var install_div = $('.sunjer_install_div').get(0);
	
	// dispatch the message
	if (install_div) {
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('sunjerIsAvailableEvent', true, true);
		install_div.dispatchEvent(customEvent);
	}
}


// Send request to background.html to save style along with metadata (id, timestamp, etc.)
function saveStyleFromSocial(channel) {
	var $channel = $(channel);
	var $post = $channel.closest('.post');
	
	var css = $channel.text();

	var url = $.trim( $post.find('.post_site').text() );
	
	var timestamp = $post.attr('data-timestamp');
	
	var id = $post.attr('id').substring(4);
	
	// let's parse the css
	var parser = new CSSParser();
	
	try {
		var sheet = parser.parse(css);
		var rules = CSSUtils.getRulesFromParserObject(sheet);

		sunjer.chrome.save(url, rules, { id: id, timestamp: timestamp });
		sunjer.chrome.pushStyles();
		
		// send back success message
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('sunjerInstallationSuccessfulEvent', true, true);				
		channel.dispatchEvent(customEvent);
	}
	
	catch(e) {
		console.log("Error parsing css: " + e);

		// send back error message
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('sunjerInstallationErrorEvent', true, true);
		channel.dispatchEvent(customEvent);
	}
}