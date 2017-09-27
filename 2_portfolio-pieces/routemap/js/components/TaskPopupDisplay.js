/**
 * Represents a TaskPopupDisplay
 */

(function(){

    /**
     * constructor
     * @param model
     */
    var TaskPopupDisplay = function(model){

        this.initialize(model);
    };

    // set the 'class'
    var p = TaskPopupDisplay.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars
    var POPUP_WIDTH = 250;

    this._topLine;
    this._bottomLine;

    // text
    this.icontxt;
    this.titletxt;
    this.bodytxt;
    this.statustxt;
    this.completedtxt;
    this.awardstxt;
    this.scoretxt;
    this.unittxt;
    this.xptxt;

    this._taskBtn;

    /**
     * Initialises the vars
     * @param model
     */
    p.initialize = function(model){

        // console.log('TaskPopupView.initialize: ' + this.openPopup);

		this.Container_initialize();
		
		this._model = model;

        this.redraw();
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // console.log('TaskPopupView.redraw');

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.drawDisplay();
        this.drawTaskButton();
        this.positionComponents();
        this.arrangeComponents();
        this.setupListeners();

        update = true;
    };
    
    /**
     * Redraws the display text
     */
    p.drawDisplay = function(){

        // console.log('TaskPopupView.drawDisplay: ' + this._model.title);

        var textWidth = POPUP_WIDTH-(POPUP_WIDTH*0.15);
        this.width = textWidth;
        
        this._statusIcon = new createjs.Shape();
        this._statusIcon.size = 5;
        this._statusIcon.graphics.beginFill(Config.getColourForStatus(this._model.getStatus())).drawCircle(0,0,this._statusIcon.size);
        
        this.icontxt = new createjs.Text("Task " + this._model.getStatus().toLowerCase(), "bold " + Config.getBodyFontSize() + " " + Config.getFont(), Config.getColourForStatus(this._model.getStatus()));

        // title

        this.titletxt = new createjs.Text(this._model.getName(), "bold " + Config.getTitleFontSize() + " " + Config.getFont(), Config.getLinkColour());
        this.titletxt.lineWidth = textWidth;

        this.titletxt_hit = new createjs.Shape();
        this.titletxt_hit.width = (this.titletxt.getMeasuredWidth() < textWidth) ? this.titletxt.getMeasuredWidth() : textWidth;
        this.titletxt_hit.height = this.titletxt.getMeasuredHeight();
        this.titletxt_hit.graphics.beginFill('#fff').rect(0,0,this.titletxt_hit.width,this.titletxt_hit.height);

        // body

        this.bodytxt = new createjs.Text(this._model.getDescription(), Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.bodytxt.lineWidth = textWidth;
        
        // lines
        
        this._topLine = drawHorizontalLine(textWidth-30, 1, '#000', 0.5);
        this._bottomLine = drawHorizontalLine(textWidth-30, 1, '#000', 0.5);

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
        
        // awards
        
        var awardsText = (this._model.getStatus() == completedDT) ? "Awards gained" : "Potential awards";
        this.awardstxt = new createjs.Text(awardsText, "bold " + Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.awardstxt.alpha = 0.5;

        // score

        /*this.scorelabel = new createjs.Text('Score', "bold " + Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.scorelabel.lineWidth = textWidth;
        
        this.scoretxt = new createjs.Text(this._model.getScore(), Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.scoretxt.lineWidth = textWidth;*/

        // xp

        this.xptxt = new createjs.Text(this._model.getXpPoints(), Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.xptxt.lineWidth = textWidth;

        this.xplabel = new createjs.Text('XP points', "bold " + Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.xplabel.lineWidth = textWidth;
        
        // challenge

        this.challengelabel = new createjs.Text('Challenge', "bold " + Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.challengelabel.lineWidth = textWidth;
        
        this.challengetxt = new createjs.Text(this._model.getChallenge(), Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.challengetxt.lineWidth = textWidth;
        
        // badge

        this.badgelabel = new createjs.Text('Badge', "bold " + Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.badgelabel.lineWidth = textWidth;

        this.badgetxt = new createjs.Text(this._model.getBadge(), Config.getBodyFontSize() + " " + Config.getFont(), "#000");
        this.badgetxt.lineWidth = textWidth;
    };

    /**
     * Draws the task button
     */
    p.drawTaskButton = function(){

	    this._taskbtn = new createjs.Container();

	    var taskbtn = new createjs.Shape();
        taskbtn.width = 125;
        taskbtn.height = 25;
        this._taskbtn.height = 25;
        this._taskbtn.width = 125;
        taskbtn.graphics.beginFill('#cc0066').rect(0,0,taskbtn.width,taskbtn.height);
        this._taskbtn.addChild(taskbtn);
        
        var taskbtntxt = new createjs.Text('GO TO TASK', "bold 11pt " + Config.getFont(), "#fff");
        taskbtntxt.x = 6;
        taskbtntxt.y = taskbtn.height - (taskbtntxt.getMeasuredHeight() + 6);
        this._taskbtn.addChild(taskbtntxt);

        var taskbtnarrow = new createjs.Shape();
       	taskbtnarrow.graphics.beginFill('#fff').drawPolyStar(0,0,7,3,2,0);
       	taskbtnarrow.x = taskbtntxt.x + taskbtntxt.getMeasuredWidth() + 13;
       	taskbtnarrow.y = taskbtntxt.y + (taskbtntxt.getMeasuredHeight()/2);
       	this._taskbtn.addChild(taskbtnarrow);
    };
    
    p.positionComponents = function() {

        // console.log('TaskPopupView.positionDisplayComponents');

        var xPos = 0;
        var yPos = 0;
       
        var labelSpacing = 75;
        
        this._statusIcon.x = xPos;
        this._statusIcon.y = yPos + 5;
        
        this.icontxt.x = 10 + (this._statusIcon.size * 0.5);
        this.icontxt.y = yPos - (this._statusIcon.size * 0.5);

        xPos -= this._statusIcon.size;

        yPos += this.icontxt.getMeasuredHeight() + 10;

        this.titletxt.x = xPos;
        this.titletxt.y = yPos;
        
        this.titletxt_hit.x = xPos;
        this.titletxt_hit.y = yPos;

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
	        
	        this.statustxt.x = labelSpacing;
	        this.statustxt.y = yPos;

	        yPos += this.statustxt.getMeasuredHeight() + 5;
	    }

        this.completedlabel.x = xPos;
        this.completedlabel.y = yPos;
        
        this.completedtxt.x = labelSpacing;
        this.completedtxt.y = yPos;

        yPos += this.completedtxt.getMeasuredHeight() + 15;

        this._bottomLine.x = xPos;
        this._bottomLine.y = yPos;
        
        yPos += 10;

        this.awardstxt.x = xPos;
        this.awardstxt.y = yPos;
        
        yPos += this.awardstxt.getMeasuredHeight() + 10;

        /*this.scorelabel.x = xPos;
        this.scorelabel.y = yPos;
        
        this.scoretxt.x = labelSpacing;
        this.scoretxt.y = yPos;

        yPos += this.scoretxt.getMeasuredHeight() + 5;*/

        this.xplabel.x = xPos;
        this.xplabel.y = yPos;
        
        this.xptxt.x = labelSpacing;
        this.xptxt.y = yPos;

        yPos += this.xptxt.getMeasuredHeight() + 5;
       
        if(this.challengetxt.text != undefined)
        {
	        this.challengelabel.x = xPos;
	        this.challengelabel.y = yPos;
	        
	        this.challengetxt.x = labelSpacing;
	        this.challengetxt.y = yPos;
	
	        yPos += this.challengetxt.getMeasuredHeight() + 5;
        }
        
        if(this.badgetxt.text != undefined)
        {
	        this.badgelabel.x = xPos;
	        this.badgelabel.y = yPos;
	        
	        this.badgetxt.x = labelSpacing;
	        this.badgetxt.y = yPos;
	
	        yPos += this.badgetxt.getMeasuredHeight() + 5;
        }

        // some spacing for the top/bottom and button
        yPos += 20;
        
        this._taskbtn.x = this.titletxt.x;
        this._taskbtn.y = yPos;

        this.height = yPos + this._taskbtn.height + 40;
    };

    p.arrangeComponents = function(){

        // text

        this.addChild(this._statusIcon, this.icontxt, this.titletxt_hit, this.titletxt, this.bodytxt, this._topLine, this.completedtxt, this.completedlabel, this._bottomLine, this.awardstxt, this.scorelabel, this.xptxt, this.xplabel);
        
        if(this.challengetxt.text != undefined) this.addChild(this.challengetxt, this.challengelabel);
        if(this.badgetxt.text != undefined) this.addChild(this.badgetxt, this.badgelabel);
        
        //this.addChild(this.scoretxt);
        
        if(this._model.getIsOverdue()) this.addChild(this.statustxt, this. statuslabel);
        
        // buttons

        this.addChild(this._taskbtn);
    };
    
    p.setupListeners = function(){
	    
		this._taskbtn.onClick = $.proxy(this.onTaskButtonClicked, this);
		this._taskbtn.onMouseOver = function(){ $('body').removeClass('defaultCursor').addClass('pointCursor'); };
		this._taskbtn.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('defaultCursor'); };
		
		this.titletxt_hit.onClick = $.proxy(this.onTaskButtonClicked, this);
		this.titletxt_hit.onMouseOver = function(){ $('body').removeClass('defaultCursor').addClass('pointCursor'); };
		this.titletxt_hit.onMouseOut = function(){ $('body').removeClass('pointCursor').addClass('defaultCursor'); };
    };

    p.onTaskButtonClicked = function(){

        //this.onCloseButtonClicked();
        window.open(this._model.getUrl());
    };

    window.TaskPopupDisplay = TaskPopupDisplay;
}());
