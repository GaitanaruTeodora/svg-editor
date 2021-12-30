"use strict";
const divSvg = document.getElementById("divSvg");
const svg = document.getElementById("svg");
const svgns = "http://www.w3.org/2000/svg";

const line = document.getElementById("line");
const rect = document.getElementById("rect");
const ellipse = document.getElementById("ellipse");

const clear = document.getElementById("itemClear");
const undo = document.getElementById("itemUndo");

const savePNG = document.getElementById("savePNG");
const saveSVG = document.getElementById("saveSVG");
const hand = document.getElementById("hand");

let isDrawing = false;
let isMoving = false;
let isHand = false;
let isLine = false;
let isRect = false;
let isEllipse = false;
let selectedElement;
let elAp;
let coord1;
let coord2;

let v1;
let v2;
let v3;
let v4;

let x = 0;
let y = 0;
let xM = 0;
let yM = 0;

let color;
let stroke;
let strokeWidth;

// Functie determinare pozitie mouse in svg 
function getMousePosition(evt) {
  var CTM = svg.getScreenCTM();
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d,
  };
}

// Tratarea evenimetelor de click pe elementele din left pannel.
line.addEventListener("click", () => {
  isLine = true;
  isRect = false;
  isEllipse = false;
  isHand = false;
});

rect.addEventListener("click", () => {
  isRect = true;
  isLine = false;
  isEllipse = false;
  isHand = false;
});

ellipse.addEventListener("click", () => {
  isEllipse = true;
  isRect = false;
  isLine = false;
  isHand = false;
});

// Tratare eveniment mousedown pe svg
svg.addEventListener("mousedown", (ev) => {
  if (isLine == true) {
    isDrawing = true;
    const svgP = getMousePosition(ev);
    x = svgP.x;
    y = svgP.y;
  }
  if (isRect == true) {
    isDrawing = true;
    const svgP = getMousePosition(ev);
    x = svgP.x;
    y = svgP.y;
  }
  if (isEllipse) {
    isDrawing = true;
    const svgP = getMousePosition(ev);
    x = svgP.x;
    y = svgP.y;
  }
});

// Tratare eveniment mousemove pe svg
svg.addEventListener("mousemove", (ev) => {
  if (isDrawing === true) {
    if (isLine == true) {
      svg.style.cursor = "move";
      const svgPM = getMousePosition(ev);
      xM = svgPM.x;
      yM = svgPM.y;

      if (svg.hasChildNodes()) {
        svg.removeChild(svg.lastChild);
      }

      const newLinie = document.createElementNS(svgns, "line");
      newLinie.setAttribute("id", "newLine");
      newLinie.setAttribute("x1", x);
      newLinie.setAttribute("y1", y);
      newLinie.setAttribute("x2", xM);
      newLinie.setAttribute("y2", yM);
      newLinie.setAttribute("stroke", stroke);
      newLinie.setAttribute("stroke-width", strokeWidth);

      svg.appendChild(newLinie);
    } else if (isRect === true) {
      svg.style.cursor = "move";
      const svgPM = getMousePosition(ev);
      xM = svgPM.x;
      yM = svgPM.y;

      const widthRect = Math.abs(x - xM);
      const heightRect = Math.abs(y - yM);
      if (xM > x) {
        xM = x;
      }
      if (yM > y) {
        yM = y;
      }

      if (svg.hasChildNodes()) {
        svg.removeChild(svg.lastChild);
      }

      const newRectangle = document.createElementNS(svgns, "rect");
      newRectangle.setAttribute("id", "newRectangle");
      newRectangle.setAttribute("x", Math.min(x, xM));
      newRectangle.setAttribute("y", Math.min(y, yM));
      newRectangle.setAttribute("width", widthRect);
      newRectangle.setAttribute("height", heightRect);
      newRectangle.setAttribute("fill", color);
      newRectangle.setAttribute("stroke", stroke);
      newRectangle.setAttribute("stroke-width", strokeWidth);

      svg.appendChild(newRectangle);
    } else if (isEllipse === true) {
      svg.style.cursor = "move";
      const svgPM = getMousePosition(ev);
      xM = svgPM.x;
      yM = svgPM.y;

      if (svg.hasChildNodes()) {
        svg.removeChild(svg.lastChild);
      }

      const newEllipse = document.createElementNS(svgns, "ellipse");
      newEllipse.setAttribute("id", "newEllipse");
      newEllipse.setAttribute("cx", (x + xM) / 2);
      newEllipse.setAttribute(
        "cy",
        (Math.max(y, yM) - Math.min(y, yM)) / 2 + Math.min(y, yM)
      );
      newEllipse.setAttribute("rx", (Math.max(x, xM) - Math.min(x, xM)) / 2);
      newEllipse.setAttribute("ry", (Math.max(y, yM) - Math.min(y, yM)) / 2);
      newEllipse.setAttribute("fill", color);
      newEllipse.setAttribute("stroke", stroke);
      newEllipse.setAttribute("stroke-width", strokeWidth);

      svg.appendChild(newEllipse);
    }
  }
});

// Tratare eveniment mouseup pe svg
svg.addEventListener("mouseup", () => {
  isDrawing = false;
  if (isRect) {
    const nullRect = document.createElementNS(svgns, "rect");
    nullRect.setAttribute("id", "null");
    svg.appendChild(nullRect);
  }
  if (isLine) {
    const nullLine = document.createElementNS(svgns, "line");
    nullLine.setAttribute("id", "null");
    svg.appendChild(nullLine);
  }
  if (isEllipse) {
    const nullEllipse = document.createElementNS(svgns, "ellipse");
    nullEllipse.setAttribute("id", "null");
    svg.appendChild(nullEllipse);
  }
});

