/**
 * Contains all milestone-relevant data
 */

(function(){

	/**
	 * Constructor
	 * @param mileStoneData contains all the milestone data retrieved from JSON object
	 */
	var MilestoneModel = function(mileStoneData){

		this.initialize(mileStoneData);
	};

	// set the 'class'
	var p = MilestoneModel.prototype;

	p.initialize = function(mileStoneData){

		this._name = mileStoneData.name;
		this._description = mileStoneData.description;
		this._dueDate = new Date(mileStoneData.time * 1000);
		this._tasks = new Array();
		this._completedDate = null;
		this._status;
		this._overdue = false;

        for(var i=0;i<mileStoneData.tasks.length;i++){
			
			var task = mileStoneData.tasks[i];
			this.addTask(task);
		}

		this.calculateLearningHours();
		this.setStatus();
		
		if(this.checkAllTasksCompleted()) 
		{
			this.checkCompletedDate();
		
			for(var i = 0; i < mileStoneData.tasks.length; i++){

				var lastTask = this._tasks[this._tasks.length-1];

				lastTask.setMilestoneComplete();

				if(lastTask.getCompletedDate() == null) lastTask.setCompletedDate(this._completedDate);
			}
		}
	};

	/**
	 * Adds a task to the list
	 * @param task
	 */
	p.addTask = function(task){

		var tm = new TaskModel(task);
		this._tasks.push(tm);
	};

	/**
	 * The following methods should only be accessed from with the class
	 */

	p.calculateLearningHours =  function(){

		// console.log("MileStoneModel::calculateLearningHours");
		var hours = 0;

		for(var i=0;i<this._tasks.length;i++){

			var t = this._tasks[i];
			hours += parseInt((t.getLearningHours()));
		}

		this._learningHours = hours;
	};

	p.checkAllTasksCompleted = function(){

		for(var i = 0; i < this._tasks.length; i++){

			var t = this._tasks[i];
			if(t.getStatus() !== completedDT && !t.getIsOptional()) return false;
		}

		return true;
	};

	p.checkTasksOverdue =  function(){

		for(var i=0;i<this._tasks.length;i++){

			var t = this._tasks[i];
			if(t.getIsOverdue()) return true;
		}

		return false;
	};
	
	p.checkCompletedDate = function(){

		var dateCompleted = -1;

		for(var i = 0; i < this._tasks.length; i++) {

			var t = this._tasks[i];
			var taskCompletedDate = t.getCompletedDate();

			if(i == 0) dateCompleted = taskCompletedDate;
			else if(taskCompletedDate > dateCompleted) dateCompleted = taskCompletedDate;
		}

		this._completedDate = dateCompleted;
	};
	
	/**
	 * Getters/setters
	 */
	 
	 /**
	 * Used for positioning the milestone when in timeline view.
	 * Gives a bit of extra spacing from the last completed task.
	 */
	p.getSpacedCompletedDate = function(){

		var spacedDate = new Date(this._completedDate);
		spacedDate.setDate(spacedDate.getDate()+4);

		// make sure the new date isn't in the future
		if(spacedDate > new Date()) spacedDate = new Date();

		return spacedDate;
	};

	p.setStatus = function(){

		var allComplete = this.checkAllTasksCompleted();

		if(allComplete) this._status = completedDT;
		else
		{
			//var overdue = this.checkTasksOverdue();
			if(this.getIsOverdue()) this._status = overdueDT;
			else this._status = this.getTasksStatus();
		}
	};
	p.getStatus = function(){ return this._status; };

	p.getCompleted = function(){ return this.checkAllTasksCompleted(); };
	p.getCompletedDate = function(){ return new Date(this._completedDate); };
	p.getDueDate = function(){ return new Date(this._dueDate); };
	p.getLearningHours = function(){ return this._learningHours; };
	p.getName = function(){ return this._name; };
	p.getDescription = function(){ return this._description; };
	p.getTasks = function(){ return this._tasks; };
	p.getIsOverdue = function(){

		var today = new Date();
		return this._dueDate < today;
	}

	p.getTasksStatus = function(){

		var status = notStartedDT;

		for(var i = 0; i < this._tasks.length; i++){

			var t = this._tasks[i];

			if(t.getStatus() === inProgressDT || t.getStatus() === completedDT){

				status = inProgressDT;
				break;
			}
		}
		return status;
	};

	window.MilestoneModel = MilestoneModel;
}());