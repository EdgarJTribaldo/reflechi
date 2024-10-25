// Función para encriptar datos
function encryptData(data, secretKey) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Función para desencriptar datos
function decryptData(encryptedData, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Clave secreta para la encriptación (en una aplicación real, esto debería ser único para cada usuario)
const SECRET_KEY = 'mi_clave_secreta';

// Función para registrar pensamientos
function logThought() {
    const now = new Date();
    const timestamp = now.toLocaleString();
    const thought = prompt("Ingresa tu pensamiento:");
    
    if (thought) {
        // Crear la entrada de registro
        const logEntry = { timestamp, thought };
        
        // Obtener pensamientos existentes del localStorage
        let thoughts = [];
        const encryptedThoughts = localStorage.getItem('encryptedThoughts');
        if (encryptedThoughts) {
            thoughts = decryptData(encryptedThoughts, SECRET_KEY);
        }
        
        // Añadir el nuevo pensamiento
        thoughts.push(logEntry);
        
        // Encriptar y guardar todos los pensamientos en localStorage
        const encryptedData = encryptData(thoughts, SECRET_KEY);
        localStorage.setItem('encryptedThoughts', encryptedData);
        
        // Actualizar la visualización
        displayThoughts();
    }
}

// Función para mostrar los pensamientos
function displayThoughts() {
    const thoughtLog = document.getElementById('thoughtLog');
    thoughtLog.innerHTML = ''; // Limpiar el contenido actual
    
    // Obtener y desencriptar los pensamientos
    const encryptedThoughts = localStorage.getItem('encryptedThoughts');
    if (encryptedThoughts) {
        const thoughts = decryptData(encryptedThoughts, SECRET_KEY);
        
        // Mostrar cada pensamiento
        thoughts.forEach(entry => {
            const logItem = document.createElement('p');
            logItem.textContent = `${entry.timestamp}: ${entry.thought}`;
            thoughtLog.appendChild(logItem);
        });
    }
}

// Agregar el evento click al botón
document.getElementById('logThoughtBtn').addEventListener('click', logThought);

// Mostrar los pensamientos existentes al cargar la página
displayThoughts();
