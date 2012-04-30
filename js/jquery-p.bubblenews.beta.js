/** Bubble News jQuery plugin vBeta
 *  Michele Puddu - modok64@hotmail.com - http://www.oim-worlds.com/
 *  License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
(function($, undefined){

    var pluginName = "bubbleNews",
    	feed = undefined,
    	selector = null,
    	copyText = '<p>Bubbles News: <strong>Michi P</strong>: <em>modok64@hotmail.com</em> - <em><a href="http://www.oim-worlds.com" target="_blank">http://www.oim-worlds.com/</a></em></p>';
        $dom = {
    		global : null,
    		insertNewFeed: null,
    		alert:null,
    		upper:null,
    		lower:null,
    		clouds: null,
    		gravityAttractor:null,
    		copy:null
    	},
        Environment = new function () {
    		var wind = 0,
	    		turbolence = 1000,
	    		gravity= 9.8,
	    		friction= 0.9;
    
    		this.Wind = function(value) {
    			if(value === undefined || isNaN(value) || value < 0)
    				return wind;
                        else {
    				wind = value;
    				return wind;
    			}
    		};
    		this.Turbolence = function(value) {
    			if(value === undefined || isNaN(value) || value < 0)
    				return turbolence;
    			else {
    				turbolence = value;
    				return turbolence;
    			}
    		};
    		this.Gravity = function(value) {
    			if(value === undefined || isNaN(value) || value < 1) {
    				return gravity;
    			}
    			else {
    				gravity = value;
    				return gravity;
    			}
    		};
    		this.Friction = function(value) {
    			if(value === undefined || isNaN(value) || value < 0)
    				return friction;
    			else {
    				friction = value;
    				return friction;
    			}
    		};
    	},
        BubbleCannon = function (shotValue) 
        {
    		var boostAbs = parseInt(shotValue) || 3,
    			boostReal = (boostAbs * Environment.Gravity()),
                feed;
    		
    		this.boostReal = boostReal;
    		this.Boost = function (value) {
    			if(value === undefined || isNaN(value)) 
    			{
    				return boostAbs;
    			} 
    			else if (value < 1)
    				return("boost can't be lesser then 1");
    			else 
    			{
    				boostAbs = value;
    				return boostAbs;
    			}
    		};
    		this.shot = function (i) {
				feed[i].start(boostReal);
    		};
    		this.loadGunPowder = function () {
    			boostReal = (boostAbs * Environment.Gravity());
    		};
            this.loadBubbles = function (_feed) {
                feed = _feed;
            };
    	},
        BubbleEngine = new function () 
    	{
            var self = this,
            	i = 0,
            	initialized = false,
            	cannon = new BubbleCannon();
            	timer = undefined,
            	mainLoop = function () 
	            {
	            	var thereIsAlive = false;
	            	
	                for (var f in feed) 
	                {
	                	var _feed = feed[f];
	                    if(_feed.isAlive) 
	                    {
	                        thereIsAlive = true;
	                        _feed.move();
	                        if(f == i) 
	                        {   
	                        	var winHeight = $(window).height();
	                            var startHeight =  winHeight - (parseInt(_feed.height) + parseInt(_feed.y));
	                            var maxHeight = 0; 
	                            var x = cannon.boostReal ;
	                            while(x > 1) {
	                            	x *= Environment.Friction();
	                            	maxHeight += x;
	                            }
    			                if(maxHeight <= startHeight) 
	                            {
    			                	var z = ++i;
    			                	if(z >= feed.length) {
    			                		z = 0;
    			                		i = 0;
    			                	}
	                                cannon.shot(z);
	                            }
	                        }
	                    }
	                }
	                
	                if(!thereIsAlive) 
	                {
	                	if(i >= feed.length)
	                		i = 0;
	                    cannon.shot(i);
	                }
	            };
	        
	        this.init = function() {
	        	if(initialized)
	        		return;
	        	
	        	cannon.loadBubbles(feed);
	            initialized = true;
	        	this.start();
	        };
            this.start = function ()
            {
            	if(!timer) {
            		timer = setInterval(function() {mainLoop();}, 1000/60);
    			}
    		};
            this.stop = function () {
                clearInterval(timer);
                timer = null;
            };
            this.newFeed = function (_feed) {
            	this.stop();
            	i = 0;
            	for (f in feed) {
            		feed[f].dispose();
            	}
            	feed.length = 0;
            	for (var f in _feed) {
            		if(!!_feed[f].link)
            			feed.push(new Bubble(_feed[f]));
                }
            	this.start();
            } 
        },
        Bubble = function(_feed) 
        {
            var self = this,
            	oscillation = 0,
            	activeOscillation = true,
            	modal,
            	boostReal,
            	dataFeed = _feed;
            this.y = $(window).height();
            this.isAlive = false;
            this.toRestartOnFinish = false;
            this.toRight = true;
            this.dom = $('<div class="agc-bubble-container" style="top:'+ self.y +'px"><div class="agc-bubble"> </div><div class="agc-bubble-news">' + dataFeed.title + '</div></div>');
           
            this.dom.click(function() {
                showPreview();
            });
            
            this.start = function(_boostReal) {
            	if(this.isAlive) {
                    this.toRestartOnFinish = true;

                    return;
                }
                boostReal = _boostReal;
                this.isAlive = true;
                this.y = $(window).height();
                this.dom.css('top', this.y);
                this.dom.appendTo($dom.global);
                this.width = this.dom.width();
                this.height = this.dom.height();
                this.x = Math.abs((Math.random() * $dom.global.width()).toFixed(0) - (this.width));
                
            };
            this.move = function() {
            	boostReal *= Environment.Friction();
    			if (boostReal < 0.5)
            		boostReal = 0.5;
    			
    			if (self.y <= ($dom.gravityAttractor.height() + $dom.gravityAttractor.position().top))
    				boostReal *= 1.2;
    			
    			self.y -= boostReal.toFixed(1);
    			if(Environment.Turbolence() != 0) {
                	
                	if(activeOscillation) 
                	{
                        if(this.toRight) {
		                    self.x += 1 * Environment.Wind();
		                } else {
		                    self.x -= 1 * Environment.Wind();
		                }
		                oscillation++;
                                
                        if(oscillation >= Environment.Turbolence()) 
                        {
                            activeOscillation = false;
                        }       
                	}
	            }
                this.dom.css({"top": self.y, "right":self.x});
                if(self.y + self.height < 0)
                    self.destroy();
            };
            this.destroy = function() {
                self.isAlive = false;
                this.dom.detach();
                if(this.toRestartOnFinish) {
                    this.toRestartOnFinish = false;
                    this.start();
                }
            };
            this.dispose = function() {
            	self.isAlive = false;
            	self.toRestartOnFinish = false;
            	this.dom.remove();
            };
            var showPreview = function () {
            	var link = (!dataFeed.origLink)?(dataFeed.link.href):(dataFeed.origLink);
            	if(typeof link === 'object' && link.length > 1 )
            		if(!!link[0].content)
            			link = link[0].content;
            		if(!!link.content)
            			link = link.content;
            	else
            		if(!!link.content)
            			link = link.content;
            		
            	if(!!dataFeed.summary.content && dataFeed.summary.content.length > 200) {
            		var $description = $('<div></div>').html(dataFeed.summary.content);
	            	$description.find('a:not([href^="http"])').remove();
	            	$description.find('a').attr('target', '_blank');
	                modal = $('<div class="agc-bubble-preview"><div class="agc-box"><div class="agc-close"></div><div class="agc-container"><h3><a href="' + link + '" target="_blank">' + dataFeed.title + '</a></h3>' + $description.html() + '</div></div></div>');
	                var box = modal.find('.agc-box');
	                var container = modal.find('.agc-container');
	                modal.find('.agc-close').click(function() {BubbleEngine.start();modal.remove();modal = undefined;});
	                $("body").append(modal);
	                var width = box.width();
	                var height = box.height();
	                box.css({"width":"20px", "height":"20px"});
	                box.animate({"width": width}).animate({"height":height},"fast", function() {container.fadeIn();});
	                BubbleEngine.stop();
                } else {
                	
            		window.open(link);
            	}
            };
            

        };

    var methods = {

        init: function (_opt) {
    		if(!!$(this).data(pluginName))
    			return;
    		
    		var defaultSettings = {
    				feedType:"rss"
    			},
    			settings,
            	$this = $dom.global = $(this);
            $this.css({"position":"fixed",
                    "z-index":10000, 
                    "right":0, 
                    "bottom":0,
                    "top":0,
                    "width":300
            });
            
            selector = $this.selector;
            settings = $.extend({}, defaultSettings, _opt, true);
            $dom.global.data(pluginName, settings);
            $dom.upper = $('<div class="agc-upper"></div>');
            $dom.lower = $('<div class="agc-lower"></div>');
            $dom.gravityAttractor = $('<div class="agc-gravity-attractor"></div>');
            $dom.alert = $('<div class="agc-alert">bubbles are loading</div>');
            $dom.copy = $('<div class="agc-copy">' + copyText + '</div>');
            
            $dom.upper.append($dom.gravityAttractor);
            $dom.lower.append($dom.alert);
            $dom.lower.append($dom.copy);
            
            $dom.global.append($dom.upper);
            $dom.global.append($dom.lower);
            
            
            $("<script>function updateFeed(feed) {jQuery('" + $this.selector + "')." + pluginName + "('update', feed.query); " + "}</script>").appendTo('head');
            $("<script>function receiverFeed(feed) {jQuery('" + $this.selector + "')." + pluginName + "('receive', feed.query); " + "}</script>").appendTo('head');
			$("<script src='http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20feednormalizer%20WHERE%20output%3D%22atom_1.0%22 AND url%3D%22" + settings.url + "%22&format=json&callback=receiverFeed'></script>").appendTo("head");
			//$("<script>function receiverTweet(feed) {$('" + $this.selector + "')." + pluginName + "('receiveTweet', feed.query); " + "}</script>").appendTo('head');
            //$("<script src='http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22" + settings.url + "%22&format=json&callback=receiverFeed'></script>").appendTo("head");
			//$("<script src='http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20twitter.user.timeline%20WHERE%20screen_name%3D%27michipg%27&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=receiverTweet'></script>").appendTo("head");
        },
		receiveTweet:function(_feed) {
			if(!!window.console)
				console.log(_feed);
		},
        receive: function(_feed) {
        	if(!$(this).data(pluginName)) {
        		return;
        	}
        	$dom.copy.html('Feed: <a href="' + $dom.global.data(pluginName).url + '" target="_blank">' + $dom.global.data(pluginName).url + "</a>").append(copyText);
    		$dom.insertNewFeed = $('<div class="agc-new-feed"><input type="text" placeholder="New Feed URL"></div>');
            $dom.insertNewFeed.find('input[type="text"]').on('keyup',function(e) {
            	if(e.which === 13) {
	            	var t = $(this).val();
	            	$dom.global[pluginName]('newFeed', t);
	            	$(this).val('');
            	}
            });
            $dom.lower.prepend($dom.insertNewFeed);
            $dom.lower.prepend('<div class="agc-options"><div class="agc-rss"></div><div class="agc-question"></div></div>');
            var newRss = $dom.lower.find('.agc-rss');
            var showCopy = $dom.lower.find('.agc-question');
            
            newRss.toggle(function() {
            	$dom.insertNewFeed.fadeIn();
            }, function() {
            	$dom.insertNewFeed.fadeOut();
            });
            showCopy.toggle(function() {
            	$dom.copy.slideDown();
            }, function() {
            	$dom.copy.slideUp();
            });
            
            feed = [];
            if(!!_feed.count) {
            	$dom.insertNewFeed.delay(1000).fadeOut();
            	for (var f in _feed.results.feed.entry) {
            		if(!!_feed.results.feed.entry[f].link)
            			feed.push(new Bubble(_feed.results.feed.entry[f]));
	            }
	        	$dom.alert.slideUp('slow');
                BubbleEngine.init();
        	} else {
        		$dom.alert.slideDown('slow').html("feed empty. Try again");
        	}
        },
        newFeed: function (url) {
        	if(!$(this).data(pluginName)) {
        		return;
        	}
        	$("<script src='http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20feednormalizer%20WHERE%20output%3D%22atom_1.0%22 AND url%3D%22" + url + "%22&format=json&callback=updateFeed'></script>").appendTo("head");
        	$dom.alert.html('bubbles are loading').slideDown('slow');
        	$dom.copy.html('Feed: <a href="' + url + '" target="_blank">' + url + '</a>').append(copyText);
        },
        update: function(_feed) {
        	if(!$(this).data(pluginName)) {
        		return;
        	}
        	if(! _feed) {
        		$dom.alert.slideDown('slow').html("URL Invalid. Check and try again").delay(2000).slideUp('slow');
        		return;
        	}
        	if(_feed.count > 0) {
        		$dom.insertNewFeed.fadeOut();
        		var newRss = $dom.upper.find('.agc-rss');
        		newRss.trigger('click');
        		$dom.alert.slideUp('slow');
        		BubbleEngine.newFeed(_feed.results.feed.entry);
        		BubbleEngine.init();
        	} else {
        		$dom.alert.slideDown('slow').html("Feed empty. Try again").delay(2000).slideUp('slow');
        	}
        	
        },
        suspend: function() {
        	if(!$(this).data(pluginName)) {
        		return;
        	}
        	BubbleEngine.stop();
        	
        },
        resume: function() {
        	if(!$(this).data(pluginName)) {
        		return;
        	}
        	BubbleEngine.start();
        	
        }
    };

    $.fn[pluginName] = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.' + pluginName );
        }    
    };
}(jQuery));