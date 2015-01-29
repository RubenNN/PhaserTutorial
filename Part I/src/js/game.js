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

      this.enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
      this.enemy.play('fly');
      this.enemy.anchor.setTo(0.5, 0.5)
      this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

      this.bullet = this.add.sprite(x, y, 'bullet');
      this.bullet.anchor.setTo(0.5, 0.5)
      // This two lines equals this.bullet.y -= 1;
      this.physics.enable(this.bullet, Phaser.Physics.ARCADE);
      this.bullet.body.velocity.y = -350;

      this.input.onDown.add(this.onInputDown, this);
    },

    update: function () {
      this.space.tilePosition.y += 0.6; // speed of space
      this.physics.arcade.overlap(
        this.bullet, this.enemy, this.enemyHit, null, this
      );
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

    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['planes'] = window['planes'] || {};
  window['planes'].Game = Game;

}());
