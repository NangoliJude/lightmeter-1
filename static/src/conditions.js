var d3Scale  = require('d3-scale'),
    lodash = require('lodash'),
    EventEmitter = require('events').EventEmitter;

var defaults = [
  {
    id: 'direct-sun',
    name: 'Direct sun',
    exposure: {
      400: 1.3,
      800: 1.6,
      200: 2.5,
      100: 5,
      50: 10
    },
    colour: {
      start: '#f7ec86',
      stop : '#fdc753'
    }
  },
  {
    id: 'partial-cloud',
    name: 'Partial cloud',
    exposure: {
      400: 5,
      800: 2.5,
      200: 10,
      100: 20,
      50: 40
    },
    colour: {
      start: '#f4e884',
      stop : '#60c084'
    }
  },
  {
    id: 'cloudy',
    name: 'Cloudy',
    exposure: {
      400: 10,
      800: 5,
      200: 20,
      100: 40,
      50: 90
    },
    colour: {
      start: '#70c488',
      stop : '#20bcfc'
    }
  },
  {
    id: 'indoors',
    name: 'Indoors',
    exposure: {
      400: 180,
      800: 90,
      200: 300,
      100: 600,
      50: 1200
    },
    colour: {
      start: '#27bbf4',
      stop : '#6340bc'
    }
  },
  {
    id: 'evening',
    name: 'Evening',
    exposure: {
      400: 600,
      800: 300,
      200: 1200,
      100: 3000,
      50: 5400
    },
    colour: {
      start: '#977bd7',
      stop : '#f75892'
    }
  }
];

var conditions = [],
    scale;

function createScale() {
  var range = lodash.pluck(conditions, 'id').reverse();
  return d3Scale
    .quantize()
    .domain([0, 1023])
    .range(range);
}

module.exports.defaults = defaults;

module.exports.create = function () {
  this.scale = createScale();
  var instance = new EventEmitter();

  instance.add = function (condition) {
    conditions.push(condition);
    this.scale = createScale();
    this.emit('change');
  };

  instance.info = function (lightLevel) {
    var id = this.scale(lightLevel);
    return lodash.find(conditions, { id: id });
  };

  instance.availableIso = function () {
    var available = [];

    if (conditions[0] && conditions[0].exposure) {
      available = lodash(conditions[0].exposure)
              .keys()
              .map(lodash.parseInt)
              .sortBy()
              .value();
    }

    return available;
  };
  return instance;
}
