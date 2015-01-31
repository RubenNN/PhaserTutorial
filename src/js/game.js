(function() {
  'use strict';

  function Game() {
    this.player = null;
    this.width = 800;
    this.height = 600;
    this.seaScroolSpeed = 12;
    this.playerSpeed = 300;
    this.spawnEnemyDelay = 1000;
    this.shotRatio = 100;
    this.minSpeedYVel = 30;
    this.maxSpeedYVel = 60;
    this.bulletVel = -500;
  }

  Game.prototype = {
   
    create: function () {
      this.setupBackground();
      this.setupPlayer();
      this.setupEnemies();
      this.setupBullets();
      this.setupExplosions();
   
      this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.checkCollisions();
        this.spawnEnemies();
        this.processPlayerInput();
    },

    render: function() {
      //This is used for debugging
      //this.game.debug.body(this.bullet);
      //this.game.debug.body(this.enemy);
      //this.game.debug.body(this.player);
    },

    enemyHit: function (bullet, enemy) {
      bullet.kill();
      enemy.kill();
      var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);
      explosion.animations.add('boom');
      explosion.play('boom', 15, false, true);
   },
   fire: function() {

      if (!this.player.alive || this.nextShotAt > this.time.now) {
        return;
      }

      if (this.bulletPool.countDead() === 0) {
        return;
      }

      this.nextShotAt = this.time.now + this.shotDelay;

      // Find the first dead bullet in the pool
      var bullet1 = this.bulletPool.getFirstExists(false);
      bullet1.reset(this.player.x + 10, this.player.y - 20);
      bullet1.body.velocity.y = this.bulletVel;

      var bullet2 = this.bulletPool.getFirstExists(false);
      bullet2.reset(this.player.x - 10, this.player.y - 20);
      bullet2.body.velocity.y = this.bulletVel;
   },
    playerHit: function (player, enemy) {
       enemy.kill();
       var explosion = this.add.sprite(player.x, player.y, 'explosion');
       explosion.anchor.setTo(0.5, 0.5);
       explosion.animations.add('boom');
       explosion.play('boom', 15, false, true);
       player.kill();
      },

    setupBackground: function () {
      this.space = this.add.tileSprite(0, 0, this.width, this.height, 'space');
      this.space.autoScroll(0, this.seaScroolSpeed);
    },
 
    setupPlayer: function () {
      this.player = this.add.sprite(400, 550, 'main');
      this.player.anchor.setTo(0.5, 0.5);
      this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);
      this.player.play('fly');
      this.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.speed = this.playerSpeed;
      this.player.body.collideWorldBounds = true;
    },
 
   setupEnemies: function () {
     this.enemyPool = this.add.group();
     this.enemyPool.enableBody = true;
     this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
     this.enemyPool.createMultiple(50, 'greenEnemy');
     this.enemyPool.setAll('anchor.x', 0.5);
     this.enemyPool.setAll('anchor.y', 0.5);
     this.enemyPool.setAll('outOfBoundsKill', true);
     this.enemyPool.setAll('checkWorldBounds', true);
 
     // Set the animation for each sprite
     this.enemyPool.forEach(function (enemy) {
       enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
     });
 
     this.nextEnemyAt = 0;
     this.enemyDelay = this.spawnEnemyDelay;
   },
 
   setupBullets: function () {
     // Add an empty sprite group into our game
     this.bulletPool = this.add.group();
 
     // Enable physics to the whole sprite group
     this.bulletPool.enableBody = true;
     this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
 
     // Add 100 'bullet' sprites in the group.
     // By default this uses the first frame of the sprite sheet and
     //   sets the initial state as non-existing (i.e. killed/dead)
     this.bulletPool.createMultiple(100, 'bullet');
 
     // Sets anchors of all sprites
     this.bulletPool.setAll('anchor.x', 0.5);
     this.bulletPool.setAll('anchor.y', 0.5);
 
     // Automatically kill the bullet sprites when they go out of bounds
     this.bulletPool.setAll('outOfBoundsKill', true);
     this.bulletPool.setAll('checkWorldBounds', true);
 
     this.nextShotAt = 0;
     this.shotDelay = this.shotRatio;
   },
 
   setupExplosions: function () {
     this.explosionPool = this.add.group();
     this.explosionPool.enableBody = true;
     this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
     this.explosionPool.createMultiple(100, 'explosion');
     this.explosionPool.setAll('anchor.x', 0.5);
     this.explosionPool.setAll('anchor.y', 0.5);
     this.explosionPool.forEach(function (explosion) {
       explosion.animations.add('boom');
     });
   },

   checkCollisions: function () {
     this.physics.arcade.overlap(
       this.bulletPool, this.enemyPool, this.enemyHit, null, this
     );
 
     this.physics.arcade.overlap(
       this.player, this.enemyPool, this.playerHit, null, this
     );
   },
 
   spawnEnemies: function () {
     if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
       this.nextEnemyAt = this.time.now + this.enemyDelay;
       var enemy = this.enemyPool.getFirstExists(false);
       // spawn at a random location top of the screen
       enemy.reset(this.rnd.integerInRange(20, 780), 0);
       // also randomize the speed
       enemy.body.velocity.y = this.rnd.integerInRange(this.minSpeedYVel, this.maxSpeedYVel);
       enemy.play('fly');
     }
   },
 
   processPlayerInput: function () {
     this.player.body.velocity.x = 0;
     this.player.body.velocity.y = 0;
 
     if (this.cursors.left.isDown) {
       this.player.body.velocity.x = -this.player.speed;
     } else if (this.cursors.right.isDown) {
       this.player.body.velocity.x = this.player.speed;
     }
 
     if (this.cursors.up.isDown) {
       this.player.body.velocity.y = -this.player.speed;
     } else if (this.cursors.down.isDown) {
       this.player.body.velocity.y = this.player.speed;
     }
 
     if (this.input.activePointer.isDown &&
         this.physics.arcade.distanceToPointer(this.player) > 15) {
       this.physics.arcade.moveToPointer(this.player, this.player.speed);
     }
 
     if (this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
         this.input.activePointer.isDown) {
       this.fire();
     }
   }

  };

  window['planes'] = window['planes'] || {};
  window['planes'].Game = Game;

}());
