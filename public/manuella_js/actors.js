// le paysage //

class Paysage {
    constructor(xp, yp) {
        this.x = xp
        this.y = yp
        this.dx = -2
        this.image = gTextures["paysage"]
    }
    update(dt) {
        this.x += this.dx

        if (this.x <= - 500) {
            this.x = 0
        }
    }
    render() {
        image(this.image, this.x, this.y)
    }
}

// l'oiseau //

class Bird extends Entity {
    constructor(xp, yp) {
        super(xp, yp, undefined, 34, 24)

        this.dx = 0
        this.dy = 0
        this.gravity = 10

        this.xinit = xp
        this.yinit = yp

        this.state = "IDLE"

        this.inflate(5, 5)

        this.label = new Label("Press space bar")
        this.label.setSize(20)
        this.label.setColor(color(255, 255, 255))

        this.flyanimation = new Animation(gTextures["flying"], 34, 24, 1 / 30, true)
        this.flyanimation.play()
    }
    reset() {
        this.x = this.xinit
        this.y = this.yinit
        this.state = "IDLE"
    }
    touched() {
        if (this.state === "LIVE") {
            this.state = "TOUCHED"

            gSounds["hurt"].stop()
            gSounds["hurt"].setVolume(0.2)
            gSounds["hurt"].play()
        }
    }
    update(dt) {
        super.update(dt)

        if (this.state == "LIVE") {
            this.dy += this.gravity * dt
            this.y += this.dy
        }
        //input
        if (gInput.isKeyPressed(32) == true) {//space bar
            if (this.state === "IDLE") {
                this.state = "LIVE"
            }
            this.dy = -3
        }
        //limites
        if (this.getBottom() > CANVAS_HEIGHT) {
            this.setBottom(CANVAS_HEIGHT)
        }
        if (this.getTop() < 0) {
            this.setTop(0)
        }
        if (this.state === "TOUCHED") {
            this.state = "IDLE"
            this.x = this.xinit
            this.y = this.yinit
            this.dx = 0
            this.dy = 0
        }
        this.flyanimation.update(dt)
    }
    render() {
        if (this.state == "LIVE" || this.state == "IDLE") {
            this.flyanimation.render(this.x, this.y)
        }
        if (this.state == "TOUCHED") {

        }
        if (this.state == "IDLE") {
            this.label.render(this.x, CANVAS_HEIGHT / 2)
        }
    }
}
//
class Ground extends Entity {
    constructor(xp, yp) {
        super(xp, yp, gTextures["ground"])

        this.speed = 2 * SPEED_MIN
        this.dx = -this.speed

        this.inflate(0, 0)
    }
    update(dt) {
        super.update(dt)

        if (this.getRight() < CANVAS_WIDTH) {
            this.x = 0
        }
    }
    render() {
        super.render()
    }
}
//
class Tube extends Entity {
    constructor(xp, yp, type) {

        switch (type) {
            case "UP":
                super(xp, -yp, gTextures["toptube"])
                break
            case "DOWN":
                super(xp, -yp + 366, gTextures["bottomtube"])
                break
            default:
                break
        }

        this.xp = xp
        this.yp = yp

        this.type = type
        this.touchLeft = false
    }
    isTouchLeft() {
        return this.touchLeft
    }
    reset() {
        this.touchLeft = false
        this.dx = 0
        this.setLeft(CANVAS_WIDTH)
        this.yp = random(70, 270)
        console.log(this.yp)
    }
    move(speed) {
        this.dx = -speed
    }
    update(dt) {
        super.update(dt)

        if (this.getRight() <= 0) {

            this.touchLeft = true
        }
    }
    render() {
        super.render()
    }
}
//
class Tubes {

    constructor(bird, score = undefined, xp) {

        if (score != undefined) {
            this.score = score
        }

        this.toptube = new Tube(xp, 100, "UP")
        this.bottomtube = new Tube(xp, 100, "DOWN")

        this.bird = bird

        this.speed = 2 * SPEED_MIN
        this.newWave()
    }
    newWave() {
        this.reset()
        this.action()
    }
    action() {
        this.toptube.move(this.speed)
        this.bottomtube.move(this.speed)
    }
    reset() {
        this.toptube.reset()
        this.bottomtube.reset()
    }
    update(dt) {
        this.toptube.update(dt)
        this.bottomtube.update(dt)

        if (this.bottomtube.isTouchLeft() || this.toptube.isTouchLeft()) {
            this.reset()
            this.action()
            if (this.bird.state === "LIVE") {
                this.score.incrementsPoints(2)
            }
        }
    }
    isCollideBird() {
        if (this.bird.state != "LIVE") {
            return
        }
        if (this.toptube.collides(this.bird) || this.bottomtube.collides(this.bird)) {
            this.reset()
            this.action()
            this.bird.touched()
            this.score.decrementsLives()
            return true
        } else {
            return false
        }
    }
    render() {
        this.toptube.render()
        this.bottomtube.render()
    }
}
//