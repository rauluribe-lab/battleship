$(function() {
  var game, gameView;
  var emptyChart = new FundsChartView({el: $("#fundsChart")});

  I18n.lang = I18n.initialLang();
  I18n.apply();
  $("#langSelect").val(I18n.lang).bind("change", function() {
    I18n.setLang($(this).val());
  });
  I18n.bind("change", function() {
    if (gameView) {
      gameView.refreshText();
    } else {
      emptyChart.render();
    }
  });

  emptyChart.render();

  $("#newGame").bind("click", function() {
    if (game) {
      game.destroy();
    }
    game = new Game({shotsPerIteration: $("#shotsPerIteration").val()});
    gameView = new GameView({model: game}).render();
  });
});
