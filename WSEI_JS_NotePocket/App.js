let notes = []

window.addEventListener('load',(e)=>{

    if(typeof(Storage) !== undefined){

        if(localStorage.getItem("notes") !== null){
            notes = JSON.parse(localStorage.getItem("notes"))
        }

        document.querySelector("#addNote").addEventListener('click',(e)=>{
            
            let title = document.querySelector("#noteTitle").value
            let content = document.querySelector("#noteContent").value
            let color = document.querySelector("#noteColor").value
            let priority = document.querySelector("#notePriority").checked

            AddNote(title,content,color,priority)
        })

        if(notes.length > 0){
            showNotes()
        }
    }
    else
    {
        console.log("Error!")
    }
})

function AddNote(title,content,color,priority){
    notes.push(
        new Note(title,content,color,priority)
    )

    showNotes()

    let notesJSON = JSON.stringify(notes)
    localStorage.setItem("notes",notesJSON)
}

function showNotes(){
    let list = document.querySelector("#noteList")
    list.innerHTML=""

    notes.forEach((elem)=>{
        let card = document.createElement("div")
        card.className="ui card";

        let content1 = document.createElement("div")
        content1.className = "content"

        let header = document.createElement("div")
        header.className="header"
        header.textContent = elem.title
        header.style.color = elem.color

        content1.appendChild(header)

        let content2 = document.createElement("div")
        content2.className="content"

        let feed = document.createElement("div")
        feed.className="ui small feed"
        feed.textContent = elem.content

        content2.appendChild(feed)

        let date = document.createElement("div")
        date.className="extra content"
        date.textContent += new Date(elem.creationDate).toLocaleString()

        card.appendChild(content1)
        card.appendChild(content2)
        card.appendChild(date)
        list.appendChild(card)
    })
}

class Note{
    constructor(_title,_content,_color,_priority){
        this.title = _title
        this.content= _content
        this.color = _color
        this.priority = _priority;
        this.creationDate = new Date()
    }
}