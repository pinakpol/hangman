const category=document.getElementById("category");
const hint=document.getElementById("hint");
const word=document.getElementById("word");
const attempts=document.getElementById("attempts");
const wrong=document.getElementById("wrong");
const letters=document.getElementById("letters");

document.getElementById("startBtn").onclick=startGame;

async function startGame(){

    const r=await fetch("/start",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            category:"animals"

        })

    });

    const data=await r.json();

    draw(data);

}

async function guess(letter){

    const r=await fetch("/guess",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            letter:letter

        })

    });

    const data=await r.json();

    draw(data);

}

function draw(data){

    category.innerHTML="<b>Category:</b> "+data.category;

    hint.innerHTML="<b>Hint:</b> "+data.hint;

    word.innerHTML=data.display;
drawHangman(data.hangmanStage);

    attempts.innerHTML="Attempts Left : "+data.attempts;

    wrong.innerHTML="Wrong : "+data.wrong.join(" ");

    letters.innerHTML="";

    data.letters.forEach(l=>{

        let div=document.createElement("div");

        div.className="letter";

        div.innerHTML=l.letter;

        if(l.state=="correct")
            div.classList.add("correct","used");

        if(l.state=="wrong")
            div.classList.add("wrong","used");

        if(l.state=="unused")
            div.onclick=()=>guess(l.letter);

        letters.appendChild(div);

    });

    if(data.status=="win")
        setTimeout(()=>alert("YOU WIN!"),100);

    if(data.status=="lose")
        setTimeout(()=>alert("YOU LOSE!"),100);

}

function drawHangman(stage){

document.getElementById("head").style.display=
stage>=1?"block":"none";

document.getElementById("body").style.display=
stage>=2?"block":"none";

document.getElementById("larm").style.display=
stage>=3?"block":"none";

document.getElementById("rarm").style.display=
stage>=4?"block":"none";

document.getElementById("lleg").style.display=
stage>=5?"block":"none";

document.getElementById("rleg").style.display=
stage>=6?"block":"none";

}