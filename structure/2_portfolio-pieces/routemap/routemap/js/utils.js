function getWeekDay(index){

	var days = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[index];
}

function getStatusAsString(status){
	
	switch(status) {
	
		case 0:
			return "Not Started";
			break;
		case 1:
			return "In Progress";
			break;
		case 2:
			return "Completed";
			break;
		default:
			if(window.console && window.console.log) console.log("utils.getStatusAsString: Error, do not recognise status '" + status + "'");
	}
}

function getMonthName(index){
	
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months[index];
}

function getDateSuffix(day){

	var suffix = "";

	switch(day) {
	
		case 1:
		case 21:
		case 31:
			suffix = "st";
			break;
		case 2:
		case 22:
			suffix = "nd";
			break;
		case 3:
		case 23:
			suffix = "rd";
			break;
		default:
			suffix = "th";
	}
	
	return suffix;
}

function getCompletedDateForView(view) {

	var date;

	if(view instanceof MilestoneView) date = view._model.getSpacedCompletedDate();
	else if(view instanceof StackedTaskView) date = view.getCompletedDate();
	else if(view instanceof StackedMilestoneView) date = view._models[0].getSpacedCompletedDate();
	else date = view._model.getCompletedDate();

	return date;
}

function getNameForView(view) {

	var name;

	if(view instanceof MilestoneView) name = view._model.getName();
	else if(view instanceof StackedTaskView) name = view._models[0].getName();
	else if(view instanceof StackedMilestoneView) name = view._models[0].getName();
	else name = view._model.getName();

	return name;
}

function sortModelsByStatusAndCompletedDate(a,b){
	
	if(a.getStatus() === completedDT && b.getStatus() === completedDT)
		return sortModelsByCompletedDate(a,b);
	else if(a.getStatus() === completedDT) 
		return -1;
	else if(b.getStatus() === completedDT) 
		return 1;
	else return sortModelsByDueDate(a,b);
}

function sortModelsByDueDate(a,b){

	var aDueDate = a.getDueDate();
	var bDueDate = b.getDueDate();

	if(aDueDate == undefined) return 1;
	else if(bDueDate == undefined) return -1;
	else if(aDueDate < bDueDate) return -1;
	else if(aDueDate == bDueDate)
	{
		// todo: if task belongs to milestone, return task first
		return 0;
	}
	else return 1;
}

function sortModelsByCompletedDate(a,b){

	var aCompletedDate = a.getCompletedDate();
	var bCompletedDate = b.getCompletedDate();

	if(aCompletedDate < bCompletedDate) return -1;
	else if(aCompletedDate == bCompletedDate) return 0;
	else return 1;
}

function sortMilestonesByStatus(a,b){

	return ((a.getStatus()===completedDT) ? -1 : ((b.getStatus())===completedDT ? 1 : 0));
}

function sortViewsByReverseStatus(a,b){
	
	return ((a._model.getStatus()===completedDT) ? 1 : ((b._model.getStatus())===completedDT ? -1 : 0));
}


function sortViewsByStatusAndCompletedDate(a,b){
	
	if(a.getModel().getStatus()===completedDT && b.getModel().getStatus()===completedDT)
		return sortViewsByCompletedDate(a,b);
	else if(a.getModel().getStatus()===completedDT) 
		return -1;
	else if(b.getModel().getStatus()===completedDT) 
		return 1;
	else return sortViewsByDueDate(a,b);
}

function sortViewsByDueDate(a,b){

	var aDueDate = a._model.getDueDate();
	var bDueDate = b._model.getDueDate();

	if(aDueDate == undefined) return 1;
	else if(bDueDate == undefined) return -1;
	else if(aDueDate < bDueDate) return -1;
	else if(aDueDate == bDueDate)
	{
		// todo: if task belongs to milestone, return task first
		return 0;
	}
	else return 1;
}

function sortViewsByCompletedDate(a,b){

	var aCompletedDate = (a instanceof StackedTaskView || a instanceof StackedMilestoneView) ? a.getCompletedDate() : a._model.getCompletedDate();
	var bCompletedDate = (b instanceof StackedTaskView || b instanceof StackedMilestoneView) ? b.getCompletedDate() : b._model.getCompletedDate();

	if(aCompletedDate < bCompletedDate) return -1;
	else if(aCompletedDate == bCompletedDate) return 0;
	else return 1;
}

/**
 * Find views with duplicate dates
 */
function findDuplicates(array) {

	var duplicates = new Array();
	var copy = array.slice(0);

	// first loop goes over every element
	for (var i = 0; i < array.length; i++) {

		var temp = [array[i]];

		for (var j = 0; j < copy.length; j++) {

			if(array[i] === copy[j] || copy[j] == undefined) continue;

			var item1Date = array[i]._model.getCompletedDate();
			var item2Date = copy[j]._model.getCompletedDate();

			if(sameDate(item1Date, item2Date)) {

				temp.push(array[j]);
				delete copy[i];
				delete copy[j];
			}
		}

		if (temp.length > 1) duplicates.push(temp);
	}

	/*
	 * now we have the duplicates, make sure each sub list
	 * contains the same class type
	 */

	copy = duplicates.slice(0);
	duplicates = [];

	for(var i = 0; i < copy.length; i++) {

		var subArr = copy[i];
		var milestones = new Array();
		var tasks = new Array();

		for(var j = 0; j < subArr.length; j++) {

			var view = subArr[j];
			(view instanceof MilestoneView) ? milestones.push(view) : tasks.push(view);
		}

		if(milestones.length > 1) duplicates.push(milestones);
		if(tasks.length > 1) duplicates.push(tasks);
	}

	if(duplicates.length > 0) return duplicates;
}

function sameDate(date1, date2) {

	if(date1 == null || date2 == null) return false;

	if(date1.getDate() == date2.getDate() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getYear() == date2.getYear()) return true;
	else return false;
}

function isWithinScreenBounds(point) {
	
	var contentHolder = stage.children[0].contentHolder;
	var lowerBound = new Point(contentHolder.x*-1, 0);
	var upperBound = new Point((contentHolder.x*-1)+Config.getStageWidth(), Config.getStageHeight());
	
	if(point.x > lowerBound.x && point.x < upperBound.x && 
	   point.y > lowerBound.y && point.y < upperBound.y) 
		return true;
	else return false;
}

function drawHorizontalLine(width, thickness, colour, alpha) {
	
	var line = new createjs.Shape();
	line.graphics
	    .setStrokeStyle(thickness)
	    .beginStroke(colour)
	    .moveTo(0, 0)
	    .lineTo(width, 0)
	    .endStroke();
    line.alpha = alpha;
	
	return line;    
}

function drawVerticalLine(height, thickness, colour, alpha) {
	
	var line = new createjs.Shape();
	line.graphics
	    .setStrokeStyle(thickness)
	    .beginStroke(colour)
	    .moveTo(0, 0)
	    .lineTo(0, height)
	    .endStroke();
    line.alpha = alpha;
	
	return line;    
}
