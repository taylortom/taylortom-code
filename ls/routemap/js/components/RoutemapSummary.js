/**
 * The routemap summary on the zoomed out chart view
 */

(function(){

    /**
     * constructor
     */
    var RoutemapSummary = function(width){

        // console.log('Dateline.constructor');

        this.initialize(width);
    };

    // set the 'class'
    var p = RoutemapSummary.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

    // vars
	this._startLineStartX;
	this._startLineEndX;
	this._endLineStartX;
	this._endLineEndX;
	
    /**
     * Initialises the vars
     */
    p.initialize = function(width){

        //console.log('RoutemapSummary.initialize');
		
		this.Container_initialize();
		this._totalWidth = width;
		
		this.redraw();
    };
	
	p.displayStartDate = function(){
		var headingtxt = new createjs.Text("START DATE", "Bold 12px Arial", "#666");
        this.addChild(headingtxt);
		
		var displayDate = $.datepicker.formatDate('d M yy', dataManager.getStartDate());
		var datetxt = new createjs.Text(displayDate, "14px Arial", "#666");
		
		datetxt.x = headingtxt.x - ((datetxt.getMeasuredWidth()-headingtxt.getMeasuredWidth())/2);
		datetxt.y = headingtxt.y + headingtxt.getMeasuredLineHeight() + 5;
		this.addChild(datetxt);	
		
		this._startLineStartX = ((datetxt.x + datetxt.getMeasuredWidth()) > (headingtxt.x + headingtxt.getMeasuredWidth()) ) ? (datetxt.x + datetxt.getMeasuredWidth() + 10) : (headingtxt.x + headingtxt.getMeasuredWidth() + 10);
	};	
	
	p.displayEndDate = function(){
		var headingtxt = new createjs.Text("END DATE", "Bold 12px Arial", "#666");
        		
		var displayDate = $.datepicker.formatDate('d M yy', dataManager.getEndDate());
		var datetxt = new createjs.Text(displayDate, "14px Arial", "#666");
		
		datetxt.x = this._totalWidth - datetxt.getMeasuredWidth();
		headingtxt.x = datetxt.x + ((datetxt.getMeasuredWidth()-headingtxt.getMeasuredWidth())/2);
		headingtxt.y = 0;
		datetxt.y = headingtxt.y + headingtxt.getMeasuredLineHeight() + 5;
		
		this.addChild(headingtxt);
		this.addChild(datetxt);	
		
		this._endLineStartX = (datetxt.x < headingtxt.x ) ? (datetxt.x -10) : (headingtxt.x -10);
	};
	
	p.displayCentreText = function(){
		var headingtxt = new createjs.Text("LEARNING HOURS", "Bold 12px Arial", "#666");
		headingtxt.x = (this._totalWidth/2) - (headingtxt.getMeasuredWidth()/2);
		
		var hoursText = dataManager.getLearningHours() + " (ESTIMATED)";
		var hourstxt = new createjs.Text(hoursText, "14px Arial", "#666");
		hourstxt.y = headingtxt.y + headingtxt.getMeasuredLineHeight() + 5;
		hourstxt.x = headingtxt.x - ((hourstxt.getMeasuredWidth()-headingtxt.getMeasuredWidth())/2);
		
		this.addChild(headingtxt);
		this.addChild(hourstxt);
		
		var leftX = hourstxt.x - 10;
		var rightX = hourstxt.x + hourstxt.getMeasuredWidth() + 10;
		var ypos = headingtxt.y - headingtxt.getMeasuredLineHeight();
		var lineHeight = 32;
		
		var leftLine = new createjs.Shape();
        leftLine.graphics.setStrokeStyle(1.5).beginStroke("#666").moveTo(leftX, ypos).lineTo(leftX, (ypos+lineHeight)).endStroke();
        this.addChild(leftLine);
		
		var rightLine = new createjs.Shape();
        rightLine.graphics.setStrokeStyle(1.5).beginStroke("#666").moveTo(rightX, ypos).lineTo(rightX, (ypos+lineHeight)).endStroke();
        this.addChild(rightLine);
		
		this._startLineEndX = leftX;
		this._endLineEndX = rightX;
		
	};
	
	p.drawHorizontalLines = function(){
		
		var lineYpos = 5;
		
		var startLine = new createjs.Shape();
        startLine.graphics.setStrokeStyle(1.5).beginStroke("#666").moveTo(this._startLineStartX, lineYpos).lineTo(this._startLineEndX, lineYpos).endStroke();
        this.addChild(startLine);
		
		var endLine = new createjs.Shape();
        endLine.graphics.setStrokeStyle(1.5).beginStroke("#666").moveTo(this._endLineStartX, lineYpos).lineTo(this._endLineEndX, lineYpos).endStroke();
        this.addChild(endLine);
	
	};
	
	p.redraw = function(){
		
		this.displayStartDate();
		
		this.displayCentreText();
		
		this.displayEndDate();
		
		this.drawHorizontalLines();
		
		update = true;	
	};

    window.RoutemapSummary = RoutemapSummary;
}());