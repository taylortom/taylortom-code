/**
 * Represents a task label
 */

(function(){

    /**
     * constructor
     * @param type
     * @param name
     * @param dueDate
     */
    var TaskLabel = function(type, name, dueDate, completed){

        this.initialize(type, name, dueDate, completed);
    };

    // set the 'class'
    var p = TaskLabel.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars

    this._overdue;
    
    this._timelinePoint;
    this._smallLine;
    this._bigLine;
    this._type;
    this._label;
    this._date;

    // text
    this.typetxt;
    this.labeltxt;
    this.datetxt;

    /**
     * Initialises the vars
     * @param type
     * @param name
     * @param dueDate
     */
    p.initialize = function(type, name, dueDate, completed){

        //console.log('TaskLabel.initialize: ' + drawBackwards + ' -- ' + dueDate);

        this.Container_initialize();

        this._drawBackwards = completed;
        this._stackLevel = 0;
        
        this.labeltxt = new createjs.Text(name, Config.getLabelFontSize() + " " + Config.getFont(), "#fff");
        this.typetxt = new createjs.Text(type, "bold " + Config.getLabelFontSize() + " " + Config.getFont(), "#000");
        this.datetxt = new createjs.Text($.datepicker.formatDate('dd M', dueDate).toUpperCase(), "bold " + Config.getLabelFontSize() + " " + Config.getFont(), '#000');

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
        this.positionComponents();
        this.drawLabelLine();
        this.arrangeComponents();

        this.setupReleaseHandlers();

        update = true;
    };

    /**
     * Sets the colour vars according to current status
     */
    p.setStatus = function(newStatus, isOverdue){

        switch(newStatus){

            case notStartedDT:
                this._labelColour = Config.getNotStartedColour();
                this._dateColour = Config.getNotStartedColour();
                this._drawBackwards = false;
                break;
            case inProgressDT:
                this._labelColour = Config.getStartedColour();
                this._dateColour = Config.getStartedColour();
                this._drawBackwards = false;
                break;
            case completedDT:
                this._labelColour = Config.getCompletedColour();
                this._dateColour = Config.getCompletedColour();
                this._drawBackwards = true;
                break;
            default:
                if(window.console && window.console.log) console.log('TaskView.setStatus: unknown progress (' + newStatus + ')');
        }
        
        this._overdue = isOverdue;

        this.redraw();
    };

    /**
     * Draws the connecting timeline point
     */
    p.drawTimelinePoint = function(){

        // console.log('TaskView.drawTimelinePoint');

        this._timelinePoint = new createjs.Shape();
        this._timelinePoint.size = 7;
        this._timelinePoint.graphics.beginFill(this._labelColour)
                              .setStrokeStyle(3)
                              .beginStroke ('#fff')
                              .drawCircle(0,0,this._timelinePoint.size)
                              .endStroke();		
    };

    /**
     * Draws the milestone's label
     */
    p.drawLabel = function(){

        // todo: create static positioning vars (spacing, small line width, label height etc.)
        // todo: possibly refactor labels into separate class to allow for resizing - too many shape vars in here
        // todo: generally refactor TaskView.drawLabel

        var TEXT_SPACING = 13;

        /**
         * type label
         */

        this._type = new createjs.Shape();
        this._type.width = 20;
        this._type.height = 20;
        this._type.graphics.beginFill('#fff')
            .setStrokeStyle(2)
            .beginStroke (this._labelColour)
            .rect(0,0, this._type.width, this._type.height)
            .endStroke();
        
        this.typetxt.color = this._labelColour;

        /**
         * name label
         */

        this._label = new createjs.Shape();
        this._label.width = this.labeltxt.getMeasuredWidth()+TEXT_SPACING;
        this._label.height = 20;
        this._label.graphics.beginFill(this._labelColour)
                           .setStrokeStyle(2)
                           .beginStroke (this._labelColour)
                           .rect(0,0, this._label.width, this._label.height)
                           .endStroke();

        /**
         * date label
         */

        if(!this._drawBackwards)
        {        	
            this._date = new createjs.Shape();
            this._date.width = this.datetxt.getMeasuredWidth()+TEXT_SPACING;
            this._date.height = 20;
            if(!this._overdue) 
            {
            	this._date.graphics.beginFill("#fff")
                    .setStrokeStyle(2)
                    .beginStroke (this._dateColour)
                    .rect(0, 0, this._date.width, this._date.height)
                    .endStroke();
            }
            else 
            {
            	this._date.graphics.beginFill(Config.getOverdueColour())
                	.setStrokeStyle(2)
                	.beginStroke (Config.getOverdueColour())
                	.rect(0, 0, this._date.width, this._date.height)
                	.endStroke();
            	
            	this.update = true;
            }

            this.datetxt.color = (this._overdue) ? '#fff' : this._dateColour;
        }
    };

    /**
     * Draws the connecting line between the timeline point and the label
     */
    p.drawLabelLine = function(){
    	
        var smallStart, smallEnd;

        if(!this._drawBackwards){

            smallStart = new Point(this._type.x, this._label.y+10);
            smallEnd = new Point(smallStart.x-15, smallStart.y);
        }
        else{
        	
        	smallStart = new Point(this._label.x + this._label.width, this._label.y+10);
            smallEnd = new Point(smallStart.x+15, smallStart.y);
        }

        this._smallLine = new createjs.Shape();
        this._smallLine.graphics.setStrokeStyle(2)
            .beginStroke(this._labelColour)
            .moveTo(smallStart.x, smallStart.y)
            .lineTo(smallEnd.x, smallEnd.y)
            .endStroke();

        this._bigLine = new createjs.Shape();
        this._bigLine.graphics.setStrokeStyle(2)
            .beginStroke(this._labelColour)
            .moveTo(smallEnd.x, smallEnd.y)
            .lineTo(this._timelinePoint.x, this._timelinePoint.y)
            .endStroke();
    };

    /**
     * Updates the positions of the components
     */
    p.positionComponents = function(){

        // calculate the label's offset

        var V_SPACING = 35;
        var H_SPACING = 0;
        var labelOffset = new Point(40-(H_SPACING*this._stackLevel),40+(V_SPACING*this._stackLevel));

        if(this._drawBackwards)
        {
            labelOffset.x *= -1;
            labelOffset.x -= (this._type.width + this._label.width);
            if(!this._drawBackwards) labelOffset.x -= this._date.width;
        }

        // position the type background shape

        this._type.x = this._timelinePoint.x + labelOffset.x;
        this._type.y = this._timelinePoint.y + labelOffset.y;

        // position the other components relatively

        this.typetxt.x = this._type.x + 5;
        this.typetxt.y = this._type.y + this._type.height - (this.typetxt.getMeasuredHeight() + 5);

        this._label.x = this._type.x + this._type.width;
        this._label.y = this._type.y;

        this.labeltxt.x = this._label.x + 5;
        this.labeltxt.y = this.typetxt.y;

        if(!this._drawBackwards)
        {
            this._date.x = this._label.x + this._label.width + 5;
            this._date.y = this._label.y;

            this.datetxt.x = this._date.x + 5;
            this.datetxt.y = this.labeltxt.y;
        }
    };

    /**
     * Make sure the components are added/layered in the right order
     */
    p.arrangeComponents = function(){

        this.addChild(this._timelinePoint);
        this.addChild(this._smallLine);
        this.addChild(this._bigLine);
        this.addChild(this._type);
        this.addChild(this._label);
        this.addChild(this.typetxt);
        this.addChild(this.labeltxt);

        if(!this._drawBackwards && this.datetxt.text != '')
        {
            this.addChild(this._date);
            this.addChild(this.datetxt);
        }
    };

    p.setupReleaseHandlers = function() {
	
    	this._timelinePoint.onClick = $.proxy(this.onPointClicked, this);
    	this._timelinePoint.onMouseOver = function() { $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
		this._timelinePoint.onMouseOut = function() { $('body').removeClass('pointCursor').addClass('overCursor'); };
    	
        this._type.onClick = $.proxy(this.onClicked, this);
        this._type.onMouseOver = function(){ $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
		this._type.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('overCursor'); };
        
        this._label.onClick = $.proxy(this.onClicked, this);
        this._label.onMouseOver = function(){ $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
		this._label.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('overCursor'); };
        
        if(!this._drawBackwards) 
        {
        	this._date.onClick = $.proxy(this.onClicked, this);
        	this._date.onMouseOver = function(){ $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
    		this._date.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('overCursor'); };
		}
    };

    /**
     * Allows the milestone to be moved along the timeline
     * @param newPoint
     */
    p.setTimelinePoint = function(newPoint){

        // console.log('TaskLabel.setTimelinePoint: (' + newPoint.x + ',' + newPoint.y + ')');

         // todo: only use x value with fixed y  - don't need to change the y

        this.x = newPoint.x;
        this.y = newPoint.y;
        this.redraw();
    };

    /**
     * Used for positioning the labels
     * @param newLevel
     */
    p.setStackLevel = function(newLevel){

        this._stackLevel = newLevel;
        this.redraw();
    };

	/**
     * Calculates the width of the task
     */
    p.getWidth = function(){

        var width;
        
        if(this._drawBackwards) width = (this._timelinePoint.size/2) -(this._date.x);
        else width = (this._timelinePoint.size/2) + this._date.x + this._date.width;
        
        return width;
    };
    
    /**
     * The height of the task
     */
    p.getHeight = function(){

    	return this._label.height;
    };

    /**
     * Returns the nearest x position
     */
    p.getStartX = function(){

        var startX;

        if(this._drawBackwards)
        {
            startX = this.x + (this._timelinePoint.width/2);
        }
        else
        {
            if(this._date != undefined) startX = this._date.x + this._date.width;
            else startX = this._label.x + this._label.width;
        }

        return startX;
    };

    /**
     * Returns the farthest x position
     */
    p.getEndX = function(){

        var endX;

        if(this._drawBackwards)
        {
            endX = this.x + (this._timelinePoint.width/2);
        }
        else
        {
            if(this._date != undefined) endX = this._date.x + this._date.width;
            else endX = this._label.x + this._label.width;
        }

        return endX;
    };

    p.onClicked = function(){
	    	
        // bubble the event back to the view
        $(this).trigger('onTaskViewClicked');

    };
    
    p.onPointClicked = function(){
    	    	
        // bubble the event back to the view
        $(this).trigger('onTaskPointClicked');

    };
	
    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        this._model.print();
        this._anchorPoint.print();
    };

    window.TaskLabel = TaskLabel;
}());
