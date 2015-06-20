﻿
'use strict';

/* Controllers */
var beehiveControllers = angular.module('beehiveControllers', []);
var punti = 0;
var ultimoQuadro;

var giocatoriCheDevonoGiocare = [];
var giocatoriCheHannoGiocato = [];
var totaleGiocatori;
var gruppetti;



var GESTIONEGRUPPI = [[], [], [], [], []];

GESTIONEGRUPPI[0][0] = 5; GESTIONEGRUPPI[0][1] = 2; GESTIONEGRUPPI[0][2] = 3; GESTIONEGRUPPI[0][3] = 2; GESTIONEGRUPPI[0][4] = 3; GESTIONEGRUPPI[0][5] = 5;
GESTIONEGRUPPI[1][0] = 5; GESTIONEGRUPPI[1][1] = 2; GESTIONEGRUPPI[1][2] = 3; GESTIONEGRUPPI[1][3] = 2; GESTIONEGRUPPI[1][4] = 2; GESTIONEGRUPPI[1][5] = 5;
GESTIONEGRUPPI[2][0] = 4; GESTIONEGRUPPI[2][1] = 2; GESTIONEGRUPPI[2][2] = 2; GESTIONEGRUPPI[2][3] = 2; GESTIONEGRUPPI[2][4] = 2; GESTIONEGRUPPI[2][5] = 4;
GESTIONEGRUPPI[3][0] = 4; GESTIONEGRUPPI[3][1] = 4; GESTIONEGRUPPI[3][2] = 3; GESTIONEGRUPPI[3][3] = 3; GESTIONEGRUPPI[3][4] = 4; GESTIONEGRUPPI[3][5] = 4; GESTIONEGRUPPI[4][0] = 3; GESTIONEGRUPPI[4][1] = 3; GESTIONEGRUPPI[4][2] = 3; GESTIONEGRUPPI[4][3] = 3; GESTIONEGRUPPI[4][4] = 3; GESTIONEGRUPPI[4][5] = 3;



var nDomandeDaFare;
var domandeFatte;
var domande;
var giusta;

