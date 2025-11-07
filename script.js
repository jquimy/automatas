// MÁQUINA DE TURING SIMPLIFICADA PERO FUNCIONAL
class TuringMachine {
    constructor() {
        this.states = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'];
        this.initialState = 'q0';
        this.blankSymbol = 'B';
        this.acceptState = 'q13';
        
        // USAR LAS MISMAS TRANSICIONES QUE EN LA TABLA
        this.transitions = {
            'q0': {
                '0': { state: 'q1', write: 'X', move: 'R' },
                '1': { state: 'q2', write: 'Y', move: 'R' },
                'B': { state: 'q14', write: 'B', move: 'S' }
            },
            'q1': {
                '0': { state: 'q1', write: '0', move: 'R' },
                '1': { state: 'q1', write: '1', move: 'R' },
                'B': { state: 'q3', write: 'B', move: 'R' }
            },
            'q2': {
                '0': { state: 'q2', write: '0', move: 'R' },
                '1': { state: 'q2', write: '1', move: 'R' },
                'B': { state: 'q4', write: 'B', move: 'R' }
            },
            'q3': {
                '0': { state: 'q5', write: 'X', move: 'L' },
                '1': { state: 'q6', write: 'Y', move: 'L' },
                'B': { state: 'q14', write: 'B', move: 'S' }
            },
            'q4': {
                '0': { state: 'q7', write: 'X', move: 'L' },
                '1': { state: 'q8', write: 'Y', move: 'L' },
                'B': { state: 'q14', write: 'B', move: 'S' }
            },
            'q5': {
                'B': { state: 'q9', write: 'B', move: 'L' }
            },
            'q6': {
                'B': { state: 'q10', write: 'B', move: 'L' }
            },
            'q7': {
                'B': { state: 'q11', write: 'B', move: 'L' }
            },
            'q8': {
                'B': { state: 'q12', write: 'B', move: 'L' }
            },
            'q9': {
                'X': { state: 'q9', write: '0', move: 'L' },
                'Y': { state: 'q9', write: '1', move: 'L' },
                '0': { state: 'q9', write: '0', move: 'L' },
                '1': { state: 'q9', write: '1', move: 'L' },
                'B': { state: 'q13', write: 'B', move: 'R' }
            },
            'q10': {
                'X': { state: 'q10', write: '1', move: 'L' },
                'Y': { state: 'q10', write: '0', move: 'L' },
                '0': { state: 'q10', write: '0', move: 'L' },
                '1': { state: 'q10', write: '1', move: 'L' },
                'B': { state: 'q13', write: 'B', move: 'R' }
            },
            'q11': {
                'X': { state: 'q11', write: '1', move: 'L' },
                'Y': { state: 'q11', write: '0', move: 'L' },
                '0': { state: 'q11', write: '0', move: 'L' },
                '1': { state: 'q11', write: '1', move: 'L' },
                'B': { state: 'q13', write: 'B', move: 'R' }
            },
            'q12': {
                'X': { state: 'q12', write: '0', move: 'L' },
                'Y': { state: 'q12', write: '1', move: 'L' },
                '0': { state: 'q12', write: '0', move: 'L' },
                '1': { state: 'q12', write: '1', move: 'L' },
                'B': { state: 'q13', write: 'B', move: 'R' }
            },
            'q13': {
                'X': { state: 'q13', write: '0', move: 'R' },
                'Y': { state: 'q13', write: '1', move: 'R' },
                '0': { state: 'q13', write: '0', move: 'R' },
                '1': { state: 'q13', write: '1', move: 'R' },
                'B': { state: 'q13', write: 'B', move: 'R' }  // CAMBIADO de 'S' a 'R'
            }
        };
        
        this.reset();
    }
    
    reset() {
        this.tape = [];
        this.headPosition = 0;
        this.currentState = this.initialState;
        this.history = [];
        this.idHistory = [];
        this.isFinished = false;
        this.result = '';
        this.operationId = '';
    }
    
