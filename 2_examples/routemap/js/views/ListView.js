/**
 *
 */

(function() {

    /**
     *
     * @constructor
     */
    var ListView = function(){

        this.initialize();
    };

    var p = ListView.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
   
    p.initialize = function(){

       // console.log(Config.getCanvasWidth());

        this._mileStoneListViews = new Array();

        this.initialiseViewStage();

        this.createMileStoneListViews();

        this.redraw();
    };

    p.initialiseViewStage = function(){

        //console.log("ListView.initialiseViewStage");

        stage.x = 0;
        // set stage to match the canvas size
        stage.width = Config.getCanvasWidth();
        stage.height = Config.getCanvasHeight();
    };

    p.drawTopBar =  function(){

       // console.log("ListView::drawTopBar");

        var topbar = new createjs.Container();
        topbar.width = stage.width;
        topbar.height = 27;

        var bar = new createjs.Shape();
        bar.width = topbar.width;
        bar.height = 25;
        bar.graphics.beginFill("#999").drawRect(0,0, bar.width, bar.height).endFill();
        topbar.addChild(bar);

        var textY = 5;

        var heading1 = new createjs.Text("MILESTONE", "16px Arial", "#fff");
        heading1.x = 10;
        heading1.y = textY;
        topbar.addChild(heading1);

        var heading2 = new createjs.Text("TASK", "16px Arial", "#fff");
        heading2.x = 210;
        heading2.y = textY;
        topbar.addChild(heading2);

        var heading3 = new createjs.Text("DUE DATE", "16px Arial", "#fff");
        heading3.x = 390;
        heading3.y = textY;
        topbar.addChild(heading3);

        var heading4 = new createjs.Text("COMPLETED", "16px Arial", "#fff");
        heading4.x = 480;
        heading4.y = textY;
        topbar.addChild(heading4);

        var heading5 = new createjs.Text("TYPE", "16px Arial", "#fff");
        heading5.x = 595;
        heading5.y = textY;
        topbar.addChild(heading5);

        var heading6 = new createjs.Text("STATUS", "16px Arial", "#fff");
        heading6.x = 690;
        heading6.y = textY;
        topbar.addChild(heading6);

        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(2).beginStroke("#000").moveTo(0, bar.height +1).lineTo(bar.width, bar.height + 1).endStroke();
        topbar.addChild(line);

        this.addChild(topbar);

        this.ypos = topbar.height;
    };

    p.createMileStoneListViews = function(){

      //  console.log("ListView::createMileStoneListViews");

      var mileStones = dataManager.getMileStonesByDueDate();

        mileStones.sort(sortMilestonesByStatus);

       for(var i = 0; i <mileStones.length; i++){
         //for(var i = 0; i < 1; i++){

              var mm = mileStones[i];
              //console.log("milestone name: " + mm.getName());

              var mslv = new MileStoneListView(mm);
             this._mileStoneListViews.push(mslv);

          }
     };

     p.attachMileStoneListViews = function(){

        //console.log("ListView::attachMileStoneListViews");

        var ypos = 40;

        for(var i=0;i<this._mileStoneListViews.length;i++){
           var mslv = this._mileStoneListViews[i];
           mslv.y = ypos;

           this.addChild(mslv);
		   
		   if(i<this._mileStoneListViews.length-1){
			   
			   ypos += mslv.getHeight() + 7;
			   
			   var line = new createjs.Shape();
			   line.graphics.setStrokeStyle(1)
					.beginStroke("#000")
					.moveTo(0, ypos)
					.lineTo(800, ypos)
					.endStroke();
				
				this.addChild(line);
				
				ypos += 14;
		   }
		   
		   //console.log("mslv.getHeight(): " +mslv.getHeight());
		 }
    };

    p.redraw = function(){

        this.removeAllChildren();

        this.drawTopBar();

        this.attachMileStoneListViews();

        update = true;
    };

    window.ListView = ListView;

}());