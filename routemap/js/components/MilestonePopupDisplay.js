/**
 * Represents a MilestonePopupDisplay
 */

(function(){

    /**
     * constructor
     * @param model
     */
    var MilestonePopupDisplay = function(model){

        this.initialize(model);
    };

    // set the 'class'
    var p = MilestonePopupDisplay.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    var POPUP_WIDTH = 250;

    // text
    this._topLine;
    this._bottomLine;
    this.titletxt;
    this.bodytxt;
    this.statustxt;
    this.completedtxt;

    /**
     * Initialises the vars
     * @param model
     */
    p.initialize = function(model){

		this.Container_initialize();

		this._tasks = new Array();

        this._model = model;

        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();

        //this.drawScreenlock();
        this.drawTasks();
        this.drawDisplay();
        this.positionDisplayComponents();
        this.arrangeComponents();

        update = true;
    };

    /**
     * Redraws the display text
     */
    p.drawDisplay = function(){

        // console.log('TaskPopupView.drawDisplay: ' + this._model.title);

        //var textWidth = POPUP_WIDTH-(POPUP_WIDTH*0.15);
        var textWidth = this.width;
        if(textWidth < POPUP_WIDTH-(POPUP_WIDTH*0.2)) textWidth = POPUP_WIDTH-(POPUP_WIDTH*0.2);
        this._displayContainer = new createjs.Container();
        
        this._statusIcon = new createjs.Shape();
        this._statusIcon.size = 10;
        //this._statusIcon.graphics.beginFill(Config.getColourForStatus(this._model.getStatus())).drawCircle(0,0,this._statusIcon.size);
        
        var iconColour = "#000";
        if(this._model.getStatus() == completedDT) iconColour = Config.getCompletedColour();
        else if(this._model.getIsOverdue()) iconColour = Config.getOverdueColour();
        
        this._statusIcon.graphics.beginFill(iconColour)
            .rect((this._statusIcon.size/2)*-1,(this._statusIcon.size/2)*-1,this._statusIcon.size,this._statusIcon.size);
        this._statusIcon.rotation = 45;
        
        this.icontxt = new createjs.Text("Milestone " + this._model.getStatus().toLowerCase(), "bold " + Config.getBodyFontSize() + " " + Config.getFont(), iconColour);

        // title

        this.titletxt = new createjs.Text(this._model.getName(), "bold " + Config.getTitleFontSize() + " " + Config.getFont(), "#000");
        this.titletxt.lineWidth = textWidth;

        // body

        this.bodytxt = new createjs.Text(this._model.getDescription(), Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.bodytxt.lineWidth = textWidth;
        
        // lines
        
        this._topLine = drawHorizontalLine(textWidth, 1, '#000', 0.5);
        this._bottomLine = drawHorizontalLine(textWidth, 1, '#000', 0.5);

        // status
        
        if(this._model.getIsOverdue())
        {
	        this.statustxt = new createjs.Text("Overdue", "bold " + Config.getBodyFontSize() + " " + Config.getFont(), Config.getOverdueColour());
	        this.statustxt.lineWidth = textWidth;
	
	        this.statuslabel = new createjs.Text('Status', "bold " + Config.getBodyFontSize() + " " + Config.getFont(), "#000");
	        this.statuslabel.lineWidth = textWidth;
        }

        // date
        
        var completedLabelText = (this._model.getStatus() == completedDT) ? "Completed" : "Due on";
        var completedDate = (this._model.getStatus() == completedDT) ? this._model.getCompletedDate() : this._model.getDueDate();
        
        this.completedlabel = new createjs.Text(completedLabelText, "bold " + Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.completedlabel.lineWidth = textWidth;
        
        this.completedtxt = new createjs.Text($.datepicker.formatDate('dd/mm/yy', completedDate), Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.completedtxt.lineWidth = textWidth;        
    };
    
    /**
     * Draws the list of tasks
     */
    p.drawTasks = function(){
    
    	var yPos = 0;
    	
    	this._taskList = new createjs.Container();
    	this.width = POPUP_WIDTH;

    	var tasks = this._model.getTasks().slice(0);
    	tasks.sort(sortModelsByStatusAndCompletedDate);
    	tasks.reverse();

	    for(var i = 0; i < tasks.length; i++)
	    {
	    	var task = new createjs.Container();
	    	var taskModel = tasks[i];
		    
		    // add the components
		    
		    var taskPoint = new createjs.Shape();
		    taskPoint.size = 5;
	        taskPoint.graphics.beginFill(Config.getColourForStatus(taskModel.getStatus())).drawCircle(0,0,taskPoint.size);
	        
	        var tasktxt = new createjs.Text(taskModel.getName(), Config.getBodyFontSize() + " " + Config.getFont(), Config.getLinkColour());
	        tasktxt.x = taskPoint.x + taskPoint.size + 7;
	        tasktxt.y = - (taskPoint.size + 1);
	        
	        var task_hit = new createjs.Shape();
	        task_hit.width = tasktxt.getMeasuredWidth();
	        task_hit.height = tasktxt.getMeasuredHeight();
	        task_hit.x = tasktxt.x;
	        task_hit.y = tasktxt.y;
	        task_hit.graphics.beginFill('#fff').rect(0,0,task_hit.width,task_hit.height);
	        
	        // add listeners to the link
	        task_hit.onClick = function(url) { return function() { window.open(url); }; }(taskModel.getUrl());
			task_hit.onMouseOver = function(){ $('body').removeClass('dragCursor').removeClass('overCursor').removeClass('defaultCursor').addClass('pointCursor'); };
			task_hit.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('overCursor'); };
				       
	        task.addChild(task_hit, taskPoint, tasktxt);
	       
	       // position the components
	       
	        task.x = (taskPoint.size*1.5);
	    	task.y = yPos;
	        
		    this._taskList.addChild(task);
	        this._tasks.push(task);
	        
	        yPos += tasktxt.getMeasuredHeight() + 5;
	        
	        // set the width
	        var width = tasktxt.x + tasktxt.getMeasuredWidth() + 40;
	        if(width > this.width) this.width = width;
	    }
	    
	    this._taskList.height = yPos;
    };

    p.positionDisplayComponents = function() {

        // console.log('TaskPopupView.positionDisplayComponents');

        var xPos = 0;
        var yPos = 0;
        var labelSpacing = 75;
        
        this._statusIcon.x = xPos;
        this._statusIcon.y = yPos + (this._statusIcon.size/3);
        
        this.icontxt.x = xPos + (10 + this._statusIcon.size*0.5);
        this.icontxt.y = yPos - (this._statusIcon.size*0.5);

        xPos -= (this._statusIcon.size/2);
        yPos += this.icontxt.getMeasuredHeight() + 10;

        this.titletxt.x = xPos;
        this.titletxt.y = yPos;

        yPos += this.titletxt.getMeasuredHeight() + 10;

        this.bodytxt.x = xPos;
        this.bodytxt.y = yPos;

        yPos += this.bodytxt.getMeasuredHeight() + 15;
        
        this._topLine.x = xPos;
        this._topLine.y = yPos;
        
        yPos += 10;
        
        if(this._model.getIsOverdue())
        {
	        this.statuslabel.x = xPos;
	        this.statuslabel.y = yPos;
	        
	        this.statustxt.x = xPos + labelSpacing;
	        this.statustxt.y = yPos;

	        yPos += this.statustxt.getMeasuredHeight() + 5;
	    }

        this.completedlabel.x = xPos;
        this.completedlabel.y = yPos;
        
        this.completedtxt.x = xPos + labelSpacing;
        this.completedtxt.y = yPos;

        yPos += this.completedtxt.getMeasuredHeight() + 15;

        this._bottomLine.x = xPos;
        this._bottomLine.y = yPos;
        
        yPos += 25;
        
        this._taskList.x = xPos;
        this._taskList.y = yPos;
        
        yPos += this._taskList.height;
        
        // add some padding
        yPos += 25;

        this.height = yPos;
    };

    p.arrangeComponents = function(){

        // text

        this.addChild(this._statusIcon, this.icontxt, this.titletxt, this.bodytxt, this._topLine, this.completedtxt, this.completedlabel, this._bottomLine);
        this.addChild(this._taskList);
        
        if(this._model.getIsOverdue()) this.addChild(this.statustxt, this. statuslabel);
    };

    window.MilestonePopupDisplay = MilestonePopupDisplay;
}());
