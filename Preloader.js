Game.Preloader = function(game){
    this.preloaderBar = null;
};

Game.Preloader.prototype = {
    preload:function(){
        this.preloaderBar = this.add.sprite(this.world.centerX,this.world.centerY,'preloaderBar');
        this.preloaderBar.anchor.setTo(0.5);
        this.time.advancedTiming = true;
        this.load.setPreloadSprite(this.preloaderBar);
        //Load All Assets
        this.load.tilemap('map1','assets/level.json',null,Phaser.Tilemap.TILED_JSON);
        this.load.image('tileset1','assets/tileset1.png');
        this.load.spritesheet('player','assets/player.png',24,26);
        //this.load.spritesheet('buttons','assets/button.png',193,71);
       // this.load.image('drag','assets/drag.png');
        this.load.image('bird','assets/enemy.png');
        this.load.image('nut','assets/nut.png');
        this.load.image('titlescreen','assets/titlescreen.png');
        this.load.image('button1','assets/buttons.png')
    },

    create : function(){
        this.state.start('Menu');
    }
}