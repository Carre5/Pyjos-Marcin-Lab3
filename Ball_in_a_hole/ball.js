
let BD,BGctx,BDctx,timer //BD -> #board, BG -> #background, timer -> #timer

let gameStarted = false
let time = 0
let timeOut
let points = 0

let ball = {
    x:0,
    y:0,
    radius:20,
    speedLimiter: 4
}

//tablica przechowywująca współrzędne wygenerowanych dołków
let holeAmount = 10;
let holes = [];

let launcher = document.querySelector("#startGame")
launcher.addEventListener('click',()=>{init()});


function init(){
    document.querySelector("#shadow").style.display = "none"

    /**
    * #background to canvas z polem gry, które jest statyczne
    * #board to canvas, który jest interaktywny i zmienia się w czasie
    */

    let background = document.querySelector("#background")
    BD = document.querySelector("#board")

    background.width = window.innerWidth
    background.height = window.innerHeight
    BGctx = background.getContext("2d")

    BD.width = window.innerWidth
    BD.height = window.innerHeight   
    BDctx = BD.getContext("2d")

    timer = document.querySelector("#timer") 

    console.log("Game starting...")

    ball.x = BD.width/2
    ball.y = BD.height/2

    if(window.DeviceOrientationEvent){
        startGame()
    }
    else{
        alert("Controls not supported!")
        return;
    }
};

function startGame(){
    gameStarted = true
    drawHoles()

    time = new Date().getTime()

    drawBall();
    window.addEventListener("deviceorientation", (e) => { handleMove(e) })
    updateTimer()
}

function drawBall(){
    BDctx.clearRect(0,0,BD.width,BD.height)
    BDctx.beginPath()
    BDctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI)
    BDctx.fillStyle ="#F00"
    BDctx.fill()
}

function createHoles(){
    for(let i =0;i<holeAmount;i++){
        
        let pos = {x:0,y:0}

        pos.x = Math.floor((Math.random()*(BD.width - (2*ball.radius)))+ball.radius)
        pos.y = Math.floor((Math.random()*(BD.height - (2*ball.radius)))+ball.radius)

        if(distanceBetweenCenter(pos,ball) <= 2*ball.radius){
            //jeżeli dołek generuje się za blisko piłki to wymuszam kolejne losowanie
            i--
        }
        else{
            holes.push({
                x:pos.x,
                y:pos.y
            })
        }
    }
}

function drawHoles(){
    if(holes.length == 0)
        createHoles()
    
    holes.forEach((el,i) => {
        BGctx.beginPath()
        BGctx.arc(el.x,el.y,ball.radius*1.5,0,2*Math.PI)
        if(i == 0){
            BGctx.fillStyle ="#FF0"
        }
        else{
            BGctx.fillStyle ="#000"
        }
        BGctx.fill()
    });
}

function handleMove(e){
    if(gameStarted && (new Date().getTime() - time) < 60000){
        //minimalna wartość to ball.radius, by kula nie wychodziła częściowo poza ekran, podobnie z maksymalną wartością (width/height - ball.radius)
        ball.x = Math.min(Math.max(parseInt(ball.x+(e.gamma/ball.speedLimiter)),ball.radius),BD.width - ball.radius)
        ball.y = Math.min(Math.max(parseInt(ball.y+(e.beta/ball.speedLimiter)),ball.radius),BD.height - ball.radius)

        holeHit()
        refreshBoard()
    }
    else if((new Date().getTime() - time) >= 60000){
        //by gra nie trwała za długo jest ograniczenie do 60 sekund
        loseGame()
    }
}

function holeHit(){
    //znajduje index i porównuję z trafionym dołkiem
    let index = holes.findIndex((hole)=>{
        return distanceBetweenCenter(hole,ball) <= 1.5*ball.radius
    })

    if(index === -1){/* Piłka poza dołkami */}
    else if(index === 0){
        getPoint()
    }
    else{
        loseGame()
    }
}

function distanceBetweenCenter(obj1,obj2){
    return Math.sqrt(Math.pow(obj1.x-obj2.x,2)+Math.pow(obj1.y-obj2.y,2))
}

function refreshBoard(){
    BDctx.clearRect(0,0,BD.width,BD.height)
    drawBall()
}

function refreshBackground(){
    BGctx.clearRect(0,0,BD.width,BD.height)
    drawHoles()
}

function updateTimer(){
    timeOut = setTimeout(()=>{
        let ms = new Date().getTime() - time
        let p = timer.children

        let s = parseInt(ms/1000)

        p[0].textContent = s < 0 ? "" : s
        p[1].textContent = ms-(s*1000)
        updateTimer()
    },50)
}

function getPoint(){
    holes.shift() //usuwam pierwszy element z tablicy dołków, to powoduje przeskok do kolejnych i tak gra się toczy
    refreshBackground()

    points++
    if(points >= 10){ winGame() }
}

function winGame(){
    alert("Wygrałeś. Gratulacje! Zajęło ci to "+ (new Date().getTime() - time) +" milisekund")
    endGame()
}

function loseGame(){
    if(gameStarted){
        alert("Przegrałeś. Spróbuj ponownie!")
        endGame()
    }
}

function endGame(){
    gameStarted = false

    document.querySelector("#shadow").style.display = "flex"

    clearTimeout(timeOut)
    time = 0
    points = 0
    holes.length = 0

    window.removeEventListener("deviceorientation", (e) => { handleMove(e) })

    BDctx.clearRect(0,0,BD.width,BD.height)
    BGctx.clearRect(0,0,BD.width,BD.height)

    console.log("... Game Ends")
}