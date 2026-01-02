class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
    });

    this.configure();
    this.gameConfig();
  }
  gameConfig() {
    this.totalSpins = 0;
    this.segments = null;
  }
  configure() {
    this.screen = "home";
    this.soundOn = true;
  }

  preload() {
    this.loadingText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "Loading: 0%",
        {
          fontFamily: "Arial",
          fontSize: "32px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    this.load.image("wheel", `${gitHubUrl}spin/wheel.png`);
    this.load.image("logo", `${gitHubUrl}spin/logo.png`);
    this.load.image("spark", `${gitHubUrl}spin/spark.png`);

    this.load.image("UIBackground", `${gitHubUrl}spin/bg.png`);
    this.load.image("particle", `${gitHubUrl}spin/particles.webp`);
    this.load.image("dollers", `${gitHubUrl}spin/dollers.png`);

    this.load.image("home", `${gitHubUrl}UI/home-icon.png`);
    this.load.image("close", `${gitHubUrl}UI/close.png`);
    this.load.image("infoIcon", `${gitHubUrl}UI/info-icon.png`);
    this.load.image("soundOn", `${gitHubUrl}UI/soundon-button.png`);
    this.load.image("soundOff", `${gitHubUrl}UI/soundoff-button.png`);

    this.load.audio("spinning", `${gitHubUrl}sounds/spinning.mp3`);
    this.load.audio("bgaudio", `${gitHubUrl}sounds/bgaudio.mp3`);
    this.load.audio("congrats", `${gitHubUrl}sounds/congrats.mp3`);
    this.load.audio("lost", `${gitHubUrl}sounds/lose-sound.mp3`);

    this.load.on("progress", (value) => {
      this.loadingText.setText(`Loading: ${Math.round(value * 100)}%`);
    });
    this.load.on("complete", () => {
      this.loadingText.destroy(); // remove from screen
    });
  }

  create() {
    this.cameras.main.fadeIn(1000);

    if (this.loaderImage) {
      this.loaderImage.destroy();
    }

    this.scoreText2 = this.add
      .text(400, 200, this.score, {
        fontFamily: "RakeslyRG",
        stroke: "#000000",
        fontSize: "100px",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(-2)
      .setVisible(false);
    this.canJump = true;
    console.log("Preload Completed");
    this.addUI();
  }

  addUI() {
    this.screenRatio = 2.3;
    if (this.screen === "home") {
      this.addHomeUI();
    } else if (this.screen === "info") {
      this.addInfoUI();
    }
  }
  addHomeUI() {
    this.addSounds();

    // let UIBackgroundSize = 0;
    // if (width < height) {
    //   UIBackgroundSize = height;
    // } else {
    //   UIBackgroundSize = width;
    // }
    this.UIBackground = this.add
      .image(halfWidth, halfHeight, "UIBackground")
      .setDisplaySize(width, height)
      .setAlpha(1);
    this.UIBackground.setDepth(-1);

    this.frequency = 300;

    const particles = this.add.particles(0, 0, "particle", {
      x: halfWidth,
      y: halfHeight * 0.9,
      speed: { min: 200, max: 300 },
      angle: { min: 0, max: 360 },
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 3 },
      lifespan: 1200,
      frequency: 10,
      blendMode: "ADD",
    });

    // const dollers = this.add.particles(0, 0, "dollers", {
    //   x: halfWidth,
    //   y: halfHeight * 0.9,
    //   speed: { min: 200, max: 300 },
    //   angle: { min: 0, max: 360 },
    //   alpha: { start: 1, end: 0 },
    //   scale: { start: 0.4, end: 0.2 },
    //   lifespan: 2000,
    //   frequency: this.frequency,
    //   blendMode: "ADD",
    // });

    if (this.soundOn) {
      this.bgaudioSound.play();
    }

    if (isMobile) {
      this.logo = this.add.image(200, 80, "logo").setScale(0.1);
      this.titleText = this.add
        .text(380, 80, gameName, {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#D34F00",
          align: "center",
        })
        .setOrigin(0.5);

      this.soundIcon = this.add
        .image(580, 57, this.soundOn ? "soundOn" : "soundOff")
        .setScale(0.37)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .setDepth(Infinity);

      this.infoIcon = this.add
        .image(650, 55, "infoIcon")
        .setScale(0.4)
        .setInteractive({ useHandCursor: true });

      this.playerInfoBox = this.add.graphics();
      this.playerInfoBox.fillStyle(0xaaaaaa, 1);
      this.playerInfoBox.fillRoundedRect(50, 160, 600, 120, 20);
      this.playerInfoBox.setAlpha(0.6);

      this.playerNameTitle = this.add
        .text(150, 185, "Player", {
          fontFamily: "RakeslyRG",
          fontSize: "25px",
          color: "#001bebff",
          align: "center",
        })
        .setOrigin(0.5);

      this.playerNameText = this.add
        .text(80, 185 + 50, this.playerName, {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#f08801ff",
          align: "center",
        })
        .setOrigin(0, 0.5);
      this.playerPointTitle = this.add
        .text(550, 185, "Points", {
          fontFamily: "RakeslyRG",
          fontSize: "25px",
          color: "#001bebff",
          align: "center",
        })
        .setOrigin(0.5);

      this.playerPointText = this.add
        .text(550, 185 + 50, this.playerPoint, {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#f08801ff",
          align: "center",
        })
        .setOrigin(0.5);

      //Wheel
      const wheel = this.createWheel(this, 350, 600, 257);
      this.wheelCover = this.add
        .image(350, 600, "wheel")
        .setScale(1.2)
        .setAlpha(1);

      this.SpinBtnBox = this.add
        .rexRoundRectangle(350, 940, 450, 100, 50, 0xc97b00)
        .setDepth(5)
        .setInteractive({ useHandCursor: true });

      this.SpinBtn = this.add
        .text(350, 940, "SPIN", {
          fontFamily: "RakeslyRG",
          fontSize: "32px",
          color: "#fff",
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(6);

      this.SpinBtnBox.on("pointerdown", () => {
        this.spinPressed(this.SpinBtn, this.SpinBtnBox, wheel);
      });

      // Result Box
    } else {
      this.titleTextBox = this.add.graphics();
      this.titleTextBox.fillStyle(0x554422, 1);
      this.titleTextBox.fillRoundedRect(70, 40, 80, 100, 10);

      this.titleTextBox.lineStyle(4, 0xd34f00, 1);
      this.titleTextBox.strokeRoundedRect(70, 40, 80, 100, 10);
      this.titleTextBox.setAlpha(0.7);

      this.logo = this.add
        .image(40, 20, "logo")
        .setDisplaySize(140, 140)
        .setOrigin(0);
      this.titleText = this.add
        .text(160, 90, gameName, {
          fontFamily: "RakeslyRG",
          fontSize: "50px",
          color: "#D34F00",
          align: "left",
        })
        .setOrigin(0, 0.5);

      this.soundIcon = this.add
        .image(width - 160, 57, this.soundOn ? "soundOn" : "soundOff")
        .setScale(0.4)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .setDepth(Infinity);

      this.infoIcon = this.add
        .image(width - 80, 55, "infoIcon")
        .setScale(0.4)
        .setInteractive({ useHandCursor: true });
      this.wheelCover = this.add
        .image(halfWidth + 22, height * 0.45, "wheel")
        .setScale(0.9)
        .setAlpha(1);
      const wheel = this.createWheel(this, halfWidth, halfHeight * 0.95, 295);

      this.SpinBtnBox = this.add
        .rexRoundRectangle(width / 2, height - 70, 200, 80, 20, 0xc97b00)
        .setStrokeStyle(5, 0xffffff) // ← 5px white stroke
        .setDepth(4)
        .setInteractive({ useHandCursor: true });

      this.SpinBtn = this.add
        .text(width / 2, height - 70, "SPIN", {
          fontFamily: "RakeslyRG",
          fontSize: "32px",
          color: "#fff",
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(6);

      this.SpinBtnBox.on("pointerdown", () => {
        this.spinPressed(this.SpinBtn, this.SpinBtnBox, wheel);
        // if (!this.clicked) {
        //   this.clicked = true;
        //   this.tweens.add({
        //     targets: this.SpinBtnBox,
        //     scale: 0.9,
        //     duration: 100,
        //     onComplete: () => {
        //       this.tweens.add({
        //         targets: this.SpinBtnBox,
        //         scale: 1,
        //         duration: 100,
        //         onComplete: () => {
        //           this.clicked = false;
        //         },
        //       });
        //     },
        //   });
        // }
      });
    }

    this.soundIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.soundIcon,
        scale: 0.3,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.soundIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              if (this.soundOn) {
                this.sound.stopAll();
                this.soundOn = false;

                this.soundIcon.setTexture("soundOff");
              } else {
                this.soundOn = true;
                this.bgaudioSound.play();
                this.soundIcon.setTexture("soundOn");
              }
            },
          });
        },
      });
    });

    this.infoIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.infoIcon,
        scale: 0.5,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.infoIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              if (!this.spinning) {
                this.screen = "info";

                this.scene.restart();
              }
            },
          });
        },
      });
    });
  }

  createWheel(scene, x, y, radius) {
    this.segments = wheelPrizes;
    let totalProbability = wheelPrizes.reduce(
      (sum, prize) => sum + prize.probability,
      0
    );
    let niceTryProbability =
      (100 - totalProbability) / (20 - wheelPrizes.length);

    for (let i = 0; i < sliceNumber - wheelPrizes.length; i++) {
      this.segments = [
        ...this.segments,
        {
          name: "Nice try",
          probability: niceTryProbability,
        },
      ];
    }

    this.segments.sort(() => Math.random() - 0.5);

    const wheelContainer = scene.add.container(x, y);
    const gfx = scene.add.graphics();
    wheelContainer.add(gfx);
    const thickness = radius * 0.49;
    const innerRadius = radius - thickness;
    const sepColor = 0xc68e00;
    const outerStroke = 4;
    const total = this.segments.length;
    const degPer = 360 / total;

    const outerCircle = scene.add.graphics();
    outerCircle.lineStyle(17, 0xc68e00, 1);
    outerCircle.strokeCircle(0, 0, radius + 8.5);
    wheelContainer.add(outerCircle);

    for (let i = 0; i < total; i++) {
      const seg = this.segments[i] || {};
      const startAngle = Phaser.Math.DegToRad(-90 + i * degPer);
      const endAngle = Phaser.Math.DegToRad(-90 + (i + 1) * degPer);
      const midAngle = (startAngle + endAngle) / 2;
      const color = this.getRandomDarkColor();
      const pointsOuter = 64;
      const outerPoints = [];
      for (let p = 0; p <= pointsOuter; p++) {
        const t = p / pointsOuter;
        const a = Phaser.Math.Interpolation.Linear([startAngle, endAngle], t);
        outerPoints.push({
          x: Math.cos(a) * radius,
          y: Math.sin(a) * radius,
        });
      }
      const innerPoints = [];
      const pointsInner = 64;

      for (let p = 0; p <= pointsInner; p++) {
        const t = p / pointsInner;
        const a = Phaser.Math.Interpolation.Linear([endAngle, startAngle], t);
        innerPoints.push({
          x: Math.cos(a) * innerRadius,
          y: Math.sin(a) * innerRadius,
        });
      }
      gfx.fillStyle(color, 1);
      gfx.beginPath();
      gfx.moveTo(outerPoints[0].x, outerPoints[0].y);
      for (let p = 1; p < outerPoints.length; p++)
        gfx.lineTo(outerPoints[p].x, outerPoints[p].y);
      for (let p = 0; p < innerPoints.length; p++)
        gfx.lineTo(innerPoints[p].x, innerPoints[p].y);
      gfx.closePath();
      gfx.fillPath();
      gfx.lineStyle(outerStroke, sepColor, 1);
      gfx.beginPath();
      gfx.moveTo(outerPoints[0].x, outerPoints[0].y);
      for (let p = 1; p < outerPoints.length; p++)
        gfx.lineTo(outerPoints[p].x, outerPoints[p].y);
      for (let p = 0; p < innerPoints.length; p++)
        gfx.lineTo(innerPoints[p].x, innerPoints[p].y);
      gfx.closePath();
      gfx.strokePath();

      if (isMobile) {
        const labelRadius = innerRadius + (radius - innerRadius) * 0.65;
        const labelX = Math.cos(midAngle) * labelRadius;
        const labelY = Math.sin(midAngle) * labelRadius;
        const name = seg.name || `Item ${i + 1}`;
        const text = scene.add
          .text(labelX, labelY, name, {
            fontFamily: "RakeslyRG",
            fontSize: Math.max(14, Math.round(radius * 0.06)),
            align: "center",
            color: "#ffffff",
          })
          .setOrigin(0.5);
        text.rotation = midAngle; // Phaser.Math.DegToRad(90);
        wheelContainer.add(text);
      } else {
        const labelRadius = innerRadius + (radius - innerRadius) * 0.75;
        let labelX = Math.cos(midAngle) * labelRadius;
        let labelY = Math.sin(midAngle) * labelRadius;
        const imageRadius = innerRadius + (radius - innerRadius) * 0.75;
        const imageX = Math.cos(midAngle) * imageRadius;
        const imageY = Math.sin(midAngle) * imageRadius;
        const name = seg.name || `Item ${i + 1}`;

        if (name !== "Nice try") {
          const text = scene.add
            .text(labelX, labelY, name, {
              fontFamily: "RakeslyRG",
              fontSize: Math.max(14, Math.round(radius * 0.07)),
              align: "center",
              color: "#ffffff",
            })
            .setOrigin(0.5);
          text.rotation = midAngle; // Phaser.Math.DegToRad(90);
          wheelContainer.add(text);
        } else {
          labelX = Math.cos(midAngle) * labelRadius * 1;
          labelY = Math.sin(midAngle) * labelRadius * 1;
          const text = scene.add
            .text(labelX, labelY, name, {
              fontFamily: "RakeslyRG",
              fontSize: Math.max(14, Math.round(radius * 0.07)),
              align: "center",
              color: "#ffffff",
            })
            .setOrigin(0.5);
          text.rotation = midAngle; // Phaser.Math.DegToRad(90);
          wheelContainer.add(text);
        }
      }

      let pointsRadius = radius + 8;
      const pointX = Math.cos(startAngle) * pointsRadius;
      const pointY = Math.sin(startAngle) * pointsRadius;
      const pointOuter = scene.add
        .circle(pointX, pointY, 4, 0xffedd9)
        .setOrigin(0.5);

      pointOuter.rotation = startAngle;
      wheelContainer.add(pointOuter);
    }

    // const centerCircle = scene.add.graphics();
    // centerCircle.fillStyle(sepColor, 1);
    // centerCircle.fillCircle(0, 0, innerRadius * 0.3);
    // wheelContainer.add(centerCircle);

    return wheelContainer;
  }
  getRandomDarkColor() {
    if (NiceTryColors == "light") {
      // Light backgrounds, still enough contrast for white text
      const lightColors = [
        0xff6f61, // soft coral red
        0xffb84d, // muted orange
        0xf5d76e, // warm yellow
        0x7fd1ae, // soft mint green
        0x5dade2, // cool light blue
        0xa569bd, // muted lavender
        0xf1948a, // rose pink
        0x73c6b6, // aqua teal
        0xf8c471, // pastel amber
      ];
      return Phaser.Utils.Array.GetRandom(lightColors);
    } else if (NiceTryColors == "dark") {
      // Dark tones, ideal for white or bright text
      const darkColors = [
        0x512e5f, // deep purple
        0x154360, // navy blue
        0x0e6251, // dark teal
        0x7b241c, // dark red
        0x4a235a, // dark violet
        0x1b2631, // charcoal blue
        0x424949, // dark gray
        0x4d5656, // muted green-gray
        0x633974, // eggplant
      ];
      return Phaser.Utils.Array.GetRandom(darkColors);
    } else if (NiceTryColors == "any") {
      // All-around colorful mix, works with either white or black text
      const anyColors = [
        0xff0000, // red
        0xffa500, // orange
        0xdddd00, // yellow
        0x00dd00, // green
        0x00ffff, // cyan
        0x0000ff, // blue
        0xff00ff, // magenta
        0xff69b4, // pink
        0x8a2be2, // purple
      ];
      return Phaser.Utils.Array.GetRandom(anyColors);
    } else if (NiceTryColors === "golden") {
      // Golden / orange casino wheel segment colors
      const wheelSegmentColors = [
        0xffd700, // classic gold
        0xffc107, // bright gold
        0xffb300, // amber gold
        0xffa000, // deep amber
        0xd4af37, // metallic gold
        0xb8860b, // dark goldenrod

        // Golden green / emerald
        0x9acd32, // yellow-green gold
        0x7cb342, // olive gold
        0x2ecc71, // emerald green
        0x1e8449, // dark emerald
        0x145a32, // deep green-gold shadow

        // Golden red / ruby
        0xe74c3c, // ruby red
        0xc0392b, // deep ruby
        0xb03a2e, // dark red-gold
        0x922b21, // wine red
        0xcd6155, // warm red highlight

        // Bronze / copper
        0xd68910, // bronze
        0xb9770e, // dark bronze
        0xa04000, // copper
        0x873600, // deep copper

        // Accent glow tones
        0xffe082, // soft glow gold
        0xffcc80, // warm glow orange
      ];

      return Phaser.Utils.Array.GetRandom(wheelSegmentColors);
    } else {
      // Return directly if user provided a custom color
      return NiceTryColors;
    }
  }
  spinPressed(a, b, wheel) {
    if (!this.spinning) {
      const dollers2 = this.add.particles(0, 0, "dollers", {
        x: halfWidth,
        y: halfHeight * 0.9,
        speed: { min: 200, max: 300 },
        angle: { min: 0, max: 360 },
        alpha: { start: 1, end: 0 },
        scale: { start: 0.5, end: 3 },
        lifespan: 1200,
        frequency: 10,
        blendMode: "ADD",
      });

      setTimeout(() => {
        dollers2.destroy();
      }, spinDuration);

      this.spinning = true;
      if (this.soundOn) {
        setTimeout(() => {
          this.spinningSound.play({
            rate: 8 / spinDuration,
            loop: false,
          });
        }, 100);
      }

      this.tweens.add({
        targets: [b, a],
        scale: 0.85,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: [b, a],
            scale: 1,
            duration: 100,

            onComplete: () => {
              this.spinWheel(
                this,
                wheel,
                this.segments,
                spinDuration,
                (result) => {
                  console.log(result);
                  setTimeout(() => {
                    this.showResult(result);
                  }, 1000);
                }
              );
            },
          });
        },
      });
    }
  }

  spinWheel(scene, wheelContainer, wheelPrizes, duration, onComplete) {
    let totalProbability = wheelPrizes.reduce(
      (sum, p) => sum + p.probability,
      0
    );
    let rand = Math.random() * totalProbability;

    let cumulative = 0;
    let chosenIndex = 0;
    for (let i = 0; i < wheelPrizes.length; i++) {
      cumulative += wheelPrizes[i].probability;
      if (rand <= cumulative) {
        chosenIndex = i;
        break;
      }
    }

    let segments = wheelPrizes.length;
    let degPer = 360 / segments;
    let stopAngle = 360 - (chosenIndex * degPer + degPer / 2);

    let extraSpins = 6 * 360;
    let finalAngle = stopAngle + extraSpins;

    scene.tweens.add({
      targets: wheelContainer,
      angle: finalAngle,
      duration: duration * 1000,
      ease: "Sine.easeOut",
      onComplete: () => {
        if (onComplete) onComplete(wheelPrizes[chosenIndex]);
      },
    });
  }
  showInsufficientFunds(text) {
    if (!this.insufficientFundNotificationOn) {
      this.insufficientFundNotificationOn = true;

      const width = 500;
      const height = 300;
      const radius = 30;
      const x = halfWidth;
      const y = halfHeight;

      let container = this.add.container(x, y).setAlpha(0).setScale(0);

      let bg = this.add.graphics();
      bg.fillStyle(0x22226f, 0.95);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
      bg.lineStyle(4, 0xff4c4c, 1);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);

      let message = this.add
        .text(0, 0, text, {
          fontFamily: "Arial",
          fontSize: "32px",
          color: "#ff4c4c",
          align: "center",
          lineSpacing: 8,
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      let closeBtn = this.add
        .image(width / 2 - 45, -height / 2 + 45, "close")
        .setOrigin(0.5)
        .setScale(0.7)
        .setInteractive({ useHandCursor: true });

      closeBtn.on("pointerover", () => closeBtn.setScale(0.8));
      closeBtn.on("pointerout", () => closeBtn.setScale(0.7));
      closeBtn.on("pointerdown", () => {
        this.tweens.add({
          targets: container,
          alpha: 0,
          scale: 0,
          duration: 600,
          ease: "Cubic.easeIn",
          onComplete: () => {
            container.destroy();
            this.insufficientFundNotificationOn = false;
            this.spinning = false;
          },
        });
      });

      container.add([bg, message, closeBtn]);
      container.setDepth(10);

      this.tweens.add({
        targets: container,
        alpha: 1,
        scale: 1,
        duration: 600,
        ease: "Back.easeOut",
        onComplete: () => {
          this.time.delayedCall(3000, () => {
            this.tweens.add({
              targets: container,
              alpha: 0,
              scale: 0,
              duration: 600,
              ease: "Cubic.easeIn",
              onComplete: () => {
                if (this.insufficientFundNotificationOn) {
                  container.destroy();
                  this.spinning = false;
                  this.insufficientFundNotificationOn = false;
                }
              },
            });
          });
        },
      });
    }
  }

  showResult(result) {
    if (result.name == "Nice try") {
      if (Math.random() * 10 > 5) {
        if (this.soundOn) {
          this.lostSound.play();
        }
        this.showInsufficientFunds("Nice Try.\nLet's Spin Again.");
      } else {
        if (this.soundOn) {
          this.lostSound.play();
        }
        this.showInsufficientFunds("No Win.\nTry Again.");
      }
    } else {
      this.showWinMessage(result);
      if (this.soundOn) {
        this.congratsSound.play();
      }
    }
  }

  showWinMessage(result) {
    const width2 = 600;
    const height2 = 400;
    const radius = 30;
    const x = halfWidth - 300;
    const y = halfHeight - 300;

    let container = this.add.container(x, y).setAlpha(0).setScale(0);

    let bg = this.add.graphics();
    bg.fillStyle(0x226f22, 0.95);
    bg.fillRoundedRect(0, 20, width2, height2, radius);
    bg.lineStyle(4, 0x4cff4c, 1);
    bg.strokeRoundedRect(0, 20, width2, height2, radius);

    let won = this.add
      .text(300, 110, "YOU WIN!!!", {
        fontFamily: "RakeslyRG",
        fontSize: "55px",
        color: "#ffffff",
        // fontStyle: "bold",
      })
      .setOrigin(0.5);

    let itemName = this.add
      .text(300, 220, `${result.name}`, {
        fontFamily: "RakeslyRG",
        fontSize: "55px",
        color: "#ffffff",
        // fontStyle: "bold",
      })
      .setOrigin(0.5);
    console.log("WIn");

    this.sendPrize = `${result.value}`;
    this.totalSpins = 1;

    let claimBtn = this.add
      .rexRoundRectangle(300, 330, 150, 60, 10)
      .setStrokeStyle(3, 0xffffff) // width, color
      .setFillStyle(0xf08801) // no fill
      .setDepth(5)
      .setInteractive({ useHandCursor: true });

    let claimBtn2 = this.add
      .text(300, 330, "Okay", {
        fontFamily: "RakeslyRG",
        fontSize: "32px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(6);

    claimBtn.on("pointerover", () => claimBtn.setScale(1.1));
    claimBtn.on("pointerout", () => claimBtn.setScale(1));

    container.add([bg, claimBtn, claimBtn2, won, itemName]);
    container.setDepth(10);
    claimBtn.on("pointerdown", () => {
      if (!this.clicked) {
        this.clicked = true;
        this.tweens.add({
          targets: claimBtn,
          scale: 0.9,
          duration: 100,
          onComplete: () => {
            this.tweens.add({
              targets: claimBtn,
              scale: 1,
              duration: 100,
              onComplete: () => {
                this.clicked = false;
                this.fireworksTween.destroy();
                this.fireworkTimer.destroy();
                container.destroy();
                this.spinning = false;
              },
            });
          },
        });
      }
    });

    setTimeout(() => {
      this.fireworksTween.destroy();
      this.fireworkTimer.destroy();
      container.destroy();
      this.spinning = false;
    }, 5000);

    this.tweens.add({
      targets: container,
      alpha: 1,
      scale: 1,
      duration: 600,
      ease: "Back.easeOut",
    });
    container.setDepth(10);

    this.particles = this.add.particles("spark");
    this.particles.setDepth(9);
    this.fireworksTween = this.time.addEvent({
      delay: 600,
      loop: true,
      callback: () => {
        let randX = Phaser.Math.Between(halfWidth - 100, halfWidth + 100);
        let randY = Phaser.Math.Between(halfHeight - 75, halfHeight + 75);
        this.firework.call(this, randX, randY);
      },
    });
  }
  firework(x, y) {
    if (!this.fireworks) {
      this.fireworks = this.add.particles(0, 0, "spark", {
        angle: { min: 0, max: 360 },
        speed: { min: 130, max: 220 },
        lifespan: { min: 1100, max: 1500 },
        alpha: { start: 1, end: 0.2 },
        gravityY: 200,
        scale: { start: 0.25, end: 0.6 },
        blendMode: "ADD",
        emitting: false,
      });
      this.fireworks.setDepth(5);
    }

    const popupCenterX = width / 2;
    const popupCenterY = height / 2 - 140;

    if (this.fireworkTimer) {
      this.fireworkTimer.remove();
      this.fireworkTimer = null;
    }

    this.fireworkTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        const rx = popupCenterX + Phaser.Math.Between(-100, 100);
        const ry = popupCenterY + Phaser.Math.Between(-70, 75);
        this.fireworks.explode(Phaser.Math.Between(12, 28), rx, ry);
      },
      callbackScope: this,
    });
  }

  addInfoUI() {
    this.UIBackground = this.add.rectangle(350, 600, 800, 1200, 0xffffff);

    this.homeIcon = this.add
      .image(640, 55, "home")
      .setScale(0.4)
      .setInteractive();

    this.homeIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.homeIcon,
        scale: 0.4,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: this.homeIcon,
            scale: 0.5,
            duration: 100,
            onComplete: () => {
              this.screen = "home";
              this.scene.restart();
            },
          });
        },
      });
    });

    this.infoTitle = this.add
      .text(350, 70, "Won Prizes", {
        fontFamily: "RakeslyRG",
        fontSize: "40px",
        color: "#000",
        align: "center",
        stroke: "#000",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);
  }
  addSounds() {
    this.spinningSound = this.sound.add("spinning");

    this.bgaudioSound = this.sound.add("bgaudio");
    this.bgaudioSound.setVolume(0.05);
    this.bgaudioSound.play({
      loop: true,
    });

    this.lostSound = this.sound.add("lost");
    this.lostSound.setVolume(0.1);
    this.congratsSound = this.sound.add("congrats");
    this.congratsSound.setVolume(0.2);
  }

  update() {}
}
const game = new Phaser.Game({
  parent: "game",
  type: Phaser.AUTO,
  width: width,
  height: height,
  border: 2,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [
      {
        key: "rexRoundRectangle",
        plugin: rexroundrectangleplugin,
        start: true,
      },
    ],
  },
  input: {
    activePointers: 3,
  },
  scene: [Game],
});
