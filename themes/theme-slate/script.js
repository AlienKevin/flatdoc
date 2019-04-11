/*
	The MIT License (MIT)

	Copyright (c) <2013> <Ren Aysha>

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
*/

if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {
	"use strict";

	var Anchorific = {
		init: function( options, elem ) {
			var self = this;

			self.elem = elem;
			self.$elem = $( elem );

			self.opt = $.extend( {},  this.opt, options );

      self.headers = self.$elem.find( 'h1, h2, h3' );

      // Fix bug #1
      if ( self.headers.length !== 0 ) {
        self.first = parseInt( self.headers.prop( 'nodeName' ).substring( 1 ), null );
      }

      if ( self.opt.spy ) {
        self.spy();
      }

      if ( self.opt.top ) {
        self.back();
      }
		},

		opt: {
			// speed: 200, // speed of sliding back to top
			// top: '.top', // back to top button or link class
			// spy: true, // scroll spy
      // spyOffset: !0 // specify heading offset for spy scrolling
      
    //   navigation: '.anchorific', // position of navigation
			headers: 'h1, h2, h3, h4, h5, h6', // custom headers selector
			speed: 200, // speed of sliding back to top
			anchorClass: 'anchor', // class of anchor links
			anchorText: '#', // prepended or appended to anchor headings
			top: '.top', // back to top button or link class
			spy: true, // scroll spy
			position: 'append', // position of anchor text
			spyOffset: !0 // specify heading offset for spy scrolling
		},

		back: function() {
			var self = this;

      $( self.opt.top ).on( 'click', function( e ) {
				e.preventDefault();

        $( 'body, html' ).animate({
					'scrollTop': 0
				}, self.opt.speed );
			});
		},

		top: function( that ) {
			var self = this, top = self.opt.top, back;

			if ( top !== false ) {
				back = ( $( that ).scrollTop() > 200 ) ? $( top ).fadeIn() : $( top ).fadeOut();
			}
		},

		spy: function() {
			var self = this, prevAhref, currAhref, current, list, top, prevList;

			$( window ).scroll( function( e ) {
				// show links back to top
				self.top( this );
				// get all the header on top of the viewport
				current = self.headers.map( function( e ) {
					if ( $( this ).offset().top !==0 &&  ( $( this ).offset().top - $( window ).scrollTop() ) < self.opt.spyOffset ) {
						return this;
					}
				});

				// get only the latest header on the viewport
				current = $( current ).last() || self.headers [0];

				if ( current && current.length ) {
					// get all li tag that contains href of # ( all the parents )
					list = $( '#root-item  li:has(a[href="#' + current.attr( 'id' ) + '"])' );
          currAhref = $(list).find( 'a[href="#' + current.attr( 'id' ) + '"]' );

					if (list.length !==0) {
            if (prevList !== undefined) {
						  prevList.removeClass( 'active' );
            }
            list.addClass( 'active' );
            prevList = list;
					}
          if (currAhref.length !==0) {
            if (prevAhref !== undefined) {
              prevAhref.removeClass( 'current' );
            }
            currAhref.addClass( 'current' );
            prevAhref = currAhref;
          }
				}
			});
		}
	};

	$.fn.anchorific = function( options ) {
		return this.each(function() {
			if ( ! $.data( this, 'anchorific' ) ) {
				var anchor = Object.create( Anchorific );

				anchor.init( options, this );

				$.data( this, 'anchorific', anchor );
			}
		});
	};

})( jQuery, window, document );

// Flatdoc script
(function($) {
  var $window = $(window);
  var $document = $(document);

 $document.on('flatdoc:ready', function() {
   $('.content').anchorific() ;
 });

  /*
   * Sidebar stick.
   */

  $(function() {
    var $sidebar = $('.menubar');
		var $header = $('.header');

    $window
      .on('resize.sidestick', function() {
        $sidebar.removeClass('fixed');
        $window.trigger('scroll.sidestick');
      })
      .on('scroll.sidestick', function() {
        var scrollY = $window.scrollTop();
				var elTop = $header.offset().top+$header.height();
        $sidebar.toggleClass('fixed', (scrollY >= elTop));
      })
      .trigger('resize.sidestick');
  });

  /*
   * Title card.
   */

   $(function() {
     var $card = $('.title-card');
     if (!$card.length) return;

     var $header = $('.header');
     var headerHeight = $header.length ? $header.outerHeight() : 0;

     $window
       .on('resize.title-card', function() {
         var windowWidth = $window.width();

         if (windowWidth < 480) {
           $card.css('height', '');
         } else {
           var height = $window.height();
           $card.css('height', height - headerHeight);
         }
       })
       .trigger('resize.title-card');
   });
})(jQuery);

/**
 * scroll-behavior-polyfill
 * Original file: /npm/scroll-behavior-polyfill@2.0.7/dist/index.js
 */
