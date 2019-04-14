/**
 * Represents a milestone
 */

(function(){

    /**
     * constructor
     * @param name
     * @param dueDate
     */
    var MilestoneLabel = function(name, dueDate, completed){

        this.initialize(name, dueDate, completed);
    };

    // set the 'class'
    var p = MilestoneLabel.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars

    this._timelinePoint;
    this._smallLine;
    this._bigLine;
    this._label;
    this._date;

    // text
    this.labeltxt;
    this.datetxt;

    /**
     * Initialises the vars
     * @param name
     * @param dueDate
     */
    p.initialize = function(name, dueDate, completed){

        //console.log('MilestoneLabel.initialize');

        this.Container_initialize();

        this._drawBackwards = completed;
        this._colour = "#000";
        this._status = notStartedDT;
		this._stackLevel = 0;

        this.labeltxt = new createjs.Text(name, Config.getMilestoneLabelFontSize() + " " + Config.getFont(), "#fff");
        this.datetxt = new createjs.Text($.datepicker.formatDate('dd M', dueDate).toUpperCase(), "bold " + Config.getMilestoneLabelFontSize() + " " + Config.getFont(), "#000");
        
        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('TaskView.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.drawTimelinePoint();
        this.drawLabel();
        this.setupListeners();
        this.positionComponents();
        this.drawLabelLine();
        this.arrangeComponents();

        update = true;
    };

    /**
     * Sets the colour vars according to current status
     */
    p.setStatus = function(newStatus){

        // console.log('TaskView.setStatus');

        switch(newStatus){

            case notStartedDT:
            case inProgressDT:
                this._colour = "#000";
                this._drawBackwards = false; 
                break;
            case completedDT:
                this._colour = Config.getCompletedColour();
                this._drawBackwards = true;
                break;
            case overdueDT:
                this._colour = Config.getOverdueColour();
                this._drawBackwards = false;
                this._stackLevel++;
                break;
            default:
                if(window.console && window.console.log) console.log('TaskView.setStatus: unknown progress (' + newStatus + ')');
        }

        this._status = newStatus;

        this.redraw();
    };

    /**
     * Adjusts how 'high' (yPos) the label will be stacked
     * @param newLevel
     */
	p.setStackLevel = function(newLevel){
		
        this._stackLevel = newLevel;
        this.redraw();
    };

    /**
     * Draws the connecting timeline point
     */
    p.drawTimelinePoint = function(){

        this._timelinePoint = new createjs.Shape();
        this._timelinePoint.size = 20;
        this._timelinePoint.graphics.beginFill(this._colour)
            .setStrokeStyle(3)
            .beginStroke ('#fff')
            .rect((this._timelinePoint.size/2)*-1,(this._timelinePoint.size/2)*-1,this._timelinePoint.size,this._timelinePoint.size)
            .endStroke();
        this._timelinePoint.rotation = 45;
    };

    /**
     * Draws the milestone's label
     */
    p.drawLabel = function(){

        // todo: create static positioning vars (spacing, small line width, label height etc.)?

        var TEXT_SPACING = 13;

        /**
         * name label
         */

        this._label = new createjs.Shape();
        this._label.width = this.labeltxt.getMeasuredWidth()+TEXT_SPACING;
        this._label.height = Config.getMilestoneLabelHeight();
        this._label.graphics.beginFill('#fff')
	            .setStrokeStyle(2)
	            .beginStroke (this._colour)
	            .rect(0,0, this._label.width, this._label.height)
	            .endStroke();
        
        /**
         * date label
         */

        this._date = new createjs.Shape();

        this._date.width = this.datetxt.getMeasuredWidth()+TEXT_SPACING;
        this._date.height = this._label.height;
        this._date.graphics.beginFill(this._colour)
                .setStrokeStyle(2)
                .beginStroke (this._colour)
                .rect(0, 0, this._date.width, this._date.height)
            	.endStroke();

		this.labeltxt.color = this._colour;
		this.datetxt.color = '#fff';
    };

    /**
     * Draws the connecting line between the timeline point and the label
     */
    p.drawLabelLine = function(){

        var smallStart, smallEnd;

        if(this._drawBackwards){

            smallStart = new Point((this._label.x+this._label.width), this._label.y+(this._label.height/2));
            smallEnd = new Point(smallStart.x+15, smallStart.y);
        }
        else{
			
            smallStart = new Point(this._label.x, this._label.y+(this._label.height/2));
            smallEnd = new Point(smallStart.x-15, smallStart.y);
        }

        this._smallLine = new createjs.Shape();
        this._smallLine.graphics.setStrokeStyle(2)
            .beginStroke(this._colour)
            .moveTo(smallStart.x, smallStart.y)
            .lineTo(smallEnd.x, smallEnd.y)
            .endStroke();

        this._bigLine = new createjs.Shape();
        this._bigLine.graphics.setStrokeStyle(2)
            .beginStroke(this._colour)
            .moveTo(smallEnd.x, smallEnd.y)
            .lineTo(this._timelinePoint.x, this._timelinePoint.y)
            .endStroke();
    };
    
    p.setupListeners = function(){
    
    	this._timelinePoint.onClick = $.proxy(this.onPointClicked, this);
		this._timelinePoint.onMouseOver = function() { $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
		this._timelinePoint.onMouseOut = function() {
            $('body').removeClass('pointCursor')
            if(Config.getCanvasDraggable())  $('body').addClass('overCursor');
        };
		
		this._label.onClick = $.proxy(this.onClicked, this);
        this._label.onMouseOver = function() { $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
		this._label.onMouseOut = function(){
                $('body').removeClass('pointCursor')
                if(Config.getCanvasDraggable())  $('body').addClass('overCursor');
        };
		
		this._date.onClick = $.proxy(this.onClicked, this);
        this._date.onMouseOver = function() { $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
		this._date.onMouseOut = function(){
            $('body').removeClass('pointCursor')
            if(Config.getCanvasDraggable())  $('body').addClass('overCursor');
        };
    };

    p.positionComponents = function(){

        var labelOffset = new Point(54,-100); // default lowest position
		var ratioX = 0.42;
		var stackYIncrement = 35;

        if(this._drawBackwards){
        	
			labelOffset.x *= -1;
			labelOffset.x -= this._label.width;
			
			if(this._stackLevel > 0){
				
				labelOffset.x -= (stackYIncrement*ratioX) * this._stackLevel;;
				labelOffset.y -= stackYIncrement * this._stackLevel;
			}
        }
		else{
			
			if(this._stackLevel > 0){
				
				labelOffset.x += (stackYIncrement*ratioX) * this._stackLevel;;
				labelOffset.y -= stackYIncrement * this._stackLevel;
			}
		}
		

        this._label.x = this._timelinePoint.x + labelOffset.x;
        this._label.y = this._timelinePoint.y + labelOffset.y;

        this.labeltxt.x = this._label.x + 5;
        this.labeltxt.y = this._label.y + this._label.height - (this.labeltxt.getMeasuredHeight() + 5);
        
        if(this._drawBackwards)
        {
        	this._date.x = this._label.x - (this._date.width + 5);
            this._date.y = this._label.y;
        }
        else
    	{
        	this._date.x = this._label.x + this._label.width + 5;
            this._date.y = this._label.y;
    	}
        	
    	this.datetxt.x = this._date.x + 5;
        this.datetxt.y = this.labeltxt.y;
    };

    /**
     * Make sure the components are added/layered in the right order
     */
    p.arrangeComponents = function(){

        this.addChild(this._timelinePoint);
        this.addChild(this._smallLine);
        this.addChild(this._bigLine);
        this.addChild(this._label);
        this.addChild(this.labeltxt);
        this.addChild(this._date);
        this.addChild(this.datetxt);
    };

    /**
     * Allows the milestone to be moved along the timeline
     * @param newPoint
     */
    p.setTimelinePoint = function(newPoint){

         // todo: only use x value with fixed y  - don't need to change the y

        this.x = newPoint.x;
        this.y = newPoint.y;

        this.redraw();
    };

    /**
     * Calculates the width of the label
     */
    p.getWidth = function(){

        var width;

        if(this._drawBackwards) width = (this._timelinePoint.size/2) -(this._date.x);
        else width = (this._timelinePoint.size/2) + this._date.x + this._date.width;

        return width;
    };

    /**
     * The 'end' xPos of the label
     */
    p.getEndPoint = function(){

       if(this._drawBackwards) return this._timelinePoint.x + (this._timelinePoint.size/2);
       else return this.getWidth();
    };

    /**
     * Returns the nearest x position
     */
    p.getStartX = function(){

        var startX;

        if(this._drawBackwards) startX = this._date.x;
        else startX = this._anchorPoint.x - (this._timelinePoint.width/2);

        return startX;
    };

    /**
     * Returns the farthest x position
     * TODO - merge with getEndPoint
     */
    p.getEndX = function(){

        var endX;

        if(this._drawBackwards) endX = this._label.x + (this._timelinePoint.width/2);
        else endX = this._date.x;

        return endX;
    };

    p.onClicked = function(){
        // bubble the event back to the view
        $(this).trigger('onMilestoneViewClicked');
    };
    
    p.onPointClicked = function(){
    	    	
        // bubble the event back to the view
        $(this).trigger('onMilestonePointClicked');
    };

    /**
     * The width of the timeline point
     * (takes into account the stroke)
     */
    p.getTimelinePointWidth = function(){

        return this._timelinePoint.size + 4;
    };

    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        this._model.print();
        //this._anchorPoint.print();
    };

    window.MilestoneLabel = MilestoneLabel;
}());