// Setare color, stroke color si stroke-width cu valorile default.
// Atribuire color, stroke si stroke-width elementului apasat 
// atunci cand se utilizeaza icon-ul "hand".
function defaultValue() {
  color = document.getElementById("fill").value;
  stroke = document.getElementById("stroke").value;
  strokeWidth = document.getElementById("stroke-width").value;
  if (elAp !== null && isHand == true) {
    if (elAp.id === "newRectangle") {
      elAp.setAttribute("fill", color);
      elAp.setAttribute("stroke", stroke);
      elAp.setAttribute("stroke-width", strokeWidth);
    } else if (elAp.id === "newLine") {
      elAp.setAttribute("stroke", stroke);
      elAp.setAttribute("stroke-width", strokeWidth);
    } else if (elAp.id === "newEllipse") {
      elAp.setAttribute("fill", color);
      elAp.setAttribute("stroke", stroke);
      elAp.setAttribute("stroke-width", strokeWidth);
    }
  }
}

defaultValue();

document.addEventListener("change", function () {
  defaultValue();
});

// Cerinta - clear svg
clear.addEventListener("click", () => {
  while (svg.firstChild) {
    svg.removeChild(svg.lastChild);
  }
});

// Cerinta - undo
undo.addEventListener("click", () => {
  if (svg.hasChildNodes()) {
    let children = svg.children;
    for (let i = children.length - 1; i >= 0; i--) {
      let el = children[i];
      if (el.id !== "null") {
        el.remove();
        break;
      }
    }
  }
});

// Cerinte - export raster & svg
savePNG.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const svgSize = svg.getBoundingClientRect();
  canvas.width = svgSize.width;
  canvas.height = svgSize.height;
  const context = canvas.getContext("2d");

  const img = document.createElement("img");
  const svgData = new XMLSerializer().serializeToString(svg);
  img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));

  img.onload = function () {
    context.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "draw.png";
    link.href = dataUrl;
    link.click();
  };
});

saveSVG.addEventListener("click", () => {
  const svgData = new XMLSerializer().serializeToString(svg);
  const dataUrl =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  const link = document.createElement("a");
  link.download = "draw.svg";
  link.href = dataUrl;
  link.click();
});

// Cerinta - Mutare elemente pe svg.
function startDragRect(e) {
  selectedElement = e.target;
  coord1 = getMousePosition(e);
  coord1.x -= parseFloat(selectedElement.getAttribute("x"));
  coord1.y -= parseFloat(selectedElement.getAttribute("y"));
}
function dragRect(e) {
  if (selectedElement) {
    e.preventDefault();
    coord2 = getMousePosition(e);
    selectedElement.setAttribute("x", coord2.x - coord1.x);
    selectedElement.setAttribute("y", coord2.y - coord1.y);
  }
}

function startDragLine(e) {
  selectedElement = e.target;
  coord1 = getMousePosition(e);
  v1 = parseFloat(selectedElement.getAttribute("x1"));
  v2 = parseFloat(selectedElement.getAttribute("y1"));
  v3 = parseFloat(selectedElement.getAttribute("x2"));
  v4 = parseFloat(selectedElement.getAttribute("y2"));
}

function dragLine(e) {
  if (selectedElement) {
    e.preventDefault();
    coord2 = getMousePosition(e);
    selectedElement.setAttribute("x1", v1 + (coord2.x - coord1.x));
    selectedElement.setAttribute("y1", v2 + (coord2.y - coord1.y));
    selectedElement.setAttribute("x2", v3 + (coord2.x - coord1.x));
    selectedElement.setAttribute("y2", v4 + (coord2.y - coord1.y));
  }
}

function startDragEllipse(e) {
  selectedElement = e.target;
  coord1 = getMousePosition(e);
  v1 = parseFloat(selectedElement.getAttribute("cx"));
  v2 = parseFloat(selectedElement.getAttribute("cy"));
  v3 = parseFloat(selectedElement.getAttribute("rx"));
  v4 = parseFloat(selectedElement.getAttribute("ry"));
}

function dragEllipse(e) {
  if (selectedElement) {
    e.preventDefault();
    coord2 = getMousePosition(e);
    selectedElement.setAttribute("cx", v1 + (coord2.x - coord1.x));
    selectedElement.setAttribute("cy", v2 + (coord2.y - coord1.y));
  }
}

hand.addEventListener("click", (ev) => {
  isLine = false;
  isRect = false;
  isEllipse = false;
  isDrawing = false;
  isHand = true;

  svg.style.cursor = "pointer";
  document.addEventListener("click", (e) => {
    selectedElement = e.target;
    if (selectedElement.id === "newRectangle") {
      elAp = selectedElement;
    } else if (selectedElement.id === "newLine") {
      elAp = selectedElement;
    } else if (selectedElement.id === "newEllipse") {
      elAp = selectedElement;
    }
  });

  document.addEventListener("mousedown", (e) => {
    selectedElement = e.target;
    if (isDrawing == false) {
      if (selectedElement.id === "newRectangle") {
        startDragRect(e);
      }
      if (selectedElement.id === "newLine") {
        startDragLine(e);
      }
      if (selectedElement.id === "newEllipse") {
        startDragEllipse(e);
      }
      isMoving = true;
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (isMoving == true && isDrawing == false) {
      if (selectedElement.id === "newRectangle") {
        dragRect(e);
      }
      if (selectedElement.id === "newLine") {
        dragLine(e);
      }
      if (selectedElement.id === "newEllipse") {
        dragEllipse(e);
      }
    }
  });

  document.addEventListener("mouseup", (e) => {
    isMoving = false;
  });
});
