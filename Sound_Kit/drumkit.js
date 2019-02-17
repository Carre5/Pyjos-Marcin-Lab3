document.addEventListener('DOMContentLoaded',appStart)

const sounds = {
    97: 'boom',
    115: 'clap',
    100: 'hihat',
    102: 'kick',
    103: 'openhat',
    104: 'ride',
    106: 'snare',
    107: 'tink',
    108: 'tom'
}

/**
 * nieograniczona ilość kanałów
 * kanał to tablica, a utwór składa się z wielu kanałów
 */

const melody=[]
let chosenChannel = -1

let recStart = 0;
let isRecording = false;

function appStart(){
    window.addEventListener('keypress',playSound)

    document.querySelector("#playAll").addEventListener('click',playAll)
    document.querySelector("#addChannel").addEventListener('click',addChannel)
}

function playAudio(){
    melody[chosenChannel].forEach(sound =>{delaySound(sound)})
}

function playAll(){
    for(let i=0;i<melody.length;i++){
        chosenChannel = i
        playAudio()
    }
    chosenChannel = -1;
}

function recAudio(e){
    recStart = Date.now()
    isRecording = !isRecording

    if(isRecording){
        chosenChannel = parseInt(e.target.innerHTML.split(" ")[2])
    }

    e.target.innerHTML = isRecording ? "Stop":"Nagrywaj kanał "+chosenChannel
}

function addChannel(){

    melody.push([])
    let nr = melody.length - 1

    let channels = document.querySelector("#channels")

    let channel = document.createElement('div')
    channel.className = "channel"

    let controls = document.createElement('div')
    controls.className = "controls"

    let path = document.createElement('div')
    path.className = "path"
    
    let recordButton = document.createElement('button')
    recordButton.innerHTML = "Nagrywaj kanał "+nr;
    recordButton.addEventListener("click",recAudio)

    let playButton = document.createElement('button')
    playButton.addEventListener("click",playAudio)
    playButton.innerHTML = "Odtwórz kanał "+nr;

    controls.appendChild(recordButton)
    controls.appendChild(playButton)

    channel.appendChild(controls)
    channel.appendChild(path)

    channels.appendChild(channel);
}

/**
 *
 * @param {Event} e zdarzenie KeyEvent  
 * 
 */
function playSound(e){
    const soundName = sounds[e.keyCode]
    playTheSound(soundName)

    if(isRecording){
        melody[chosenChannel].push({
            name:soundName,
            time: Date.now() - recStart
        })
    }
}

function playTheSound(soundName){
    const audioDOM = document.querySelector(`#${soundName}`)
    audioDOM.currentTime = 0
    audioDOM.play()
}

function delaySound(sound){
    setTimeout(()=>{
        playTheSound(sound.name)
    },sound.time)
}

//min 4 kanały
//odtworzenie całego utworu
//w miarę czysty i skomentowany kod