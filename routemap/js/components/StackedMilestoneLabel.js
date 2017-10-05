/**
 * Represents multiple milestone labels
 */

(function(){

    /**
     * constructor
     * @param type
     * @param name
     * @param dueDate
     */
    var StackedMilestoneLabel = function(names, dates){

        this.initialize(names, dates);
    };

    // set the 'class'
    var p = StackedMilestoneLabel.prototype = new createjs.Container();
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
    p.initialize = function(names, dates){

        this.Container_initialize();

        this._stackLevel = 0;
        this._labelCount = names.length;

        this._colour = Config.getCompletedColour();

        // arrays to allow for arbitrary height stacks

        this._labels = new Array();
        this._dates = new Array();

        this._labeltxts = new Array();
        this._datetxts = new Array();

        var longestLabel = undefined;

        for(var i = 0; i < this._labelCount; i++) {

            var labeltxt = new createjs.Text(names[i], Config.getMilestoneLabelFontSize() + " " + Config.getFont(), "#fff");
            this._labeltxts.push(labeltxt);

            // work out which of the labels has the longest text
            if(longestLabel == undefined || labeltxt.getMeasuredWidth() > longestLabel.getMeasuredWidth()) longestLabel = labeltxt;

            var datetxt = new createjs.Text($.datepicker.formatDate('dd M', dates[i]).toUpperCase(), "bold " + Config.getMilestoneLabelFontSize() + " " + Config.getFont(), "#000");
            this._datetxts.push(datetxt);
        }

        this._textWidth = longestLabel.getMeasuredWidth();
        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('StackedMilestoneLabel.redraw: ' + this.y);

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.drawTimelinePoint();
        this.drawLabels();
        this.positionComponents();
        this.drawLabelLine();
        this.arrangeComponents();
        this.setupListeners();

        update = true;
    };

    /**
     * Draws the connecting timeline point
     */
    p.drawTimelinePoint = function(){

        // console.log('TaskView.drawTimelinePoint');

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
    p.drawLabels = function(){
		
        // todo: create static positioning vars (spacing, small line width, label height etc.)
        // todo: possibly refactor labels into separate class to allow for resizing - too many shape vars in here
		
        for(var i = 0; i < this._labelCount; i++) {
			
            var TEXT_SPACING = 13;
			
            /**
             * name label
             */
			
			var label = new createjs.Shape();
            label.width = this._textWidth+TEXT_SPACING;
            label.height = Config.getMilestoneLabelHeight();
            label.graphics.beginFill('#fff')
                               .setStrokeStyle(2)
                               .beginStroke (this._colour)
                               .rect(0,0, label.width, label.height)
                               .endStroke();	
			label.onClick = $.proxy(function (num) { return function () { this.onClicked(num); }; }(i), this);
			label.onMouseOver = function() { $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
			label.onMouseOut = function() { $('body').removeClass('pointCursor').addClass('overCursor'); };
            this._labels.push(label);
				
            /**
             * date label
             */
				
            var date = new createjs.Shape();
            date.width = this._datetxts[i].getMeasuredWidth()+TEXT_SPACING;
            date.height = label.height;
            date.graphics.beginFill(this._colour)
                              .setStrokeStyle(2)
                              .beginStroke (this._colour)
                              .rect(0, 0, date.width, date.height)
                              .endStroke();
            this._dates.push(date);
			date.onClick = $.proxy(function (num) { return function () { this.onClicked(num); };}(i), this);
			date.onMouseOver = function() { $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
			date.onMouseOut = function() { $('body').removeClass('pointCursor').addClass('overCursor'); };
            
			this._labeltxts[i].color = this._colour;
			this._datetxts[i].color = '#fff';
        }
    };

    /**
     * Draws the connecting line between the timeline point and the label
     */
    p.drawLabelLine = function(){
		
        var smallStart = new Point(this._labels[0].x+this._labels[0].width, this._labels[0].y+(this.getHeight()/2));
        var smallEnd = new Point(smallStart.x+15, smallStart.y);
		
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
    
    /**
     * Updates the positions of the components
     */
    p.positionComponents = function(){
		
        // calculate the label's offset
        var V_SPACING = 35;
        var labelOffset = new Point(-54,-100+((V_SPACING*this._stackLevel)*-1)); // default lowest position
        labelOffset.x -= this._labels[0].width;
        labelOffset.x -= this._dates[0].width;
		
        // todo: update to use gav's code
			
        for(var i = 0; i < this._labelCount; i++) {
			
            // position the date background shape
			
            this._dates[i].x = this._timelinePoint.x + labelOffset.x;
            this._dates[i].y = this._timelinePoint.y + labelOffset.y;
			
            // position the other components relatively
			
            this._datetxts[i].x = this._dates[i].x + 5;
			this._datetxts[i].y = this._dates[i].y + this._dates[i].height - (this._datetxts[i].getMeasuredHeight() + 5);
			
            this._labels[i].x = this._dates[i].x + this._dates[i].width + 5;
            this._labels[i].y = this._dates[i].y;
			
            this._labeltxts[i].x = this._labels[i].x + 5;
            this._labeltxts[i].y = this._datetxts[i].y;
			
            labelOffset.y += this._labels[i].height;
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
			
            this.addChild(this._labels[i]);
            this.addChild(this._labeltxts[i]);
			
            this.addChild(this._dates[i]);
            this.addChild(this._datetxts[i]);
        }
    };
    
    p.setupListeners = function(){
	    
		this._timelinePoint.onClick = $.proxy(this.onPointClicked, this);
		this._timelinePoint.onMouseOver = function() { $('body').removeClass('overCursor').addClass('pointCursor'); };
		this._timelinePoint.onMouseOut = function() { $('body').removeClass('pointCursor').addClass('overCursor'); };
    };
	
	p.onClicked = function(index) {
	
        // bubble the event back to the view
        $(this).trigger('onMilestoneViewClicked', [index]);
    };
    
    p.onPointClicked = function(index) {
	
        // bubble the event back to the view
        $(this).trigger('onMilestonePointClicked');
    };

    /**
     * Allows the milestone to be moved along the timeline
     * @param newPoint
     */
    p.setTimelinePoint = function(newPoint){
		
        // console.log('StackedMilestoneLabel.setTimelinePoint: (' + newPoint.x + ',' + newPoint.y + ')');
		
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

    p.getHeight = function(){
		
        var height = 0;
		
        for(var i = 0; i < this._labelCount; i++) height += this._labels[i].height;
		
        return height;
    };

    window.StackedMilestoneLabel = StackedMilestoneLabel;
}());
