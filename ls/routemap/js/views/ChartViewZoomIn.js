/**
 *
 */

(function() {

    /**
     *
     * @constructor
     */
    var ChartViewZoomIn = function(){

        this.initialize();
    };

    // set the 'class'
    var p = ChartViewZoomIn.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    // declare vars with object scope that are initialised later
    this.contentHolder;
    this.dragArea;
	this.openPopup = undefined;
	
    p.initialize = function(){

        //console.log("ChartView::initialize");
        this.Container_initialize();

        this.initialiseContentHolder();
        
        this.dragPadding = 0;
        this.timelineOffset = 200;
        this.timeline = new Timeline(new Point(this.timelineOffset,300),new Point(150,300), 20);
        this.calendarView = new CalendarView(this.timeline.getFirstXPos());
        this.dateline = new Dateline(this.calendarView.getLastXPos());

        this.completeViews = new Array();
        this.incompleteViews = new Array();

        // this._timer = -1;

        this.createMileStoneViews();
        //this.initialiseDragArea();
        if('ontouchstart' in document.documentElement || (window.navigator && window.navigator.msMaxTouchPoints > 0)){
            createjs.Touch.enable(stage);
            document.getElementById('canvas').addEventListener("touchstart", this.onTouchStart, false);
          }
        this.initialiseDragArea();

        this.viewToday();
        this.arrangeComponents();
        this.initialiseScrollbar();
    };

    /**
     * Creates the draggable background
     */
    p.initialiseDragArea = function(){

        Config.setCanvasDraggable(true);

        stage.height = Config.getStageHeight();
        stage.width = this.timeline.getWidth() + this.timelineOffset*2;
        var stageWidth = stage.width;

        this.dragArea = new createjs.Container();
        this.dragArea.width = stageWidth;
        this.dragArea.height = Config.getStageHeight();
        
        // whether the mouse is on the canvas
        //var onCanvas = false;

        var dragShape = new createjs.Shape();
        dragShape.graphics.beginFill("#fff")
            .rect(-1000,0,this.dragArea.width+1000,this.dragArea.height);
        this.dragArea.addChild(dragShape);

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

                if(contentHolder.x > stage.children[0].dragPadding) contentHolder.x = stage.children[0].dragPadding;
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
        	//onCanvas = true;
        };        	
        this.dragArea.onMouseOut = function() {
            $('body').removeClass('dragCursor').removeClass('overCursor').addClass('defaultCursor');
        	//onCanvas = false;
        };        	
    };


    p.onTouchStart =  function(e){
        e.preventDefault();
    };

    p.initialiseContentHolder = function(){

        // console.log("ChartView::initialiseContentHolder");

        this.contentHolder = new createjs.Container();
        this.contentHolder.x = 0;
        this.contentHolder.width = timelineWidth;
        this.contentHolder.height = Config.getStageHeight();
    };

    p.initialiseScrollbar = function(){

        this.scrollbar = new Scrollbar(this.timeline);
        this.scrollbar.setTimelineOffset(this.timelineOffset*2);
        this.addChild(this.scrollbar);
    };
    
    p.resetCanvas = function() {
    
    	stage.children[0].dragPadding = 0;
        if(stage.children[0].contentHolder.x > 0) stage.children[0].contentHolder.x = 0;  
    };

    /**
     * Moves the view to be centred on the dateline
     */
    p.viewToday = function() {

        var viewXPos = (this.dateline.getXPos() - Config.getStageWidth()/2)*-1;
        this.contentHolder.x = viewXPos;
    };

    p.createMileStoneViews = function(){

        var mileStones = dataManager.getMileStones();

        for(var i = 0; i < mileStones.length; i++) {

            var mm = mileStones[i];
            var mv = new MilestoneView(mm, new Point(0,this.timeline.getYPos()), true);

            if(mm.getStatus() == completedDT) this.completeViews.push(mv);
            else this.incompleteViews.push(mv);

            // populate the completed tasks array
            var completeTasks = mv._completeTaskViews;
            for(var k = 0; k < completeTasks.length; k++)
                this.completeViews.push(completeTasks[k]);
        }

        this.positionIncompleteViews();
        this.positionCompleteViews();

        // update the stage
        update = true;
    };

    p.attachViews = function() {

        var allViews = this.incompleteViews.concat(this.completeViews);

        for(var i = 0; i < allViews.length; i++)
            this.contentHolder.addChild(allViews[i]);
    };

    /**
     * Positions the complete milestones/tasks by completed date along the timeline
     */
    p.positionCompleteViews = function(){

        // console.log('ChartViewZoomIn.positionCompleteViews');

        this.replaceDuplicateViews();

        var startDate = dataManager.getStartDate();
        var today = new Date();
        var calendarLength = (today-startDate);

        for(var i = 0; i < this.completeViews.length; i++) {

            var view = this.completeViews[i];

            var completedDate = getCompletedDateForView(view);
            var offset = (completedDate-startDate);

            var newX = this.timeline.getFirstXPos()+(this.calendarView.getWidth()*(offset/calendarLength));

            // Make sure the views aren't overlapping
            if(i > 0) {

               var prevView = this.completeViews[i-1];

                var spacing = (view instanceof MilestoneView) ? 15 : 8;
                spacing += (prevView instanceof MilestoneView) ? 15 : 8;

                if(newX < (prevView._anchorPoint.x + spacing)) newX = (prevView._anchorPoint.x + spacing);
            }

            view.setTimelineXPos(newX);
        }

        /**
         * do a final sweep to ensure the tasks/milestones
         * fall into the correct month after spacing
         */
        this.checkViewPositions();

        // stack the groups (splitting up into sub-groups if appropriate)
        var viewGroups = this.groupDates();
        for(var i = viewGroups.length-1; i >= 0; i--) this.stackGroup(viewGroups[i]);
    };

    /**
     * Evenly spaces the incomplete milestones along the timeline
     */
    p.positionIncompleteViews = function(){

        // console.log('ChartViewZoomIn.positionMilestones: ' + this.overdueViews[this.overdueViews.length-1]._anchorPoint.x);

        // sort the list
        this.incompleteViews.sort(sortViewsByDueDate);

        var SPACING = 25;
        var xPos = this.dateline.getXPos() + SPACING;

        for(var i = 0; i < this.incompleteViews.length; i++) {

            var mv = this.incompleteViews[i];

            if(i == 0) xPos += mv.getTimelineSpace();
            else {

                var prevMv = this.incompleteViews[i-1];
                xPos += prevMv.getTimelineGap() + mv.getTimelineSpace();
            }

            mv.setTimelineXPos(xPos);
        }

        this.timeline.setWidth(xPos-this.timeline._startPoint.x + this.timeline.getEndSpacing() + 150);
    };

    /**
     * Looks for any tasks/milestones occurring on the
     * same day and replaces with a stacked task
     */
    p.replaceDuplicateViews = function() {

        // make sure the list's sorted
        this.completeViews.sort(sortViewsByCompletedDate);

        var duplicates = findDuplicates(this.completeViews);
        if(duplicates) {

            for(var i = 0; i < duplicates.length; i++) {

                // remove the old views
                for(var j = 0; j < duplicates[i].length; j++)
                    this.completeViews.splice(this.completeViews.indexOf(duplicates[i][j]), 1);

                if(duplicates[i][0] instanceof MilestoneView) {

                    // add new StackedMileStoneView
                    var smv = new StackedMilestoneView(duplicates[i],new Point(0, this.timeline.getYPos()));
                    this.completeViews.push(smv);
                }
                else {

                    // add the new StackedTaskView
                    var stv = new StackedTaskView(duplicates[i],new Point(0, this.timeline.getYPos()));
                    this.completeViews.push(stv);
                }
            }
        }

        // re-sort to take into account the new stacked views
        this.completeViews.sort(sortViewsByCompletedDate);
    };

    /**
     * Looks for any tasks/milestones which are closely grouped together
     * and group them accordingly
     */
    p.groupDates = function() {

        var groups = new Array();
        var tempGroup = new Array();
        var date;

        // make sure it's sorted first
        this.completeViews.sort(sortViewsByCompletedDate);

        for(var i = this.completeViews.length-1; i >= 0; i--) {

            var view = this.completeViews[i];

            var tempDate = getCompletedDateForView(view);
            var offsetDate = new Date(tempDate);
            offsetDate.setDate(offsetDate.getDate()+30);

            if(date == undefined || offsetDate < date) {

                if(tempGroup.length > 0) groups.push(tempGroup);
                tempGroup = new Array();
            }

            tempGroup.push(view);
            date = tempDate;
        }

        // add the last temp group if applicable
        if(tempGroup.length > 0) groups.push(tempGroup);

        return this.compactGroups(groups);
    };

    /**
     * Loops through the grouped views, and further
     * groups them to 'fill up' the stack slots
     * @param groups
     * @return Grouped items
     */
    p.compactGroups = function(groups) {

        var copy = groups.slice(0).reverse();
        var compactedGroups = new Array();
        tempGroup = new Array();
        var currentGroupSize = 0;

        for(var i = 0; i < copy.length; i++) {

            var group = copy[i].reverse();
            currentGroupSize += group.length;

            var createNewGroup = (currentGroupSize > Config.getMaxStackHeight());

            // check to see if there's a gap of 45 days between groups
            if(!createNewGroup && i > 0) {

                var currentCompletedDate = getCompletedDateForView(group[0]);
                var prevCompletedDate = getCompletedDateForView(copy[i-1][copy[i-1].length-1]);
                // calculate the offset date
                prevCompletedDate.setDate(prevCompletedDate.getDate()+45);

                if(currentCompletedDate > prevCompletedDate) createNewGroup = true;
            }

            if(createNewGroup) {

                currentGroupSize = 0;
                compactedGroups.push(tempGroup);

                tempGroup = new Array();
            }

            for(var j = 0; j < group.length; j++) {

                tempGroup.push(group[j]);
            }
        }

        // add the last group
        compactedGroups.push(tempGroup);

        return compactedGroups;
    };

    p.stackGroup = function(group) {

        // console.log('ChartViewZoomIn.stackGroup: [' + group.length + ']');

        var STACK_LABEL_SIZE = 0.6;
        var milestones = new Array();
        var tasks = new Array();
        var taskCount = 0;
        var milestoneCount = 0;

        // count the number of tasks/milestones in the group and set stack levels accordingly
        for(var i = 0; i < group.length; i++) {

            if(group[i] instanceof MilestoneView){

                milestones.push(group[i]);
                milestoneCount++;
            }
            else if(group[i] instanceof StackedMilestoneView) {

                milestones.push(group[i]);
                milestoneCount += (group[i]._label._labelCount);
            }
            else if(group[i] instanceof TaskView) {

                tasks.push(group[i]);
                taskCount++;
            }
            else if(group[i] instanceof StackedTaskView) {

                tasks.push(group[i]);
                taskCount += (group[i]._label._labelCount);
            }
        }

        var taskStackLevel = 0;
        var mileStonetackLevel = 0;

        if(milestoneCount >= Config.getMaxStackHeight() && !this.splitStack(milestones));
        else if(taskCount >= Config.getMaxStackHeight() && !this.splitStack(tasks));
        else {

            for(var i = 0; i < group.length; i++) {

                var view = group[i];

                if(view instanceof MilestoneView) view._label.setStackLevel(++mileStonetackLevel);
                else if(view instanceof TaskView) view._label.setStackLevel(++taskStackLevel);
                else if(view instanceof StackedMilestoneView) {

                    view._label.setStackLevel(++mileStonetackLevel);
                    mileStonetackLevel += (view._label._labelCount-1)*STACK_LABEL_SIZE;
                }
                else if(view instanceof StackedTaskView) {

                    view._label.setStackLevel(++taskStackLevel);
                    taskStackLevel += (view._label._labelCount-1)*STACK_LABEL_SIZE;
                }
            }
        }
    };

    /**
     * Splits the passed stack into two smaller ones
     * at the view with the biggest gap
     *
     * Recursively calls stackGroup until the sub-stacks
     * are suitable small.
     *
     * return whether the method was successful
     */
    p.splitStack = function(stack) {

        // console.log('ChartViewZoomIn.splitStack: ' + stack.length);

        var biggestGap = 0;
        var index = 0;

        for(var i = 1; i < stack.length; i++) {

            var gap = (stack[i]._anchorPoint.x - stack[i-1]._anchorPoint.x);

            if(gap > biggestGap) {

                biggestGap = gap;
                index = i;
            }
        }

        var newStack1 = stack.slice(index, stack.length);
        var newStack2 = stack.slice(0, index);

        if(biggestGap > this.calendarView._monthColumns[0].getWidth()*2) return false;
        else
        {
            this.stackGroup(newStack1);
            this.stackGroup(newStack2);
            return true;
        }
    };

    /**
     * Makes sure all views are positioned within the
     * bounds of their completed month
     */
    p.checkViewPositions = function() {

        var shiftRight = false;

        for(var i = this.completeViews.length-1; i >= 0; i--) {

            var view = this.completeViews[i];
            var nextView = this.completeViews[i+1];
            var completedDate = getCompletedDateForView(view);

            // if the points aren't overlapping, no point moving
            if(nextView != undefined && (nextView._anchorPoint.x - view._anchorPoint.x) > (nextView._label._timelinePoint.size)+(view._label._timelinePoint.size))
                shiftRight = false;

            // move the current view to the next available xPos
            if(shiftRight) view.setTimelineXPos(nextView._anchorPoint.x-(nextView._label._timelinePoint.size)-(view._label._timelinePoint.size));

            // push any views which are out of the month back in...
            if(view._anchorPoint.x > this.calendarView.getEndPointForDate(completedDate)) {

                if(i == 0) view.setTimelineXPos(this.calendarView.getEndPointForDate(completedDate));
                else view.setTimelineXPos(this.calendarView.getEndPointForDate(completedDate));

                shiftRight = true;
            }

            // push any views which are out of the month back in...
            if(view._anchorPoint.x < this.calendarView.getStartPointForDate(completedDate)) {

                var shiftLeft = true;

                view.setTimelineXPos(this.calendarView.getStartPointForDate(completedDate));

                for(var j = i; j < this.completeViews.length; j++) {

                    if(j == 0) continue;

                    var v1 = this.completeViews[j-1];
                    var v1TimelinePointSize = v1._label._timelinePoint.size;
                    var v2 = this.completeViews[j];
                    var v2TimelinePointSize = v2._label._timelinePoint.size;

                    if((v1._anchorPoint.x + (v1TimelinePointSize/2+3)) > (v2._anchorPoint.x - (v2TimelinePointSize/2+3)))
                        v2.setTimelineXPos((v1._anchorPoint.x + (v1TimelinePointSize/2+3)) + (v2TimelinePointSize/2+3));
                }
            }
        }
    }

    /**
     * Makes sure the components are layered correctly
     */
    p.arrangeComponents = function(){

        this.contentHolder.addChild(this.dragArea);
        this.contentHolder.addChild(this.calendarView);
        this.contentHolder.addChild(this.timeline);
        this.attachViews();
        this.contentHolder.addChild(this.dateline);
        this.addChild(this.contentHolder);
    };

    window.ChartViewZoomIn = ChartViewZoomIn;
})();
