# JavaScript Color Scheme Picker

This toy utility enacts the color scheme selection process given in WebdesignerDepot's article [How to Get a Professional Look With Color](http://www.webdesignerdepot.com/2009/12/how-to-get-a-professional-look-with-color/): choose up to five colors; increase to fifteen by adding the result of overlaying each color with translucent black or white; unify the fifteen by overlaying all with a common translucent color. The color scheme picker uses Brian Grinstead's color picker [Spectrum](https://github.com/bgrins/spectrum) for most of the input, and populates the colors on load via David Merfield's [Random Color](https://github.com/davidmerfield/randomColor) script. Some of my [color layer flattener](https://github.com/ReveWeber/js-color-layer-flattener) reappears to blend the layers into fifteen individual opaque colors.

You can [try it out on my blog](http://www.rweber.net/web-development/javascript/color-scheme-picker-take-1/).

To use it yourself there are two pieces you need: jscsp-form.html and either jscsp-complete.js or jscsp-no-jquery.js. The form includes Spectrum's CSS and both the scripts include both Spectrum and Random Color; jscsp-complete.js includes jQuery, as you might guess, so use jscsp-no-jquery.js if your site already loads jQuery.

To use: place a div with id="csp-container" in your page. If the file jscsp-form.html is not at the root of your webpage, assign the container div a data-path attribute with the URL between the domain and jscsp-form.html. For example, for example.com/gadgets/color/jscsp-form.html you would use data-path="gadgets/color". Including or excluding slashes on each end is okay. Call jscsp-complete.js or jscsp-no-jquery.js sometime after the container div.

My intention is to come back to this and add a means to select, say, five of the fifteen resultant colors and have them appear by themselves underneath the current contents.