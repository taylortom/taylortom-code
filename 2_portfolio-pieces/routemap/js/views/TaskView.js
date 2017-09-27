/**
 * Represents a task
 */

(function(){

    /**
     * constructor
     * @param model
     * @param anchorPoint
     */
    var TaskView = function(model, anchorPoint){

        // console.log('TaskView.constructor: ' + model.getName() + ' (' + _anchorPoint.x + ',' + _anchorPoint.y + ')');

        this.initialize(model, anchorPoint);
    };

    // set the 'class'
    var p = TaskView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars

    this._label;
    this._popup;

    /**
     * Initialises the vars
     * @param model
     * @param anchorPoint
     */
    p.initialize = function(model, anchorPoint){

        // console.log('TaskView.initialize');

        this.Container_initialize();

        this._model = model;
        this._anchorPoint = anchorPoint;

        this.attachLabel();

        this.redraw();
    };

    /**
     * Creates and attaches the label
     */
    p.attachLabel = function(){

        //var taskCompleted = (this._model.getCompletedDate() != undefined);
        var date = (this._model.getCompletedDate() != null) ? this._model.getCompletedDate() : this._model.getDueDate();

        var drawBackwards = ((this._model.getStatus() == completedDT) || this._model.getMilestoneComplete());

        this._label = new TaskLabel(this._model.getType(), this._model.getName(), date, (this._model.getStatus() == completedDT));
        this._label.setStatus(this._model.getStatus(), this._model.getIsOverdue());
        this._label.setTimelinePoint(this._anchorPoint);
        $(this._label).bind('onTaskViewClicked', $.proxy(this.onTaskClicked, this));
        $(this._label).bind('onTaskPointClicked', $.proxy(this.onTaskPointClicked, this));
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('TaskView.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        // re-add the label
        this.addChild(this._label);

        update = true;
    };

    /**
     * Allows the task to be moved along the timeline
     * @param newPoint
     */
    p.setTimelinePoint = function(newPoint){

        this._anchorPoint.x = newPoint.x;
        this._anchorPoint.y = newPoint.y;

        this._label.setTimelinePoint(newPoint);
    };

    p.setTimelineXPos = function(newX){

        var newPoint = new Point(newX, this._anchorPoint.y);

        this.setTimelinePoint(newPoint);
        this._label.setTimelinePoint(newPoint);
    };

    p.getTimelinePointWidth = function(){

        return this._label._timelinePoint.size + 10;
    };

    p.onTaskClicked = function(){

        // console.log('TaskView.onTaskClicked: (' + this._label._label.x + ',' + this._label._label.y + ')');

        var labelOffset = new Point(this._label._label.x+10,this._label._label.y+this._label.getHeight()/2);
        this._popup = new TaskPopupView(this._model, new Point(this._label.x+labelOffset.x,this._label.y+labelOffset.y));
    };
    
    p.onTaskPointClicked = function(){

        // console.log('TaskView.onTaskClicked: (' + this._label._label.x + ',' + this._label._label.y + ')');

        this._popup = new TaskPopupView(this._model, this._anchorPoint);
    };

    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        this._model.print();
        this._anchorPoint.print();
    };

    window.TaskView = TaskView;
}());
