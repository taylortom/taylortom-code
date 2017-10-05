/**
 * Represents multiple task labels
 */

(function(){

    /**
     * constructor
     * @param type
     * @param name
     * @param dueDate
     */
    var StackedTaskLabel = function(types, names, dates, statuses){

        this.initialize(types, names, dates, statuses);
    };

    // set the 'class'
    var p = StackedTaskLabel.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    this._timelinePoint;
    this._smallLine;
    this._bigLine;

    this._textWidth;

    /**
     * Initialises the vars
     * @param the labels to be stacked
     */
    p.initialize = function(types, names, dates, statuses){

        this.Container_initialize();

        this._stackLevel = 0;
        this._labelCount = types.length;

        this._labelColours = new Array();
        this._dateColours = new Array();
        
        this._initialiseColours(statuses);

        // arrays to allow for arbitrary height stacks

        this._types = new Array();
        this._labels = new Array();
        this._dates = new Array();

        this._typetxts = new Array();
        this._labeltxts = new Array();
        this._datetxts = new Array();

        var longestLabel = undefined;

        for(var i = 0; i < this._labelCount; i++) {

            var labeltxt = new createjs.Text(names[i], Config.getLabelFontSize() + " " + Config.getFont(), "#fff");
            this._labeltxts.push(labeltxt);

            // work out which of the labels has the longest text
            if(longestLabel == undefined || labeltxt.getMeasuredWidth() > longestLabel.getMeasuredWidth()) longestLabel = labeltxt;

            var typetxt = new createjs.Text(types[i], "bold " + Config.getLabelFontSize() + " " + Config.getFont(), "#000");
            this._typetxts.push(typetxt);

            /*var datetxt = new createjs.Text($.datepicker.formatDate('dd/mm', dates[i]), Config.getLabelFontSize() + " " + Config.getFont(), "#000");
            this._datetxts.push(datetxt);*/
        }

        this._textWidth = longestLabel.getMeasuredWidth();
        this.redraw();
    };
    
    p._initialiseColours = function(statuses){
    
    	for(var i = 0; i < statuses.length; i++) {
	    	
	    	this._labelColours.push(this.getColourForStatus(statuses[i]));
	    	this._dateColours.push(this.getColourForStatus(statuses[i]));
    	}
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('StackedTaskLabel.redraw: ' + this.y);

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.drawTimelinePoint();
        this.drawLabels();
        this.positionComponents();
        this.drawLabelLine();
        this.arrangeComponents();

        update = true;
    };

    /**
     * Draws the connecting timeline point
     */
    p.drawTimelinePoint = function(){

        // console.log('TaskView.drawTimelinePoint');

        this._timelinePoint = new createjs.Shape();
        this._timelinePoint.size = 7;
        this._timelinePoint.graphics.beginFill(Config.getCompletedColour())
                              .setStrokeStyle(3)
                              .beginStroke ('#fff')
                              .drawCircle(0,0,this._timelinePoint.size)
                              .endStroke();
        this._timelinePoint.onClick = $.proxy(this.onPointClicked, this);
		this._timelinePoint.onMouseOver = function() { $('body').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
		this._timelinePoint.onMouseOut = function() { $('body').removeClass('pointCursor').addClass('overCursor'); };
    };

    /**
     * Draws the milestone's label
     */
    p.drawLabels = function(){

        // todo: create static positioning vars (spacing, small line width, label height etc.)
        // todo: possibly refactor labels into separate class to allow for resizing - too many shape vars in here
        // todo: generally refactor TaskView.drawLabel

        for(var i = 0; i < this._labelCount; i++) {

            var TEXT_SPACING = 13;

            /**
             * type label
             */

            var type = new createjs.Shape();
            type.width = 20;
            type.height = 20;
            type.graphics.beginFill('#fff')
                .setStrokeStyle(2)
                .beginStroke (this._labelColours[i])
                .rect(0,0, type.width, type.height)
                .endStroke();
            type.onClick = $.proxy(function (num) { return function () { this.onClicked(num); };}(i), this);
			type.onMouseOver = function(){ $('body').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
			type.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('overCursor'); };
            this._types.push(type);

            this._typetxts[i].color = this._labelColours[i];

            /**
             * name label
             */

            var label = new createjs.Shape();
            label.width = this._textWidth+TEXT_SPACING;
            label.height = 20;
            label.graphics.beginFill(this._labelColours[i])
                               .setStrokeStyle(2)
                               .beginStroke (this._labelColours[i])
                               .rect(0,0, label.width, label.height)
                               .endStroke();
            label.onClick = $.proxy(function (num) { return function () { this.onClicked(num); };}(i), this);
			label.onMouseOver = function(){ $('body').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
			label.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('overCursor'); };
            this._labels.push(label);

            /**
             * date label
             */

            /*var date = new createjs.Shape();
            date.width = this._datetxts[i].getMeasuredWidth()+TEXT_SPACING;
            date.height = 20;
            date.graphics.beginFill("#fff")
                              .setStrokeStyle(2)
                              .beginStroke (this._dateColour)
                              .rect(0, 0, date.width, date.height)
                              .endStroke();
            date.onClick = $.proxy(function (num) { return function () { this.onClicked(num); };}(i), this);
			date.onMouseOver = function(){ $('body').css('cursor', 'pointer'); };
			date.onMouseOut = function(){ $('body').css('cursor', 'default'); };
            this._dates.push(date);

            this._datetxts[i].color = this._dateColour;*/
        }
    };

    /**
     * Draws the connecting line between the timeline point and the label
     */
    p.drawLabelLine = function(){

//        var smallStart = new Point(this._dates[0].x+this._dates[0].width, this._dates[0].y+(this.getHeight()/2));
        var smallStart = new Point(this._labels[0].x+this._labels[0].width, this._labels[0].y+(this.getHeight()/2));
        var smallEnd = new Point(smallStart.x+15, smallStart.y);

        this._smallLine = new createjs.Shape();
        this._smallLine.graphics.setStrokeStyle(2)
            .beginStroke(Config.getCompletedColour())
            .moveTo(smallStart.x, smallStart.y)
            .lineTo(smallEnd.x, smallEnd.y)
            .endStroke();

        this._bigLine = new createjs.Shape();
        this._bigLine.graphics.setStrokeStyle(2)
            .beginStroke(Config.getCompletedColour())
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
        var labelOffset = new Point(0,40+(V_SPACING*this._stackLevel));
        labelOffset.x = -40;
        labelOffset.x -= (this._types[0].width + this._labels[0].width);
        //labelOffset.x -= this._dates[0].width;

        for(var i = 0; i < this._labelCount; i++) {

            // position the type background shape

            this._types[i].x = this._timelinePoint.x + labelOffset.x;
            this._types[i].y = this._timelinePoint.y + labelOffset.y;

            // position the other components relatively

            this._typetxts[i].x = this._types[i].x + 5;
            this._typetxts[i].y = this._types[i].y + this._types[i].height - (this._typetxts[i].getMeasuredHeight() + 5);

            this._labels[i].x = this._types[i].x + this._types[i].width;
            this._labels[i].y = this._types[i].y;

            this._labeltxts[i].x = this._labels[i].x + 5;
            this._labeltxts[i].y = this._typetxts[i].y;

            if(this._datetxts[i] != undefined)
            {
                this._dates[i].x = this._labels[i].x + this._labels[i].width + 5;
                this._dates[i].y = this._labels[i].y;

                this._datetxts[i].x = this._dates[i].x + 5;
                this._datetxts[i].y = this._typetxts[i].y;
            }

            labelOffset.y += this._types[i].height;
        }
    };

    /**
     * Make sure the components are added/layered in the right order
     */
    p.arrangeComponents = function(){

        this.addChild(this._timelinePoint);
        this.addChild(this._smallLine);
        this.addChild(this._bigLine);

        for(var i = 0; i < this._labelCount; i++) {

            this.addChild(this._types[i]);
            this.addChild(this._labels[i]);
            this.addChild(this._typetxts[i]);
            this.addChild(this._labeltxts[i]);

            /*this.addChild(this._dates[i]);
            this.addChild(this._datetxts[i]);*/
        }
    };

    /**
     * Allows the milestone to be moved along the timeline
     * @param newPoint
     */
    p.setTimelinePoint = function(newPoint){

        // console.log('TaskLabel.setTimelinePoint: (' + newPoint.x + ',' + newPoint.y + ')');

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
    
    p.getColourForStatus = function(status){
	    
	    switch(status){
		    
		    case notStartedDT:
		    	return Config.getNotStartedColour();
		    	break;
		    case inProgressDT:
		    	return Config.getStartedColour();
		    	break;
		    case completedDT:
		    	return Config.getCompletedColour();
		    	break;
		    default:
                if(window.console && window.console.log) console.log("Config.getColourForStatus: Error, do not recognise status '" + status + "'");
	    }
    }

    p.getHeight = function(){

        var height = 0;

        for(var i = 0; i < this._labelCount; i++) height += this._types[i].height;

        return height;
    };

    p.onClicked = function(index) {

        // bubble the event back to the view
        $(this).trigger('onTaskViewClicked', [index]);
    };
    
    p.onPointClicked = function() {

        // bubble the event back to the view
        $(this).trigger('onTaskPointClicked');
    };
	
    window.StackedTaskLabel = StackedTaskLabel;
}());
