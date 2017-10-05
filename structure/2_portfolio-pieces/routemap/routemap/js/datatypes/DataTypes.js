/** No static variables in JavaScript so provide a central point to store commonly used
 * datatypes. Wrap values up in a function so not to pollute the global namespace.
 **/

var notStartedDT = (function() {
    return "Not Started";
})();

var inProgressDT = (function() {
    return "In Progress";
})();

var bookedDT = (function() {
    return "Booked";
})();

var completedDT = (function() {
    return "Completed";
})();

var overdueDT = (function() {
    return "Overdue";
})();

var assessmentDT = (function() {
    return "Assessment";
})();

var portfolioDT = (function() {
    return "Portfolio";
})();

var learningDT = (function() {
    return "Learning";
})();

