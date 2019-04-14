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
    var MilestoneView = function(model,anchorPoint, showTasks){

        // console.log('MilestoneView.constructor: ' + model.getName() + ' (' + anchorPoint.x + ',' + anchorPoint.y + ') ' + showTasks);

        this.initialize(model, anchorPoint, showTasks);
    };

    // set the 'class'
    var p = MilestoneView.prototype = new createjs.Container();
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

        //if(window.console && window.console.log) console.log('MilestoneView.initialize: ' + anchorPoint.x + ',' + anchorPoint.y);

        this.Container_initialize();

        this._model = model;
        this._anchorPoint = new Point(anchorPoint.x, anchorPoint.y);
        this._showTasks = showTasks;
        this._taskViews = new Array();
        this._stackLevel = 0; // default
        this._completeTaskViews = new Array();

        this.attachLabel();

        if(this._showTasks) this.addTasks();

        this.redraw();
    };

    /**
     * Creates and attaches the label
     */
    p.attachLabel = function(){
       // console.log("MilestoneView::attachLabel");
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

        //console.log("MilestoneView::addTasks");

        var tasks = this._model.getTasks();

        for(var i = 0; i < tasks.length; i++){

            var model = tasks[i];
            var view = new TaskView(model, new Point(0,this._anchorPoint.y));

            if(this._model.getCompleted()) this._completeTaskViews.push(view);
            else if(model.getStatus() == completedDT) this._completeTaskViews.push(view);
            else this._taskViews.push(view);
        }
    };

    /**
     * Attaches and positions the tasks relative to the milestone
     */
    p.attachTasks = function(){

        //console.log('MilestoneView.attachTasks: ' + this._taskViews.length);

        var SPACING = -30;
        var position = new Point(this._anchorPoint.x, this._anchorPoint.y);
        position.x -= 10;

        this._taskViews.sort(sortViewsByDueDate);
        this._taskViews.reverse();

        for(var i = 0; i < this._taskViews.length; i++){

            var tv = this._taskViews[i];

            var newPosition = new Point((position.x + SPACING), position.y);
            tv.setTimelinePoint(newPosition);
            tv._label.setStackLevel(i);

            position = newPosition;

            // don't add completed tasks, we'll deal with those later...
            if(tv._model.getCompletedDate() == undefined && !tv._model.getIsOptional()) this.addChild(tv);
        }
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('MilestoneView.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.addChild(this._label);

        if(this._showTasks) this.attachTasks();

        update = true;
    };

    /**
     * Allows the milestone to be moved along the timeline
     * @param newPoint
     */
    p.setTimelinePoint = function(newPoint){

       //console.log('MilestoneView.setTimelinePoint: (' + newPoint.x + ',' + newPoint.y + ')');

        this._anchorPoint.x = newPoint.x;
        this._anchorPoint.y = newPoint.y;


        this._label.setTimelinePoint(newPoint);

        this.redraw();
    };

    p.getTimelineXPos = function(){ return this._anchorPoint.x; };
    p.setTimelineXPos = function(newX){

        var newPoint = new Point(newX, this._anchorPoint.y);

        this.setTimelinePoint(newPoint);
        this._label.setTimelinePoint(newPoint);
    };

    /**
     * Calculates the amount of timeline space the milestone requires
     */
    p.getTimelineSpace = function(){

        if(this._taskViews.length < 1) return 50;

        var space = this._anchorPoint.x;
        space -= this._taskViews[this._taskViews.length-1]._anchorPoint.x;

        return space;
    };

    /**
     * Calculates the amount of space required to clear the last task
     */
    p.getTimelineGap = function(){

        if(this._taskViews.length < 1) return 150;

        var tasksEnd = this._taskViews[0]._label.getEndX();
        var milestonesEnd = this._label._date.x + this._label._date.width;

        //console.log('tasksEnd: ' + tasksEnd + ' -- milestonesEnd: ' + milestonesEnd);

        return Math.max(tasksEnd, milestonesEnd);
    };

    p.getTimelinePointWidth = function(){

        return this._label._timelinePoint.size + 12;
    };

    /**
     * Calculates the complete width of the milestone
     */
    // todo: factor in tasks
    p.getWidth = function(){

       return this._label.getWidth();
     };

    // todo: factor in tasks
    p.getEndPoint = function(){

        if(this._model.getStatus()===completedDT){ // milestone will be drawn backwards

            return this._label.getEndPoint();
        }
        else{

            //return (this._label._date.x + this._label._date.width);
            return this._label.getWidth();
        }
    };

    /**
     * Used for setting the height
     * @param newLevel
     */
    p.setStackLevel = function(newLevel){
		
        this._stackLevel = newLevel;
		this._label.setStackLevel(this._stackLevel);
		//this.redraw();
    };

    p.onMilestoneClicked = function(){
        //console.log("MilestoneView::onMilestoneClicked");
    	var labelOffset = new Point(this._label._label.x+10,this._label._label.y+this._label._label.height/2);
        this._popup = new MilestonePopupView(this._model, new Point(this._label.x+labelOffset.x,this._label.y+labelOffset.y));
    };
    
    p.onMilestonePointClicked = function(){
    
        this._popup = new MilestonePopupView(this._model, this._anchorPoint);
    };

    p.getModel = function(){ return this._model; };
    
    p.getStackLevel = function(){ return this._stackLevel; };

    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        //this._model.print();
        this._anchorPoint.print();
    };

    window.MilestoneView = MilestoneView;
}());