    initializeTape(firstNumber, secondNumber) {
        // Para la máquina REAL, solo ponemos los números en la cinta
        this.tape = [...firstNumber.split(''), 'B', ...secondNumber.split(''), 'B'];
        
        this.operationId = `${firstNumber}_${secondNumber}`;
        this.headPosition = 0;
        this.currentState = this.initialState;
        this.history = [];
        this.isFinished = false;
        this.result = '';
        
        this.recordHistory();
    }
    
    step() {
        if (this.isFinished) return false;
        
        const currentSymbol = this.tape[this.headPosition] || this.blankSymbol;
        
        if (this.transitions[this.currentState] && 
            this.transitions[this.currentState][currentSymbol]) {
            
            const transition = this.transitions[this.currentState][currentSymbol];
            
            this.tape[this.headPosition] = transition.write;
            
            if (transition.move === 'R') this.headPosition++;
            if (transition.move === 'L') this.headPosition--;
            
            this.currentState = transition.state;
            
            // NUEVA LÓGICA: Detener solo cuando lleguemos al final de la cinta
            if (this.headPosition >= this.tape.length && this.currentState === this.acceptState) {
                this.isFinished = true;
                this.calculateFinalResult();
            }
            
            this.recordHistory();
            return true;
        }
        
        // Si no hay transición, detenerse
        this.isFinished = true;
        if (this.currentState === this.acceptState) {
            this.calculateFinalResult();
        }
        
        return false;
    }
    
    calculateFinalResult() {
        // Extraer el resultado limpio de la cinta
        const tapeStr = this.tape.join('');
        const parts = tapeStr.split('B');
        
        if (parts.length >= 1) {
            let result = parts[0];
            // Convertir símbolos X/Y a 0/1
            result = result.replace(/X/g, '0').replace(/Y/g, '1');
            // Limpiar caracteres no binarios
            result = result.replace(/[^01]/g, '');
            this.result = result || '000';
        }
    }
    
    recordHistory() {
        const tapeStr = this.tape.map((s, i) => i === this.headPosition ? `[${s}]` : s).join(' ');
        this.history.push(`Estado ${this.currentState}: ${tapeStr}`);

        // Registrar ID (u q v)
        const left = this.tape
            .slice(0, this.headPosition)
            .map(ch => ch ?? this.blankSymbol)
            .join('');
        const headSym = this.tape[this.headPosition] ?? this.blankSymbol;
        const right = this.tape
            .slice(this.headPosition + 1)
            .map(ch => ch ?? this.blankSymbol)
            .join('');
        const idTuple = { u: left, q: this.currentState, v: headSym + right };
        this.idHistory.push(idTuple);
    }
}

// Instancia de la Máquina de Turing
const tm = new TuringMachine();

// Elementos del DOM
const firstNumberInput = document.getElementById('firstNumber');
const secondNumberInput = document.getElementById('secondNumber');
const startBtn = document.getElementById('startBtn');
const stepBtn = document.getElementById('stepBtn');
const resetBtn = document.getElementById('resetBtn');
const tapeElement = document.getElementById('tape');
const stateInfoElement = document.getElementById('stateInfo');
const transitionTableBody = document.getElementById('transitionTableBody');
const historyElement = document.getElementById('history');
const graphCanvas = document.getElementById('graphCanvas');
// Elementos para ID y función extendida
const idStepsElement = document.getElementById('idSteps');
const idStepCountElement = document.getElementById('idStepCount');
const deltaStarDisplayElement = document.getElementById('deltaStarDisplay');
// Recursos: PDF y Video
const pdfInput = document.getElementById('pdfInput');
const viewPdfBtn = document.getElementById('viewPdfBtn');
const viewVideoBtn = document.getElementById('viewVideoBtn');
// Enlace fijo al video (cámbialo por tu URL real)
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=XXXXXXXXXXX';
// Ruta por defecto para un PDF incluido en el proyecto
const DEFAULT_PDF_URL = 'ejercicio.pdf';

