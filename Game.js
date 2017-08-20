SeaBombs.Game = function(game) {
    this.ship;
    this.shipMoveRate;
    this.waterline;
    this.target
    this.shots;
    this.nextfire;
    this.burst;
    this.enemyBurst;
    this.enemies;
    this.enemyTimer;
    this.enemyCount;
    this.enemyShots;
    this.enemyShotTimer;
    this.beep;
    this.boom1;
    this.boom2;
    this.boom3;
    this.boop1;
    this.boop2;
    this.cursors;
    this.control;
    this.shotFired;
    this.score;
    this.prevscore;
    this.scoremessage;
    this.gameover;
    this.overmessage;
    this.timer;
    this.timerMessage;
    this.upKey;
    this.downKey;
    this.pauseKey;
};

SeaBombs.Game.prototype = {
    
    create: function() {
        this.timer = 60000;
        this.timerMessage = "";
        this.score = 0;
        this.prevscore = 0;
        this.gameover = false;
        this.enemies = null;
        this.enemyCount = 3;
        this.enemyTimer = null;
        this.enemyShotTimer = null;
        this.shipMoveRate = 4;
        this.nextfire = 0;
        this.shotFired = false;
        this.upKey = this.input.keyboard.addKey(Phaser.KeyCode.UP);
        this.upKey.onDown.add(this.moveTargetUp, this);
        this.downKey = this.input.keyboard.addKey(Phaser.KeyCode.DOWN);
        this.downKey.onDown.add(this.moveTargetDown, this);
        this.pauseKey =  this.input.keyboard.addKey(Phaser.KeyCode.P);
        this.pauseKey.onDown.add(this.togglePause, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        /*
        this.beep =  this.add.audio('beep');
        this.boom1 = this.add.audio('boom1');
        this.boom2 = this.add.audio('boom2');
        this.boom3 = this.add.audio('boom3');
        this.boop1 = this.add.audio('boop1');
        this.boop2 = this.add.audio('boop2');
        this.brr =   this.add.audio('brr');
        this.bweeoop =   this.add.audio('bweeoop');
        this.deedeedee = this.add.audio('deedeedee');
        */        
        this.buildWorld();
    },
    
    buildWorld: function () {
        this.buildShip();
        this.buildShots();
        this.buildTarget();
        this.buildWater();
        this.buildEnemies();
        /*
        this.buildAsteroids();
        this.buildEnemyShots();
        this.buildEmitter();
        this.buildEnemyEmitter();
        */
        this.scoremessage = this.add.bitmapText(this.world.width-200,10, 'eightbitwonder', 'Score:' + this.score, 20);
        this.timerMessage = this.add.bitmapText(10, 10, 'eightbitwonder', 'Time: ' + this.timer.toString(), 20);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.control = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.control.onDown.add(this.fireShot, this);
        this.physics.enable(this.ship, Phaser.Physics.ARCADE);
        this.ship.body.maxVelocity.set(this.shipMoveRate);
    },
    
    buildShip: function() {
        this.ship = this.add.sprite(this.world.centerX, 40, 'ship');
        this.ship.height = 50;
        this.ship.width = 200; 
        this.ship.enableBody = true;
        this.ship.allowRotation = false;
        this.ship.anchor.setTo(0.1, 0.1);
    },
    
    buildShots: function() {
        this.shots = this.add.group();
        this.shots.physicsBodyType = Phaser.Physics.ARCADE;
        this.shots.enableBody = true;
        this.shots.createMultiple(50, 'shot');
        this.shots.setAll('checkWorldBounds', true);
        this.shots.setAll('outOfBoundsKill', true);
    },

    buildTarget: function() {
        this.target = this.add.sprite(0, this.world.centerY, 'target');
        this.target.enableBody = true;
        this.target.allowRotation = false;
    },

    moveTargetDown: function() {
        if (!this.gameover) {
            if (this.target && this.target.y < 600) {
                this.target.y = this.target.y + 5;
            }
        }
    },

    moveTargetUp: function() {
        if (!this.gameover && this.target.y > 110) {
            if (this.target) {
                this.target.y = this.target.y - 5;
            }
        }
    },   

    buildWater: function() {
        this.waterline = this.add.sprite(0, 90, 'waterline');
        this.waterline.enableBody = true;
    },

    playRndSound: function(nm) {
        if (this.rnd.integerInRange(1,2) == 1) {
            if (nm == 'boom') {
                this.boom1.play();
            } else { 
                this.boop1.play();
            }
        } else {    // 2
            if (nm == 'boom') {
                this.boom2.play();
            } else {
                this.boop2.play();
            }
        }
    },
    
    fireShot: function() {
        if (this.gameover == false) {
            if (this.ship.exists) {
                // there can only be 5 shots on the screen at once:
                if (this.time.now > this.nextfire && this.shots.countDead() > 0 && this.shots.countLiving() <= 5) {
                    this.nextfire = this.time.now + this.firerate;
            
                    var shot = this.shots.getFirstDead();
            
                    shot.reset(this.ship.x, this.ship.y);
                    this.physics.arcade.velocityFromAngle(90, 100, shot.body.velocity);
                    //this.playRndSound('boop');
                }
            }
        }
    },
    
    buildEmitter:function() {
        this.burst = this.add.emitter(0, 0, 50);
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 0.8;
        this.burst.minParticleSpeed.setTo(-50, 50);
        this.burst.maxParticleSpeed.setTo(50, -50);
        this.burst.makeParticles('explosion');
    },
    
    buildEnemyEmitter:function() {
        this.enemyBurst = this.add.emitter(0, 0, 30);
        this.enemyBurst.minParticleScale = 0.1;
        this.enemyBurst.maxParticleScale = 0.5;
        this.enemyBurst.minParticleSpeed.setTo(-90, 90);
        this.enemyBurst.maxParticleSpeed.setTo(90, -90);
        this.enemyBurst.makeParticles('explosion');
    },
    
    fireBurst: function(a, s) {
        if (this.gameover == false) {
            //play sound
            this.playRndSound('boom');
            
            //erase the shot
            var shot = this.shots.getFirstAlive();
            if (shot) {
                shot.kill();
            }
            
            this.burst.emitX = a.x;
            this.burst.emitY = a.y;
            this.burst.start(true, 500, null, 15); //(explode, lifespan, frequency, quantity)
            
            this.score++;
            this.scoremessage.setText('Score: ' + this.score);
            this.checkScore();
            
            if (a.exists) {
                if (a.custSize == 'large') {
                    this.goLargeToMedium(a);
                } else if (a.custSize == 'medium') {
                    this.goMediumToSmall(a);
                } else {
                    a.kill();
                    this.asteroidCount--;
                }
            }
        }
    },
    
    screenWrapMyShip: function() {
        if (this.ship.x > this.game.width) {
            this.ship.x = 0;
        }
    },
    
    buildEnemies: function() {
        this.enemies = this.add.group();
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.enableBody = true;
        this.enemies.createMultiple(this.enemyCount, 'enemy');
        this.enemyTimer = null;
    },
    
    checkForEnemy: function(game) {
        if (this.enemies.countLiving() <= this.enemyCount) {
            if (this.enemyTimer == null) {
                this.enemyTimer = this.time.now + this.rnd.integerInRange(1000,1500);
                console.log("Setting enemy timer to " + this.enemyTimer);
            }
        }    
    },
    
    rebuildEnemy: function() {
        if (this.gameover == false) {
            if (this.enemies.countLiving() <= this.enemyCount) {
                var enemy = this.enemies.getFirstDead(true);
                enemy.reset(this.world.width-50, this.rnd.integerInRange(150, this.world.height-100));
            }
        }
    },

    enemyExplode: function() {
        if (this.gameover == false) {
            if (this.enemy.exists == true) {
                this.bweeoop.stop();
                this.boom3.play();
                
                this.enemyBurst.emitX = this.enemy.x;
                this.enemyBurst.emitY = this.enemy.y;
                this.enemyBurst.start(true, 800, null, 30); //(explode, lifespan, frequency, quantity)
                
                this.enemy.kill();
                this.checkForEnemy();
                this.score = this.score + 10;
                this.checkScore();
                this.scoremessage.setText('Score: ' + this.score);
            }
        }  
    },
    
    screenWrapEnemy: function() {
        if (this.gameover) {
            if (this.enemy.x < 0) {
                //this.bweeoop.stop();
                this.enemy.kill();
            }
        }
    },
    
    /*
    checkScore: function() {
        if (this.gameover == false) {
            if (this.score != 0) {
                if ((this.score < 500 && this.score - this.prevscore > 50) || 
                    (this.score - this.prevscore > 100))  {
                    //this.deedeedee.play();
                    this.lives++;
                    this.lifemessage.setText('Lives: ' + this.lives);
                    this.prevscore = this.score;
                }    
            } 
        }
    },
    
    endGame: function() {
        this.gameover = true;
        this.ship.kill();
        this.shots.forEachExists(
                function(shot) {
                    shot.kill();
                }, this);       
        //this.bweeoop.stop();
        //this.lifemessage.setText("Lives: 0");
        
        // remember this score
        if (this.game.device.localStorage) {
            localStorage.setItem('newestScore', this.score);
            console.log("newest score is " + localStorage.getItem('newestScore'));
        } else { 
            console.log('!!!!!!!!!! Cannot set high score - no local storage !!!!!!!!!!');   
        }
        
        // game over message
        this.overmessage = this.add.bitmapText(this.world.centerX-170, this.world.centerY-80, 'eightbitwonder', 'Game Over', 40);
        
        this.timer = this.time.now + 5000;
    },
    
    quitGame: function(pointer) {
        this.state.start('HighScores');
    },   
    */ 

    togglePause: function() {
        this.physics.arcade.isPaused = (this.physics.arcade.isPaused) ? false : true;
        if (this.physics.arcade.isPaused === true) {
            //this.bweeoop.stop();
        } else {
            if (this.enemy.exists === true) {
                //this.bweeoop.loopFull();
            }
        }
        console.log('toggled pause - ' + this.physics.arcade.isPaused);
    },
    
    doNothing: function() {
        //really.
    },
        
    update: function() {
        if (this.gameover === true && this.timer < this.time.now) {
            this.quitGame();
            this.timer = null;
        }
        
        if (this.gameover === false) {
            if (this.enemies.countLiving() <= this.enemyCount && this.enemyTimer < this.time.now) {
                if (this.enemyTimer != null) {
                    console.log("need to rebuild enemy");
                    this.rebuildEnemy();
                    this.enemyTimer = null;
                }
            }

            // move the ship and the enemies
            this.ship.x += this.shipMoveRate;
            this.enemies.setAllChildren('velocity', '-5');
            
            // keyboard inputs - left, right, up
            if (this.cursors.up.isDown) {
                this.moveTargetUp();
            } else if (this.cursors.down.isDown) {
                this.moveTargetDown();
            }
                        
            this.screenWrapMyShip(this);
            this.checkForEnemy(this);
            this.screenWrapEnemy(this);
             // collisions
            //this.physics.arcade.overlap(this.enemy, this.shots, this.enemyExplode, null, this);
        }
    }
};
