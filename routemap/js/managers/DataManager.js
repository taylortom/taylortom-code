/**
 * Manages all data in the application, providing methods for storing and accessing data.
 */

(function() {
	
	var DataManager = function(startTime, endTime){

        this.initialize(startTime, endTime);
    };

    // set the 'class'
    var p = DataManager.prototype;
    
    p.initialize = function(startTime, endTime){
   
	    this._startDate = new Date(startTime * 1000);
        this._endDate = new Date(endTime * 1000);
        this._learningHours;
        this._mileStones = new Array();
    };

    p.addMileStone = function(mileStoneModel){
    
        this._mileStones.push(mileStoneModel);
    };

    p.sortMilestonesByDueDate = function(a,b){
    
       return (b.getDueDate()> a.getDueDate()) ? -1 : 1;
    };
    
    p.calculateLearningHours = function(){

        var hours = 0;
        for(var i=0;i<this._mileStones.length;i++){

            var ms = this._mileStones[i];
            hours += ms.getLearningHours();
        }

        this._learningHours = hours;
    };
    
    p.getMileStonesByDueDate = function(){
    
        return this._mileStones.sort(this.sortMilestonesByDueDate);
    };

    p.getNumMilestonesCompleted = function(){
    
        var completed = 0;
    
        for(var i=0; i<this._mileStones.length;i++){
    
            var msm = this._mileStones[i];
            if(msm.getStatus()===completedDT) completed++;
        }
        return completed;
    };
    
    p.getEndDate = function(){ return this._endDate; };
    p.getLearningHours = function(){ return this._learningHours; };
    p.getMileStones = function(){ return this._mileStones; };
    p.getStartDate = function(){ return this._startDate; };

    window.DataManager = DataManager;
})();
