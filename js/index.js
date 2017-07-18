(function() {
  // Your code here
  var audio1 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
  );
  var audio2 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
  );
  var audio3 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
  );
  var audio4 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  );

  var audioBuzz = new Audio(
    "https://soundbible.com/mp3/Basketball Buzzer-SoundBible.com-1863250611.mp3"
  );

  var audioWin = new Audio(
    "https://www.gamethemesongs.com/uploads/audio/Super Mario Bros - Level Complete.mp3"
  );

  var Game = {
    round: null,
    playerTurn: false,
    buttons: ["1", "2", "3", "4"],
    pattern: [],
    playerPattern: [],
    clicks: null,
    lastRound: 20,
    isStrict: false,

    startGame: function() {
      this.round = 1;
      $("#roundNum").text(this.getCurrentRound());
      this.startRound();
    },

    resetGame: function() {
      $("#roundMsg").removeClass("hidden");
      $("#winMsg").addClass("hidden");
      this.round = null;
      this.pattern = [];
      this.playerPattern = [];
      this.clicks = null;
      this.startGame();
    },

    startRound: function() {
      this.playerTurn = false;
      //add rand num (1-4) to pattern
      this.addRandomSequence();
      //binds rand num to light and lights it up
      this.bindPattern();
    },

    //if player guess incorrect
    restartRound: function() {
      if (this.isStrict) {
          this.resetGame();
          console.log("Round reset to " + this.round);
      } else {
        this.clicks = null;
        console.log("Round still is " + this.round);
        //rebind the rand num to lights and light it up again
        this.bindPattern();
        //empty playerPattern for user to try again
        this.playerPattern = [];
      }
    },

    //getCurrentRound
    getCurrentRound() {
      return this.round;
    },

    toggleStrict: function() {
      if (this.isStrict == false) {
        this.isStrict = true;
        $("#strictStatus").text("On");
      } else if (this.isStrict) {
        this.isStrict = false;
        $("#strictStatus").text("Off");
      }
    },

    addRandomSequence: function() {
      var randNum = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
      this.pattern.push(randNum);
    },
    //get array of random sequence
    getRandomSequence: function() {
      return this.pattern;
    },

    bindPattern() {
      //pushes random num to this.pattern
      var pattern = this.getRandomSequence();

      for (var i = 0; i < pattern.length; i++) {
        (function(ind) {
          setTimeout(function() {
            for (var j = 0; j < Game.buttons.length; j++) {
              if (pattern[ind] == Game.buttons[j]) {
                console.log(pattern[ind]);
                Game.lightUp(pattern[ind]);
              }
            }
          }, 1000 + 800 * ind);
        })(i);
      }
      this.playerTurn = true;
    },

    //lights up button
    lightUp: function(id) {
      var light = document.getElementById(id);
      //previous background-color
      var prevBackground = $(light).css("background-color");
      $(light).css("background-color", "white");
      setTimeout(function() {
        if (id == 1) {
          audio1.play();
        } else if (id == 2) {
          audio2.play();
        } else if (id == 3) {
          audio3.play();
        } else {
          audio4.play();
        }
        $(light).css("background-color", prevBackground);
      }, 150);
    },

    checkPattern: function() {
      if (this.clicks == null) {
        this.clicks = 0;
      } else {
        this.clicks = this.clicks + 1;
      }
      console.log("clicks " + this.clicks);
      //user this.clicks to check both pattern and playerPatter
      if (this.pattern[this.clicks] == this.playerPattern[this.clicks]) {
        //go next round if array lengths are same
        if (this.playerPattern.length === this.pattern.length) {
          setTimeout(function() {
            Game.goNextRound();
          }, 1000);
        }
      } else {
        audioBuzz.play();
        this.showErrorMsg();
        //repeat lights that blinked
        //and try again
        setTimeout(function() {
          Game.restartRound();
        }, 1000);
      }
    },

    //go next round when user correct
    goNextRound: function() {
      this.round = this.round + 1;

      if (this.round > this.lastRound) {
        this.showWinMsg();
      } else {
        $("#roundNum").text(Game.getCurrentRound());
        this.clicks = null;
        this.playerPattern = [];
        this.startRound();
      }
    },

    showErrorMsg: function() {
      $("#roundMsg").addClass("hidden");
      $("#errorMsg").removeClass("hidden");
      setTimeout(function() {
        $("#roundMsg").removeClass("hidden");
        $("#errorMsg").addClass("hidden");
      }, 1000);
    },

    showWinMsg: function() {
      audioWin.play();
      this.playerTurn = false;
      $("#roundMsg").addClass("hidden");
      $("#winMsg").removeClass("hidden");
    }
    
  }; //End of Game Object

  window.onload = function() {
    setTimeout(function() {
      Game.startGame();
    }, 0);
  };

  $(".light1").on("click", function() {
    if (Game.playerTurn) {
      audio1.play();
      var id = $(this).attr("id");
      Game.lightUp(id);
      //check if button lightup
      Game.playerPattern.push(id);
      Game.checkPattern();
    }
  });

  $(".light2").on("click", function() {
    if (Game.playerTurn) {
      audio2.play();
      var id = $(this).attr("id");
      Game.lightUp(id);
      //check if button lightup
      Game.playerPattern.push(id);
      Game.checkPattern(this.clicks);
    }
  });

  $(".light3").on("click", function() {
    if (Game.playerTurn) {
      audio3.play();
      var id = $(this).attr("id");
      Game.lightUp(id);
      //check if button lightup
      Game.playerPattern.push(id);
      Game.checkPattern(this.clicks);
    }
  });

  $(".light4").on("click", function() {
    if (Game.playerTurn) {
      audio4.play();
      var id = $(this).attr("id");
      Game.lightUp(id);
      //check if button lightup
      Game.playerPattern.push(id);
      Game.checkPattern(this.clicks);
    }
  });

  $("#resetBtn").on("click", function() {
    if (Game.playerTurn || Game.round > Game.lastRound) {
      Game.resetGame();
    }
  });

  $("#strictBtn").on("click", function() {
    if (Game.playerTurn) {
      Game.toggleStrict();
    }
  });
  
  document.onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode == 38 || e.keyCode == 87) { // Up keycode || W keycode
        if (Game.playerTurn) {
          audio2.play();
          Game.lightUp(2);
          //check if button lightup
          Game.playerPattern.push(2);
          Game.checkPattern();
        }
    } else if (e.keyCode == 37 || e.keyCode == 65) { // left keycode || A
        if (Game.playerTurn) {
          audio1.play();
          Game.lightUp(1);
          //check if button lightup
          Game.playerPattern.push(1);
          Game.checkPattern();
        }
    } else if (e.keyCode == 39 || e.keyCode == 68) { // right keycode || D
        if (Game.playerTurn) {
          audio3.play();
          Game.lightUp(3);
          //check if button lightup
          Game.playerPattern.push(3);
          Game.checkPattern();
        }
    } else if (e.keyCode == 40 || e.keyCode == 83) { // down keycode || S
        if (Game.playerTurn) {
          audio4.play();
          Game.lightUp(4);
          //check if button lightup
          Game.playerPattern.push(4);
          Game.checkPattern();
        }
    }
};
  
})();