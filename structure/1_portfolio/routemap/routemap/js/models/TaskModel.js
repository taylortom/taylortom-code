/**
 * Contains all task-relevant data
 */

(function(){

    /**
     * Constructor
     * @param task object containing all task data
     */
    var TaskModel = function(task){
    
        this.initialize(task);
    };

    // set the 'class'
    var p = TaskModel.prototype;

    /**
     * Initialises the vars
     * @param task object containing all task data
     */
    p.initialize = function(task){

       //console.log('TaskModel.initialize: ' + task.due_time);

        this._name = task.name;
        this._description = task.description;
        this._score = task.score;
        this._xpPoints = task.xp_points;
        this._challenge = task.challenge;
        this._badge = task.badge;
        this._learningHours = task.learning_hours;
        this._dueDate = (task.due_time == null) ? undefined : new Date(task.due_time * 1000);
        
        if(task.completed_time != null) this._completedDate = new Date(task.completed_time * 1000);
        else this._completedDate = null;
        
        this._type = task.type;
        this._status = getStatusAsString(task.status);
        this._overdue = (task.overdue == 1 && this._status != completedDT) ? true : false;
        this._url = task.url;
        this._optional = (task.optional == 1) ? true : false;        
    };

    /*
     * Public getters/setters
     */ 
    p.getCompletedDate = function(){ return this._completedDate; };
    p.setCompletedDate = function(newDate){ 
    
    	if(this._completedDate != newDate) this._completedDate = newDate; 
    };
    
    p.getMilestoneComplete = function(){ return this._milestoneComplete; }; 
    p.setMilestoneComplete = function(){ 
    
    	if(!this._milestoneComplete) this._milestoneComplete = true; 
    };
    
    p.getDescription = function(){ return this._description; };
    p.getDueDate = function(){ return this._dueDate; };
    p.getIsOptional = function(){ return this._optional };
    p.getIsOverdue = function(){ return this._overdue };
    p.getLearningHours = function(){ return this._learningHours; };
    p.getName = function(){ return this._name; };
    p.getScore = function(){ return this._score; };
    p.getStatus = function(){ return this._status; };
    p.getType = function(){ return this._type; };
    p.getUrl = function(){ return this._url; }
    p.getXpPoints = function(){ return this._xpPoints; };
    p.getChallenge = function(){ return this._challenge; };
    p.getBadge = function(){ return this._badge; };

    /**
     * Returns the task type as a word
     * @return word
     */
    p.getFullTypeName = function(){

        // console.log('TaskModel.getFullTypeName');

        switch (this._type){
            case 'A':
                return assessmentDT;
            case 'P':
                return portfolioDT;
            case 'L':
                return learningDT;
            default:
                if(window.console && window.console.log) console.log("Invalid task type specified");
                return '';
        }
    };

    window.TaskModel = TaskModel;
}());