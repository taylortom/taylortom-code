/**
 *
 */

(function() {

    /**
     *
     * @constructor
     */
    var ChartViewZoomOut = function(){

        this.initialize();
    };

    var p = ChartViewZoomOut.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars with object scope
    this.contentHolder;
    this.timeline;
	this._routemapSummary;
    this._viewWidth;
    this.dragArea;

    p.initialize = function(){

        this.Container_initialize();

        this.contentHolder = new createjs.Container();
        this._timelineYpos = Config.getCanvasHeight() * 0.67;
        this.timelineOffset = 20;
        this._milestoneViews = new Array();

        //alert("Chart View Zoom Out");

        this.initialiseViewStage();
        this.createMileStoneViews();
		this.redraw();

    };

    p.initialiseViewStage = function(){

        stage.x = 0;
        // set stage to match the canvas size
        stage.width = Config.getCanvasWidth();
        stage.height = Config.getCanvasHeight();
    };

    p.createMileStoneViews = function(){

        var milestones = dataManager.getMileStonesByDueDate();
        var anchorPoint = new Point(0, this._timelineYpos);
        milestones.sort(this.sortMilestonesByStatus);

        for(var i=0;i<milestones.length;i++){
        
            var mm = milestones[i];	
			var msv = new MilestoneView(mm, anchorPoint, false);
            this._milestoneViews.push(msv);
        }
    };

    p.drawTimeline = function(){

        var startPoint = new Point(this.timelineOffset,this._timelineYpos);
        var endPoint = new Point(Config.getCanvasWidth()-this.timelineOffset,this._timelineYpos);
        var radius = 12;

        this.timeline = new Timeline(startPoint,endPoint, radius);
        this.timeline.setThickness(6);
    };

    p.positionMilestoneViews = function(){

        this._milestoneViews.sort(sortViewsByStatusAndCompletedDate);
        this._milestoneViews.sort(this.sortByStackLevel);

        var startXPos = (dataManager.getNumMilestonesCompleted() > 0) ? 0 : this.timelineOffset + this.timeline.getFirstXPos();
        var position = new Point(startXPos,this.timeline.getYPos());
        var milestones = dataManager.getMileStones();
        var endXPos = this.getLastTimelinePoint();
        var firstMilestone = this._milestoneViews[0];
        var minSpacing = firstMilestone.getTimelinePointWidth()+1;
        var spacing = Math.max((endXPos - startXPos)/(this._milestoneViews.length-1), minSpacing);
        var topStackLevel = 8; // 8 is the absolute maximum height
        var numMilestonesCompleted = dataManager.getNumMilestonesCompleted();

        if(((milestones.length-numMilestonesCompleted) > topStackLevel) || (milestones.length==numMilestonesCompleted))
            lowestStartStackLevel = topStackLevel;
        else if((milestones.length-numMilestonesCompleted) < (milestones.length/2))
            lowestStartStackLevel = milestones.length-numMilestonesCompleted;
        else lowestStartStackLevel = Math.ceil(milestones.length/2) + numMilestonesCompleted;

        var maxStackLevel = (lowestStartStackLevel > topStackLevel) ? topStackLevel : lowestStartStackLevel;
        var stackLevel = (this._milestoneViews[0].getModel().getCompleted()) ? 0 : maxStackLevel;
        var prevCompleted = false;
        var newStack = false;
        var endPoint = 0;

        for(var i=0;i<this._milestoneViews.length;i++){
        
            var msv = this._milestoneViews[i];

            if(msv.getModel().getStatus()===completedDT){
            
                msv.setStackLevel(stackLevel);
                stackLevel++;
                prevCompleted = true;
            }
            else if(prevCompleted){
            
                stackLevel = maxStackLevel;
                msv.setStackLevel(stackLevel);
                stackLevel--;
                prevCompleted = false;
            }
            else{
            
                msv.setStackLevel(stackLevel);
                stackLevel--;
            }

            if(milestones[i].getStatus()===completedDT){
            
                if(i == 0){
                
                    startXPos = position.x += msv.getWidth();
                    spacing = Math.max((endXPos - startXPos)/(this._milestoneViews.length-1), minSpacing);
                }
                else{ // check for ridiculously long titles going off canvas
                
                    if((position.x-msv.getWidth()) < 0){
                    
                        var offset = position.x-msv.getWidth();
                        position.x += Math.ceil(Math.abs(offset));
                    }
                }
            }

            msv.setTimelinePoint(position);

            if(stackLevel < 0 ) {
            
                var remainder = (this._milestoneViews.length - i) - 1;
                stackLevel = Math.min(remainder, maxStackLevel);
                newStack = true;
            }
            if(stackLevel > maxStackLevel ) stackLevel = 0;

            if(newStack){
            
                position.x = endPoint - this.timeline.getFirstXPos() + 20;
                newStack = false;
            }
            else position.x += spacing;

            if((position.x +msv.getWidth()) > endPoint) endPoint = (position.x +msv.getWidth());

        }

    };

    p.sortMilestonesByStatus = function(a,b){
    
        return ((a.getStatus()===completedDT) ? -1 : ((b.getStatus())===completedDT ? 1 : 0));
    };

    /***
     * If milestones have identical statuses and completed date then need to sort further by stack level
     */
    p.sortByStackLevel = function(a,b){

        if(a.getModel().getStatus() === b.getModel().getStatus() &&
	       a.getModel().getStatus() !== completedDT && b.getModel().getStatus() !== completedDT &&
	       sameDate(a.getModel().getDueDate(), b.getModel().getDueDate())){
	               
	    	return (a.getStackLevel() < b.getStackLevel()) ? 1 : 0;
        }
    };

    p.getLastTimelinePoint = function(){
    
       var lastMilestone = this._milestoneViews[this._milestoneViews.length-1];
       var lastMileStoneModel = dataManager.getMileStones()[dataManager.getMileStones().length-1];
      
       if(lastMileStoneModel.getStatus()===completedDT) return this.timeline.getLastXpos() - this.timelineOffset;
       else return this.timeline.getLastXpos() - lastMilestone.getWidth() - 10; //this.timelineOffset;
    };
	
	p.drawRoutemapSummary = function(){

        var viewWidth = Math.max(this._viewWidth, Config.getCanvasWidth());
        var width = viewWidth - (this.timelineOffset*2);

        this._routemapSummary = new RoutemapSummary(width);
		this._routemapSummary.x = this.timelineOffset;
		this._routemapSummary.y = this._timelineYpos + 75;
    };

    p.redraw = function(){

        this.removeAllChildren();

        this.drawTimeline();

        this.positionMilestoneViews();

        this._viewWidth = this.getViewWidth();

        if(this._viewWidth > Config.getCanvasWidth()){
        
            stage.width = this._viewWidth + this.timelineOffset + (this.timeline.getRadius()*2);
            stage.height = Config.getCanvasHeight();

            this.resizeTimelineToFit();

            if('ontouchstart' in document.documentElement || (window.navigator && window.navigator.msMaxTouchPoints > 0)){
                createjs.Touch.enable(stage);
                document.getElementById('canvas').addEventListener("touchstart", this.onTouchStart, false);
            }
            this.initialiseDragArea();
        }
        else{
            Config.setCanvasDraggable(false);
        }

        this.drawRoutemapSummary();

        this.arrangeComponents();

        update = true;

    };

    p.arrangeComponents = function(){

        if(this._viewWidth > Config.getCanvasWidth()) this.contentHolder.addChild(this.dragArea);
        this.contentHolder.addChild(this.timeline);
        this.contentHolder.addChild(this._routemapSummary);

        this.attachMilestoneViews();
        
        this.addChild(this.contentHolder);
        
        this.addChild(this.scrollbar);
    };

    p.attachMilestoneViews = function(){

        for(var i = 0; i < this._milestoneViews.length; i++){
        
            var msv = this._milestoneViews[i];
            this.contentHolder.addChild(msv);
        }
    };

    p.getViewWidth = function(){
    
        var endPoint = Config.getCanvasWidth();

        for(var i = 0; i < this._milestoneViews.length; i++){
	
	        var msv = this._milestoneViews[i];
        	if((msv.getTimelineXPos() + msv.getEndPoint()) > endPoint) endPoint = (msv.getTimelineXPos() + msv.getEndPoint());
        }

        return endPoint;
    };

    p.resizeTimelineToFit = function(){
    
        this.timeline.setWidth(this._viewWidth);
    };

    p.initialiseDragArea = function(){

        Config.setCanvasDraggable(true);
    
        stage.height = Config.getStageHeight();
        var stageWidth = stage.width;

        this.dragArea = new createjs.Container();
        this.dragArea.width = stageWidth;
        this.dragArea.height = Config.getStageHeight();
        
        // whether the mouse is on the canvas
        var onCanvas = false;

        var dragShape = new createjs.Shape();
        dragShape.graphics.beginFill("#fff")
            .rect(-1000,0,this.dragArea.width+1000,this.dragArea.height);
        this.dragArea.addChild(dragShape);
        
        this.scrollbar = new Scrollbar(this.timeline);
        this.scrollbar.setTimelineOffset(this.timelineOffset*2);

        /**
         * Listen for click events
         */
        this.dragArea.onPress = function(evt) {

            var contentHolder = stage.children[0].contentHolder;
            var dragArea = stage.children[0].dragArea;
            var scrollbar = stage.children[0].scrollbar;
            var offset = { x:dragArea.x-evt.stageX };
            var maxDragX = dragArea.width - Config.getCanvasWidth();
            var startX = contentHolder.x;

            $('body').removeClass('overCursor').addClass('dragCursor');

            evt.onMouseMove = function(ev){

                 if(!scrollbar.getEnabled()) scrollbar.enable();
                scrollbar.update();

                contentHolder.x = startX + ev.stageX + offset.x;

                if(contentHolder.x > 0) contentHolder.x = 0;
                if(contentHolder.x <= (maxDragX * -1)) contentHolder.x = (maxDragX * -1);

                update = true;
            };
            
            evt.onMouseUp = function(ev)
            {
                $('body').removeClass('dragCursor').addClass('overCursor');
            	scrollbar.disable(); 
            };
         };
         
         this.dragArea.onMouseOver = function() {

             $('body').removeClass('defaultCursor').addClass('overCursor');
        	onCanvas = true;
        };        	
        this.dragArea.onMouseOut = function() {

            $('body').removeClass('dragCursor').removeClass('overCursor').addClass('defaultCursor');
        	onCanvas = false;
        };
    };

    p.onTouchStart =  function(e){
        e.preventDefault();
    };

    window.ChartViewZoomOut = ChartViewZoomOut;

}());