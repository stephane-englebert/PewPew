// FUNCTION LSNB (LocalStorage Number) => get localStorage value of variable named 'varName', parse it as Int and return value
let lSNb = (varName) => {
    let varValue = parseInt(localStorage.getItem(varName));
    return varValue;
}
let drawShell = (ctx,x,y) => {
    let lgSh = lSNb("lgShell");
    let htSh = lSNb("htShell");
    let shell = {
        color: 'red',
        draw: function() {
          ctx.beginPath();
          ctx.moveTo(x,y);
          ctx.lineTo(x,y-htSh);
          ctx.lineTo(x+lgSh/2,y-(htSh+lgSh/2));
          ctx.lineTo(x+lgSh,y-htSh);
          ctx.lineTo(x+lgSh,y);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        }
    };   
    shell.draw();       
    return shell;
}
let eraseShell = (ctx,x,y) => {
    ctx.clearRect(x,y,10,25);
}
let isTargetHit = (ctx) => {
    let hit = false;    
    let posXTarget = lSNb("posXTarget");
    let rdTarget = lSNb("radiusTarget"); 
    let min = posXTarget - rdTarget - 8;
    let max = posXTarget + rdTarget + 2;
    let posXShell = lSNb("posXShell");
    if((posXShell > min) && (posXShell < max)){hit = true;}
    return hit;
}
let shootShell = (ctx) => {
    let lgSh = lSNb("lgShell");
    let htSh = lSNb("htShell");
    let posXTank = lSNb("posXTank");
    let posYTank = lSNb("posYTank");
    let lgTk = lSNb("lgTank");
    let htTk = lSNb("htTank");
    let lgCn = lSNb("lgCannon");
    let htCn = lSNb("htCannon");
    let x = posXTank + lgTk/2 - lgSh/2;
    let y = posYTank - htCn -65;
    localStorage.posXShell = x;
    localStorage.posYShell = y;
    playDetonation(ctx);
    let launchedShells = lSNb("launchedShells");
    launchedShells++;
    localStorage.launchedShells = launchedShells;
    showInGameMenus(ctx);
    let loop = setInterval(executeLoop,50);
    function executeLoop(){
        let posXShell = lSNb("posXShell");
        let posYShell = lSNb("posYShell");
        let offsetShell = lSNb("offsetShell");
        let hitTargets = lSNb("hitTargets");
        let scope = 0;
        eraseShell(ctx,posXShell,posYShell);
        if(isTargetHit(ctx)){scope = 70;}else{scope = 5;}
        if(posYShell <= scope){
            clearInterval(loop);
            localStorage.launched = "false";
            // check if target hit...
            if(isTargetHit(ctx)){
                eraseTarget(ctx);
                hitTargets++;
                localStorage.hitTargets = hitTargets;
                showInGameMenus(ctx);
                if(hitTargets < 10){
                    let target = initTarget(ctx);
                }else{
                    // 10 targets hit - game over!  
                    localStorage.gameOver = "true";
                    endOfGame(ctx);
                }                
            }
        }else{            
            let newPosYShell = posYShell - offsetShell;
            localStorage.posYShell = newPosYShell;
            drawShell(ctx,posXShell,posYShell);
        }
    }
}
let drawTank = (ctx) => {
    let x = lSNb("posXTank");
    let y = lSNb("posYTank");
    let lgTank = lSNb("lgTank");
    let htTank = lSNb("htTank");
    let lgCan = lSNb("lgCannon");
    let htCan = lSNb("htCannon");
    let rdTur = lSNb("radiusTurret");
    let tank = {
        draw: function(){
            ctx.fillStyle = "#41613f";           
            ctx.fillRect(x,y,lgTank,-htTank);  // TANK
            ctx.fillStyle = "#21331f";
            ctx.fillRect(x+(lgTank-lgCan)/2,y-htTank/2,lgCan,-htCan); // CANNON
            ctx.beginPath();
            ctx.arc(x+lgTank/2,y-htTank/2,rdTur,0,2 * Math.PI); // TURRET
            ctx.fill();
        }
    }
    tank.draw();
    return tank;
}
let initScene = (ctx) => {
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("pewPewCanvas").style.display = "block";
    localStorage.setItem("lgTank",80);
    localStorage.setItem("htTank",50);
    localStorage.setItem("lgCannon",10);
    localStorage.setItem("htCannon",70);
    localStorage.setItem("lgShell",6);
    localStorage.setItem("htShell",12);
    localStorage.setItem("posXTank",450);
    localStorage.setItem("posYTank",550);
    localStorage.setItem("radiusTurret",20);
    localStorage.setItem("offsetTank",5);
    localStorage.setItem("posLateralMin",20);
    localStorage.setItem("posLateralMax",720);
    let tank = drawTank(ctx);
    localStorage.setItem("tank",tank);
    localStorage.setItem("radiusTarget",20);
    localStorage.setItem("posXTarget",30);
    localStorage.setItem("posYTarget",50);
    localStorage.setItem("launched",false);// yes or no?
    localStorage.setItem("launchedShells",0); // how many?
    localStorage.setItem("posXShell",0);
    localStorage.setItem("posYShell",450);
    localStorage.setItem("offsetShell",20 );
    let target = initTarget(ctx);
    localStorage.setItem("hitTargets",0);
    localStorage.setItem("elapsedTime",0);
    localStorage.setItem("gameOver",false);
    localStorage.setItem("rankGame",0);
    showInGameMenus(ctx);
}
let moveTank = (ctx,direction) => {
    let offset = lSNb("offsetTank");
    if(direction === "ArrowLeft"){offset *=-1;}
    let newPosXTank = lSNb("posXTank") + offset;
    let posMin = lSNb("posLateralMin");
    let posMax = lSNb("posLateralMax");
    if((newPosXTank > posMin) && (newPosXTank < posMax)){
        localStorage.posXTank = newPosXTank;
        ctx.clearRect(0,600,850,-150);
        drawTank(ctx);
    }
}
let playDetonation = (ctx) => {
    let lgTank = lSNb("lgTank");
    let htTank = lSNb("htTank");
    let lgCan = lSNb("lgCannon");
    let htCan = lSNb("htCannon");
    let x = lSNb("posXTank") + (lgTank-lgCan) / 2;
    let y = lSNb("posYTank") - (htTank/2) - htCan;
    let detonation = {
        draw: function(){
            ctx.fillStyle = "yellow";     
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x-10,y-10);
            ctx.lineTo(x+2,y-5);
            ctx.lineTo(x+7,y-20);
            ctx.lineTo(x+10,y-5);
            ctx.lineTo(x+25,y-8);
            ctx.lineTo(x+10,y);
            ctx.closePath();
            ctx.fill();
        }
    }
    detonation.draw();
    setTimeout(function(){ctx.clearRect(x-15,y,40,-25);},200);
}
let aleaNumber = (min,max) => {
    let alea = min + Math.floor(Math.round(Math.random() * (max-min)) * 100)/100;
    return alea;
}
let initTarget = (ctx) => {
    let rdTarget = lSNb("radiusTarget");
    let lgTank = lSNb("lgTank");
    let posMin = lSNb("posLateralMin") + lgTank;
    let posMax = lSNb("posLateralMax") - lgTank;
    let posXTarget = aleaNumber(posMin,posMax);
    localStorage.posXTarget = posXTarget;
    let posYTarget = lSNb("posYTarget");
    let target = {
        draw: function(){                       
            ctx.beginPath();
            ctx.fillStyle = "#ffdbdb";
            ctx.arc(posXTarget,posYTarget,rdTarget,0,2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#ffffff"; 
            ctx.arc(posXTarget,posYTarget,rdTarget-5,0,2 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = "red"; 
            ctx.arc(posXTarget,posYTarget,rdTarget-10,0,2 * Math.PI);
            ctx.stroke();
        }
    }
    target.draw();
    return target;
}
let eraseTarget = (ctx) => {
    let posXTarget = lSNb("posXTarget");
    let rdTarget = lSNb("radiusTarget");   
    ctx.clearRect(posXTarget-rdTarget-5,0,rdTarget* 3,100);
}
let calculateScore = (ctx,elapsedTime,launchedShells) => {
    let basisScore = 1000;
    let bonus = (launchedShells < 16) ? 500 : 0;
    let extraBonus = (launchedShells == 10) ? 2000 : 0;
    let malus = (launchedShells > 20) ? -300 : 0;
    let extraMalus = (launchedShells > 25) ? -500 : 0;
    let timeBonus = (elapsedTime < 60) ? 600 : 0;
    let medianTimeBonus = ((elapsedTime > 59)&&(elapsedTime < 91)) ? (elapsedTime-59)*10 : 0;
    let medianTimeBonus2 = ((elapsedTime < 60)&&(elapsedTime > 29)) ? (elapsedTime-29)*15 : 0;
    let extraTimeBonus = (elapsedTime < 30) ? 1500 : 0;
    let timeMalus = (elapsedTime > 120) ? -200 : 0;
    let extraTimeMalus = (elapsedTime > 220) ? -500 : 0;
    let scoreBonus = bonus + extraBonus;
    let scoreMalus = malus + extraMalus;
    let scoreTimeBonus = timeBonus + medianTimeBonus + medianTimeBonus2 + extraTimeBonus;
    let scoreTimeMalus = timeMalus + extraTimeMalus;
    let scoreGame = basisScore + scoreBonus + scoreMalus + scoreTimeBonus + scoreTimeMalus;
    showScore(ctx, elapsedTime, basisScore, scoreGame, scoreBonus, scoreMalus, scoreTimeBonus, scoreTimeMalus);
    return scoreGame;
}
let updateRanks = (ctx, scoreGame, elapsedTime) => {
    let rankGame = 0;
    let arrayRankScores = localStorage.rankScores.split(",");
    let arrayRankTimes = localStorage.rankTimes.split(",");
    let inserted = false;
    for(let i=0; i<5; i++){
        if((!inserted) && (scoreGame>parseInt(arrayRankScores[i]))){
            inserted = true;
            rankGame = i+1;
            let j = 4;
            while(j>i){
                arrayRankScores[j] = arrayRankScores[j-1];
                arrayRankTimes[j] = arrayRankTimes[j-1];
                j--;
            }
            arrayRankScores[i] = scoreGame;
            arrayRankTimes[i] = elapsedTime;
        }
    }
    localStorage.rankGame = rankGame;
    localStorage.rankScores = arrayRankScores;
    localStorage.rankTimes = arrayRankTimes;
    return rankGame;
}
let buildTimeString = (ctx, elapsedTime) => {
    let seconds = elapsedTime%60;
    let minutes = (elapsedTime - seconds) / 60;  
    let strMin = convertStrCounter(ctx,minutes);
    let strSec = convertStrCounter(ctx,seconds);
    let dspString = strMin + ":" + strSec; 
    return dspString;
}
let showScore = (ctx, elapsedTime, basisScore, scoreGame, scoreBonus, scoreMalus, scoreTimeBonus, scoreTimeMalus) => {
    let dspString = buildTimeString(ctx, elapsedTime);
    document.getElementById("timeElapsed").innerHTML = dspString;
    document.getElementById("basisScore").innerHTML = basisScore;
    document.getElementById("bonus").innerHTML = scoreBonus;
    document.getElementById("malus").innerHTML = scoreMalus;
    document.getElementById("timeBonus").innerHTML = scoreTimeBonus;
    document.getElementById("timeMalus").innerHTML = scoreTimeMalus;
    document.getElementById("scoreGame").innerHTML = scoreGame;
}
let showRanks = (ctx) => {
    let rankGame = lSNb("rankGame");
    let arrayRankScores = localStorage.rankScores.split(",");
    let arrayRankTimes = localStorage.rankTimes.split(",");
    document.getElementById("arrowRank1").innerHTML = "";
    document.getElementById("arrowRank2").innerHTML = "";
    document.getElementById("arrowRank3").innerHTML = "";
    document.getElementById("arrowRank4").innerHTML = "";
    document.getElementById("arrowRank5").innerHTML = "";
    if(rankGame>0 && rankGame<6){document.getElementById("arrowRank"+rankGame).innerHTML = "-->";}
    document.getElementById("scoreRank1").innerHTML = arrayRankScores[0];
    document.getElementById("scoreRank2").innerHTML = arrayRankScores[1];
    document.getElementById("scoreRank3").innerHTML = arrayRankScores[2];
    document.getElementById("scoreRank4").innerHTML = arrayRankScores[3];
    document.getElementById("scoreRank5").innerHTML = arrayRankScores[4];
    document.getElementById("timeRank1").innerHTML = buildTimeString(ctx,arrayRankTimes[0]);
    document.getElementById("timeRank2").innerHTML = buildTimeString(ctx,arrayRankTimes[1]);
    document.getElementById("timeRank3").innerHTML = buildTimeString(ctx,arrayRankTimes[2]);
    document.getElementById("timeRank4").innerHTML = buildTimeString(ctx,arrayRankTimes[3]);
    document.getElementById("timeRank5").innerHTML = buildTimeString(ctx,arrayRankTimes[4]);
}
let showResults = (ctx, elapsedTime, launchedShells) => {
    let scoreGame = calculateScore(ctx,elapsedTime,launchedShells);
    let rankGame = updateRanks(ctx, scoreGame, elapsedTime);
    showRanks(ctx);
}
let endOfGame = (ctx) => {
    ctx.clearRect(0,600,850,-150);
    localStorage.posXTank = 450;
    localStorage.posYTank = 550;
    localStorage.hitTargets = 0;
    let elapsedTime = lSNb("elapsedTime");
    let launchedShells = lSNb("launchedShells");    
    showResults(ctx,elapsedTime,launchedShells);
    localStorage.elapsedTime = 0;
    localStorage.launchedShells = 0;
    let tank = drawTank(ctx);
    showStartMenu();
}
let showHitMenu = (ctx) => {
    ctx.fillStyle = "black";
    ctx.font = "16pt Calibri";
    ctx.fillText("Hit", 790, 170);
    ctx.fillStyle = "white";
    ctx.fillText(localStorage.hitTargets,800,195);
}
let showLaunchedMenu = (ctx) => {
    ctx.fillStyle = "black";
    ctx.font = "16pt Calibri";
    ctx.fillText("Launched", 760, 95);
    ctx.fillStyle = "white";
    ctx.fillText(localStorage.launchedShells,800,120);
}
let convertStrCounter = (ctx,ctrTime) => {
    let tempString = "00";
    if(ctrTime>=10){tempString = ctrTime;}else{tempString = "0" + ctrTime;}
    return tempString;
}
let updateElapsedTime = (ctx) => {
    let dspTime = lSNb("elapsedTime");
    dspTime++;
    localStorage.elapsedTime = dspTime;
    let seconds = dspTime%60;
    let minutes = (dspTime - seconds) / 60;  
    let strMin = convertStrCounter(ctx,minutes);
    let strSec = convertStrCounter(ctx,seconds);
    let dspString = strMin + " : " + strSec;
    return dspString;
}
let showInGameMenus = (ctx) => {
    ctx.clearRect(760,1,90,500);
    showHitMenu(ctx);
    showTimeMenu(ctx);
    showLaunchedMenu(ctx);
}
let showTimeMenu = (ctx) => {
    ctx.fillStyle = "black";
    ctx.font = "16pt Calibri";
    ctx.fillText("Time", 780, 20);
    ctx.fillStyle = "white";
    let insertText = updateElapsedTime(ctx);
    ctx.fillText(insertText,770,45);
}
let showStartMenu = () => {
    document.getElementById("pewPewCanvas").style.display = "none";
    document.getElementById("startMenu").style.display = "block";
}
window.onload = function (){
    let ctx = document.getElementById("pewPewCanvas").getContext("2d");
    showStartMenu();
    localStorage.setItem("rankScores",[0,0,0,0,0]);
    localStorage.setItem("rankTimes",[0,0,0,0,0]);
    showRanks(ctx);
    document.getElementById("start").addEventListener("click", () => {
        initScene(ctx);        
        let clock = setInterval(function(){
            if(localStorage.gameOver == "true"){
                //clearInterval(clock);
            }else{
                showInGameMenus(ctx);
            }
        },1000);
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if((keyName === "ArrowLeft")||(keyName === "ArrowRight")){moveTank(ctx,keyName);}
            if(keyName === " "){
                let launched = localStorage.launched;
                if(launched === "false"){
                    launched = "true";
                    localStorage.launched = launched;
                    let shell = shootShell(ctx);
                }
            }
        })
    })
}