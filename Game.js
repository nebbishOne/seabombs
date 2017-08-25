SeaBombs.Game = function(game) {
    this.header;
    this.ship;
    this.shipMoveRate;
    this.waterline;
    this.waterlineX;
    this.waterlineTimer;
    this.target
    this.shots;
    this.nextfire;
    this.firerate;
    this.enemy1;
    this.enemy2;
    this.enemy3;
    this.enemy1Dir;
    this.enemy2Dir;
    this.enemy3Dir;
    this.enemy1Burst;
    this.enemy1Timer;
    this.enemy1Shots;
    this.enemy1ShotTimer;
    this.enemy2Burst;
    this.enemy2Timer;
    this.enemy2Shots;
    this.enemy2ShotTimer;
    this.enemy3Burst;
    this.enemy3Timer;
    this.enemy3Shots;
    this.enemy3ShotTimer;
    this.beep;
    this.boom1;
    this.boom2;
    this.boom3;
    this.boop1;
    this.boop2;
    this.cursors;
    this.control;
    this.shotFired;
    this.shotTargetY;
    this.shotBurst;
    this.score;
    this.prevscore;
    this.scoremessage;
    this.gameover;
    this.overmessage;
    this.timer;
    this.timeKeeper;
    this.timerMessage;
    this.timerLifespan;
    this.upKey;
    this.downKey;
    this.pauseKey;
};

