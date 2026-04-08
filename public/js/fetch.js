// Gestiona el tauler amb Fetch + async/await
let idSala, jugador; 

async function obtenirTauler() {
    if (!idSala) return; // No fer res si no tenim ID de sala
    
    try {
        // Promise.race per implementar un Timeout
        const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout de xarxa")), 3000)
        );
        
        const fetchPeticio = fetch(`/estatSala?idSala=${idSala}&jugador=${jugador}`);
        const res = await Promise.race([fetchPeticio, timeout]);

        // Promise.all per fer peticions paral·leles
        const [dades] = await Promise.all([
            res.json()
            
        ]);

        if (dades && dades.tauler) {
            pintarTauler(dades.tauler);
            if (dades.marcador) actualitzarMarcador(dades.marcador);

            // Afegim feedback visual si l'altre jugador s'ha desconnectat
            if (dades.jugadors && dades.jugadors.length < 2) {
                document.getElementById('info').textContent = `Sala: ${idSala} | Ets el: ${jugador} | Esperant un altre jugador...`;
            } else {
                document.getElementById('info').textContent = `Sala: ${idSala} | Ets el: ${jugador}`;
            }
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
            
            if (dades[i][j]) td.className = dades[i][j];
            td.addEventListener("click", () => marcarCasella(i, j));
            fila.appendChild(td);
        }
        tauler.appendChild(fila);
    }
}

// Crida inicial per carregar el tauler cada 1s
setInterval(obtenirTauler, 1000);