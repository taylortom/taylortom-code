/**
 * The calendar view
 */

(function(){

    /**
     * constructor
     */
    var CalendarView = function(xPos){

       // console.log('CalendarView.constructor');

        this.initialize(xPos);
    };

    // set the 'class'
    var p = CalendarView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars

    /**
     * Initialises the vars
     */
    p.initialize = function(xPos){

        // console.log('CalendarView.initialize');

        this.Container_initialize();

        this._startXPos = xPos;
        this._monthColumns = new Array();

        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('CalendarView.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.attachMonthColumns();
        this.drawTopBar();

        this.addChild(this._line);
    };

    /**
     * Draws the top row with labels
     */
    p.drawTopBar = function(){

        // console.log('CalendarView.drawTopBar');

        this._line = new createjs.Shape();
        this._line.graphics.setStrokeStyle(1)
            .beginStroke(Config.getTimelineColour())
            .moveTo(this._startXPos, Config.getCalendarLabelHeight()-1)
            .lineTo(this.getLastXPos(), Config.getCalendarLabelHeight()-1)
            .endStroke();
    };

    p.attachMonthColumns = function(){

        // console.log('CalendarView.attachMonthColumns');

        var today = new Date();
        
        var startDate = new Date(dataManager.getStartDate());
        var tempDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0, 1);
      
        var xPos = this._startXPos;
        var greyed = true;

        while(tempDate <= today){
        	
            var mc = new MonthColumn();

            mc.setDate(tempDate);
            mc.setGreyed(greyed);
            mc.x = xPos;

            this._monthColumns.push(mc);
            this.addChild(mc);

            xPos += mc.getWidth();
            tempDate.setMonth(tempDate.getMonth()+1);
            greyed = !greyed;
        }
    };

    p.getWidth = function(){

        return this.getLastXPos()-this._startXPos;
    };

    p.getLastXPos = function(){

        // console.log('CalendarView.getLastXPos');

        var lastColumn = this._monthColumns[this._monthColumns.length-1];

        var today = new Date().getDate();
        var percent = (today/31);

        var newWidth = lastColumn._defaultWidth*percent;

        // set the column width
        lastColumn.setWidthAsPercentage(percent);
        if(percent < 0.75) lastColumn.labeltxt.visible = false;

        return lastColumn.x + newWidth;
    };

    p.getStartPointForDate = function(date) {

        if(date == null) return;

        for(var i = 0; i < this._monthColumns.length; i++) {

            var column = this._monthColumns[i];
            var columnDate = column.getDate();

            if(date.getYear() == columnDate.getYear() &&
                date.getMonth() == columnDate.getMonth()) {

                return column.x;
            }
        }
    };

    p.getEndPointForDate = function(date) {

        if(date == null) return;

        for(var i = 0; i < this._monthColumns.length; i++) {

            var column = this._monthColumns[i];
            var columnDate = column.getDate();

            if(date.getYear() == columnDate.getYear() &&
               date.getMonth() == columnDate.getMonth()) {

                return column.x + column.getWidth();
            }
        }
    };

    window.CalendarView = CalendarView;
}());
