// 🔧 CONFIGURACIÓN FIREBASE
// Pega aquí tu bloque firebaseConfig tal como te lo da Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyDo638_vPG4W8k78DkdgaS7UTwlE_xQ6Ec",
  authDomain: "eep-n114-portal-c5509.firebaseapp.com",
  databaseURL: "https://eep-n114-portal-c5509-default-rtdb.firebaseio.com/",
  projectId: "eep-n114-portal-c5509",
  storageBucket: "eep-n114-portal-c5509.firebasestorage.app",
  messagingSenderId: "584158473225",
  appId: "1:584158473225:web:aef416a680179eae6c1cd8",
  measurementId: "G-DFQG1L2KQK"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("oculto"));
  document.getElementById(id).classList.remove("oculto");
}

// Login del admin
function login() {
  const pass = document.getElementById("adminPass").value;
  if (pass === "amdn123") {
    sessionStorage.setItem("admin", "true");
    document.getElementById("login").classList.add("oculto");
    document.querySelectorAll(".adminOnly").forEach(e => e.classList.remove("oculto"));
  } else {
    alert("Contraseña incorrecta");
  }
}

// Referencias a las secciones de Firebase
const refs = {
  comunicados: db.ref("comunicados"),
  eventos: db.ref("eventos"),
  docentes: db.ref("docentes")
};

// Escuchar cambios en tiempo real
Object.entries(refs).forEach(([tipo, ref]) => {
  ref.on("value", snap => {
    const data = snap.val() || {};
    const contenedor = document.getElementById("lista" + tipo.charAt(0).toUpperCase() + tipo.slice(1));
    contenedor.innerHTML = "";
    Object.entries(data).forEach(([id, valor]) => {
      const div = document.createElement("div");
      div.className = "item";
      div.textContent = valor.texto || valor.nombre || valor.titulo;
      if (sessionStorage.getItem("admin")) {
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => ref.child(id).remove();
        div.appendChild(btn);
      }
      contenedor.appendChild(div);
    });
  });
});

// Agregar funciones
function agregarComunicado() {
  const texto = document.getElementById("nuevoComunicado").value.trim();
  if (texto) refs.comunicados.push({ texto });
  document.getElementById("nuevoComunicado").value = "";
}

function agregarEvento() {
  const titulo = document.getElementById("nuevoEvento").value.trim();
  if (titulo) refs.eventos.push({ titulo });
  document.getElementById("nuevoEvento").value = "";
}

function agregarDocente() {
  const nombre = document.getElementById("nombreDocente").value.trim();
  if (nombre) refs.docentes.push({ nombre });
  document.getElementById("nombreDocente").value = "";
}
