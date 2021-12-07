"use strict";
// element
const divSvg = document.getElementById("divSvg");
const svg = document.getElementById("svg");
const svgns = "http://www.w3.org/2000/svg";

// redimensionare svg
const width = divSvg.clientWidth;
const height = divSvg.clientHeight;
svg.setAttribute("width", width);
svg.setAttribute("height", width);

let isDrawing = false;
let isLine = false;
let isRect = false;
let isEllipse = false;

let x = 0;
let y = 0;
let ok = 0;

let color;
let stroke;
let strokeWidth;

function svgPunct(element, x, y) {
    var pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(element.getScreenCTM().inverse()); 
}

// Tratarea evenimetelor de click pe elementele din left pannel.
const line = document.getElementById("line");
line.addEventListener("click", () =>{
  isLine = true;
  isRect = false;
  isEllipse = false;

});

const rect = document.getElementById("rect");
rect.addEventListener("click", () => {
  isRect = true;
  isLine = false;
  isEllipse = false;

});

const ellipse = document.getElementById("ellipse");
ellipse.addEventListener("click", () => {
  isEllipse = true;
  isRect = false;
  isLine = false;
});

// Tratare eveniment mousedown pen svg
svg.addEventListener("mousedown", (ev) => {

  if (isLine == true) {
    isDrawing = true;
 
    if (ok == 0) {
        const svgP = svgPunct(svg, ev.clientX, ev.clientY);
        x=svgP.x;
        y=svgP.y; 
      ok = 1;
    }
  }
  if (isRect == true) {
    isDrawing = true;
 
    if (ok == 0) {
        const svgP = svgPunct(svg, ev.clientX, ev.clientY);
        x=svgP.x;
        y=svgP.y; 
      ok = 1;
    }
  }
  if(isEllipse) {
    isDrawing = true;
    const svgP = svgPunct(svg, ev.clientX, ev.clientY);
        x=svgP.x;
        y=svgP.y; 
      ok = 1;
  }
});


// Tratare eveniment mousemove pe svg
svg.addEventListener("mousemove", (ev) => {
  if (isDrawing === true) {
    if (isLine == true) {
      svg.style.cursor = "crosshair";
      const svgPM = svgPunct(svg, ev.clientX, ev.clientY);
      var xM = svgPM.x;
      var yM = svgPM.y;

      if(svg.hasChildNodes()){
      svg.removeChild(svg.lastChild);
      }
      
      const newLinie = document.createElementNS(svgns, "line");
      newLinie.setAttribute("x1", x);
      newLinie.setAttribute("y1", y);
      newLinie.setAttribute("x2", xM);
      newLinie.setAttribute("y2", yM);
      newLinie.setAttribute("stroke", stroke);
      newLinie.setAttribute("stroke-width", strokeWidth);
      svg.appendChild(newLinie);


    } else if (isRect === true) {
      svg.style.cursor = "crosshair";
      const svgPM = svgPunct(svg, ev.clientX, ev.clientY);

      var xM = svgPM.x;
      var yM = svgPM.y;

      const width1 = Math.abs(x - xM);
      const height1 = Math.abs(y - yM);
      if(xM > x){
        xM = x;
      }
      if(yM > y){
        yM = y;
      }

      if(svg.hasChildNodes()){
      svg.removeChild(svg.lastChild);
      }
    
      const newRectangle = document.createElementNS(svgns, "rect");
      newRectangle.setAttribute("x", x);
      newRectangle.setAttribute("y", y);
      newRectangle.setAttribute("id", "newRectangle");
      newRectangle.setAttribute("fill", color);
      newRectangle.setAttribute("stroke", stroke);
      newRectangle.setAttribute("stroke-width", strokeWidth);
      newRectangle.setAttribute("width", width1);
      newRectangle.setAttribute("height", height1);
      svg.appendChild(newRectangle);
    } else if (isEllipse === true) {
      svg.style.cursor = "crosshair";
      const svgPM = svgPunct(svg, ev.clientX, ev.clientY);
      var xM = svgPM.x;
      var yM = svgPM.y;

      if(svg.hasChildNodes()){
        svg.removeChild(svg.lastChild);
      }

      const newEllipse = document.createElementNS(svgns, "ellipse");
      newEllipse.setAttribute("cx", (x + xM) /2);
      newEllipse.setAttribute("cy", (Math.max(y, yM) - Math.min(y, yM)) / 2 + Math.min(y, yM));
      newEllipse.setAttribute("rx", (Math.max(x, xM) - Math.min(x, xM)) / 2);
      newEllipse.setAttribute("ry", (Math.max(y, yM) - Math.min(y, yM)) / 2);
      newEllipse.setAttribute("fill", color);
      newEllipse.setAttribute("stroke", stroke);
      newEllipse.setAttribute("stroke-width", strokeWidth);
      svg.appendChild(newEllipse);

    }
  }
});
function defaultValue(){
  color = document.getElementById("fill").value;
  stroke = document.getElementById("stroke").value;
  strokeWidth = document.getElementById("stroke-width").value;
}
defaultValue()

