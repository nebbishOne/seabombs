var SeaBombs = {};

SeaBombs.Boot = function(game) {};

SeaBombs.Boot.prototype = {

    preload: function() {
        this.load.image('titleimage', 'images/title.png');
    },

	create: function() {
		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = false; // pause game on tab change

		this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
		this.scale.minWidth = 800;
		this.scale.minHeight = 600;
		this.scale.updateLayout(true);  // true will force screen resize no matter what

		this.input.addPointer();
		this.stage.backgroundColor = '#000';

		//console.log('BOOT) width = ' + (this.world.width || '0') + ' and height = ' + (this.world.height || '0'));
		
		this.state.start('Preloader');
	}
};
