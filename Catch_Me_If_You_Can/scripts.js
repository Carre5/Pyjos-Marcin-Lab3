let uluru, map, marker
let ws
let players = {}
let nick = 'Anonymous'
let avatar = "";

function init() {

    nick = prompt("Wprowadź nick:");
    avatar = prompt("Wprowadź adres url avataru:")

    avatar == "" ? avatar = "http://0.gravatar.com/avatar/0205b4383f4d60a04050bf332a9fffed?s=50&d=http%3A%2F%2Fwww.bigredbarrel.com%2Fblog%2Fwp-content%2Fthemes%2Fdiverse%2Fimages%2FBRB.png&r=g" : avatar

    initMap()
}

function initMap(position){

    if(position == undefined || position == null){
        position = { lat: -25.363, lng: 131.044 }
    }

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: position,
        keyboardShortcuts: false
    });
    
    marker = new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: avatar
    });
    
    getLocalization()
    startWebSocket()
    addKeyboardEvents()
}

function addKeyboardEvents() {
    window.addEventListener('keydown', poruszMarkerem)
}
function poruszMarkerem(ev) {
    let lat = marker.getPosition().lat()
    let lng = marker.getPosition().lng()

    switch (ev.code) {
        case 'ArrowUp':
            lat += .5
            break;
        case 'ArrowDown':
            lat -= .5
            break;
        case 'ArrowLeft':
            lng -= .5
            break;
        case 'ArrowRight':
            lng += .5
            break;
    }
    let position = {
        lat,
        lng
    }
    let wsData = {
        lat: lat,
        lng: lng,
        id: nick
    }
    marker.setPosition(position)
    ws.send(JSON.stringify(wsData))
}
function startWebSocket() {
    let url = 'ws://91.121.6.192:8010'
    ws = new WebSocket(url)
    ws.addEventListener('open', onWSOpen)
    ws.addEventListener('message', onWSMessage)
}

function onWSOpen(data) {
    console.log(data)
}
function onWSMessage(e) {
    let data = JSON.parse(e.data)

    if (!players['user' + data.id]) {
        players['user' + data.id] = new google.maps.Marker({
            position: { lat: data.lat, lng: data.lng },
            map: map,
            animation: google.maps.Animation.DROP
        })
    } else {
        players['user' + data.id].setPosition({
            lat: data.lat,
            lng: data.lng
        })
    }
}



function getLocalization() {
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)
}

function geoOk(data) {
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    }
    map.setCenter(coords)
    marker.setPosition(coords)
    initMap(coords)
}

function geoFail(err) {
    console.log(err)
}