SeaBombs.Game.prototype = {
    
    create: function() {
        this.timer = this.time.now;
        this.timeKeeper = 60;
        this.timerMessage = "";
        this.timerLifespan = 1000;
        this.score = 0;
        this.prevscore = 0;
        this.gameover = false;
        this.enemy1Timer = null;
        this.enemy1ShotTimer = null;
        this.enemy2Timer = null;
        this.enemy2ShotTimer = null;
        this.enemy3Timer = null;
        this.enemy3ShotTimer = null;
        this.waterlineX = 0;
        this.waterlineTimer = this.time.now + 500;
        this.enemy1Dir = 0;           // 0 = right to left, 1 = left to right
        this.enemy1Dir = 1;
        this.enemy1Dir = 0;
        this.shipMoveRate = 4;
        this.nextfire = 0;
        this.firerate = 400;
        this.shotFired = false;
        this.shotBurst = null;
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
        this.buildShotEmitter();
        this.buildTarget();
        this.buildWater();
        this.buildEnemies();
        this.buildEnemyEmitter();
        //this.buildEnemyShots();

        this.timerMessage = this.add.bitmapText(20, 10, 'eightbitwonder', 'Time: ' + this.timeKeeper.toString(), 20);
        this.timerMessage.lifespan = this.timerLifespan;
        this.scoremessage = this.add.bitmapText(this.world.width-240, 10, 'eightbitwonder', 'Score:' + this.score.toLocaleString(), 20);
        this.header = this.add.image((this.world.width/2)-150, 20, 'header');
        this.header.height = 25;
        this.header.width = 250;
                
        this.cursors = this.input.keyboard.createCursorKeys();
        this.control = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.control.onDown.add(this.fireShot, this);
    },
    
    buildShip: function() {
        this.ship = this.add.sprite(this.world.centerX, 80, 'ship');
        this.physics.enable(this.ship, Phaser.Physics.ARCADE);
        this.ship.body.maxVelocity.set(5000);   //this.shipMoveRate);
        this.ship.height = 50;
        this.ship.width = 200; 
        this.ship.enableBody = true;
        this.ship.allowRotation = false;
        this.ship.bringToTop();
        this.ship.anchor.setTo(0.1, 0.1);
    },

    buildWater: function() {
        this.waterline = this.add.sprite(0, 115, 'waterline');
        this.waterline.enableBody = true;
    },

    flipWater: function() {
        if (!this.gameover) {
            this.waterlineX = this.waterlineX === 0 ? -25 : 0;
            //console.log('this.waterline X is ' + this.waterlineX);
            this.waterline.reset(this.waterlineX, this.waterline.y);
        }
    },
    
    buildShots: function() {
        this.shots = this.add.group();
        this.shots.physicsBodyType = Phaser.Physics.ARCADE;
        this.shots.enableBody = true;
        this.shots.createMultiple(5, 'shot');
        this.shots.setAll('checkWorldBounds', true);
        this.shots.setAll('outOfBoundsKill', true);
    },

    buildTarget: function() {
        this.target = this.add.sprite(0, this.world.centerY-50, 'target');
        this.target.height = 3;
        this.target.enableBody = true;
        this.target.bringToTop();
        this.target.allowRotation = false;
    },

    moveTargetDown: function() {
        if (!this.gameover) {
            if (this.target && this.target.y < 550) {
                this.target.y = this.target.y + 5;
            }
        }
    },

    moveTargetUp: function() {
        if (!this.gameover && this.target.y > 150) {
            if (this.target) {
                this.target.y = this.target.y - 5;
            }
        }
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
        if (!this.gameover) {
            if (this.ship.exists) {
                // there can only be 5 shots on the screen at once:
                if (this.time.now > this.nextfire && this.shots.countDead() > 0 && this.shots.countLiving() < 5) {
                    this.nextfire = this.time.now + this.firerate;            
                    var shot = this.shots.getFirstDead();            
                    shot.reset(this.ship.x, this.ship.y);
                    this.physics.arcade.velocityFromAngle(90, 100, shot.body.velocity);
                    shot.shotTargetY = this.target.y;
                    //this.playRndSound('boop');
                }
            }
        }
    },

    checkAllShots: function() {
        if (!this.gameover) {
            this.shots.forEachExists(this.explodeShotAtDepth, this);
        }
    },

    explodeShotAtDepth: function(shot) {
        if (shot.alive === true) {
            var r = 10;
            if (shot.y >= shot.shotTargetY - r && shot.y <= shot.shotTargetY + r) { 
                r = 50;
                if (shot.x >= (this.enemy1.x - r) && shot.x <= (this.enemy1.x + r)) {
                    this.enemyExplode(shot, this.enemy1);
                } else if (shot.x >= (this.enemy2.x - r) && shot.x <= (this.enemy2.x + r)) {
                    this.enemyExplode(shot, this.enemy2);
                } else if (shot.x >= (this.enemy3.x - r) && shot.x <= (this.enemy3.x + r)) {
                    this.enemyExplode(shot, this.enemy3);
                } else {
                    this.shotExplode(shot);
                }
            }
        }
    },

    buildShotEmitter:function() {
        this.shotBurst = this.add.emitter(0, 0, 50);
        this.shotBurst.minParticleScale = 0.3;
        this.shotBurst.maxParticleScale = 0.8;
        this.shotBurst.minParticleSpeed.setTo(-50, 50);
        this.shotBurst.maxParticleSpeed.setTo(50, -50);
        this.shotBurst.makeParticles('explosion');
    },

    shotExplode: function(shot) {
        if (!this.gameover && shot.alive === true) {
            this.shotBurst.emitX = shot.x;
            this.shotBurst.emitY = shot.y;
            this.shotBurst.start(true, 800, null, 30); //(explode, lifespan, frequency, quantity)
            shot.kill();
            console.log('BOOOOOOOOOOOOOOOOOOOOOOOOOM');
        }
    },
       
    buildEnemyEmitter:function() {
        // enemy 1
        this.enemy1Burst = this.add.emitter(0, 0, 30);
        this.enemy1Burst.minParticleScale = 0.1;
        this.enemy1Burst.maxParticleScale = 0.5;
        this.enemy1Burst.minParticleSpeed.setTo(-90, 90);
        this.enemy1Burst.maxParticleSpeed.setTo(90, -90);
        this.enemy1Burst.makeParticles('enemyexplosion');

        // enemy 2
        this.enemy2Burst = this.add.emitter(0, 0, 30);
        this.enemy2Burst.minParticleScale = 0.1;
        this.enemy2Burst.maxParticleScale = 0.5;
        this.enemy2Burst.minParticleSpeed.setTo(-90, 90);
        this.enemy2Burst.maxParticleSpeed.setTo(90, -90);
        this.enemy2Burst.makeParticles('enemyexplosion');

        // enemy 3
        this.enemy3Burst = this.add.emitter(0, 0, 30);
        this.enemy3Burst.minParticleScale = 0.1;
        this.enemy3Burst.maxParticleScale = 0.5;
        this.enemy3Burst.minParticleSpeed.setTo(-90, 90);
        this.enemy3Burst.maxParticleSpeed.setTo(90, -90);
        this.enemy3Burst.makeParticles('enemyexplosion');
    },
        
    screenWrapMyShip: function() {
        if (this.ship.x > this.game.width) {
            this.ship.x = 0;
        }
    },
    
    buildEnemies: function() {
        // build enemy 1
        this.enemy1 = this.add.sprite(this.world.width-75, this.rnd.integerInRange(100, this.world.height-100), 'enemy1');
        this.physics.enable(this.enemy1, Phaser.Physics.ARCADE);
        this.enemy1.height = 50;
        this.enemy1.width = 150; 
        this.enemy1.enableBody = true;
        this.enemy1.allowRotation = false;
        this.enemy1.anchor.setTo(0.1, 0.1);
        this.enemy1.sendToBack();
        this.enemy1.kill();

        // build enemy 2
        this.enemy2 = this.add.sprite(this.world.width-75, this.rnd.integerInRange(100, this.world.height-100), 'enemy2');
        this.physics.enable(this.enemy2, Phaser.Physics.ARCADE);
        this.enemy2.height = 50;
        this.enemy2.width = 130; 
        this.enemy2.enableBody = true;
        this.enemy2.allowRotation = false;
        this.enemy2.anchor.setTo(0.1, 0.1);
        this.enemy2.sendToBack();
        this.enemy2.kill();

        // build enemy 3
        this.enemy3 = this.add.sprite(this.world.width-75, this.rnd.integerInRange(100, this.world.height-100), 'enemy3');
        this.physics.enable(this.enemy3, Phaser.Physics.ARCADE);
        this.enemy3.height = 50;
        this.enemy3.width = 110; 
        this.enemy3.enableBody = true;
        this.enemy3.allowRotation = false;
        this.enemy3.anchor.setTo(0.1, 0.1);
        this.enemy3.sendToBack();
        this.enemy3.kill();
    },
    
    checkForEnemy: function() {
        if (this.enemy1.alive === false) {
            if (this.enemy1Timer === null) {
                this.enemy1Timer = this.time.now + this.rnd.integerInRange(1000,5000);
                //console.log("Setting enemy1 timer to " + this.enemy1Timer);
            }
        } 
        if (this.enemy2.alive === false) {
            if (this.enemy2Timer === null) {
                this.enemy2Timer = this.time.now + this.rnd.integerInRange(1000,5000);
                //console.log("Setting enemy1 timer to " + this.enemy2Timer);
            }
        } 
        if (this.enemy3.alive === false) {
            if (this.enemy3Timer === null) {
                this.enemy3Timer = this.time.now + this.rnd.integerInRange(1000,5000);
                //console.log("Setting enemy1 timer to " + this.enemy3Timer);
            }
        }    
    },
    
    rebuildEnemy: function(game) {
        if (!this.gameover) {
            if (this.enemy1.alive === false) {
                this.enemy1Dir = this.rnd.integerInRange(0,1);
                var vel = this.rnd.integerInRange(100, 150);
                if (this.enemy1Dir === 0) {
                    this.enemy1.reset(this.world.width-75, this.rnd.integerInRange(150, this.world.height-100));  
                    this.enemy1.body.velocity.x = (vel * -1);
                } else {
                    this.enemy1.reset(50, this.rnd.integerInRange(150, this.world.height-100));  
                    this.enemy1.body.velocity.x = vel;
                }
                //console.log('Created Enemy #1.');
            }
            if (this.enemy2.alive === false) {
                this.enemy2Dir = this.rnd.integerInRange(0,1);
                var vel = this.rnd.integerInRange(200, 250);
                if (this.enemy2Dir === 0) {
                    this.enemy2.reset(this.world.width-75, this.rnd.integerInRange(150, this.world.height-100));  
                    this.enemy2.body.velocity.x = (vel * -1);
                } else {
                    this.enemy2.reset(50, this.rnd.integerInRange(150, this.world.height-100));  
                    this.enemy2.body.velocity.x = vel;
                }
                //console.log('Created Enemy #2.');
            }
            if (this.enemy3.alive === false) {
                this.enemy3Dir = this.rnd.integerInRange(0,1);
                var vel = this.rnd.integerInRange(300, 350);
                if (this.enemy3Dir === 0) {
                    this.enemy3.reset(this.world.width-75, this.rnd.integerInRange(350, this.world.height-100));  
                    this.enemy3.body.velocity.x = (vel * -1);
                } else {
                    this.enemy3.reset(50, this.rnd.integerInRange(150, this.world.height-100));  
                    this.enemy3.body.velocity.x = vel;
                }
                //console.log('Created Enemy #3.');
            }
        }
    },

    enemyExplode: function(shot, enemy) {
        if (!this.gameover) {
            console.log('KABOOOOOOOOM');
            if (enemy.exists == true) {
                    //this.bweeoop.stop();
                    //this.boom3.play();
                    this.enemy1Burst.emitX = enemy.x;
                    this.enemy1Burst.emitY = enemy.y;
                    this.enemy1Burst.start(true, 800, null, 30); //(explode, lifespan, frequency, quantity)
                    
                    shot.kill();
                    enemy.kill();
                    this.checkForEnemy();
                    if (enemy.y > 600) { 
                        this.score += 150;
                    } else if (enemy.y > 400) {
                        this.score += 50
                    } else { 
                        this.score += 25;
                    }
                    this.scoremessage.setText('Score: ' + this.score);
            }
        }  
    },
    
    screenWrapEnemy: function() {
        if (!this.gameover) {
            if (this.enemy1.exists === true) {
                var kill1 = false;
                if (this.enemy1Dir === 0) {
                    if (this.enemy1.x < 0) {
                        kill1 = true;
                    }
                } else {
                    if (this.enemy1.x > this.world.width) {
                        kill1 = true;
                    }
                }
                if (kill1 === true) {
                    //this.bweeoop.stop();
                    this.enemy1.kill();
                    this.enemy1Timer = null;
                    //console.log('................Killed enemy1.');
                }
            }
            if (this.enemy2.exists === true) {
                var kill2 = false;
                if (this.enemy2Dir === 0) {
                    if (this.enemy2.x < 0) {
                        kill2 = true;
                    }
                } else {
                    if (this.enemy2.x > this.world.width) {
                        kill2 = true;
                    }
                }
                if (kill2 === true) {
                    //this.bweeoop.stop();
                    this.enemy2.kill();
                    this.enemy2Timer = null;
                    //console.log('................Killed enemy2.');
                }
            }
            if (this.enemy3.exists === true) {
                var kill3 = false;
                if (this.enemy3Dir === 0) {
                    if (this.enemy3.x < 0) {
                        kill3 = true;
                    }
                } else {
                    if (this.enemy3.x > this.world.width) {
                        kill3 = true;
                    }
                }
                if (kill3 === true) {
                    //this.bweeoop.stop();
                    this.enemy3.kill();
                    this.enemy3Timer = null;
                    //console.log('................Killed enemy3.');
                }
            }
        }
    },
    
    checkScore: function() {
        if (!this.gameover) {
            if (this.score != 0) {
                if (this.score != this.prevscore) {
                    if (this.score % 100 == 0 && this.timeKeeper > 1) {
                        this.timeKeeper += 5;
                    }
                    this.prevscore = this.score; 
                }   
            } 
        }
    },

    checkGameTimer: function() {
        if (!this.gameover) {
            if (this.timeKeeper === 0) {
                this.endGame();
            }
        }
    },

    endGame: function() {
        this.gameover = true;
        this.ship.velocity = 0;
        this.shots.forEachExists(
                function(shot) {
                    shot.kill();
                }, this);       
        
        //this.bweeoop.stop();
        //this.lifemessage.setText("Lives: 0");
        
        // remember this score
        if (this.game.device.localStorage) {
            localStorage.setItem('seaBombsNewestScore', this.score);
            console.log("newest score is " + localStorage.getItem('seaBombsNewestScore'));
        } else { 
            console.log('!!!!!!!!!! Cannot set high score - no local storage !!!!!!!!!!');   
        }
        
        // game over message
        this.overmessage = this.add.bitmapText(this.world.centerX-170, this.world.centerY-80, 'eightbitwonder', 'Game Over', 40);
        
        this.timer = this.time.now + 3000;
    },
    
    quitGame: function(pointer) {
        this.state.start('HighScores');
    },   
    
    togglePause: function() {
        this.physics.arcade.isPaused = (this.physics.arcade.isPaused) ? false : true;
        if (this.physics.arcade.isPaused === true) {
            //this.bweeoop.stop();
        } else {
            /*
            if (this.enemies.countLiving() > 0) {
                //this.bweeoop.loopFull();
            }
            */
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
            //console.log('this.timer : ' + this.timer + '           this.time.now: ' + this.time.now);
            if (this.timer + 1100 <= this.time.now) {            // every 2 seconds...
                this.timeKeeper = this.timeKeeper > 0 ? this.timeKeeper - 1 : 0;
                this.checkScore();
                //console.log(this.timeKeeper);
                //this.timerMessage = this.add.bitmapText(20, 10, 'eightbitwonder', "...........................", 20);
                this.timerMessage = this.add.bitmapText(20, 10, 'eightbitwonder', 'Time: ' + this.timeKeeper.toString(), 20);
                this.timerMessage.lifespan = this.timerLifespan;
                this.timer = this.time.now;
            }

            var rebuild = false;
            if (this.enemy1Timer != null && this.enemy1Timer < this.time.now) {
                if (this.enemy1.exists == false) {
                    rebuild = true;
                }
            }
            if (this.enemy2Timer != null && this.enemy2Timer < this.time.now) {
                if (this.enemy2.exists == false) {
                    rebuild = true;
                }
            }
            if (this.enemy3Timer != null && this.enemy3Timer < this.time.now) {
                if (this.enemy3.exists == false) {
                    rebuild = true;
                }
            }
            if (rebuild === true) {
                console.log("need to rebuild enemy");
                this.rebuildEnemy(this);
            }

            if (this.waterlineTimer < this.time.now) {
                this.flipWater();
                this.waterlineTimer = this.time.now + 500;
            }

            this.ship.x += this.shipMoveRate;
            
            // keyboard inputs - left, right, up
            if (this.cursors.up.isDown) {
                this.moveTargetUp();
            } else if (this.cursors.down.isDown) {
                this.moveTargetDown();
            }
                        
            this.screenWrapMyShip();
            this.screenWrapEnemy();
            this.checkForEnemy();
            this.checkAllShots();
            this.checkGameTimer();
        }
    }
};
