/**
 * Represents a stacked task
 */

(function(){

    /**
     * constructor
     * @param model
     * @param anchorPoint
     */
    var StackedTaskView = function(views, anchorPoint){

       // console.log('StackedTaskView.StackedTaskView: ' + views.length);
        this.initialize(views, anchorPoint);
    };

    // set the 'class'
    var p = StackedTaskView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars

    this._label;

    /**
     * Initialises the vars
     * @param model
     * @param anchorPoint
     */
    p.initialize = function(views, anchorPoint) {

        this.Container_initialize();

        // console.log('StackedTaskView.initialize');

        this._anchorPoint = new Point(anchorPoint.x,anchorPoint.y);

        // pull out the models
        this._models = new Array();
        for(var i = 0; i < views.length; i++)
            this._models.push(views[i]._model);

        this.attachLabel();

        this.redraw();
    };

    /**
     * Creates and attaches the label
     */
    p.attachLabel = function(){

        var _types = new Array();
        var _names = new Array();
        var _dates = new Array();
        var _statuses = new Array();

        for(var i = 0; i < this._models.length; i++) {

            var model = this._models[i];

            _types.push(model.getType());
            _names.push(model.getName());
            _dates.push(model.getCompletedDate());
            _statuses.push(model.getStatus());
        }

        this._label = new StackedTaskLabel(_types, _names, _dates, _statuses);
        this._label.setTimelinePoint(this._anchorPoint);
        $(this._label).bind('onTaskViewClicked', $.proxy(this.onTaskViewClicked, this));
        $(this._label).bind('onTaskPointClicked', $.proxy(this.onTaskPointClicked, this));
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('StackedTaskView.redraw');

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

    p.getCompletedDate = function(){

        return this._models[0].getCompletedDate();
    };

    p.onTaskViewClicked = function(event, index){

        // console.log('StackedTaskView.onTaskViewClicked: index: ' + index + ' label.x: ' + this._label._labels[index].x + ' ' + this._anchorPoint.y);

    	var label = this._label._labels[index];
    	
    	var labelOffset = new Point(label.x+10,label.y+label.height/2);
        this._popup = new TaskPopupView(this._models[index], new Point(this._anchorPoint.x+labelOffset.x,this._anchorPoint.y+labelOffset.y));
    };
    
    p.onTaskPointClicked = function(event){

        this._popup = new StackedTaskPopupView(this._models, this._anchorPoint);
    };

    window.StackedTaskView = StackedTaskView;
}());
