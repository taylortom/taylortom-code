/**
 * Represents a taskpopup
 */

(function(){

    /**
     * constructor
     * @param model
     * @param anchorPoint
     */
    var StackedMilestonePopupView = function(models,anchorPoint){

        // console.log('StackedMilestonePopupView.constructor: ' + model.getTitle() + ' (' + anchorPoint.x + ',' + anchorPoint.y + ')');
        this.initialize(models, anchorPoint);
    };

    // set the 'class'
    var p = StackedMilestonePopupView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    this._screenlock;
    this._mask;
    this._shadow;
    this._callout;
    this._bg;
    
    this._closeBtn;

    /**
     * Initialises the vars
     * @param model
     * @param anchorPoint
     */
    p.initialize = function(models, anchorPoint){

        // console.log('StackedMilestonePopupView.initialize: ' + this.openPopup);

		this.Container_initialize();
		
		if(openPopup != undefined) openPopup.onCloseButtonClicked();
		openPopup = this;
		
		this._models = models;
        this._anchorPoint = anchorPoint;
        this._offset = new Point(anchorPoint.x, anchorPoint.y);
        this._drawBackwards = false;
        this._alignPopupBottom = false;

        this._display = new createjs.Container();
        this._displays = new Array();

        this.redraw();

        // positions the popup (drawing backwards if need be)
        this.checkIsOnscreen();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();

        //this.drawScreenlock();
        this.attachDisplays();
        this.drawCloseButton();
        this.drawBackground();
        this.positionComponents();
        this.arrangeComponents();
        this.setupListeners();

        stage.children[0].contentHolder.addChild(this);

        update = true;
    };
    
    p.attachDisplays = function(){
    
    	var xPos = 0;
        var spacing = 40;
        
        var height = 0;

        for(var i = 0; i < this._models.length; i++){
        
        	var display = new MilestonePopupDisplay(this._models[i]);

        	if(i > 0)
			{        	
		    	var line = drawVerticalLine(display.height, 0.5, '#000', 0.4);
		    	line.x = display.x - 30;
		    	line.y = -20;
	        	display.addChild(line);
        	}
        	
        	display.x = xPos;
        	xPos += display.width;	
        	
        	xPos += 45;
        	
        	this._displays.push(display);
        	
        	if(display.height > height) height = display.height;
        }
        
        this._display.width = xPos;
        this._display.height = height;
    }

    /**
     * Draws the background for the popup
     */
    p.drawScreenlock = function(){

        // console.log('StackedMilestonePopupView.drawScreenlock: ' + stage.width + "x" + stage.height);

        this._screenlock = new createjs.Shape();
        this._screenlock.graphics.beginFill('#000')
                           .rect(0,0,Config.getStageWidth(),Config.getStageHeight());
        this._screenlock.x = 0;
        this._screenlock.alpha = 0.4;
        this._screenlock.x = stage.children[0].contentHolder.x*-1;
        this._screenlock.onClick = function(){};
    };

    /**
     * Draws the background for the popup
     */
    p.drawBackground = function(){

        // console.log('StackedMilestonePopupView.drawBackground: ' + this._offset.x + ',' + this._offset.y);

        var strokeColour = Config.getCompletedColour();
        var strokeThickness = 2.5;
        
        this._bg = new createjs.Shape();
        this._bg.width = this._display.width;
        this._bg.height = this._display.height;
        this._bg.graphics.beginFill('#fff')
                   .setStrokeStyle(strokeThickness)
                   .beginStroke (strokeColour)
                   .rect(0,0,this._bg.width,this._bg.height)
                   .endStroke();

        this._callout = new createjs.Shape();
        this._callout.size = 25;
        this._callout.rotationAngle = (this._drawBackwards) ? 0 : 180;
        this._callout.graphics.beginFill('#fff')
            .setStrokeStyle(strokeThickness)
            .beginStroke (strokeColour)
            .drawPolyStar(0,0,this._callout.size,3,2,this._callout.rotationAngle)
            .endStroke();
        
        this._mask = new createjs.Shape();
        this._mask.width = 20;
        this._mask.height = 49;
        this._mask.graphics.beginFill('#fff').rect(0,0,this._mask.width,this._mask.height);

        this._shadow = new createjs.Shape();
        this._shadow.graphics.beginFill('#000').rect(0,0,this._bg.width,this._bg.height);
        this._shadow.alpha = 0.25;
    };

    /**
     * Draws the close button
     */
    p.drawCloseButton = function(){

        this._closebtn = new createjs.Shape();
        this._closebtn.size = 15;
        this._closebtn.graphics.beginFill('#cc0066')
            .rect(0,0,this._closebtn.size,this._closebtn.size)
            .endFill()
            .setStrokeStyle(2)
            .beginStroke("#fff")
            .moveTo(2,2)
            .lineTo(13,13)
            .moveTo(2,13)
            .lineTo(13,2)
            .endStroke();
    };
    
    /**
     * Positions the components
     */
    p.positionComponents = function(){
	    
        this._bg.x = (this._drawBackwards) ? this._offset.x-(this._bg.width+this._callout.size) : this._offset.x + this._callout.size;
        this._bg.y = (this._alignPopupBottom) ? Config.getStageHeight()-(this._bg.height + 10) : this._offset.y-(this._display.height/2);
        
        this._callout.x = (this._drawBackwards) ? (this._bg.x+this._bg.width)-0.35 : this._bg.x+0.35;
        this._callout.y = this._anchorPoint.y;

        this._mask.x = (this._drawBackwards) ? this._callout.x-(this._mask.width+1) : this._callout.x+1;
        this._mask.y = this._callout.y-this._callout.size;

        this._shadow.x = this._bg.x + 5;
        this._shadow.y = this._bg.y + 5;
        
        this._closebtn.x = this._bg.x + this._bg.width - (this._closebtn.size + 10);
        this._closebtn.y = this._bg.y + 10;
        
        this._display.x = this._bg.x+25;
        this._display.y = this._bg.y+20;
    };

    p.arrangeComponents = function(){

        // screenlock/background

        this.addChild(this._screenlock);
        this.addChild(this._shadow, this._bg, this._callout, this._mask);

        for(var i = 0; i < this._displays.length; i++){
        	
        	this._display.addChild(this._displays[i]);
        }

        this.addChild(this._display);

        // buttons

        this.addChild(this._closebtn, this.buttontxt);
    };
    
    p.setupListeners = function(){
	    
		this._bg.onClick = function() {}; // ignore any clickables behind the popup
		this._bg.onMouseOver = function(){ $('body').css('cursor', Config.getCursorDefault()); };
        
        this._closebtn.onClick = $.proxy(this.onCloseButtonClicked, this);
		this._closebtn.onMouseOver = function(){ $('body').css('cursor', Config.getCursorPoint()); };
		this._closebtn.onMouseOut = function(){ $('body').css('cursor', Config.getCursorDefault()); };
    };

    p.checkIsOnscreen = function() {

    	var changed = false;

        var viewX = stage.children[0].contentHolder.x*-1;
        var bottomLeft = new Point(this._bg.x, this._bg.y+this._bg.height);
        var topRight = new Point(this._bg.x+this._bg.width, this._bg.y);

        var drawBackwards = (this._anchorPoint.x > (viewX + Config.getStageWidth()/2));
        
        // work out if we need to flip the popup

        if(this._drawBackwards != drawBackwards) {

            this._drawBackwards = drawBackwards;
            if(!isWithinScreenBounds(this._offset)) 
            {
            	this._offset.x = ((stage.children[0].contentHolder.x*-1) + Config.getStageWidth());// - (10 + this._callout.size);
            }
            changed = true;
        }
        else if(!isWithinScreenBounds(this._offset)) {

            this._offset.x = ((stage.children[0].contentHolder.x*-1) + (10+this._callout.size));
            changed = true;
        }

        // work out if we need to shift the yPos of the popup

        // take into account the fact that we might have flipped the popup
        if(this._drawBackwards) bottomLeft.x -= (this._bg.width + this._callout.size); 
        
        if(bottomLeft.y > (stage.height - 10) || bottomLeft.y < 10) {
        	
            this._alignPopupBottom = true;
            changed = true;
        }

        if(changed) this.redraw();
        
        var sidePadding = 15;
        if(this._bg.x < sidePadding) stage.children[0].dragPadding = -this._bg.x + sidePadding;
    };

    /**
     * Close the popup
     */
    p.onCloseButtonClicked = function(){
    	

        this.removeAllChildren();
        
        stage.children[0].resetCanvas();
        
        update = true;
    };

    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        //this._model.print();
        this._anchorPoint.print();
    };

    window.StackedMilestonePopupView = StackedMilestonePopupView;
}());
