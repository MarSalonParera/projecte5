// Gestiona el tauler amb Fetch + async/await
let idSala, jugador; // Assignats després de XHR

async function obtenirTauler() {
    if (!idSala) return; // No fer res si no tenim ID de sala
    
    try {
        const res = await fetch(`/estatSala?idSala=${idSala}`);
        const dades = await res.json();
        if (dades.tauler) {
            pintarTauler(dades.tauler);
            if (dades.marcador) actualitzarMarcador(dades.marcador);
        }
    } catch (e) {
        console.error("Error en les promeses paral·leles:", e);
    }
}

async function marcarCasella(fila, columna) {
    try {
        const res = await fetch("/marcar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idSala, fila, columna, jugador })
        });
        const dades = await res.json();
        if (dades.tauler) pintarTauler(dades.tauler);
    } catch (e) {
        console.error("Error marcant casella:", e);
    }
}

function actualitzarMarcador(marcador) {
    const p1 = document.getElementById("punts-jug1");
    const p2 = document.getElementById("punts-jug2");
    if (p1 && p2) {
        p1.textContent = marcador.jug1;
        p2.textContent = marcador.jug2;
    }
}

function pintarTauler(dades) {
    const tauler = document.getElementById("tauler");
    tauler.innerHTML = "";
    for (let i = 0; i < dades.length; i++) {
        const fila = document.createElement("tr");
        for (let j = 0; j < dades[i].length; j++) {
            const td = document.createElement("td");
            // Si la casella té valor (jug1 o jug2), li posem com a classe CSS
            if (dades[i][j]) td.className = dades[i][j];
            td.addEventListener("click", () => marcarCasella(i, j));
            fila.appendChild(td);
        }
        tauler.appendChild(fila);
    }
}

// Crida inicial per carregar el tauler cada 1s
setInterval(obtenirTauler, 1000);