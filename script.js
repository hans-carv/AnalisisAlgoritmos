const header = document.getElementById('main-header');

document.addEventListener('mousemove', (event) => {
    
    if (event.clientY < 120) {
        header.classList.add('visible');
    } else {
        header.classList.remove('visible');
    }
});



const lienzo = document.getElementById('lienzo');
let nodoSeleccionado = null; 


lienzo.addEventListener('click', function(e) {
   
    if (e.target.tagName !== 'svg') return;

    const nombre = prompt("Nombre del nodo:");
    if (!nombre) return;

    
    const rect = lienzo.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    crearNodo(x, y, nombre);
});

function crearNodo(x, y, nombre) {
    
    const grupo = document.createElementNS("http://www.w3.org/2000/svg", "g");
    grupo.setAttribute("transform", `translate(${x},${y})`);
    grupo.style.cursor = "pointer";

    
    const circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circulo.setAttribute("r", 25); 
    circulo.setAttribute("class", "nodo");
    
   
    const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    texto.textContent = nombre;
    texto.setAttribute("dy", ".3em"); 

    
    grupo.addEventListener('click', (e) => {
        e.stopPropagation(); 
        manejarClickNodo(grupo);
    });

    
    grupo.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        crearBucle(grupo);
    });

    
    grupo.appendChild(circulo);
    grupo.appendChild(texto);
    lienzo.appendChild(grupo);
}

function manejarClickNodo(nodoClick) {
    const circulo = nodoClick.querySelector("circle");

    if (nodoSeleccionado === null) {
        
        nodoSeleccionado = nodoClick;
        circulo.classList.add("nodo-seleccionado");
    } else if (nodoSeleccionado === nodoClick) {
        
        circulo.classList.remove("nodo-seleccionado");
        nodoSeleccionado = null;
    } else {
       
        const peso = prompt("Peso de la arista:");
        if (peso) {
            crearFlecha(nodoSeleccionado, nodoClick, peso);
        }
        
       
        nodoSeleccionado.querySelector("circle").classList.remove("nodo-seleccionado");
        nodoSeleccionado = null;
    }
}

function crearFlecha(origen, destino, peso) {
    
    const getCoords = (el) => {
        const transform = el.getAttribute("transform");
        const parts = transform.match(/translate\(([^,]+),([^)]+)\)/);
        return { x: parseFloat(parts[1]), y: parseFloat(parts[2]) };
    };

    const p1 = getCoords(origen);
    const p2 = getCoords(destino);
    const radioNodo = 25; 

   
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    
    const offset = dist / 5; 
    const normX = -dy / dist;
    const normY = dx / dist;
    const cx = midX + normX * offset;
    const cy = midY + normY * offset;


    const vectorX = p2.x - cx;
    const vectorY = p2.y - cy;
    const longVector = Math.sqrt(vectorX*vectorX + vectorY*vectorY);
    
    
    const factor = radioNodo / longVector;
    
    
    const finX = p2.x - (vectorX * factor);
    const finY = p2.y - (vectorY * factor);

   
    const pathData = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${finX} ${finY}`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "black");
    path.setAttribute("fill", "none");
    path.setAttribute("marker-end", "url(#arrowhead)");

    
    const textoPeso = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textoPeso.setAttribute("x", cx);
    textoPeso.setAttribute("y", cy);
    textoPeso.setAttribute("class", "peso-arista"); 
    textoPeso.textContent = peso;

    lienzo.insertBefore(path, lienzo.firstChild);
    lienzo.insertBefore(textoPeso, lienzo.firstChild);
}


function crearBucle(nodo) {
    const peso = prompt("Valor del bucle:");
    if (!peso) return;

    const transform = nodo.getAttribute("transform");
    const parts = transform.match(/translate\(([^,]+),([^)]+)\)/);
    const x = parseFloat(parts[1]);
    const y = parseFloat(parts[2]);
    
    
    const radioNodo = 25;
    const radioBucle = 15; 
    const alturaBucle = 35; 

    
    const startX = x - 10;
    const startY = y - (radioNodo - 5); 
    const endX = x + 10;
    const endY = y - (radioNodo - 5);

   
    const d = `M ${startX} ${startY} 
               C ${x - 30} ${y - alturaBucle - 20}, 
                 ${x + 30} ${y - alturaBucle - 20}, 
                 ${endX} ${endY}`;
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
    path.setAttribute("marker-end", "url(#arrowhead)");

   
    const textoPeso = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textoPeso.setAttribute("x", x);
    textoPeso.setAttribute("y", y - alturaBucle - 10); 
    textoPeso.textContent = peso;
    textoPeso.setAttribute("class", "peso-arista");

    lienzo.insertBefore(path, lienzo.firstChild);
    lienzo.insertBefore(textoPeso, lienzo.firstChild);
}

function borrarLienzo() {
    
    const defs = lienzo.querySelector("defs");

    
    lienzo.innerHTML = '';

    
    if (defs) {
        lienzo.appendChild(defs);
    }

    
    nodoSeleccionado = null;
}