beehiveControllers.controller('home', ['$scope', '$location',
  function ($scope, $location) {


      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.registrazioneGiocatori = function (name) {
          $.connection.hub.stop();
          $location.path('newbee');
          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start()
  }]);


beehiveControllers.controller('newbee', ['$scope', '$location',
  function ($scope, $location) {
      document.getElementById("nomeApe").focus();

      $scope.AddNew = function () {
          var n_bee = $scope.nomeApe;

          if (n_bee == "" || n_bee == null) {
              alert("Inserire un nome per l'ape!");
              return false;
          }
          giocatoriCheDevonoGiocare.push(n_bee);

          document.getElementById("nomeApe").value = "";
          document.getElementById("nomeApe").focus();
      }

      $scope.End = function () {
          var n_bee = $scope.nomeApe;

          if (giocatoriCheDevonoGiocare.length > 5) {
              if (giocatoriCheDevonoGiocare.length < 8) {
                  gruppetti = new Array(giocatoriCheDevonoGiocare, giocatoriCheDevonoGiocare, giocatoriCheDevonoGiocare);//3 gruppetti
              }
              else {
                  gruppetti = new Array(giocatoriCheDevonoGiocare, giocatoriCheDevonoGiocare);//2 gruppetti
              }
              totaleGiocatori = giocatoriCheDevonoGiocare.length;
              $.connection.hub.stop();
              $location.path('cellclose');
              $scope.$apply();
          }
          else {
              alert("Inserire minimo 6 api!");

              document.getElementById("nomeApe").focus();
          }
      }

  }]);

beehiveControllers.controller('cellclose', ['$scope', '$location',
  function ($scope, $location) {

      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.avvioVideo = function () {
          $.connection.hub.stop();
          $location.path('video1');
          $scope.$apply();
      }

      // Start the connection.
      $.connection.hub.start()
  }]);

beehiveControllers.controller('video1', ['$scope', '$location',
  function ($scope, $location) {
      var vid = document.getElementById("video1");
      vid.focus();

      vid.play();

      vid.onended = function () {
          ultimoQuadro = 1;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('quiz', ['$scope', '$location',
  function ($scope, $location) {

      // Temporanea
      giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.length != 0 ? giocatoriCheDevonoGiocare : ['1', '2', '3', '4', '5', '6'];
      giocatoriCheDevonoGiocare = shuffle(giocatoriCheDevonoGiocare);
      console.log(giocatoriCheDevonoGiocare);
      ultimoQuadro = ultimoQuadro != null ? ultimoQuadro : 1;
      totaleGiocatori = giocatoriCheDevonoGiocare.length;

      nDomandeDaFare = GESTIONEGRUPPI[(10 - totaleGiocatori)][ultimoQuadro - 1];
      domandeFatte = 0;//contatore

      var domanda;
      var rispostaG;
      var rispostaS;
      var nomeBimbo = giocatoriCheDevonoGiocare.pop();//selezione giocatore random
      giocatoriCheHannoGiocato.push(nomeBimbo);
      $.get("http://localhost:9999/api/domande/" + ultimoQuadro, "", function (domandeRicevute) {
          domande = domandeRicevute;

          domanda = domande[domandeFatte][0];
          rispostaG = domande[domandeFatte][1];
          rispostaS = domande[domandeFatte][2];

          
          giusta = 0;

          $scope.nomeBimbo = nomeBimbo;
          $scope.domanda = domanda;
          $scope.risp0 = rispostaG;
          $scope.risp1 = rispostaS;
          $scope.$apply();
      });


      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.risposta0 = function (name) {
          if (giusta == 0) {              //gestione risposta 0
              document.getElementById("risp0").style.backgroundColor = "green";
              //risposta corretta
          }
          else {
              document.getElementById("risp0").style.backgroundColor = "red";
              //risposta sbagliata
          };
          domandeFatte++;
          if (domandeFatte < nDomandeDaFare) {          //cambio domanda
              var domanda = domande[domandeFatte][0];
              var rispostaG = domande[domandeFatte][1];
              var rispostaS = domande[domandeFatte][2];

              var nomeBimbo = nomeBimbo = giocatoriCheDevonoGiocare.pop();//selezione giocatore random
              giocatoriCheHannoGiocato.push(nomeBimbo);
              giusta = 0;
              console.log(giocatoriCheHannoGiocato);
              console.log(giocatoriCheDevonoGiocare);
              $scope.nomeBimbo = nomeBimbo;
              $scope.domanda = domanda;
              $scope.risp0 = rispostaG;
              $scope.risp1 = rispostaS;
              $scope.$apply();

          };
          if (domandeFatte >= nDomandeDaFare) {
              $.connection.hub.stop();
              $location.path('quadro2');
              $scope.$apply();
          }
      };

      chat.client.risposta1 = function (name) {
          if (giusta == 1) {              //gestione risposta 1
              document.getElementById("risp1").style.backgroundColor = "green";
              //risposta corretta
          }
          else {
              document.getElementById("risp1").style.backgroundColor = "red";
              //risposta sbagliata
          }

          domandeFatte++;
          if (domandeFatte < nDomandeDaFare) {          //cambio domanda
              var domanda = domande[domandeFatte][0];
              var rispostaG = domande[domandeFatte][1];
              var rispostaS = domande[domandeFatte][2];

              var nomeBimbo = nomeBimbo = giocatoriCheDevonoGiocare.pop();//selezione giocatore random
              giocatoriCheHannoGiocato.push(nomeBimbo);
              giusta = 0;

              $scope.nomeBimbo = nomeBimbo;
              $scope.domanda = domanda;
              $scope.risp0 = rispostaG;
              $scope.risp1 = rispostaS;

              domandeFatte++;
          } else {
              $.connection.hub.stop();
              $location.path('quadro2');
              $scope.$apply();
          }
      };

      // Start the connection.
      $.connection.hub.start()

  }]);

beehiveControllers.controller('quadro2', ['$scope', '$location',
  function ($scope, $location) {
      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.avvioVideo2 = function () {
          $.connection.hub.stop();
          $location.path('video2');
          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start()
  }]);

beehiveControllers.controller('video2', ['$scope', '$location',
  function ($scope, $location) {
      var vid = document.getElementById("video2");
      vid.focus();
      vid.play();
      vid.onended = function () {
          ultimoQuadro = 2;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('next', ['$scope', '$location',
  function ($scope, $location) {
  }]);

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}