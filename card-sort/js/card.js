var Card = function(data) {
  this.data = data;
  this.$el = $("<div class='card draggable'><div class='inner'>" + this.data.text + "</div></div>");

  this.$el.click(click.bind(this));
};

function click(event) {
  event.stopPropagation();
  this.$el.toggleClass('selected');
}
