
(function() {

    /**
     *
     * @constructor
     */
    var ChartViewZoomCentre = function(){

        this.initialize();
    };

    var p = ChartViewZoomCentre.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // declare vars with object scope that are initialised later
    this.contentHolder;
    this.dragArea;
    this.timeline;

    p.initialize = function(){
        this.Container_initialize();

        this.contentHolder = new createjs.Container();

        this.timelineOffset = 200;

        this._timelineYpos = Config.getCanvasHeight() * 0.67;
        this._canvasBuffer = 30;

        this._milestoneSummaryViews = new Array();
        this.createMileStoneSummaryViews();


        this.redraw();
    };

    p.drawTimeline = function(){

        var startPoint = new Point(this._canvasBuffer,this._timelineYpos);
        var endPoint = new Point(Config.getCanvasWidth()-this._canvasBuffer,this._timelineYpos);
        var radius = 16;

        this.timeline = new Timeline(startPoint,endPoint, radius);
        this.timeline.setThickness(7);
    };

    p.createMileStoneSummaryViews = function(){
	
        //if(console) console.log("ChartViewZoomCentre.createMileStoneSummaryViews");

        var milestones = dataManager.getMileStonesByDueDate();
        milestones.sort(sortMilestonesByStatus);
        var anchorPoint = new Point(0, this._timelineYpos);

       for(var i = 0; i < milestones.length; i++) {

            var mm = milestones[i];
            //if(console) console.log("mm.getName(): " + mm.getName());
            var msv = new MilestoneSummaryView(mm, anchorPoint,true);
            this._milestoneSummaryViews.push(msv);
        }

    };

    p.positionViews = function(){
        var xpos = (dataManager.getNumMilestonesCompleted() > 0) ? 0 : this._canvasBuffer + this.timeline.getFirstXPos();

        var buffer = 100;
        var spacing = 150;

        this._milestoneSummaryViews.sort(sortViewsByStatusAndCompletedDate);

        var maxStackLevel = 8; // 8 is the absolute maximum height
        var stackLevel = (this._milestoneSummaryViews[0].getModel().getCompleted()) ? 0 : 5;

        for(var i = 0; i < this._milestoneSummaryViews.length; i++) 
        {

            var msv = this._milestoneSummaryViews[i];

            if(msv.getModel().getStatus()===completedDT){
                msv.setStackLevel(stackLevel);
                stackLevel++;
               // prevCompleted = true;
            }
            else if(msv.getModel().getStatus()===overdueDT){
                // stackLevel = maxStackLevel;
                msv.setStackLevel(5);
                //stackLevel--;
                //prevCompleted = false;
            }
            else{
                msv.setStackLevel(3);
                //stackLevel--;
            }

            if(stackLevel < 0) stackLevel = maxStackLevel;
            if(stackLevel > maxStackLevel ) stackLevel = 0;

            if(msv.getModel().getStatus()===completedDT){
                if(i==0){
                    xpos += Math.max(msv.getWidth(), msv.getTasksWidth());
                }else{ // check for ridiculously long titles going off canvas
                    if((xpos-msv.getWidth()) < 0){
                        var offset = xpos-msv.getWidth();
                        //if(console) console.log("label off canvas by: " + offset);
                        xpos += Math.ceil(Math.abs(offset)) + 10;
                    }
                }
            }

            msv.x = xpos;
            if(msv.getModel().getStatus()===completedDT){
                xpos += Math.max((msv.getTasksWidth() + buffer), spacing); // set spacing to a min of 150
            }else{
                xpos += msv.getWidth();
            }
        }

    };

    p.attachViews = function() {

        //if(console) console.log("ChartViewZoomCentre.attachViews");

        for(var i = 0; i < this._milestoneSummaryViews.length; i++){

            var msv = this._milestoneSummaryViews[i];
            this.contentHolder.addChild(msv);
        }
    };

    p.redraw = function(){
        this.removeAllChildren();

        this.drawTimeline();

        this.positionViews();

        if(this.getViewWidth() > Config.getCanvasWidth()){
            stage.width = this.getViewWidth() + this._canvasBuffer + (this.timeline.getRadius()*2);
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

        this.arrangeComponents();

        update = true;
    };

    /**
     * Makes sure the components are layered correctly
     */
    p.arrangeComponents = function(){
        //if(console) console.log("ChartViewZoomCentre.arrangeComponents");

        this.contentHolder.addChild(this.dragArea);
        this.contentHolder.addChild(this.timeline);
        this.attachViews();

       this.addChild(this.contentHolder);
    };

    p.getViewWidth = function(){
        lastMilestone = this._milestoneSummaryViews[this._milestoneSummaryViews.length-1];
        return (lastMilestone.x + lastMilestone.getEndPoint());
    };

    p.resizeTimelineToFit = function(){
        this.timeline.setWidth(this.getViewWidth());
    };

    /**
     * Creates the draggable background
     */
    p.initialiseDragArea = function(){

        //if(console) console.log('ChartViewZoomCentre.initialiseDragArea');

        var stageWidth = stage.width;

        this.dragArea = new createjs.Container();
        this.dragArea.width = stageWidth;
        this.dragArea.height = Config.getStageHeight();

        // whether the mouse is on the canvas
        var onCanvas = false;

        var dragShape = new createjs.Shape();
        dragShape.graphics.beginFill("#fff")
            .rect(0,0,this.dragArea.width,this.dragArea.height);
        this.dragArea.addChild(dragShape);

        /**
         * Listen for click events
         */

        this.dragArea.onPress = function(evt) {

            var contentHolder = stage.children[0].contentHolder;
            var dragArea = stage.children[0].dragArea;
            var offset = {x:dragArea.x-evt.stageX};
            var maxDragX = dragArea.width - Config.getCanvasWidth();

            var startX = contentHolder.x;

            $('body').removeClass('overCursor').addClass('dragCursor');

            evt.onMouseMove = function(ev){

                contentHolder.x = startX + ev.stageX+offset.x;

                if(contentHolder.x > 0){
                    contentHolder.x = 0;
                 }

                if(contentHolder.x <= (maxDragX*-1)){
                   contentHolder.x = (maxDragX*-1);
                }

                update = true;
            };

            evt.onMouseUp = function(ev)
            {
                $('body').removeClass('dragCursor').addClass('overCursor');
                //scrollbar.disable();
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

    window.ChartViewZoomCentre = ChartViewZoomCentre;

}());