/**
 * A MonthColumn component
 */

(function(){

    /**
     * constructor
     */
    var MonthColumn = function(){

        // console.log('MonthColumn.constructor');

        this.initialize();
    };

    // set the 'class'
    var p = MonthColumn.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    this.labeltxt;
    this._bg;

    p.initialize = function(){
        // console.log('MonthColumn.initialize');

        this.Container_initialize();

        this._defaultWidth = 200;
        this.width = this._defaultWidth;

        this._month = 0;
        this._year = 0;
        this._greyed = false;

        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.drawBg();
        this.drawLabel();

        this.arrangeComponents();

        update = true;
    };

    /**
     * Draws the connecting line between the timeline point and the label
     */
    p.drawBg = function(){

        var colour = (this._greyed) ? "#DBDBDB" : null;

        this._bg = new createjs.Shape();
        this._bg.width = this.width;
        this._bg.height = Config.getStageHeight();
        this._bg.graphics.beginFill(colour)
            .rect(0,0,this._bg.width,this._bg.height);
    };

    /**
     * Draws the date label
     */
    p.drawLabel = function(){

        this.labeltxt = new createjs.Text($.datepicker.formatDate('M', new Date(0, this._month)).toUpperCase(), "bold " + Config.getLabelFontSize() + " " + Config.getFont(), "#000");
        this.labeltxt.x = (this._bg.width/2)-(this.labeltxt.getMeasuredWidth()/2);
        this.labeltxt.y = Config.getCalendarLabelHeight() - this.labeltxt.getMeasuredHeight() - 5;
    };

    /**
     * Makes sure that layering is correct
     */
    p.arrangeComponents = function(){

        this.addChild(this._bg);
        this.addChild(this.labeltxt);
    };

    /**
     * Getters/setters
     */

    p.getWidth = function(){

        return this._bg.width;
    };

    p.setWidthAsPercentage = function(percentage){

        this.width = this._defaultWidth*percentage;
        this.redraw();
    };

    p.setMonth = function(month){

        this._month = month;
        this.redraw();
    };

    p.setDate = function(date){

        this._month = date.getMonth();
        this._year = date.getFullYear();
        this.redraw();
    };

    p.getDate = function() {

        return new Date(this._year, this._month);
    };

    p.setGreyed = function(greyed){

        this._greyed = greyed;
        this.redraw();
    };

    window.MonthColumn = MonthColumn;
}());
