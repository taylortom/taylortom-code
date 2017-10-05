/**
 * A Scrollbar component
 */

(function(){

    /**
     * constructor
     */
    var Scrollbar = function(timeline){

        // console.log('Scrollbar.constructor');
        this.initialize(timeline);
    };

    // set the 'class'
    var p = Scrollbar.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    this._timeline;
    this._bg;
    this._marker;
    
    this._timelineOffset = 0;

    /**
     * Initialises the vars
     */
    p.initialize = function(timeline){

        // console.log('Scrollbar.initialize');

        this.Container_initialize();

        this._timeline = timeline;

        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this._bg = new createjs.Shape();
        this._bg.width = Config.getStageWidth();
        this._bg.height = Config.getScrollbarHeight();
        this._bg.graphics.beginFill('#000')
            .rect(0,0,this._bg.width,this._bg.height);
        this._bg.alpha = 0.15;
        this._bg.x = 0;
        this._bg.y = Config.getStageHeight()-this._bg.height;

        this._marker = new createjs.Shape();
        var width = Config.getStageWidth() * (Config.getStageWidth()/this._timeline.getWidth());

        if(this._timelineOffset > 0) { 
        
        	var buffer = Config.getStageWidth() * (this._timelineOffset/this._timeline.getWidth());
        	width -= buffer;

        	
        	if(window.console && window.console.log) console.log('Config.getStageWidth:  ' + Config.getStageWidth() + ' -- ' + (this._timelineOffset/this._timeline.getWidth()) + ' -- ' + buffer);
    	}
       	
        this._marker.width = width;
        
        this._marker.height = this._bg.height*0.55;
        this._marker.graphics.beginFill('#000')
            .drawRoundRect(0,0,this._marker.width,this._marker.height,this._marker.height);
        this._marker.alpha = 0.4;
        this._marker.x = 0;
        this._marker.y = this._bg.y + ((this._bg.height-this._marker.height)/2);

        this.arrangeComponents();
        this.disable();

        update = true;
    };

    p.update = function() {

        var timeline = stage.children[0].timeline;
        var currentPosition = stage.children[0].contentHolder.x * -1;

        currentPosition += (Config.getStageWidth()/2) - (timeline._startPoint.x);
        var xPos = (currentPosition/timeline.getWidth()) * Config.getStageWidth();

        this._marker.x = xPos - (this._marker.width/2);
    };

    /**
     * Makes sure that layering is correct
     */
    p.arrangeComponents = function(){

        this.addChild(this._bg);
        this.addChild(this._marker);
    };
    
    p.setTimelineOffset = function(newOffset){
    
    	this._timelineOffset = newOffset;
    	this.redraw();
    };

    /**
     * Shows the bar
     */
    p.enable = function(){

        // console.log('Scrollbar.enable');
        if(stage.children[0] != undefined) this.update();
        this.visible = true;
        this._enabled = true;
        update = true;
    };

    /**
     * Hides the bar
     */
    p.disable = function(){

        // console.log('Scrollbar.disable: ' + this);

        this.visible = false;
        this._enabled = false;
        if(stage.children[0] != undefined) this.update();
        update = true;
    };

    /**
     * Returns whether the bar's
     * enabled or not
     */
    p.getEnabled = function(){

        return this._enabled;
    };

    window.Scrollbar = Scrollbar;
}());
