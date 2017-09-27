/**
 * Contains all of the constant configuration variables
 * Should only contain class methods
 */

(function(){

    /**
     * Constructor (shouldn't ever be called)
     */
    var Config = function(){};

	/**
	 * The vars
	 */
	
    // fonts
    var _defaultFont = "Arial";

    // font sizes
    var _labelFontSize = 12;
    var _taskLabelFontSize = 12;
    var _milestoneLabelFontSize = 14;
    var _bodyFontSize = 12;
    var _titleFontSize = 16;
    var _taskListViewFontSize = 14;
    var _listViewTitleFontSize = 28;

    // colours
    var _linkColour = "#0033cc";
    var _notStartedColour = "#b3b3b3";
    var _startedColour = "#29abe2";
    var _completedColour = "#8cc63f";
    var _overdueColour = "#ff0000";
    var _datelineColour = "#ff9900";
    var _timelineColour = "#000";
    var _milestoneColour = "#000";
    var _listViewOverdueColour = "#fff";
    var _defaultListViewTaskColour = "#000";

    // dimensions
    var _stageWidth = 800;
    var _stageHeight = 600;
    var _scrollbarHeight = 12;
    var _calendarLabelHeight = 20;
    var _taskLabelHeight = 20;
    var _milestoneLabelHeight = 25;
    
    // cursors
    /*var _cursorDefault = 'default';
    var _cursorPoint = 'pointer';
    var _cursorMove = 'move';
    var _cursorDrag = 'crosshair';*/

    var _canvasDraggable = false;

    // misc
    var _maxStackHeight = 7;

	
	/**
	 * The getters
	 */
	
    /* --------------- Fonts --------------- */

    // Returns the default font
    Config.getFont = function (){ return _defaultFont; };

    /* --------------- Font sizes --------------- */

    // Returns the label font size
    Config.getLabelFontSize = function (){ return _labelFontSize + "px"; };
	
	// Returns the task label font size
    Config.getTaskLabelFontSize = function (){ return _taskLabelFontSize + "px"; };
	
	// Returns the milestone label font size
    Config.getMilestoneLabelFontSize = function (){ return _milestoneLabelFontSize + "px"; };

    // Returns the title font size
    Config.getTitleFontSize = function (){ return _titleFontSize + "px"; };

    // Returns the title font size
    Config.getBodyFontSize = function (){ return _bodyFontSize + "px"; };

	// Returns the title font size (ListView)
    Config.getListViewTitleFontSize =  function() { return _listViewTitleFontSize + "px"; };

	// Returns the font size (ListView)
    Config.getTaskListViewFontSize = function(){ return _taskListViewFontSize + "px"; };

    /* --------------- Colours --------------- */

    // Returns the hyperlink colour
    Config.getLinkColour = function (){ return _linkColour; };
    
    // Returns the 'not started' colour
    Config.getNotStartedColour = function (){ return _notStartedColour; };

    //Returns the 'started' colour
    Config.getStartedColour = function (){ return _startedColour; };

    // Returns the 'completed' colour
    Config.getCompletedColour = function (){ return _completedColour; };

    // Returns the 'overdue' colour
    Config.getOverdueColour = function (){ return _overdueColour; };

    // Returns the timeline's colour
    Config.getTimelineColour = function (){ return _timelineColour; };

    // Returns the dateline's colour
    Config.getDatelineColour = function (){ return _datelineColour; };

    // Returns the milestone's colour
    Config.getMilestoneColour = function (){ return _milestoneColour; };

	// Returns the default task colour (ListView)
    Config.getDefaultListViewTaskColour = function(){ return _defaultListViewTaskColour;};

	// Returns the overdue colour (ListView)
    Config.getListViewOverdueColour = function(){ return _listViewOverdueColour;};

    /* --------------- Dimensions --------------- */
 
    // Returns the width of the canvas
    Config.getCanvasWidth = function(){ return document.getElementById("canvas").width; };

    // Returns the height of the canvas
    Config.getCanvasHeight = function(){ return document.getElementById("canvas").height; };

    // Returns the width of the stage
    Config.getStageWidth = function (){ return _stageWidth; };

    // Returns the height of the stage
    Config.getStageHeight = function (){ return _stageHeight; };

    // Returns the height of the scrollbar
    Config.getScrollbarHeight = function (){ return _scrollbarHeight; };

    // Returns the height of the scrollbar
    Config.getCalendarLabelHeight = function (){ return _calendarLabelHeight; };
	
	// Returns the height of task labels
    Config.getTaskLabelHeight = function (){ return _taskLabelHeight; };
	
	// Returns the height of milestone labels
    Config.getMilestoneLabelHeight = function (){ return _milestoneLabelHeight; };

    /* --------------- Cursors --------------- */
/*
    // Returns the name of the default cursor
    Config.getCursorDefault = function () { return _cursorDefault; };
    
    // Returns the name of the pointer cursor
    Config.getCursorPoint = function () { return _cursorPoint; };
    
    // Returns the name of the move cursor
    Config.getCursorMove = function () { return _cursorMove; };
    
    // Returns the name of the drag cursor
    Config.getCursorDrag = function () { return _cursorDrag; };*/
	
	/* --------------- Miscellaneous --------------- */

    // Returns the maximum number of views which can be stacked
    Config.getMaxStackHeight = function () { return _maxStackHeight; };

    Config.setCanvasDraggable = function(value){
        _canvasDraggable =  value;
    };

    Config.getCanvasDraggable = function(){ return _canvasDraggable; };

    // returns the matching colour string for the passed status
    Config.getColourForStatus = function(status){
	    
	    switch(status)
	    {
		    case notStartedDT:
		    	return this.getNotStartedColour();
		    	break;
			case inProgressDT:
				return this.getStartedColour();
				break;
			case completedDT:
				return this.getCompletedColour();
				break;
			case overdueDT:
				return this.getOverdueColour();
				break;
			default:
                if(window.console && window.console.log) console.log("Config.getColourForStatus: Error, status not recognised '" + status + "'");
				break;		
	    }
    }


    /**
     * For debugging: prints data to screen
     */
    Config.print = function(){

        if(window.console && window.console.log){
            console.log('Begin Config:');
			
            console.log('   Fonts:');
            console.log('      Default Font: :' + this.getFont());

            console.log('   Font sizes:');
            console.log('      Label: ' + this.getLabelFontSize());
            console.log('      Task label: ' + this.getTaskLabelFontSize());
            console.log('      Milestone label: ' + this.getMilestoneLabelFontSize());
            console.log('      Title: ' + this.getTitleFontSize());
			console.log('      Body: ' + this.getBodyFontSize());
			console.log('      LV Title: ' + this.getListViewTitleFontSize());
			console.log('      LV: ' + this.getTaskListViewFontSize());

            console.log('   Colours:');
            console.log('       Link: ' + this.getLinkColour());
            console.log('       Not started: ' + this.getNotStartedColour());
            console.log('       Started: ' + this.getStartedColour());
            console.log('       Completed: ' + this.getCompletedColour());
            console.log('       Overdue: ' + this.getOverdueColour());
            console.log('       Timeline: ' + this.getTimelineColour());
            console.log('       Dateline: ' + this.getDatelineColour());
            console.log('       Milestone: ' + this.getMilestoneColour());
            console.log('       LV Tasks: ' + this.getDefaultListViewTaskColour());
            console.log('       LV Overdue: ' + this.getListViewOverdueColour());

            console.log('   Dimensions:');
            console.log('       Canvas width: ' + this.getCanvasWidth());
            console.log('       Canvas width: ' + this.getCanvasHeight());
			console.log('       Stage width: ' + this.getStageWidth());
            console.log('       Stage height: ' + this.getStageHeight());
            console.log('       Scrollbar height: ' + this.getScrollbarHeight());
            console.log('       Calendar label height: ' + this.getCalendarLabelHeight());
            console.log('       Task label height: ' + this.getTaskLabelHeight());
            console.log('       Milestone label height: ' + this.getMilestoneLabelHeight());
			
			console.log('   Cursors:');
            console.log('       Default: ' + this.getCursorDefault());
            console.log('       Point: ' + this.getCursorPoint());
            console.log('       Move: ' + this.getCursorMove());
			
			console.log('   Miscellaneous:');
            console.log('       Max stack height: ' + this.getMaxStackHeight());
			
            console.log('End Config:');
        }
    };

    window.Config = Config;
}());