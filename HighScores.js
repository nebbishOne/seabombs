SeaBombs.HighScores = function(game) {
  this.highscoretitle;
  this.yourscoretitle;
  this.newhighmessage;
  this.overmessage;
  this.timer;
  this.control;
};

SeaBombs.HighScores.prototype = {
    
    create: function () {
      //this.bg = this.add.image(0, 0, 'bg');
      //this.bg.height = this.world.height;
      //this.bg.width = this.world.width; 
      //this.bg.z = 0;
      
      if (!this.game.device.localStorage) {
        console.log('!!!!!!!!!! Cannot set high score - no local storage !!!!!!!!!!');   
      } else {
        var phs = localStorage.getItem('seaBombsHighScore') ? localStorage.getItem('seaBombsHighScore') : '0';
        var ns = localStorage.getItem('seaBombsNewestScore') ? localStorage.getItem('seaBombsNewestScore') : 0;
        
    		this.highscoretitle = this.add.bitmapText((this.world.width/2)-200,(this.world.height/2)-200, 'eightbitwonder', 'Previous High Score: ' + phs, 20);
    		this.yourscoretitle = this.add.bitmapText((this.world.width/2)-200,(this.world.height/2)-160, 'eightbitwonder', 'Your Score: ' + ns, 20);
        phs = parseInt(phs, 10);
        ns = parseInt(ns, 10);
        if (ns > phs) {
                console.log('HighScores: replacing high score with newest score');
                localStorage.setItem('seaBombsHighScore', ns);
                this.newhighmessage = this.add.bitmapText((this.world.width/2)-200,(this.world.height/2)-120, 'eightbitwonder', 'You got the new high score!!!', 15);
    		} else { 
            this.newhighmessage = this.add.bitmapText((this.world.width/2)-200,(this.world.height/2)-120, 'eightbitwonder', 'Try again...', 15);
    		}
      }
  		
  		this.overmessage = this.add.bitmapText((this.world.width/2)-200,(this.world.height/2)-80, 'eightbitwonder', 'Press Space to Play Again', 20);
          this.overmessage.align = 'center';
          this.overmessage.inputEnabled = true;
          this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
          this.timer = this.time.now + 3000;
	},
	
	quitGame: function(pointer) {
        this.state.start('StartMenu');
    },

	update: function () {
	    if (this.timer < this.time.now) {
            this.control = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.control.onDown.add(this.quitGame, this);
            this.timer = null;
        }
	}
};
