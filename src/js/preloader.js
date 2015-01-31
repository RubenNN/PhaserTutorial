(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(320, 240, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.image('space', 'assets/space.png');
      this.load.image('bullet', 'assets/bullet.png');
      this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32); // We load a sprite sheet instead of an image. Including the width and height of the individual frames
      this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
      this.load.spritesheet('main', 'assets/main.png', 36, 24); // We load a sprite sheet instead of an image. Including the width and height of the individual frames

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['planes'] = window['planes'] || {};
  window['planes'].Preloader = Preloader;

}());
