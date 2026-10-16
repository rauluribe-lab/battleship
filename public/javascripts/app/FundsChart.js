// Line chart of the balance after every shot, drawn as inline SVG.
var FundsChartView = Backbone.View.extend({
  width: 280,
  height: 230,
  margin: {top: 14, right: 12, bottom: 30, left: 52},
  yStep: 100000,
  minYMax: 900000,

  initialize: function() {
    _.bindAll(this, "render");
    if (this.model) {
      this.model.bind("history", this.render);
    }
  },

  maxShots: function() {
    return this.model ? this.model.get("maxShots") : Game.prototype.defaults.maxShots;
  },
  budget: function() {
    var defaults = Game.prototype.defaults;
    return this.model ? this.model.get("maxShots") * this.model.get("costPerShot") : defaults.maxShots * defaults.costPerShot;
  },
  history: function() {
    return this.model ? this.model.fundsHistory : [];
  },

  render: function() {
    var self = this;
    var m = this.margin;
    var plotW = this.width - m.left - m.right;
    var plotH = this.height - m.top - m.bottom;
    var history = this.history();
    var maxShots = this.maxShots();
    var budget = this.budget();

    var peak = _.max(history.concat([this.minYMax]));
    var yMax = Math.ceil(peak / this.yStep) * this.yStep;

    var x = function(i) { return m.left + (i / maxShots) * plotW; };
    var y = function(v) { return m.top + plotH - (Math.max(v, 0) / yMax) * plotH; };

    var svg = [];
    svg.push('<svg viewBox="0 0 ' + this.width + ' ' + this.height + '" role="img" aria-label="' + I18n.t("chartTitle") + '">');
    svg.push('<defs><linearGradient id="spxLine" gradientUnits="userSpaceOnUse" x1="' + m.left + '" y1="0" x2="' + (m.left + plotW) + '" y2="0">' +
      '<stop offset="0%" stop-color="#ffc24d"/><stop offset="45%" stop-color="#ff6b6b"/><stop offset="100%" stop-color="#a855f7"/>' +
      '</linearGradient></defs>');

    // Y grid and labels
    var yLabelEvery = yMax > 1000000 ? 2 : 1;
    for (var v = 0, i = 0; v <= yMax; v += this.yStep, i++) {
      var gy = y(v);
      svg.push('<line class="chart__grid' + (v === 0 ? ' chart__axis' : '') + '" x1="' + m.left + '" x2="' + (m.left + plotW) + '" y1="' + gy + '" y2="' + gy + '"/>');
      if (i % yLabelEvery === 0) {
        svg.push('<text class="chart__tick" x="' + (m.left - 8) + '" y="' + gy + '" text-anchor="end" dominant-baseline="middle">' + this.formatK(v) + '</text>');
      }
    }

    // X axis labels
    svg.push('<line class="chart__axis" x1="' + m.left + '" x2="' + m.left + '" y1="' + m.top + '" y2="' + (m.top + plotH) + '"/>');
    for (var s = 0; s <= maxShots; s += 5) {
      svg.push('<text class="chart__tick" x="' + x(s) + '" y="' + (m.top + plotH + 18) + '" text-anchor="middle">' + s + '</text>');
    }

    // Budget line
    var by = y(budget);
    svg.push('<line class="chart__budget" x1="' + m.left + '" x2="' + (m.left + plotW) + '" y1="' + by + '" y2="' + by + '"/>');
    svg.push('<text class="chart__budget-label" x="' + (m.left + 4) + '" y="' + (by - 6) + '">' + I18n.t("budget") + '</text>');

    // Balance series
    if (history.length > 1) {
      var points = _(history).map(function(value, i) { return x(i) + ',' + y(value); }).join(' ');
      svg.push('<polyline class="chart__line" points="' + points + '"/>');
    }
    _(history).each(function(value, i) {
      var last = i === history.length - 1;
      svg.push('<circle class="chart__dot' + (value < budget ? ' chart__dot--below' : '') + (last ? ' chart__dot--last' : '') + '" cx="' + x(i) + '" cy="' + y(value) + '" r="' + (last ? 4.5 : 2.5) + '">' +
        '<title>' + I18n.t("shot") + ' ' + i + ': ' + self.formatK(value) + '</title></circle>');
    });

    svg.push('</svg>');
    this.el.innerHTML = svg.join('');
    return this;
  },

  formatK: function(amount) {
    return "$" + Math.round(amount / 1000) + "k";
  }
});
