/**
 * Represents a taskpopup
 */

(function(){

    /**
     * constructor
     * @param model
     * @param anchorPoint
     */
    var MilestonePopupView = function(model,anchorPoint){

        // console.log('MilestonePopupView.constructor: ' + model.getTitle() + ' (' + anchorPoint.x + ',' + anchorPoint.y + ')');
        this.initialize(model, anchorPoint);
    };

    // set the 'class'
    var p = MilestonePopupView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    var POPUP_WIDTH = 250;

    this._screenlock;
    this._shadow;
    this._bg;
    this._taskList;

    this._closeBtn;

    /**
     * Initialises the vars
     * @param model
     * @param anchorPoint
     */
    p.initialize = function(model, anchorPoint){

        // console.log('TaskPopupView.initialize: ' + this.openPopup);

		this.Container_initialize();
		
		if(openPopup != undefined) openPopup.onCloseButtonClicked();
		openPopup = this;
		
        this._model = model;
        this._anchorPoint = anchorPoint;
        this._offset = new Point(anchorPoint.x, anchorPoint.y);
        this._drawBackwards = false;
        this._alignPopupBottom = false;
        this._alignPopupTop = false;

        this.redraw();

        // positions the popup (drawing backwards if need be)
        this.checkIsOnscreen();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('TaskPopupView.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        //this.drawScreenlock();
        this._display = new MilestonePopupDisplay(this._model);
        this.drawBackground();
        this.positionComponents();
        this.drawCloseButton();
        this.arrangeComponents();

        stage.children[0].contentHolder.addChild(this);

        update = true;
    };

    /**
     * Draws the background for the popup
     */
    p.drawScreenlock = function(){

        // console.log('TaskPopupView.drawScreenlock: ' + stage.width + "x" + stage.height);

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

        // console.log('TaskPopupView.drawBackground: ' + POPUP_WIDTH + ' -- ' + this._taskList.width);

        var strokeColour = "#000";
        var strokeThickness = 2.5;
        
        if(this._model.getStatus() == completedDT) strokeColour = Config.getCompletedColour();
        else if(this._model.getIsOverdue()) strokeColour = Config.getOverdueColour();

        this._bg = new createjs.Shape();
        this._bg.width = ((this._display.width + 45) < POPUP_WIDTH) ? POPUP_WIDTH : (this._display.width+45);
        this._bg.height = this._display.height;
        this._bg.graphics.beginFill('#fff')
                   .setStrokeStyle(strokeThickness)
                   .beginStroke (strokeColour)
                   .rect(0,0,this._bg.width,this._bg.height)
                   .endStroke();
        this._bg.onClick = function() {}; // ignore any clickables behind the popup
        this._bg.onMouseOver = function(){ $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('pointCursor').addClass('defaultCursor'); };

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
     * Positions the components
     */
    p.positionComponents = function(){
	    
        this._bg.x = (this._drawBackwards) ? this._offset.x-(this._bg.width+this._callout.size) : this._offset.x + this._callout.size;

        if(!this._alignPopupBottom && !this._alignPopupTop){
            this._bg.y = this._offset.y-(this._display.height/2);
        }else{
            this._bg.y = (this._alignPopupBottom) ? Config.getStageHeight()-(this._bg.height + 10) : 10;
        }
        
        this._callout.x = (this._drawBackwards) ? (this._bg.x+this._bg.width)-0.35 : this._bg.x+0.35;
        this._callout.y = this._anchorPoint.y;

        this._mask.x = (this._drawBackwards) ? this._callout.x-(this._mask.width+1) : this._callout.x+1;
        this._mask.y = this._callout.y-this._callout.size;

        this._shadow.x = this._bg.x + 5;
        this._shadow.y = this._bg.y + 5;
        
        this._display.x = this._bg.x+25;
        this._display.y = this._bg.y+20;
    };

    /**
     * Draws the close button
     */
    p.drawCloseButton = function(){

        this._closebtn = new createjs.Shape();
        this._closebtn.graphics.beginFill('#cc0066')
            .rect(0,0,15,15)
            .endFill()
            .setStrokeStyle(2)
            .beginStroke("#fff")
            .moveTo(2,2)
            .lineTo(13,13)
            .moveTo(2,13)
            .lineTo(13,2)
            .endStroke();
        this._closebtn.x = this._bg.x+this._bg.width-25;
        this._closebtn.y = this._display.y-10;
        this._closebtn.onClick = $.proxy(this.onCloseButtonClicked, this);
		this._closebtn.onMouseOver = function(){ $('body').removeClass('defaultCursor').addClass('pointCursor'); };
		this._closebtn.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('defaultCursor'); };
    };

    p.arrangeComponents = function(){

        // screenlock/background

        this.addChild(this._screenlock);
        this.addChild(this._shadow, this._bg, this._callout, this._mask);
        this.addChild(this._display);
        this.addChild(this._closebtn, this.buttontxt);
    };

    /**
     * 
     */
    p.checkIsOnscreen = function() {

    	var changed = false;

        var bottomLeft = new Point(this._bg.x, this._bg.y+this._bg.height);
        var topRight = new Point(this._bg.x+this._bg.width, this._bg.y);
        var drawBackwards = !isWithinScreenBounds(topRight);
    
        // work out if we need to flip the popup

        if(this._drawBackwards != drawBackwards) {

            this._drawBackwards = drawBackwards;
            if(!isWithinScreenBounds(this._offset)) 
            {
            	this._offset.x = ((stage.children[0].contentHolder.x*-1) + Config.getStageWidth());
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
        
        if(bottomLeft.y > (Config.getStageHeight() + 10)) {
        	
            this._alignPopupBottom = true;
            changed = true;
        }

        if(this._bg.y < 0){
            this._alignPopupTop = true;
            changed = true;
        }



        if(changed) this.redraw();
    };

    /**
     * Close the popup
     */
    p.onCloseButtonClicked = function(){
    	

        this.removeAllChildren();
        update = true;
    };

    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        //this._model.print();
        this._anchorPoint.print();
    };

    window.MilestonePopupView = MilestonePopupView;
}());
