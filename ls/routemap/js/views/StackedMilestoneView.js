/**
 * Represents a stacked milestone
 */

(function(){

    /**
     * constructor
     * @param model
     * @param anchorPoint
     */
    var StackedMilestoneView = function(views, anchorPoint){

        // console.log('StackedMilestoneView.StackedMilestoneView: ' + views.length);
        this.initialize(views, anchorPoint);
    };

    // set the 'class'
    var p = StackedMilestoneView.prototype = new createjs.Container();
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

        // console.log('StackedMilestoneView.initialize');

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

        var _names = new Array();
        var _dates = new Array();

        for(var i = 0; i < this._models.length; i++) {

            var model = this._models[i];

            _names.push(model.getName());
            _dates.push(model.getCompletedDate());
        }

        this._label = new StackedMilestoneLabel(_names, _dates);
        this._label.setTimelinePoint(this._anchorPoint);
        $(this._label).bind('onMilestoneViewClicked', $.proxy(this.onMilestoneViewClicked, this));
        $(this._label).bind('onMilestonePointClicked', $.proxy(this.onMilestonePointClicked, this));
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('StackedMilestoneView.redraw');

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
    
    p.onMilestoneViewClicked = function(event, index){

    	var label = this._label._labels[index];
    	
    	var labelOffset = new Point(label.x+10,label.y+label.height/2);
        this._popup = new MilestonePopupView(this._models[index], new Point(this._anchorPoint.x+labelOffset.x,this._anchorPoint.y+labelOffset.y));
    };
    
    p.onMilestonePointClicked = function(event){
    	
        this._popup = new StackedMilestonePopupView(this._models, this._anchorPoint);
    };

    window.StackedMilestoneView = StackedMilestoneView;
}());