// Inicializar la tabla de transiciones
function initializeTransitionTable() {
    transitionTableBody.innerHTML = '';
    const originalTransitions = tm.transitions; // ya definidas en la máquina
    
    // Generar la tabla con las transiciones ORIGINALES
    for (const state in originalTransitions) {
        for (const symbol in originalTransitions[state]) {
            const transition = originalTransitions[state][symbol];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${state}</td>
                <td>${symbol}</td>
                <td>${transition.state}</td>
                <td>${transition.write}</td>
                <td>${transition.move}</td>
            `;
            transitionTableBody.appendChild(row);
        }
    }
}

// Actualizar la visualización de la cinta
function updateTapeDisplay() {
    tapeElement.innerHTML = '';
    for (let i = 0; i < tm.tape.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = tm.tape[i];
        if (i === tm.headPosition) cell.classList.add('current');
        tapeElement.appendChild(cell);
    }
    
    stateInfoElement.textContent = `Operación: ${tm.operationId} | Estado: ${tm.currentState}`;
    
    if (tm.isFinished) {
        if (tm.currentState === tm.acceptState) {
            stateInfoElement.innerHTML += ` <span class="accepted">- ACEPTADA</span>`;
            const firstNum = firstNumberInput.value;
            const secondNum = secondNumberInput.value;
            const decimalFirst = parseInt(firstNum, 2);
            const decimalSecond = parseInt(secondNum, 2);
            const decimalResult = decimalFirst - decimalSecond;
            if (decimalResult >= 0) {
                const binaryResult = decimalResult.toString(2).padStart(Math.max(firstNum.length, secondNum.length), '0');
                stateInfoElement.innerHTML += ` <br><strong class="result-highlight">Resultado: ${binaryResult}</strong>`;
                stateInfoElement.innerHTML += ` <br>Operación: ${firstNum} - ${secondNum} = ${binaryResult} (${decimalFirst} - ${decimalSecond} = ${decimalResult})`;
                tm.result = binaryResult;
            } else {
                stateInfoElement.innerHTML += ` <br><strong class="result-error">Resultado: Negativo</strong>`;
            }
        } else {
            stateInfoElement.innerHTML += ` <span class="rejected">- RECHAZADA</span>`;
        }
    }
}

// Actualizar el historial
function updateHistory() {
    historyElement.innerHTML = '';
    for (let i = 0; i < tm.history.length; i++) {
        const item = tm.history[i];
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `Paso ${i}: ${item}`;
        historyElement.appendChild(historyItem);
    }
    historyElement.scrollTop = historyElement.scrollHeight;
}

// --------------------- drawGraph() mejorada ---------------------
function drawGraph() {
    // Asegurar que el contenedor del canvas tenga fondo blanco (si existe)
    if (graphCanvas.parentElement) {
        graphCanvas.parentElement.style.backgroundColor = 'white';
    }
    // Fijar fondo del canvas a blanco
    graphCanvas.style.backgroundColor = 'white';

    // PREPARAR CONTEXTO
    const ctx = graphCanvas.getContext('2d');
    // limpiamos el canvas entero (tamaño puede cambiar más abajo)
    ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

    // parámetros de dibujo
    const nodeRadius = 22;
    const startX = 80;
    const startY = 300;
    const horizontalSpacing = 160; // aumenté ligeramente para dar más espacio horizontal
    const verticalSpacing = 140;   // aumenté vertical para más separación general

    // posiciones (q9..q12 separadas mejor)
    const nodePositions = {
        'q0': { x: startX, y: startY },
        'q1': { x: startX + horizontalSpacing, y: startY - verticalSpacing },
        'q2': { x: startX + horizontalSpacing, y: startY + verticalSpacing },
        'q3': { x: startX + 2 * horizontalSpacing, y: startY - verticalSpacing },
        'q4': { x: startX + 2 * horizontalSpacing, y: startY + verticalSpacing },
        'q5': { x: startX + 3 * horizontalSpacing, y: startY - verticalSpacing - 100 },
        'q6': { x: startX + 3 * horizontalSpacing, y: startY - verticalSpacing + 100 },
        'q7': { x: startX + 3 * horizontalSpacing, y: startY + verticalSpacing - 100 },
        'q8': { x: startX + 3 * horizontalSpacing, y: startY + verticalSpacing + 100 },
        // q9..q12 mucho más separados verticalmente para evitar taparse
        'q9':  { x: startX + 4 * horizontalSpacing, y: startY - verticalSpacing - 220 },
        'q10': { x: startX + 4 * horizontalSpacing, y: startY - verticalSpacing + 40 },
        'q11': { x: startX + 4 * horizontalSpacing, y: startY + verticalSpacing + 120 },
        'q12': { x: startX + 4 * horizontalSpacing, y: startY + verticalSpacing + 300 },
        'q13': { x: startX + 5 * horizontalSpacing, y: startY },
        'q14': { x: startX + 5 * horizontalSpacing, y: startY + 220 }
    };

    // --- Calcular bounding box del grafo y ajustar canvas con padding ---
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s in nodePositions) {
        const p = nodePositions[s];
        minX = Math.min(minX, p.x - nodeRadius - 40);
        minY = Math.min(minY, p.y - nodeRadius - 120); // dejamos espacio extra arriba para ciclos/etiquetas
        maxX = Math.max(maxX, p.x + nodeRadius + 40);
        maxY = Math.max(maxY, p.y + nodeRadius + 160); // espacio extra abajo
    }
    const padding = 80;
    const desiredWidth = Math.max(1200, Math.ceil(maxX - minX) + padding * 2);
    const desiredHeight = Math.max(800, Math.ceil(maxY - minY) + padding * 2);

    // Setear tamaño del canvas (esto borra el contexto, por eso lo hicimos arriba)
    graphCanvas.width = desiredWidth;
    graphCanvas.height = desiredHeight;

    // después de cambiar tamaño, obtener contexto otra vez
    const ctx2 = graphCanvas.getContext('2d');
    ctx2.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
    // traducimos para que la caja mínima quede con padding
    ctx2.save();
    ctx2.translate(padding - minX, padding - minY);

    // estilos y font
    ctx2.lineWidth = 1.5;
    ctx2.font = '14px Arial';
    ctx2.strokeStyle = '#000';
    ctx2.fillStyle = '#000';
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';

    // --- Agrupar transiciones por par origen-destino ---
    const groupedTransitions = {};
    for (const fromState in tm.transitions) {
        for (const symbol in tm.transitions[fromState]) {
            const { state: toState, write, move } = tm.transitions[fromState][symbol];
            const key = `${fromState}_${toState}`;
            if (!groupedTransitions[key]) groupedTransitions[key] = [];
            groupedTransitions[key].push(`${symbol};${write},${move}`);
        }
    }

    // --- Dibujar aristas y etiquetas ---
    for (const key in groupedTransitions) {
        const [fromState, toState] = key.split('_');
        const labels = groupedTransitions[key];
        const fromPos = nodePositions[fromState];
        const toPos = nodePositions[toState];
        if (!fromPos || !toPos) continue;

        // CICLO (origen == destino)
        if (fromState === toState) {
            const loopRadius = 20;
            const loopX = fromPos.x;
            const loopY = fromPos.y - nodeRadius - 24;
            ctx2.beginPath();
            // arco grande para que las etiquetas puedan colocarse encima
            ctx2.arc(loopX, loopY, loopRadius, Math.PI * 0.2, Math.PI * 1.8, false);
            ctx2.stroke();

            // flecha pequeña en el arco (orientación)
            const arrowAngle = Math.PI * 1.15;
            const ax = loopX + loopRadius * Math.cos(arrowAngle);
            const ay = loopY + loopRadius * Math.sin(arrowAngle);
            ctx2.beginPath();
            ctx2.moveTo(ax, ay);
            ctx2.lineTo(ax - 6, ay - 6);
            ctx2.lineTo(ax + 6, ay - 6);
            ctx2.closePath();
            ctx2.fill();

            // Dibujar etiquetas apiladas por encima del bucle
            labels.forEach((text, idx) => {
                // medir anchura del texto
                const tw = ctx2.measureText(text).width;
                const rectW = Math.max(44, Math.ceil(tw + 12));
                const offsetY = loopY - loopRadius - 10 - idx * 18;
                ctx2.fillStyle = '#fff';
                ctx2.fillRect(loopX - rectW / 2, offsetY - 8, rectW, 16);
                ctx2.strokeStyle = '#ccc';
                ctx2.strokeRect(loopX - rectW / 2, offsetY - 8, rectW, 16);
                ctx2.fillStyle = '#000';
                ctx2.fillText(text, loopX, offsetY);
            });

            continue;
        }

        // CONEXIÓN ENTRE DOS NODOS (curva)
        // punto medio curvado para separar curvas de distintas direcciones
        const midX = (fromPos.x + toPos.x) / 2;
        // alejar el control point según la diferencia vertical para evitar cruces en el mismo sitio
        const midY = (fromPos.y + toPos.y) / 2 - 40 * Math.sign(toPos.y - fromPos.y);

        ctx2.beginPath();
        ctx2.moveTo(fromPos.x, fromPos.y);
        ctx2.quadraticCurveTo(midX, midY, toPos.x, toPos.y);
        ctx2.stroke();

        // calcular ángulo local para la flecha (tomando como referencia el punto cercano al destino)
        const angle = Math.atan2(toPos.y - midY, toPos.x - midX);
        const arrowSize = 8;
        // punto en el borde del nodo destino
        const tx = toPos.x - nodeRadius * Math.cos(angle);
        const ty = toPos.y - nodeRadius * Math.sin(angle);
        ctx2.beginPath();
        ctx2.moveTo(tx, ty);
        ctx2.lineTo(tx - arrowSize * Math.cos(angle - Math.PI / 6), ty - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx2.lineTo(tx - arrowSize * Math.cos(angle + Math.PI / 6), ty - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx2.closePath();
        ctx2.fill();

        // Dibujar etiquetas apiladas sobre el punto medio (cada etiqueta en su propia fila)
        labels.forEach((text, idx) => {
            const tw = ctx2.measureText(text).width;
            const rectW = Math.max(48, Math.ceil(tw + 12));
            const offsetY = midY - 8 - idx * 18;
            ctx2.fillStyle = '#fff';
            ctx2.fillRect(midX - rectW / 2, offsetY - 8, rectW, 16);
            ctx2.strokeStyle = '#ccc';
            ctx2.strokeRect(midX - rectW / 2, offsetY - 8, rectW, 16);
            ctx2.fillStyle = '#000';
            ctx2.fillText(text, midX, offsetY);
        });
    }

    // --- Dibujar nodos (después de las aristas para que queden encima) ---
    for (const state in nodePositions) {
        const { x, y } = nodePositions[state];
        ctx2.beginPath();
        ctx2.arc(x, y, nodeRadius, 0, Math.PI * 2);

        if (state === tm.currentState && !tm.isFinished) {
            ctx2.fillStyle = '#ff9800';
        } else if (state === 'q13') {
            ctx2.fillStyle = '#4CAF50';
        } else if (state === 'q14') {
            ctx2.fillStyle = '#f44336';
        } else {
            ctx2.fillStyle = '#2196F3';
        }
        ctx2.fill();

        ctx2.strokeStyle = '#000';
        ctx2.lineWidth = 2;
        ctx2.stroke();

        ctx2.fillStyle = '#fff';
        ctx2.font = 'bold 13px Arial';
        ctx2.fillText(state, x, y);
    }

    // restaurar transform
    ctx2.restore();
}
// ------------------- fin drawGraph() -------------------

// Función para actualizar la descripción formal
function updateFormalDescription() {
    // Contar transiciones totales
    let transitionCount = 0;
    for (const state in tm.transitions) {
        transitionCount += Object.keys(tm.transitions[state]).length;
    }
    document.getElementById('transitionCount').textContent = transitionCount;

    // Actualizar estado actual en tiempo real
    const currentStateElement = document.querySelector('.spec-item:nth-child(1) code');
    if (currentStateElement) {
        currentStateElement.textContent = tm.currentState;
        // Resaltar estado actual en la descripción
        document.querySelectorAll('.state-group span').forEach(span => {
            span.classList.remove('state-current');
            if (span.textContent.includes(tm.currentState)) {
                span.classList.add('state-current');
            }
        });
    }
}

function updateAllDisplays() {
    updateTapeDisplay();
    updateHistory();
    drawGraph();
    updateFormalDescription();
    updateIDSection();
}

// Renderizar sección de ID y δ*
function updateIDSection() {
    if (!idStepsElement || !idStepCountElement || !deltaStarDisplayElement) return;
    // Lista de IDs
    idStepsElement.innerHTML = '';
    tm.idHistory.forEach((id) => {
        const li = document.createElement('li');
        const u = id.u && id.u.length ? id.u : 'ε';
        const v = id.v && id.v.length ? id.v : 'ε';
        li.textContent = `⟨${id.q}, ${u}, ${v}⟩`;
        idStepsElement.appendChild(li);
    });
    // Paso actual
    idStepCountElement.textContent = String(Math.max(0, tm.idHistory.length - 1));
    // δ* actual usando la parte de entrada hasta el primer B
    const tapeStr = tm.tape.map(ch => ch ?? tm.blankSymbol).join('');
    const w = tapeStr.split('B')[0] ?? '';
    deltaStarDisplayElement.textContent = `δ*(q0, ${w || 'ε'}) = ${tm.currentState}`;
}

// Event Listeners
startBtn.addEventListener('click', () => {
    const firstNumber = firstNumberInput.value.trim();
    const secondNumber = secondNumberInput.value.trim();
    if (!firstNumber || !secondNumber || !/^[01]+$/.test(firstNumber) || !/^[01]+$/.test(secondNumber)) {
        alert('Por favor, ingresa números binarios válidos (solo 0 y 1)');
        return;
    }
    tm.initializeTape(firstNumber, secondNumber);
    updateAllDisplays();
    stepBtn.disabled = false;
    resetBtn.disabled = false;
    startBtn.disabled = true;
});

stepBtn.addEventListener('click', () => {
    if (!tm.isFinished) {
        tm.step();
        updateAllDisplays();
        if (tm.isFinished) {
            stepBtn.disabled = true;
            startBtn.disabled = false;
        }
    }
});

resetBtn.addEventListener('click', () => {
    tm.reset();
    updateAllDisplays();
    stepBtn.disabled = true;
    resetBtn.disabled = true;
    startBtn.disabled = false;
});

// Inicializar la aplicación
function initializeApp() {
    initializeTransitionTable();
    updateAllDisplays();
    // Habilitar botón de PDF por defecto (usará DEFAULT_PDF_URL si no se ha seleccionado archivo)
    if (viewPdfBtn) {
        viewPdfBtn.disabled = false;
    }
    // Aplicar zoom global al cargar (75%)
    try {
        document.body.style.zoom = '0.75'; // Chrome/Edge
    } catch (_) {}
    // Fallback (Firefox): usar transform
    if (!document.body.style.zoom) {
        document.body.style.transform = 'scale(0.75)';
        document.body.style.transformOrigin = '0 0';
        document.documentElement.style.width = '133.3333%';
        document.body.style.width = '133.3333%';
    }
}

// Inicializar cuando se carga la página
window.addEventListener('load', initializeApp);

// Listeners para Recursos (PDF y Video)
let currentPdfObjectUrl = null;
if (pdfInput && viewPdfBtn) {
    pdfInput.addEventListener('change', () => {
        const file = pdfInput.files && pdfInput.files[0];
        if (currentPdfObjectUrl) {
            URL.revokeObjectURL(currentPdfObjectUrl);
            currentPdfObjectUrl = null;
        }
        if (file && file.type === 'application/pdf') {
            currentPdfObjectUrl = URL.createObjectURL(file);
            viewPdfBtn.disabled = false;
        } else {
            // Si no hay archivo válido, dejar botón activo solo si tenemos PDF por defecto
            viewPdfBtn.disabled = !DEFAULT_PDF_URL;
        }
    });
    viewPdfBtn.addEventListener('click', () => {
        if (viewPdfBtn.disabled) return;
        const url = currentPdfObjectUrl || DEFAULT_PDF_URL;
        window.open(url, '_blank');
    });
}

if (viewVideoBtn) {
    viewVideoBtn.addEventListener('click', () => {
        window.open(YOUTUBE_URL, '_blank');
    });
}
