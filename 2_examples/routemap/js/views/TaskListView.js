
(function(){

    var TaskListView = function(model, showBG){

        this.initialize(model, showBG);
    };

    // set the 'class'
    var p = TaskListView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars with object scope
	this.bg;
	this.bgHeight;
	this.tasktxt;

    p.initialize = function(model, showBG){

       // console.log('TaskListView.initialize');

        this.Container_initialize();

        this._model = model;
        this._showBG = showBG;
        if(!this._showBG && this._model.getStatus()===overdueDT) this._showBG = true;
		this.buffer = 8;
		this.minHeight = 21;
		
		this.redraw();
    };

    p.displayText = function(){
        var xpos = 5;
        var ypos = 5;
		
		var textColour = (this._model.getStatus()===overdueDT) ? Config.getListViewOverdueColour() : Config.getDefaultListViewTaskColour();

        // console.log("Adding task: "+ this._model.getName());
        this.tasktxt = new createjs.Text(this._model.getName(), Config.getTaskListViewFontSize() + " " + Config.getFont(), textColour);
        this.tasktxt.x = xpos;
        this.tasktxt.y = ypos;
		//this.tasktxt.maxWidth = 175;
		this.tasktxt.lineWidth = 175;
        this.addChild(this.tasktxt);
		
		//console.log("this.tasktxt.textBaseline: " + this.tasktxt.textBaseline );// always returns null

       xpos += 180;
       var dueDateText =  $.datepicker.formatDate('d M y', this._model.getDueDate());
       var duetxt = new createjs.Text(dueDateText, Config.getTaskListViewFontSize() + " " + Config.getFont(), textColour);
       duetxt.x = xpos;
       duetxt.y = ypos;
       this.addChild(duetxt);

        xpos += 90;

        var completedText = (this._model.getCompletedDate() != null) ?  $.datepicker.formatDate('d M y', this._model.getCompletedDate()) : "--";
        var completedtxt = new createjs.Text(completedText, Config.getTaskListViewFontSize() + " " + Config.getFont(), textColour);
        completedtxt.x = xpos;
        completedtxt.y = ypos;
        this.addChild(completedtxt);
        xpos += 110;

        var typeText = this._model.getFullTypeName();
        var typetxt = new createjs.Text(typeText, Config.getTaskListViewFontSize() + " " + Config.getFont(), textColour);
        typetxt.x = xpos;
        typetxt.y = ypos;
        this.addChild(typetxt);
		
		if(this._model.getStatus()===inProgressDT || this._model.getStatus()===completedDT){
			textColour = (this._model.getStatus()===inProgressDT) ? Config.getStartedColour() : Config.getCompletedColour();
		}				

        xpos += 100;
        var statusText = this._model.getStatus();
        var statustxt = new createjs.Text(statusText, Config.getTaskListViewFontSize() + " " + Config.getFont(), textColour);
        statustxt.x = xpos;
        statustxt.y = ypos;
        this.addChild(statustxt);
    };
	
	p.addBackground = function(){
		this.bg = new createjs.Shape();
		this.bg.y = 0;
		this.addChild(this.bg);
		
	};
	
	p.drawBackground = function(){
		
		//console.log(this.tasktxt.text + " text height is: " + this.tasktxt.getMeasuredLineHeight());
		//console.log("lineHeight: " + this.tasktxt.lineHeight ); // always returns null
		
		this.bgHeight = Math.max(this.tasktxt.getMeasuredHeight() + this.buffer, this.minHeight);
		var bgColour = (this._model.getStatus()===overdueDT) ? Config.getOverdueColour() : "#ccc";
		
		var width = Config.getCanvasWidth() - 210;
		this.bg.graphics.beginFill(bgColour).drawRect(0,0, width, this.bgHeight).endFill();		
	};

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();
		
		if(this._showBG) this.addBackground();
		
		this.displayText();
		
		if(this._showBG) this.drawBackground();
		
        update = true;
    };
	
	p.getHeight = function(){
		if(this._showBG){
			return this.bgHeight;
		}
		else{
			return Math.max(this.tasktxt.getMeasuredHeight() + this.buffer, this.minHeight);
		}		
	};

    window.TaskListView = TaskListView;
}());