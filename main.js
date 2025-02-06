
// Hora actual
function horaActual(){
    let fecha = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }
    let hora = fecha.getHours();
    let minuto = fecha.getMinutes();
    let segundo = fecha.getSeconds();
    let horaImprimible = hora + ":" + minuto + ":" + segundo + " | " + dia;
    console.log(horaImprimible);
}

horaActual();

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

// Función para descargar el historial
function downloadHistory() {
    const encryptedThoughts = localStorage.getItem('encryptedThoughts');
    if (encryptedThoughts) {
        const blob = new Blob([encryptedThoughts], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'pensamientos_encriptados.txt';
        a.click();
    } else {
        alert('No hay pensamientos para descargar.');
    }
}

// Función para subir el historial
function uploadHistory(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const encryptedThoughts = e.target.result;
            localStorage.setItem('encryptedThoughts', encryptedThoughts);
            displayThoughts();
            alert('Historial cargado con éxito.');
        };
        reader.readAsText(file);
    }
}

// Agregar el evento click al botón
document.getElementById('logThoughtBtn').addEventListener('click', logThought);

// Agregar eventos a los nuevos botones
document.getElementById('downloadHistoryBtn').addEventListener('click', downloadHistory);
document.getElementById('uploadHistoryBtn').addEventListener('click', () => document.getElementById('fileInput').click());
document.getElementById('fileInput').addEventListener('change', uploadHistory);

// Mostrar los pensamientos existentes al cargar la página
displayThoughts();

// Función para registrar el estado de ánimo
function logMood(mood) {
    const now = new Date();
    const moodEntry = {
        mood: mood,
        timestamp: now.toISOString()
    };

    // Obtener registros existentes
    let moodLog = [];
    const encryptedMoodLog = localStorage.getItem('encryptedMoodLog');
    if (encryptedMoodLog) {
        moodLog = decryptData(encryptedMoodLog, SECRET_KEY);
    }
    moodLog.push(moodEntry);

    // Encriptar y guardar
    const encryptedData = encryptData(moodLog, SECRET_KEY);
    localStorage.setItem('encryptedMoodLog', encryptedData);

    // Actualizar visualización
    displayMoodLog();
}

// Función para mostrar el historial de estados de ánimo
function displayMoodLog() {
    const moodLogElement = document.getElementById('moodLog');
    if (!moodLogElement) return; // Verificar si el elemento existe

    moodLogElement.innerHTML = '';

    const encryptedMoodLog = localStorage.getItem('encryptedMoodLog');
    if (encryptedMoodLog) {
        try {
            const moodLog = decryptData(encryptedMoodLog, SECRET_KEY);
            moodLog.forEach(entry => {
                const moodItem = document.createElement('p');
                moodItem.textContent = `${new Date(entry.timestamp).toLocaleString()}: ${entry.mood}`;
                moodLogElement.appendChild(moodItem);
            });
        } catch (error) {
            console.error('Error al desencriptar el registro de estados de ánimo:', error);
        }
    }
}

// Obtener el modal
const modal = document.getElementById("moodModal");

// Obtener el botón que abre el modal
const btn = document.getElementById("logMoodBtn");

// Obtener el elemento <span> que cierra el modal
const span = document.getElementsByClassName("close")[0];

// Cuando el usuario hace clic en el botón, abrir el modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), cerrar el modal
span.onclick = function() {
  modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del modal, cerrarlo
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Evento para abrir el modal de selección de estado de ánimo
document.getElementById('logMoodBtn').addEventListener('click', () => {
    // Aquí deberías implementar la lógica para abrir el modal
    console.log('Abrir modal de estado de ánimo');
});

// Eventos para los botones de estado de ánimo en el modal
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        logMood(e.target.dataset.mood);
        // Aquí deberías implementar la lógica para cerrar el modal
        console.log('Estado de ánimo registrado:', e.target.dataset.mood);
    });
});

// Inicializar la visualización de pensamientos y estados de ánimo al cargar la página
displayThoughts();
displayMoodLog();

// Al inicio del archivo, después de las otras declaraciones
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el estado guardado de los checkboxes
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
        const checkbox = document.getElementById(day);
        const savedState = localStorage.getItem(`meditation-${day}`);
        if (savedState) {
            checkbox.checked = JSON.parse(savedState);
        }
        
        // Agregar evento para guardar el estado cuando cambie
        checkbox.addEventListener('change', (e) => {
            localStorage.setItem(`meditation-${day}`, e.target.checked);
        });
    });
});
