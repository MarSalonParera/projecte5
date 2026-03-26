// Exemples de crides XHR2 si es vol fer servir en algun punt
let xhr;

function iniciarXHR() {
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        alert("El teu navegador no suporta XHR!");
        return;
    }
}

function obtenirEstatSalaXHR(salaId, callback) {
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.open("GET", `/estatSala?idSala=${salaId}`, true);
    xhr.send();
}

function marcarCasellaXHR(salaId, fila, columna, jugador, callback) {
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.open("POST", "/marcar", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ idSala: salaId, fila, columna, jugador }));
}