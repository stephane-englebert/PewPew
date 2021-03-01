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
    let y = posYTank - htCn;
    drawShell(ctx,x,y);
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
            ctx.arc(x+lgTank/2,y-htTank/2,rdTur,0,2 * Math.PI);
            ctx.fill();
        }
    }
    tank.draw();
    return tank;
}
let initScene = () => {
    localStorage.setItem("lgTank",80);
    localStorage.setItem("htTank",50);
    localStorage.setItem("lgCannon",10);
    localStorage.setItem("htCannon",70);
    localStorage.setItem("lgShell",6);
    localStorage.setItem("htShell",12);
    localStorage.setItem("posXTank",450);
    localStorage.setItem("posYTank",550);
    localStorage.setItem("radiusTurret",20);
}
window.onload = function (){
    initScene();
    let ctx = document.getElementById("pewPewCanvas").getContext("2d");
    let tank = drawTank(ctx);
    let shell = shootShell(ctx);
}