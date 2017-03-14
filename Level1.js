EnemyBird = function(index,game,x,y){
    this.bird = game.add.sprite(x,y,'bird');
    this.bird.anchor.setTo(0.5);
    this.bird.name = index.toString();
    game.physics.enable(this.bird,Phaser.Physics.ARCADE);
    this.bird.body.immovable = true;
    this.bird.body.collideWorldBounds = true;
    this.bird.body.allowGravity = false;
    this.birdTween = game.add.tween(this.bird).to({
        y : this.bird.y + 25
    },2000,'Linear',true,0,100,true);
}

var enemy1;

Game.Level1 = function(game){};

var map;
var layer;
var player;
var controls = {};
var playerSpeed = 150;
var jumpTimer = 0;
var buttons;
var drag;
var shootTime = 0;
var nuts;
var respawn;

Game.Level1.prototype = {
    create : function(game){
        this.stage.backgroundColor = '#3A5963';
        this.physics.arcade.gravity.y = 1400; 
        respawn = game.add.group();
        map = this.add.tilemap('map1');
        map.addTilesetImage('tileset1','tileset1');
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        map.setCollisionBetween(0,2);
        map.setTileIndexCallback(7,this.getcoin,this);
        map.setTileIndexCallback(6,this.spawn,this);
        map.setTileIndexCallback(9,this.speedPowerup,this);
        map.createFromObjects('Object Layer 1',8,'',0,true,false,respawn);
        player = this.add.sprite(100,560,'player');
        player.scale.setTo(2,2);
        player.anchor.setTo(0.5);
        this.spawn();
        player.animations.add('idle',[0,1],1,true);
        player.animations.add('jump',[2],1,true);
        player.animations.add('run',[3,4,5,6,7,8],7,true);
        this.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        controls = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            shoot: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            up: this.input.keyboard.addKey(Phaser.Keyboard.W),
        };
      /*  button = this.add.button(this.world.centerX - 95, this.world.centerY + 200, 'buttons', function(){
            console.log('pressed');
        },this,2,1,0);
        button.fixedToCamera = true;
        drag = this.add.sprite(player.x,player.y,'drag');
        drag.anchor.setTo(0.5);
        drag.inputEnabled = true;
        drag.input.enableDrag(true);*/
        enemy1 = new EnemyBird(0,game,player.x+500,player.y-200);
        nuts = game.add.group();
        nuts.enableBody = true;
        nuts.physicsBodyTupe = Phaser.Physics.ARCADE;
        nuts.createMultiple(5,'nut');
        nuts.setAll('anchor.x',0.5);
        nuts.setAll('anchor.y',0.5);
        nuts.setAll('scale.x',0.5);
        nuts.setAll('scale.y',0.5);
        nuts.setAll('outOfBoundsKill',true);
        nuts.setAll('checkWorldBounds',true);
    },
    update : function(){
        this.physics.arcade.collide(player,layer);
        this.physics.arcade.collide(player,enemy1.bird,this.resetPlayer);
        player.body.velocity.x = 0;
        if(controls.right.isDown)
        {
            player.animations.play('run');
            player.scale.setTo(2,2);
            player.body.velocity.x += playerSpeed;
        }
        if(controls.left.isDown)
        {
            player.animations.play('run');
            player.scale.setTo(-2,2);
            player.body.velocity.x -= playerSpeed;
        }
        if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && this.time.now > jumpTimer)
        {
            player.body.velocity.y = -650;
            jumpTimer = this.time.now + 750;
            player.animations.play('jump');
        }
        if(player.body.velocity.x == 0 && player.body.velocity.y == 0)
        {
            player.animations.play('idle');
        }
        if(controls.shoot.isDown)
        {
            this.shootNut();
        }
        if(checkOverlap(nuts,enemy1.bird))
        {
            enemy1.bird.kill();
        }

    },
    resetPlayer : function(){
        player.reset(100,560);
    },
    spawn : function(){
        respawn.forEach(function(spawnPoint){
            player.reset(spawnPoint.x,spawnPoint.y);
        },this);
    },
    getcoin : function(){
        map.putTile(-1, layer.getTileX(player.x), layer.getTileY(player.y));
    },
    speedPowerup : function(){
        map.putTile(-1, layer.getTileX(player.x), layer.getTileY(player.y));
        playerSpeed += 50;
        this.time.events.add(Phaser.Timer.SECOND * 10,function(){
            playerSpeed -= 50;
        });
    },
    shootNut : function(){
        if(this.time.now > shootTime)
        {
            nut = nuts.getFirstExists(false);
            if(nut)
            {
                nut.reset(player.x,player.y);
                nut.body.velocity.y = -600;
                shootTime = this.time.now + 900;
            }
        }
    }
}

function checkOverlap(spriteA,spriteB)
{
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA,boundsB);
}