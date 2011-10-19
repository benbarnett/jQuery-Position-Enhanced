/*
jquery.position-enhanced plugin v0.10
---
http://github.com/benbarnett/jQuery-Position-Enhanced
http://benbarnett.net
@benpbarnett
---
Copyright (c) 2011 Ben Barnett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---
Extends jQuery.position() to collect translated position in addition to native method
Tested with jQuery 1.3.2+

Supports -moz-transition, -webkit-transition, -o-transition, transition

Usage (exactly the same as it would be normally):
	
	jQuery(element).position();
	
Changelog:
	0.10 (19/10/2011):
		- Plugin created
*/

(function(jQuery, originalPositionMethod) {

	// ----------
	// Plugin variables
	// ----------
	var	cssPrefixes = ["", "-webkit-", "-moz-", "-o-"];
		
	
	// ----------
	// Check if this browser supports CSS3 transitions
	// ----------
	var thisBody = document.body || document.documentElement,
   		thisStyle = thisBody.style,
		transitionEndEvent = (thisStyle.WebkitTransition !== undefined) ? "webkitTransitionEnd" : (thisStyle.OTransition !== undefined) ? "oTransitionEnd" : "transitionend",
		cssTransitionsSupported = thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined,
		has3D = use3DByDefault = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
		
	
	/**
		@private
		@name translation
		@function
		@description Get current X and Y translations
	*/
	function getTranslation() {
		if (!this[0]) {
			return null;
		}

		var	elem = this[0],
			cStyle = window.getComputedStyle(elem, null),
			translation = {
				left: 0,
				top: 0
			};
			
		for (var i = cssPrefixes.length - 1; i >= 0; i--){
			var transform = cStyle.getPropertyValue(cssPrefixes[i] + "transform");
			if (transform && (/matrix/i).test(transform)) {
				var explodedMatrix = transform.replace(/^matrix\(/i, '').split(/, |\)$/g);
				translation = {
					left: parseInt(explodedMatrix[4], 10),
					top: parseInt(explodedMatrix[5], 10)
				};
				
				break;
			}
		}
		
		return translation;
	};
	
	
	/**
		@private
		@name jQuery.position
		@function
		@description Extended position() method to include CSS3 translations
	*/
	jQuery.fn.position = function() {
		if (!this[0]) {
			return null;
		}
		
		// bail out on Webkit otherwise we double up
		if (thisStyle.WebkitTransition !== undefined) return originalPositionMethod.call(this);
		
		var position = originalPositionMethod.call(this),
			translation = getTranslation.call(this);
			
		return (position) ? {
			left: position.left + translation.left,
			top: position.top + translation.top
		} : null;
	};
	
})(jQuery, jQuery.fn.position);