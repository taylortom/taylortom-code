/**
 * Represents a milestone in List View
 */

(function(){

    var MileStoneListView = function(model){

        this.initialize(model);
    };

    // set the 'class'
    var p = MileStoneListView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars with object scope
    this.titletxt;
	this.datetxt; 

    p.initialize = function(model){

      // console.log('MilestoneLabel.initialize');

        this.Container_initialize();

        this._model = model;

        this._taskListViews = new Array();

        this.createTaskListViews();

        this.redraw();
    };

    p.createTaskListViews = function(model){

        var tasks = this._model.getTasks();
        var showBG = true;

       for(var i=0;i<tasks.length;i++){
            var taskModel = tasks[i];
            var tlv = new TaskListView(taskModel, showBG);
            this._taskListViews.push(tlv);

            showBG = !showBG;
        }
    };

    p.displayCoreInfo = function(){

        var xpos = 10;
        var ypos = 0;
        var maxLineWidth = 200;

        this.titletxt = new createjs.Text(this._model.getName(), "18px Arial", "#000");
        this.titletxt.x = xpos;
        this.titletxt.y = ypos;
        this.titletxt.maxWidth = maxLineWidth;
        this.addChild(this.titletxt);

        ypos += this.titletxt.getMeasuredLineHeight() + 15;

        var completionText = (this._model.getCompleted()) ? "COMPLETED MILESTONE ON" : "EXPECTED COMPLETION";
        var completedtxt = new createjs.Text(completionText, "13px Arial", "#666");
        completedtxt.x = xpos;
        completedtxt.y = ypos;
        completedtxt.lineWidth = maxLineWidth;
        this.addChild(completedtxt);

        ypos += completedtxt.getMeasuredLineHeight() + 5;

        var date = (this._model.getCompleted()) ? this._model.getCompletedDate() : this._model.getDueDate();
        var dateText = getWeekDay(date.getDay()) + " " + date.getDate() + getDateSuffix(date.getDate()) + " " + getMonthName(date.getMonth());
        this.datetxt = new createjs.Text(dateText, "14px Arial", "#000");
        this.datetxt.x = xpos;
        this.datetxt.y = ypos;
        this.datetxt.lineWidth = maxLineWidth;
        this.addChild(this.datetxt);

    };

    p.attachTaskListViews = function(){

        var xpos = 210;
        var ypos = this.titletxt.y - 7; // align the top task with the top of the title text
		//console.log("ypos: " + ypos);

        for(var i=0;i<this._taskListViews.length;i++){
            var tlv = this._taskListViews[i];
            tlv.x = xpos;
            tlv.y = ypos;
            this.addChild(tlv);
			
			ypos += tlv.getHeight();
        }
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.displayCoreInfo();

        this.attachTaskListViews();

        update = true;
    };
	
	p.getHeight = function(){
		
		//console.log("this.datetxt.y: " + this.datetxt.y);
		var lastTask = this._taskListViews[this._taskListViews.length-1];
		var lastTaskBottom = lastTask.y + lastTask.getHeight();
		
		return Math.max(this.datetxt.y + this.datetxt.getMeasuredHeight(), lastTaskBottom); // text is bottom aligned
	};

    window.MileStoneListView = MileStoneListView;
}());