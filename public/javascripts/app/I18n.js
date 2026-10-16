// UI translations. Static text is tagged with data-i18n="key" in index.html;
// dynamic text (end game message, chart) reads I18n.t(key) and re-renders on "change".
var I18n = _.extend({
  storageKey: "spx-battleship-lang",
  fallback: "en",

  dictionaries: {
    en: {
      pageTitle: "Battleship · SimplexityLab",
      language: "Language",
      kicker: "Agile Battleship",
      title: "Battleship",
      fleet: "Fleet",
      aircraftCarrier: "Aircraft carrier (5)",
      battleship: "Battleship (4)",
      submarine: "Submarine (3)",
      cruiser: "Cruiser (3)",
      destroyer: "Destroyer (2)",
      shotsPerIteration: "Shots per iteration",
      newGame: "New game",
      emptyBoard: "Press “New game” to deploy the fleet",
      scoreboard: "Scoreboard",
      totalShotsRemaining: "Total shots remaining",
      shotsRemainingForIteration: "Shots remaining for iteration",
      balance: "Balance",
      gameOver: "Game over",
      youWin: "You win!",
      youMade: "You made",
      chartTitle: "Balance per shot",
      budget: "Budget",
      shot: "Shot"
    },
    es: {
      pageTitle: "Batalla Naval · SimplexityLab",
      language: "Idioma",
      kicker: "Batalla Naval Ágil",
      title: "Batalla Naval",
      fleet: "Flota",
      aircraftCarrier: "Portaaviones (5)",
      battleship: "Acorazado (4)",
      submarine: "Submarino (3)",
      cruiser: "Crucero (3)",
      destroyer: "Destructor (2)",
      shotsPerIteration: "Disparos por iteración",
      newGame: "Nuevo juego",
      emptyBoard: "Pulsa “Nuevo juego” para desplegar la flota",
      scoreboard: "Marcador",
      totalShotsRemaining: "Disparos restantes en total",
      shotsRemainingForIteration: "Disparos restantes en la iteración",
      balance: "Saldo",
      gameOver: "Fin del juego",
      youWin: "¡Ganaste!",
      youMade: "Obtuviste",
      chartTitle: "Saldo por disparo",
      budget: "Presupuesto",
      shot: "Disparo"
    },
    pt: {
      pageTitle: "Batalha Naval · SimplexityLab",
      language: "Idioma",
      kicker: "Batalha Naval Ágil",
      title: "Batalha Naval",
      fleet: "Frota",
      aircraftCarrier: "Porta-aviões (5)",
      battleship: "Encouraçado (4)",
      submarine: "Submarino (3)",
      cruiser: "Cruzador (3)",
      destroyer: "Contratorpedeiro (2)",
      shotsPerIteration: "Disparos por iteração",
      newGame: "Novo jogo",
      emptyBoard: "Clique em “Novo jogo” para posicionar a frota",
      scoreboard: "Placar",
      totalShotsRemaining: "Disparos restantes no total",
      shotsRemainingForIteration: "Disparos restantes na iteração",
      balance: "Saldo",
      gameOver: "Fim de jogo",
      youWin: "Você venceu!",
      youMade: "Você obteve",
      chartTitle: "Saldo por disparo",
      budget: "Orçamento",
      shot: "Disparo"
    }
  },

  initialLang: function() {
    var saved;
    try { saved = localStorage.getItem(this.storageKey); } catch (e) {}
    if (saved && this.dictionaries[saved]) {
      return saved;
    }
    var browser = (navigator.language || "").slice(0, 2).toLowerCase();
    return this.dictionaries[browser] ? browser : this.fallback;
  },

  t: function(key) {
    var dict = this.dictionaries[this.lang] || this.dictionaries[this.fallback];
    return dict[key] !== undefined ? dict[key] : this.dictionaries[this.fallback][key];
  },

  setLang: function(lang) {
    if (!this.dictionaries[lang]) {
      return;
    }
    this.lang = lang;
    try { localStorage.setItem(this.storageKey, lang); } catch (e) {}
    this.apply();
    this.trigger("change", lang);
  },

  apply: function() {
    var self = this;
    document.documentElement.lang = this.lang;
    document.title = this.t("pageTitle");
    $("[data-i18n]").each(function() {
      $(this).text(self.t($(this).attr("data-i18n")));
    });
    $("[data-i18n-attr]").each(function() {
      var pair = $(this).attr("data-i18n-attr").split(":");
      $(this).attr(pair[0], self.t(pair[1]));
    });
  }
}, Backbone.Events);

I18n.lang = I18n.fallback;
