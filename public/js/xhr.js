// Implementació XHR2 per a la gestió d'usuaris i sales

function crearSalaXHR(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/crearSala", true);
    
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        } else {
            console.error("Error creant sala");
        }
    };

    xhr.onerror = function() {
        console.error("Error de xarxa en crear sala");
    };

    xhr.send();
}

function unirJugadorXHR(idSala, nom, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/unirJugador", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        } else {
            const errorMsg = JSON.parse(xhr.responseText).error;
            alert("Error: " + errorMsg);
            window.location.href = "/"; // Redirigim a l'inici si la sala és plena
        }
    };

    xhr.send(JSON.stringify({ idSala, nom }));
}