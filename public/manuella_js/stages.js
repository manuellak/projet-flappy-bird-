/*

*/
class PlayStage extends Stage {
    constructor(gsm) {
        super(gsm)

        this.score = new ScoreManager()

        this.paysage = new Paysage(0, 0)

        this.bird = new Bird(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2)

        this.ground = new Ground(0, CANVAS_HEIGHT - 15)

        this.tubes = new Tubes(this.bird, this.score, CANVAS_WIDTH / 2)

        /*this.tubestab = []

        this.tubestab.push(new Tubes(this.bird, this.score, CANVAS_WIDTH))
        this.tubestab.push(new Tubes(this.bird, this.score, 3 * CANVAS_WIDTH / 2))
        this.tubestab.push(new Tubes(this.bird, this.score, 2 * CANVAS_WIDTH))
        */
    }
    update(dt) {
        this.paysage.update(dt)

        this.bird.update(dt)

        this.ground.update(dt)

        this.tubes.update(dt)
        /*
                for (let i = 0; i < this.tubestab.length; i++) {
                    this.tubestab[i].update(dt)
                }
        */
        this.score.update(dt)

        if (this.score.isGameOver()) {
            let datas = {
                "name": this.score.getName(),
                "points": this.score.getPoints(),
                "best" : this.score.getBest()
            }
            gsm.changeStage(gStages.get("gameover"), datas)
        }
        this.collisions()
    }
    collisions() {
        // bird with ground
        if (this.bird.state === "LIVE" && this.bird.collides(this.ground)) {
            this.bird.touched()
            this.score.decrementsLives()

            this.tubes.newWave()

            return
        }
        // bird with tubes
        this.tubes.isCollideBird()
    }
    render() {
        this.paysage.render()

        this.bird.render()

        this.tubes.render()

        this.ground.render()
        /*
                for (const item of this.tubestab) {
                    item.render()
                }
        */
        this.score.render()
    }
    onEnter(datas) {
        gSounds["game"].setLoop(true)
        gSounds["game"].setVolume(0.2)
        gSounds["game"].play()

        gSounds["fly"].setLoop(true)
        gSounds["fly"].setVolume(0.2)
        gSounds["fly"].play()

        if (datas != undefined) {
            this.score.setName(datas.name)
            this.score.reset()
        }

        this.bird.reset()
        this.tubes.newWave()
    }
    onExit() {
        gSounds["game"].setLoop(false)
        gSounds["game"].stop()

        gSounds["fly"].setLoop(false)
        gSounds["fly"].stop()
    }
}
////
class IntroStage extends Stage {
    constructor(gsm) {
        super(gsm)

        this.tab = [65, 65, 65]
        this.indice = 0
        this.timer = 0
        this.toggle = true

        this.label = new Label()
        this.label.setSize(40)
        this.label.setColor(color(255, 255, 255))

        this.name = "aaa"

        this.paysage = new Paysage(0, 0)
    }
    update(dt) {
        this.timer += dt
        if (this.timer > 0.4) {
            this.timer = 0
            this.toggle = !this.toggle
        }
        if (gInput.isKeyPressed(32)) {

            this.name = "" + char(this.tab[0]) + char(this.tab[1]) + char(this.tab[2])

            let datas = {
                "name": this.name
            }
            gsm.changeStage(gStages.get("play"), datas)
        }
        if (gInput.isKeyPressed(LEFT_ARROW) && this.indice > 0) {
            this.indice = this.indice - 1
        }
        if (gInput.isKeyPressed(RIGHT_ARROW) && this.indice < 2) {
            this.indice = this.indice + 1
        }
        if (gInput.isKeyPressed(UP_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] + 1
            if (this.tab[this.indice] > 90) {
                this.tab[this.indice] = 65
            }
        }

        if (gInput.isKeyPressed(DOWN_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] - 1
            if (this.tab[this.indice] < 65) {
                this.tab[this.indice] = 90
            }
        }
        this.paysage.update(dt)
    }
    render() {
        this.paysage.render()

        this.label.setText("Flappy Bird")
        this.label.render(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 4)

        this.afficheName()

        this.label.setText('Press Enter to Start')
        this.label.render(150, 150 + CANVAS_HEIGHT / 2)
    }
    onEnter() {
        gSounds["menu"].setLoop(true)
        gSounds["menu"].play()
    }
    onExit() {
        gSounds["menu"].setLoop(false)
        gSounds["menu"].stop()
    }
    afficheName() {
        let xp = CANVAS_WIDTH / 2 - 70
        let yp = CANVAS_HEIGHT / 2
        //
        if (this.indice == 0) {
            if (this.toggle) {
                text(char(this.tab[0]), xp, yp)
            }
            text(char(this.tab[1]), xp + 50, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //
        else if (this.indice == 1) {
            if (this.toggle) {
                text(char(this.tab[1]), xp + 50, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //
        else if (this.indice == 2) {
            if (this.toggle) {
                text(char(this.tab[2]), xp + 100, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[1]), xp + 50, yp)
        }
    }
}
////
class OverStage extends Stage {
    constructor(gsm) {
        super(gsm)

        this.paysage = new Paysage(0, 0)

        this.label = new Label()
        this.label.setSize(25)
        this.label.setColor(color(255, 255, 255))

        this.name = "aaa"
        this.score = 0
        this.best
    }
    update(dt) {

        this.paysage.update(dt)

        if (gInput.isKeyPressed(32)) {

            gsm.changeStage(gStages.get("intro"))
        }
    }
    render() {
        this.paysage.render()

        this.label.setText("Game Over " + this.name)
        this.label.render(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 4)

        this.label.setText("Score= " + this.score + " pts")
        this.label.render(CANVAS_WIDTH / 3 + 10, CANVAS_HEIGHT / 2)

        
        this.label.setText("Meilleur Score= " + this.best + " pts")
        this.label.render(CANVAS_WIDTH / 4 + 10, 50+ CANVAS_HEIGHT / 2)

        this.label.setText('Go to menu')
        this.label.render(CANVAS_WIDTH / 3 + 20, 100 + CANVAS_HEIGHT / 2)
    }
    onEnter(datas) {
        if (datas) {
            this.name = datas.name
            this.score = datas.points
            this.best= datas.best
        }
        gSounds["menu"].setLoop(true)
        gSounds["menu"].play()
    }
    onExit() {
        gSounds["menu"].setLoop(false)
        gSounds["menu"].stop()
    }
}

//// 
