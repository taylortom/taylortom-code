
(function(){

    var TaskSummaryView = function(model,anchorPoint){

        this.initialize(model,anchorPoint);
    };

    // set the 'class'
    var p = TaskSummaryView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // vars with object scope
    this._circle;

    p.initialize = function(model,anchorPoint){

        // console.log('TaskSummaryView.initialize');
        this.Container_initialize();
        this._model = model;
        //this._anchorPoint = anchorPoint;
        this._radius = 6;
        this._lineThickness = 3;
        this.setColour();

        this.redraw();
    };

    p.setColour = function(){

        switch(this._model.getStatus()){

            case notStartedDT:
                this._colour = Config.getNotStartedColour();
                break;
            case inProgressDT:
                this._colour = Config.getStartedColour();
                break;
            case completedDT:
                this._colour = Config.getCompletedColour();
                break;
            case overdueDT:
                this._colour = Config.getOverdueColour();
                break;
            default:
                if(window.console && window.console.log) console.log('TaskSummaryView.setStatus: unknown progress (' + this._model.getStatus() + ')');
        }
    };

    p.drawCircle = function(){
       // if(console) console.log("TaskSummaryView.drawCircle");
        this._circle = new createjs.Shape();
        this._circle.graphics.beginFill(this._colour)
            .setStrokeStyle(this._lineThickness)
            .beginStroke ('#fff')
            .drawCircle(0,0,this._radius)
            .endStroke();

        this.addChild(this._circle);
    };

    /**
     * Re-renders all display objects
     */
    p.redraw = function(){

        // make sure we're not drawing objects again
        this.removeAllChildren();

        this.drawCircle();

        update = true;
    };

    /**
     * Allows the task to be moved along the timeline
     * @param newPoint
     */
    /*p.setTimelineXpos = function(newX){
        this.x = newX;
        this.redraw();
    };*/

    p.getWidth = function(){
        return (this._radius*2) + this._lineThickness;
    };

    window.TaskSummaryView = TaskSummaryView;
}());