if (!("scrollBehavior" in document.documentElement.style)) {
!function(){"use strict";var t="scrollBehavior"in document.documentElement.style,e=function(){return(e=Object.assign||function(t){for(var e,o=1,n=arguments.length;o<n;o++)for(var l in e=arguments[o])Object.prototype.hasOwnProperty.call(e,l)&&(t[l]=e[l]);return t}).apply(this,arguments)};function o(t,e){var o="function"==typeof Symbol&&t[Symbol.iterator];if(!o)return t;var n,l,r=o.call(t),i=[];try{for(;(void 0===e||e-- >0)&&!(n=r.next()).done;)i.push(n.value)}catch(t){l={error:t}}finally{try{n&&!n.done&&(o=r.return)&&o.call(r)}finally{if(l)throw l.error}}return i}var n="scrollBehavior",l="scroll-behavior",r=new RegExp(l+":\\s*([^;]*)");function i(t,e){if(null!=e&&"smooth"===e.behavior)return"smooth";var i,s="style"in t?t:null!=document.scrollingElement?document.scrollingElement:document.documentElement;if("style"in s){var c=s.style[n];null!=c&&""!==c&&(i=c)}if(null==i){var a=s.getAttribute("scroll-behavior");null!=a&&""!==a&&(i=a)}if(null==i){var u=s.getAttribute("style");if(null!=u&&u.includes(l)){var f=u.match(r);if(null!=f){var h=o(f,2)[1];null!=h&&""!==h&&(i=h)}}}if(null==i){var d=getComputedStyle(s).getPropertyValue("scrollBehavior");null!=d&&""!==d&&(i=d)}return i}var s=.5;function c(t){return s*(1-Math.cos(Math.PI*t))}var a=15e3;var u=Element.prototype.scroll,f=window.scroll,h=Element.prototype.scrollBy,d=window.scrollBy,p=Element.prototype.scrollTo,m=window.scrollTo;function w(t,e){this.__adjustingScrollPosition=!0,this.scrollLeft=t,this.scrollTop=e,delete this.__adjustingScrollPosition}function v(t,e){return w.call(this,t,e)}function y(t,e){this.__adjustingScrollPosition=!0,this.scrollLeft+=t,this.scrollTop+=e,delete this.__adjustingScrollPosition}function g(t,e){switch(t){case"scroll":return e instanceof Element?null!=u?u:w:f;case"scrollBy":return e instanceof Element?null!=h?h:y:d;case"scrollTo":return e instanceof Element?null!=p?p:v:m}}function b(t,e,o,n){var l="performance"in window?performance.now():Date.now();if(t instanceof Element)return{startTime:l,startX:r=t.scrollLeft,startY:i=t.scrollTop,endX:Math.floor("scrollBy"===n?r+e:e),endY:Math.floor("scrollBy"===n?i+o:o),method:g("scrollTo",t).bind(t)};var r,i,s=window.scrollX,c=window.pageXOffset,a=window.scrollY,u=window.pageYOffset;return{startTime:l,startX:r=null==s||0===s?c:s,startY:i=null==a||0===a?u:a,endX:Math.floor("scrollBy"===n?r+e:e),endY:Math.floor("scrollBy"===n?i+o:o),method:g("scrollTo",window).bind(window)}}function E(t){return null==t?0:"number"==typeof t?t:"string"==typeof t?parseFloat(t):0}function T(t){return null!=t&&"object"==typeof t}function M(t,o,n,l){!function(t,e,o){var n=i(e,t);null==n||"auto"===n?g(o,e).call(e,t.left,t.top):function(t){var e=t.startTime,o=t.startX,n=t.startY,l=t.endX,r=t.endY,i=t.method,s=0,u=l-o,f=r-n,h=Math.max(Math.abs(u/1e3*a),Math.abs(f/1e3*a));requestAnimationFrame(function t(a){s+=a-e;var d=Math.max(0,Math.min(1,0===h?0:s/h)),p=Math.floor(o+u*c(d)),m=Math.floor(n+f*c(d));i(p,m),p===l&&m===r||requestAnimationFrame(t)})}(b(e,t.left,t.top,o))}(function(t,o){if(void 0===o&&!T(t))throw new TypeError("Failed to execute 'scroll' on 'Element': parameter 1 ('options') is not an object.");return T(t)?e({},B(t.left,t.top),{behavior:null==t.behavior?"auto":t.behavior}):e({},B(t,o),{behavior:"auto"})}(n,l),t,o)}function B(t,e){return{left:E(t),top:E(e)}}function S(t){return"nodeType"in t&&1===t.nodeType?t.parentNode:"ShadowRoot"in window&&t instanceof window.ShadowRoot?t.host:t===document?window:t instanceof Node?t.parentNode:null}var j=null!=document.scrollingElement?document.scrollingElement:document.documentElement;function O(t){return"visible"!==t&&"clip"!==t}function P(t){if(t.clientHeight<t.scrollHeight||t.clientWidth<t.scrollWidth){var e=getComputedStyle(t,null);return O(e.overflowY)||O(e.overflowX)}return!1}function W(t){for(var e=t;null!=e;){var o=i(e);if(null!=o&&(e===j||P(e)))return[e,o];e=S(e)}for(e=t;null!=e;){if(e===j||P(e))return[e,"auto"];e=S(e)}return[j,"auto"]}var X=/^#\d/;function Y(){window.addEventListener("click",function(t){if(t.isTrusted&&t.target instanceof HTMLAnchorElement){var e=t.target.getAttribute("href");if(null!=e&&e.startsWith("#")){var n=function(t){for(var e=t;null!=e;){if("ShadowRoot"in window&&e instanceof window.ShadowRoot)return e;var o=S(e);if(o===e)return document;e=o}return document}(t.target),l=null!=e.match(X)?n.getElementById(e.slice(1)):n.querySelector(e);if(null!=l){var r=o(W(l),2)[1];"smooth"===r&&(t.preventDefault(),l.scrollIntoView({behavior:r}))}}}})}var _=Element.prototype.scrollIntoView;function I(t,e,o,n,l,r,i,s){return r<t&&i>e||r>t&&i<e?0:r<=t&&s<=o||i>=e&&s>=o?r-t-n:i>e&&s<o||r<t&&s>o?i-e+l:0}function L(t,e,o){var n=o.block,l=o.inline,r=document.scrollingElement||document.documentElement,i=null!=window.visualViewport?visualViewport.width:innerWidth,s=null!=window.visualViewport?visualViewport.height:innerHeight,c=null!=window.scrollX?window.scrollX:window.pageXOffset,a=null!=window.scrollY?window.scrollY:window.pageYOffset,u=t.getBoundingClientRect(),f=u.height,h=u.width,d=u.top,p=u.right,m=u.bottom,w=u.left,v="start"===n||"nearest"===n?d:"end"===n?m:d+f/2,y="center"===l?w+h/2:"end"===l?p:w,g=e.getBoundingClientRect(),b=g.height,E=g.width,T=g.top,M=g.right,B=g.bottom,S=g.left,j=getComputedStyle(e),O=parseInt(j.borderLeftWidth,10),P=parseInt(j.borderTopWidth,10),W=parseInt(j.borderRightWidth,10),X=parseInt(j.borderBottomWidth,10),Y=0,_=0,L="offsetWidth"in e?e.offsetWidth-e.clientWidth-O-W:0,x="offsetHeight"in e?e.offsetHeight-e.clientHeight-P-X:0;if(r===e)Y="start"===n?v:"end"===n?v-s:"nearest"===n?I(a,a+s,s,P,X,a+v,a+v+f,f):v-s/2,_="start"===l?y:"center"===l?y-i/2:"end"===l?y-i:I(c,c+i,i,O,W,c+y,c+y+h,h),Y=Math.max(0,Y+a),_=Math.max(0,_+c);else{Y="start"===n?v-T-P:"end"===n?v-B+X+x:"nearest"===n?I(T,B,b,P,X+x,v,v+f,f):v-(T+b/2)+x/2,_="start"===l?y-S-O:"center"===l?y-(S+E/2)+L/2:"end"===l?y-M+W+L:I(S,M,E,O,W+L,y,y+h,h);var V=e.scrollLeft,H=e.scrollTop;Y=Math.max(0,Math.min(H+Y,e.scrollHeight-b+x)),_=Math.max(0,Math.min(V+_,e.scrollWidth-E+L))}return{top:Y,left:_}}var x=Object.getOwnPropertyDescriptor(Element.prototype,"scrollTop").set;var V=Object.getOwnPropertyDescriptor(Element.prototype,"scrollLeft").set;var H="scroll"in Element.prototype&&"scrollTo"in Element.prototype&&"scrollBy"in Element.prototype&&"scrollIntoView"in Element.prototype;t&&H||(Element.prototype.scroll=function(t,e){M(this,"scroll",t,e)},Element.prototype.scrollBy=function(t,e){M(this,"scrollBy",t,e)},Element.prototype.scrollTo=function(t,e){M(this,"scrollTo",t,e)},Element.prototype.scrollIntoView=function(t){var n=null==t||!0===t?{block:"start",inline:"nearest"}:!1===t?{block:"end",inline:"nearest"}:t,l=o(W(this),2),r=l[0],i=l[1],s=null!=n.behavior?n.behavior:i;if("smooth"===s)r.scrollTo(e({behavior:s},L(this,r,n)));else if(null!=_)_.call(this,n);else{var c=L(this,r,n),a=c.top,u=c.left;g("scrollTo",this).call(this,u,a)}},Object.defineProperty(Element.prototype,"scrollLeft",{set:function(t){return this.__adjustingScrollPosition?V.call(this,t):(M(this,"scrollTo",t,this.scrollTop),t)}}),Object.defineProperty(Element.prototype,"scrollTop",{set:function(t){return this.__adjustingScrollPosition?x.call(this,t):(M(this,"scrollTo",this.scrollLeft,t),t)}}),window.scroll=function(t,e){M(this,"scroll",t,e)},window.scrollBy=function(t,e){M(this,"scrollBy",t,e)},window.scrollTo=function(t,e){M(this,"scrollTo",t,e)},Y())}();
}
document.documentElement.style.scrollBehavior = "smooth";