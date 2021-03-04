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
    let min = posXTarget - rdTarget - 2;
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
    let y = posYTank - htCn -50;
    localStorage.posXShell = x;
    localStorage.posYShell = y;
    let loop = setInterval(executeLoop,50);
    function executeLoop(){
        let posXShell = lSNb("posXShell");
        let posYShell = lSNb("posYShell");
        let offsetShell = lSNb("offsetShell");
        let hitTargets = lSNb("hitTargets");
        eraseShell(ctx,posXShell,posYShell);
        if(posYShell < 80){
            clearInterval(loop);
            localStorage.launched = "false";
            // check if target hit...
            if(isTargetHit(ctx)){
                eraseTarget(ctx);
                hitTargets++;
                localStorage.hitTargets = hitTargets;
                showHitMenu(ctx);
                if(hitTargets < 10){
                    let target = initTarget(ctx);
                }else{
                    // 10 targets hit - game over!                    
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
    localStorage.setItem("launched",false);
    localStorage.setItem("posXShell",0);
    localStorage.setItem("posYShell",450);
    localStorage.setItem("offsetShell",20 );
    let target = initTarget(ctx);
    localStorage.setItem("hitTargets",0);
    localStorage.setItem("elapsedTime",0);
    showHitMenu(ctx);
    showTimeMenu(ctx);
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
            ctx.fillStyle = "red";
            ctx.arc(posXTarget,posYTarget,rdTarget,0,2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#ffffff"; 
            ctx.arc(posXTarget,posYTarget,rdTarget-5,0,2 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = "black"; 
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
let endOfGame = (ctx) => {
    ctx.clearRect(0,600,850,-150);
    localStorage.posXTank = 450;
    localStorage.posYTank = 550;
    localStorage.hitTargets = 0;
    let tank = drawTank(ctx);
    //let target = initTarget(ctx);
    showStartMenu();
}
let showHitMenu = (ctx) => {
    ctx.clearRect(1,1,50,100);
    ctx.fillStyle = "black";
    ctx.font = "18pt Calibri";
    ctx.fillText("Hit", 10, 20);
    ctx.fillStyle = "white";
    ctx.fillText(localStorage.hitTargets,20,45);
}
let displayElapsedTime = (ctx) => {
    let dspTime = lSNb("elapsedTime");
    let dspString = "00 : 00";
    return dspString;
}
let showTimeMenu = (ctx) => {
    ctx.clearRect(760,1,90,100);
    ctx.fillStyle = "black";
    ctx.font = "18pt Calibri";
    ctx.fillText("Time", 780, 20);
    ctx.fillStyle = "white";
    ctx.fillText(displayElapsedTime(ctx),770,45);
}
let showStartMenu = () => {
    document.getElementById("pewPewCanvas").style.display = "none";
    document.getElementById("startMenu").style.display = "block";
}
window.onload = function (){
    let ctx = document.getElementById("pewPewCanvas").getContext("2d");
    showStartMenu();
    document.getElementById("start").addEventListener("click", () => {
        initScene(ctx);
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