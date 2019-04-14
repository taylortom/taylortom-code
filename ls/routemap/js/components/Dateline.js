/**
 * A Dateline component
 */

(function(){

    /**
     * constructor
     */
    var Dateline = function(xPos){

        // console.log('Dateline.constructor');

        this.initialize(xPos);
    };

    // set the 'class'
    var p = Dateline.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    this._label;
    this.labeltxt;
    this._line;

    /**
     * Initialises the vars
     */
    p.initialize = function(xPos){

        // console.log('Dateline.initialize');

        this.Container_initialize();

        this._startPoint = new Point(xPos,0);
        this._endPoint = new Point(xPos,Config.getStageHeight());

        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('Dateline.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.drawLine();
        this.drawLabel();

        this.arrangeComponents();

        update = true;
    };

    /**
     * Draws the connecting line between the timeline point and the label
     */
    p.drawLine = function(){

        this._line = new createjs.Shape();
        this._line.graphics.setStrokeStyle(2)
            .beginStroke(Config.getDatelineColour())
            .moveTo(this._startPoint.x, this._startPoint.y)
            .lineTo(this._endPoint.x, this._endPoint.y)
            .endStroke();
    };

    /**
     * Draws the date label
     */
    p.drawLabel = function(){

        this.labeltxt = new createjs.Text($.datepicker.formatDate('dd M', new Date()).toUpperCase(), "bold " + Config.getLabelFontSize() + " " + Config.getFont(), "#fff");

        this._label = new createjs.Shape();
        this._label.width = this.labeltxt.getMeasuredWidth() + 20;
        this._label.height = Config.getCalendarLabelHeight();
        this._label.graphics.beginFill(Config.getDatelineColour())
            .rect(0,0,this._label.width,this._label.height);
        this._label.x = this._startPoint.x -(this._label.width/2);
        this._label.y = 0;

        this.labeltxt.x = this._label.x + 9;
        this.labeltxt.y = this._label.y + this._label.height - (this.labeltxt.getMeasuredHeight() + 5);
    };

    /**
     * Makes sure that layering is correct
     */
    p.arrangeComponents = function(){

        this.addChild(this._line);
        this.addChild(this._label);
        this.addChild(this.labeltxt);
    };

    /**
     * Returns the y position
     */
    p.getLabelYPos = function(){

        return this._label.y + this._label.height;
    };

    /**
     * Returns the x position
     */
    p.getXPos = function(){

        return this._startPoint.x;
    };

    window.Dateline = Dateline;
}());
