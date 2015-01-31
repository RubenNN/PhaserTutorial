(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {
   
    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

      this.space = this.add.tileSprite(0, 0, 800, 600, 'space');

      this.enemy = this.add.sprite(400, 200, 'greenEnemy');

      this.player = this.add.sprite(400, 500, 'main');

      // This is our  player
      this.player.animations.add('fly', [ 0, 1, 2], 10, true);
      this.player.play('fly');
      this.player.anchor.setTo(0.5, 0.5);
      this.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.speed = 300;
      this.player.body.collideWorldBounds = true;

      this.enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
      this.enemy.play('fly');
      this.enemy.anchor.setTo(0.5, 0.5)
      this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

      this.bullets = [];
      this.nextShotAt = 0;
      this.shotDelay = 100;

      this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
      this.space.tilePosition.y += 0.6; // speed of space
      for (var i = 0; i < this.bullets.length; i++) {
        this.physics.arcade.overlap(
          this.bullets[i], this.enemy, this.enemyHit, null, this
        );
      }

      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;

      // Movement with keys
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

      // Movement with mouse
      if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
        this.physics.arcade.moveToPointer(this.player, this.player.speed);
      }

      if (this.input.keyboard.isDown(Phaser.Keyboard.Z) ||  this.input.activePointer.isDown) {
        this.fire();
      }
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

      if (this.nextShotAt > this.time.now) {
        return;
      }

      this.nextShotAt = this.time.now + this.shotDelay;

      var bullet1 = this.add.sprite(this.player.x + 10, this.player.y - 20, 'bullet');
      var bullet2 = this.add.sprite(this.player.x - 10, this.player.y - 20, 'bullet');

      bullet1.anchor.setTo(0.5, 0.5);
      bullet2.anchor.setTo(0.5, 0.5);

      this.physics.enable(bullet1, Phaser.Physics.ARCADE);
      this.physics.enable(bullet2, Phaser.Physics.ARCADE);

      bullet1.body.velocity.y = -500;
      bullet2.body.velocity.y = -500;

      this.bullets.push(bullet1);
      this.bullets.push(bullet2);
   },
    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['planes'] = window['planes'] || {};
  window['planes'].Game = Game;

}());
