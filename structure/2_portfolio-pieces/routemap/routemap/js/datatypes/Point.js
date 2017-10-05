/**
 * Basic 2D coordinate datatype
 */

(function(){

    /**
     * Constructor
     * @param _x
     * @param _y
     */
    var Point = function(_x,_y){

        // alert('Point.constructor: (' + _x + ',' + __y + ")");
        this.x = _x;
        this.y = _y;
    };

    // set the 'class'
    var p = Point.prototype;

    // vars

    /**
     * For debugging: prints data to screen
     */
    p.print = function(){

        if(window.console && window.console.log) console.log("Point(" + this.x + "," + this.y + ")");
    };

    window.Point = Point;
}());