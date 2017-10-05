var data = {
  start: moment([2015,03,13,12,30]),
  units: false,
  mems: false
};

var init = function() {
  createTimer('years','months','days','hours','minutes','seconds');
  doMems();
  onTick();
  window.setInterval(onTick, 1000);
};

/**
* Timer/stats stuff
*/

// the main 'event loop'
var onTick = function() {
  var tempStart = data.start.clone();
  for(var i = 0; i < data.units.length; i++) {
    var unit = data.units[i];
    tempStart = unit.update(tempStart);
    if(unit.name === 'days' && unit.value === 0) {
      celebrate();
    }
    updateStats();
  }
};

var createTimer = function(/* units... */) {
  data.units = [];
  for(var i = 0; i < arguments.length; i++) {
    var unitName = arguments[i];
    var unit = new Unit(unitName);
    data.units.push(unit);
  }
};

var updateStats = function() {
  $('.stats').html('');
  updateStat('years');
  updateStat('months');
  updateStat('weeks');
  updateStat('days');
  updateStat('hours');
  updateStat('minutes');
  updateStat('seconds');
};

var updateStat = function(statName) {
  var total = data.start.diff(moment(), statName)*-1 || 0;
  $('.stats').append('<div class="stat">' + total + '<span class="label">' + statName + '</span></div>');
};

var celebrate = function() {
  $('img').removeClass('display-none');
};

var Unit = function(unitName) {
  var html = '<div class="unit ' + unitName + '"><div class="number first"><div class="line"></div><div class="value"></div></div><div class="number second"><div class="line"></div><div class="value"></div></div><div class="label"></div></div>';
  $('.timer').append(html);

  var $el = $('.timer .unit.' + unitName);
  $('.label', $el).html(unitName.toUpperCase());

  // public

  this.name = unitName;
  this.value = 0;

  this.update = function(momentDate) {
    this.value = momentDate.diff(moment(), this.name)*-1 || 0;
    var strVal = this.value.toString();
    if(strVal.length === 1) {
      var first = '0';
      var second = strVal;
    } else {
      var first = strVal.charAt(0);
      var second = strVal.charAt(1);
    }
    // update HTML
    $('.first .value', $el).html(first);
    $('.second .value', $el).html(second);

    return momentDate.add(this.value,this.name);
  };

  return this;
};

/**
* Mems stuff
*/
var sortMems = function(mem1, mem2) {
  if(!mem1.date.hasOwnProperty('getYear')) {
    try {
      mem1.date = new Date(mem1.date);
    } catch(e) {
      console.error("Couldn't parse", mem1.date);
    }
  }
  if(!mem2.date.hasOwnProperty('getYear')) {
    try {
      mem2.date = new Date(mem2.date);
    } catch(e) {
      console.error("Couldn't parse", mem2.date);
    }
  }
  if(new Date(mem1.date) < new Date(mem2.date)) return 1;
  else return -1;
};

var doMems = function() {
  $.getJSON('events.json', function(data) {
    data.mems = data;
    // sort mems by year
    var mems = data.mems.slice().sort(sortMems);

    $('.mems').empty();

    var today = new Date();
    var year = -1;
    var $list;

    for(var i = 0, count = mems.length; i < count; i++) {
      var mem = mems[i];
      var memYear = mem.date.getFullYear();

      if((mem.date.getDate() !== today.getDate()) || (mem.date.getMonth() !== today.getMonth())) {
        continue;
      }
      if(memYear !== year) {
        $list = $('<ul>');
        $('.mems').append('<div class="year">' + memYear).append($list);
        year = memYear;
      }
      $list.append('<li>' + mem.description);
    }
    if($('.mems > ul').length === 0) {
      $('.mems').closest('.content-block').remove();
    } else {
      $('.mems').closest('.content-block').show();
    }
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.log('Failed to load JSON,', textStatus + ':', errorThrown);
  });
}

/**
* Self-starter
*/
$(init);
