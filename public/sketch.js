/*

*/
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 350

const SPEED_MIN = 100

const gInput = new InputManager()
const gStages = new Map()
const gsm = new StageManager()

const save_score="highscore"

let gTextures = {}
let gSounds = {}
let gFonts = {}

let playing = true

//
function preload() {
    gTextures["paysage"] = loadImage("assets/images/paysage.png")
    gTextures["flying"] = loadImage("assets/images/birdanimation.png")
    gTextures["ground"] = loadImage("assets/images/ground.png")

    gTextures["bottomtube"] = loadImage("assets/images/bottomtube.png")
    gTextures["toptube"] = loadImage("assets/images/toptube.png")
    
    gSounds["game"] = loadSound("assets/musics/music.mp3")
    gSounds["menu"] = loadSound("assets/musics/intro.mp3")

    gSounds["hurt"] = loadSound("assets/sounds/hurt.wav")
    gSounds["score"] = loadSound("assets/sounds/score.wav")
    gSounds["fly"] = loadSound("assets/sounds/fly.ogg")

    gFonts["brick"] = loadFont("assets/fonts/brick.ttf")



}

function setup() {
    pixelDensity(1)
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    background(50)

    gStages.set("intro", new IntroStage(gsm))

    gStages.set("play", new PlayStage(gsm))

    gStages.set("gameover", new OverStage(gsm))

    gsm.pushStage(gStages.get("intro"))
    //gsm.pushStage(gStages.get("play"))
    //gsm.pushStage(gStages.get("gameover"))

    pause = createP('')
}

let ancien = 0
let now = 0
let dt = 0

function draw() {
    if (playing === true) {
        background(255)
        now = millis()
        dt = (now - ancien) / 1000
        //
        gsm.update(dt)
        //
        gInput.update()

        gsm.render()

    ancien =now
    }
    
pause.html("clik wherever to pause ")
}

function touchEnded() {
    playing =! playing 
}
//
function keyPressed() {
    gInput.setKeyboardPressed(keyCode)
}
//
function keyReleased() {
    gInput.setKeyboardReleased(keyCode)
}

