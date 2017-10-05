/**
 * Represents a milestone
 */

(function(){

    /**
     * constructor
     * @param model
     * @param anchorPoint
     * @param showTasks
     */
    var MilestoneSummaryView = function(model,anchorPoint, showTasks){

        //if(console) console.log('MilestoneSummaryView.constructor: ' + model.getName() + ' (' + anchorPoint.x + ',' + anchorPoint.y + ') ' + showTasks);

        this.initialize(model, anchorPoint, showTasks);
    };

    // set the 'class'
    var p = MilestoneSummaryView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    this._label;
    this._popup;

    /**
     * Initialises the vars
     * @param model
     * @param anchorPoint
     * @param showTasks
     */
    p.initialize = function(model, anchorPoint, showTasks){

        // console.log('MilestoneView.initialize: ' + anchorPoint.x + ',' + anchorPoint.y);

        this.Container_initialize();

        this._model = model;
        this._anchorPoint = new Point(anchorPoint.x, anchorPoint.y);
        this._showTasks = showTasks;
        this._taskSummaryViews = new Array();
        this._stackLevel = 0; // default

        this.attachLabel();

        if(this._showTasks) this.addTasks();

        this.redraw();
    };

    /**
     * Creates and attaches the label
     */
    p.attachLabel = function(){

        var date = (this._model.getCompleted()) ? this._model.getCompletedDate() : this._model.getDueDate();

        this._label = new MilestoneLabel(this._model.getName(), date, this._model.getCompleted());
        this._label.setStatus(this._model.getStatus());
        this._label.setTimelinePoint(this._anchorPoint);
        $(this._label).bind('onMilestoneViewClicked', $.proxy(this.onMilestoneClicked, this));
        $(this._label).bind('onMilestonePointClicked', $.proxy(this.onMilestonePointClicked, this));
    };

    /**
     * Adds the associated tasks
    */
    p.addTasks = function(){

        //console.log("MilestoneSummaryView::addTasks");

        var tasks = this._model.getTasks();

        for(var i = 0; i < tasks.length; i++){

            var model = tasks[i];
            var view = new TaskSummaryView(model, new Point(0,this._anchorPoint.y));

            this._taskSummaryViews.push(view);
        }
    };

    /**
     * Attaches and positions the tasks relative to the milestone
     */
    p.attachTasks = function(){

        //console.log("this._anchorPoint.x: " + this._anchorPoint.x);
        var position = new Point(this._anchorPoint.x, this._anchorPoint.y);
        position.x -= (this._label.getTimelinePointWidth()/2);

        this._taskSummaryViews.sort(sortViewsByDueDate);
        this._taskSummaryViews.reverse();

        this._taskSummaryViews.sort(sortViewsByReverseStatus);

        for(var i=0;i<this._taskSummaryViews.length;i++){
            var tsv = this._taskSummaryViews[i];

            if(i==0) position.x -= (tsv.getWidth()/2);

            var newPosition = new Point((position.x - tsv.getWidth()), position.y);
            tsv.x = position.x;
            tsv.y = position.y;
            position = newPosition;

            this.addChild(tsv);
        }
    };

    p.onMilestoneClicked = function(){
        var labelOffset = new Point(this._label._label.x+10,this._label._label.y+this._label._label.height/2);
        this._popup = new MilestonePopupView(this._model, new Point(this._label.x+labelOffset.x,this._label.y+labelOffset.y));
    };

    p.onMilestonePointClicked = function(){

        this._popup = new MilestonePopupView(this._model, this._anchorPoint);
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.addChild(this._label);

        if(this._showTasks) this.attachTasks();

        update = true;
    };

    p.getModel = function(){
        return this._model;
    };

    /**
     * Allows the milestone to be moved along the timeline
     * @param newPoint
     */
    p.setTimelinePoint = function(newPoint){

        // console.log('MilestoneView.setTimelinePoint: (' + newPoint.x + ',' + newPoint.y + ')');

        this._anchorPoint.x = newPoint.x;
        this._anchorPoint.y = newPoint.y;

        this._label.setTimelinePoint(newPoint);

        this.redraw();
    };

    p.setTimelineXPos = function(newX){

        var newPoint = new Point(newX, this._anchorPoint.y);

        this.setTimelinePoint(newPoint);
        this._label.setTimelinePoint(newPoint);
    };

    /**
     * Calculates the complete width of the milestone
     */
    p.getWidth = function(){
       //console.log("this._label.getWidth(): " + this._label.getWidth());

       return this._label.getWidth();
     };

    p.getTasksWidth = function(){
        var lastTask = this._taskSummaryViews[this._taskSummaryViews.length-1];
        //console.log("lastTask.x: " + lastTask.x);

        return this._anchorPoint.x - lastTask.x;
    };

    p.getEndPoint = function(){

        return this._label.getEndPoint();
     };

    /**
     * Used for setting the height
     * @param newLevel
     */
    p.setStackLevel = function(newLevel){
		
		//console.log("MilestoneView.setStackLevel: "+ newLevel);
        this._stackLevel = newLevel;
		this._label.setStackLevel(this._stackLevel);
		//this.redraw();
    };

    p.sortTasksByStatus = function(a,b){
        //console.log("ChartViewZoomOut.sortMilestonesByStatus");
        //console.log(b.getStatus());
        return ((a.getStatus()===completedDT) ? -1 : ((b.getStatus())===completedDT ? 1 : 0));
    };

    p.getCompletedDate = function(){
        return this._model.getCompletedDate();
    };

    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        //this._model.print();
        this._anchorPoint.print();
    };

    window.MilestoneSummaryView = MilestoneSummaryView;
}());
