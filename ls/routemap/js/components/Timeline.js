/**
 * A timeline component
 */

(function(){

    /**
     * constructor
     * @param startPoint
     * @param endPoint
     */
    var Timeline = function(startPoint, endPoint, radius){

        // console.log('Timeline.constructor: (' + startPoint.x + ',' + startPoint.y + ')-(' + endPoint.x + ',' + endPoint.y + ')');

        this.initialize(startPoint, endPoint, radius);
    };

    // set the 'class'
    var p = Timeline.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    var SPACING = 40;

    this._startPoint;
    this._endPoint;
    this._startShape;
    this._endShape;
    this._line;

    /**
     * Initialises the vars
     * @param startPoint
     * @param endPoint
     */
    p.initialize = function(startPoint, endPoint, radius){

       //console.log('Timeline.initialize');

        this.Container_initialize();

        this._startPoint = new Point();
        this._endPoint = new Point();

       // console.log("startPoint.x: " + startPoint.x + ", startPoint.y: " + startPoint.y + ", endPoint.x: " + endPoint.x + ", endPoint.y: " + endPoint.y);

        this._startPoint.x = startPoint.x;
        this._startPoint.y = startPoint.y;

        this._endPoint.x = endPoint.x;
        this._endPoint.y = endPoint.y;

        this._radius = radius;
        this._thickness = 8;

        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('Timeline.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this._startShape = new createjs.Shape();
        this._startShape.radius = this._radius;
        this._startShape.graphics.beginFill("#fff")
                                 .beginStroke(Config.getTimelineColour())
                                 .setStrokeStyle(this._thickness)
                                 .drawCircle(0,0,this._startShape.radius)
                                 .endStroke();
        this._startShape.x = this._startPoint.x;
        this._startShape.y = this._startPoint.y;

        this._endShape = new createjs.Shape();
        this._endShape.radius = this._radius;
        this._endShape.graphics.beginFill("#fff")
            .beginStroke(Config.getTimelineColour())
            .setStrokeStyle(this._thickness)
            .drawCircle(0,0,this._radius)
            .endStroke();
        this._endShape.x = this._endPoint.x;
        this._endShape.y = this._endPoint.y;

        this._line = new createjs.Shape();
        this._line.graphics.setStrokeStyle(this._thickness)
            .beginStroke(Config.getTimelineColour())
            .moveTo(this._startShape.x, this._startShape.y)
            .lineTo(this._endShape.x,this._endShape.y)
            .endStroke();

        // add to stage and re-render
        this.addChild(this._line, this._startShape, this._endShape);
        update = true;
    };
    
    p.setThickness = function(newThickness){
    	
    	this._thickness = newThickness;
    	this.redraw();
    };

    /**
     * Works out the width of the clip
     */
    p.getWidth = function(){

        return (this._endPoint.x - this._startPoint.x);
    };

    p.setWidth = function(newWidth){

        this._endPoint.x = this._startPoint.x + newWidth;
        this.redraw();
    };

    /**
     * Calculates the first available xPosition after the start shape
     */
    p.getFirstXPos = function(){

        return (this._startPoint.x + this._startShape.radius + SPACING);
    };

    p.getLastXpos = function(){

        return this._endPoint.x -20;
    };

    p.getYPos = function(){

        return this._startPoint.y;
    };

    /**
     * How much spacing is needed for the end 'cap'
     */
    p.getEndSpacing = function(){

        return this._endShape.radius + 16 + SPACING;
    };

    p.getRadius = function(){

      return this._radius;
    };

    window.Timeline = Timeline;
}());