document.addEventListener("change", function(){
  defaultValue()
})

// Tratare eveniment de mouseup pe svg.
svg.addEventListener("mouseup", () => {
  isDrawing = false;
  if (isRect)
  {

    const nullRect = document.createElementNS(svgns, "rect");
    svg.appendChild(nullRect);
  }
  if( isLine){
    const nullLine = document.createElementNS(svgns, "line");
    svg.appendChild(nullLine);

  }
  if( isEllipse){
    const nullEllipse = document.createElementNS(svgns, "ellipse");
    svg.appendChild(nullEllipse);

  }
  ok=0;
});
// -------- Clear Svg -----
const clear = document.getElementById("itemClear");
clear.addEventListener("click", () => {
  while (svg.firstChild) {
    svg.removeChild(svg.lastChild);
}
});

// ------ Undo -----
const undo = document.getElementById("itemUndo");
undo.addEventListener("click", () => {
  if(svg.hasChildNodes()){
    svg.removeChild(svg.lastChild);
  }

});

// -------- Export --------
const saveJPG = document.querySelector("#saveJPG");
const savePNG = document.querySelector("#savePNG");
const saveSVG = document.querySelector("#saveSVG");

saveJPG.addEventListener("click", ()=>{

let img = document.createElement("img");
 img.onload = function() {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  
  let svgSize = divSvg.getBoundingClientRect();
  canvas.width = svgSize.width;
  canvas.height = svgSize.height;
  context.drawImage(img, 0, 0);
    let imgsrc = canvas.toDataURL("image/jpg");
    let b64 = imgsrc.replace(/^data:image.+;base64,/, '');
    let a = document.createElement("a");
    a.download = "picture.jpg";
    a.href = b64;
    a.click();
};
});

savePNG.addEventListener("click", ()=>{
  console.log("click")

let canvas = document.createElement("canvas");
 let svgSize = divSvg.getBoundingClientRect();
 canvas.width = svgSize.width;
 canvas.height = svgSize.height;
let context = canvas.getContext("2d");
let img = document.createElement("img");
img.setAttribute("src", 'data:image/svg+xml;base64,'+ btoa(html));

 img.onload = function() {
    context.drawImage(img, 0, 0);
    let imgsrc = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.download = "picture.png";
    a.href = imgsrc;
    a.click();
};
});

saveSVG.addEventListener("click", ()=>{
    let svgData = divSvg.outerHTML;
    var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);

    const a = document.createElement("a");
    a.href = svgUrl;
    a.download = "picture-svg.svg";
    a.click();
});

const hand = document.getElementById("hand");
hand.addEventListener("click", (ev)=>{
  
  svg.style.cursor = "pointer";
  document.addEventListener("keydown", e=>{
    const selectedItem = e.target;
    console.log(selectedItem);

  })
  
  
});