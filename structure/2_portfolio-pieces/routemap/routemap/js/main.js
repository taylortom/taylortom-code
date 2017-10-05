// all globals declared here
//var currentView;
var currentViewType;
var dataManager;
var update = true;

var stage;
//var dragArea;

var timelineWidth = 3500;

function init(view){

    initialiseStage();
    initialiseCursor();

    currentViewType = view;

    //loadJSONData();
};

function initialiseCursor(){

	// don't use the ibeam on drag
	canvas.onselectstart = function () { return false; } // IE
	canvas.onmousedown = function () { return false; } // Web Kit
};

function initialiseStage(){

    var canvas = document.getElementById('canvas');

    // Check the element is in the DOM and the browser supports canvas
    if(canvas.getContext) {
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(30);
    }

};

function loadJSONData(){
   $.getJSON('routemap.json', onJSONLoaded);
};

function onJSONLoaded(json){

    //console.log("main.onJSONLoaded");

    dataManager = new DataManager(json.routemap.start_time, json.routemap.end_time);

    for(var i = 0; i < json.routemap.milestones.length; i++){

        var milestone = json.routemap.milestones[i];
        var msm = new MilestoneModel(milestone);
        dataManager.addMileStone(msm);
    }

    dataManager.calculateLearningHours();

    currentView = getView(currentViewType);
    stage.addChild(currentView);

    createjs.Ticker.addListener(window);

    //if(window.console && window.console.log) outputDataToConsole();
};

function refreshCanvasView(type){

    // console.log("refreshCanvasView: " + type);

    stage.clear();
    stage.removeChild(currentView);
    currentView = null;

    currentViewType = type;
    currentView = getView(type);
    stage.addChild(currentView);
}

var getView = (function(type){

    switch(type){

        case "chart-zoom-in":
            return new ChartViewZoomIn();
        case "chart-zoom-out":
            return new ChartViewZoomOut();
        case "chart-zoom-centre":
            return new ChartViewZoomCentre();
        case "list":
            return new ListView();
        default:
            console.error("Error: Invalid view type requested");
    }
});

function outputDataToConsole(){

    var mileStones = dataManager.getMileStones();

    console.log("RouteMap start date " + dataManager.getStartDate());
    console.log("RouteMap end date " + dataManager.getEndDate());
    console.log("Total learning hours: " + dataManager.getLearningHours());

    for(var i = 0; i < mileStones.length; i++){

        var ms = mileStones[i];
        console.log(ms.getName() + " has " + ms.getLearningHours() + " hours");
        console.log(ms.getStatus());
        console.log(ms.getDueDate());
        console.log(ms.getCompleted());
        if(ms.getCompleted()) console.log(ms.getCompletedDate());

        var tasks = ms.getTasks();
        for(var j = 0; j < tasks.length; j++){

            var t = tasks[j];
            console.log(t.getName());
            console.log(t.getDescription());
            console.log(t.getScore());
           // console.log(t.getUnitRef());
            console.log(t.getXpPoints());
            console.log(t.getLearningHours());
            console.log(t.getDueDate());
            console.log(t.getCompletedDate());
            console.log(t.getType());
            console.log(t.getStatus());
            console.log(t.getUrl());
        }
    }
};

function tick() {

    if(update){

       // console.log("Update the Stage")
	   stage.update();
       update = false;
    }
};