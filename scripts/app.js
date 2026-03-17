// app.js
// Commit 3: se añade el POST para crear posts. App completa.

// ---------------------------------------------------------------------------
// BASE URL de la API
// ---------------------------------------------------------------------------
const API_BASE = 'https://dummyjson.com';

// ---------------------------------------------------------------------------
// REFERENCIAS AL DOM — se guardan una sola vez para no buscarlas en cada uso
// ---------------------------------------------------------------------------

// Vistas principales
const viewHome   = document.getElementById('view-home');
const viewCreate = document.getElementById('view-create');

// Botones de navegación
const btnHome   = document.getElementById('btn-home');
const btnCreate = document.getElementById('btn-create');
const btnBack   = document.getElementById('btn-back');

// Búsqueda
const searchInput = document.getElementById('search-input');
const btnSearch   = document.getElementById('btn-search');

// UI States del Home
const stateIdle    = document.getElementById('state-idle');
const stateLoading = document.getElementById('state-loading');
const stateEmpty   = document.getElementById('state-empty');
const stateError   = document.getElementById('state-error');
const stateSuccess = document.getElementById('state-success');
const postsList    = document.getElementById('posts-list');
const btnRetry     = document.getElementById('btn-retry');

// ---------------------------------------------------------------------------
// NAVEGACIÓN — alterna entre las dos secciones
// ---------------------------------------------------------------------------

function showHome() {
  viewHome.classList.remove('hidden');
  viewCreate.classList.add('hidden');
}

function showCreate() {
  viewHome.classList.add('hidden');
  viewCreate.classList.remove('hidden');
}

btnHome.addEventListener('click', showHome);
btnCreate.addEventListener('click', showCreate);
btnBack.addEventListener('click', () => {
  showHome();
  resetFormStates(); // al volver, deja el formulario limpio
});

// ---------------------------------------------------------------------------
// UI STATES del Home — solo uno visible a la vez
// Recibe un string: 'idle' | 'loading' | 'success' | 'empty' | 'error'
// ---------------------------------------------------------------------------

function setHomeState(state) {
  // Oculta todos primero
  stateIdle.classList.add('hidden');
  stateLoading.classList.add('hidden');
  stateEmpty.classList.add('hidden');
  stateError.classList.add('hidden');
  stateSuccess.classList.add('hidden');

  // Muestra solo el pedido
  switch (state) {
    case 'idle':    stateIdle.classList.remove('hidden');    break;
    case 'loading': stateLoading.classList.remove('hidden'); break;
    case 'empty':   stateEmpty.classList.remove('hidden');   break;
    case 'error':   stateError.classList.remove('hidden');   break;
    case 'success': stateSuccess.classList.remove('hidden'); break;
  }
}

// ---------------------------------------------------------------------------
// RENDER DE CARDS — recibe el array de posts y los pinta en el DOM
// ---------------------------------------------------------------------------

function renderPosts(posts) {
  // Limpia el contenedor antes de pintar nuevos resultados
  postsList.innerHTML = '';

  posts.forEach(post => {
    // Genera los spans de tags; si no hay tags, muestra texto vacío
    const tagsHTML = (post.tags || [])
      .map(tag => `<span class="tag">${tag}</span>`)
      .join('');

    // Crea el card completo con los datos del post
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <h2 class="post-title">${post.title}</h2>
      <p class="post-body">${post.body}</p>
      <div class="post-tags">${tagsHTML}</div>
      <p class="post-meta">Likes: ${post.reactions?.likes ?? 0} &nbsp;|&nbsp; Vistas: ${post.views ?? 0}</p>
    `;

    postsList.appendChild(card);
  });
}

// ---------------------------------------------------------------------------
// FETCH POSTS — GET /posts
// Obtiene todos los posts de la API y actualiza el estado según el resultado
// ---------------------------------------------------------------------------

function fetchAllPosts() {
  setHomeState('loading');

  fetch(`${API_BASE}/posts`)
    .then(response => {
      // Si el servidor responde con error HTTP (4xx, 5xx), lo lanzamos como error
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const posts = data.posts;

      if (!posts || posts.length === 0) {
        // La API respondió pero no hay posts
        setHomeState('empty');
        return;
      }

      renderPosts(posts);
      setHomeState('success');
    })
    .catch(error => {
      // Error de red o error HTTP lanzado arriba
      console.error('fetchAllPosts falló:', error);
      setHomeState('error');
    });
}

// ---------------------------------------------------------------------------
// BUSCAR POSTS — GET /posts/search?q=texto
// Usa query params para filtrar posts por texto en la API
// ---------------------------------------------------------------------------

function searchPosts(query) {
  // Si el campo está vacío, carga todos los posts normalmente
  if (!query.trim()) {
    fetchAllPosts();
    return;
  }

  setHomeState('loading');

  // Se construye la URL con el query param "q"
  const url = `${API_BASE}/posts/search?q=${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const posts = data.posts;

      if (!posts || posts.length === 0) {
        setHomeState('empty');
        return;
      }

      renderPosts(posts);
      setHomeState('success');
    })
    .catch(error => {
      console.error('searchPosts falló:', error);
      setHomeState('error');
    });
}

// ---------------------------------------------------------------------------
// EVENTOS de búsqueda y retry
// ---------------------------------------------------------------------------

// Botón "Buscar"
btnSearch.addEventListener('click', () => {
  searchPosts(searchInput.value);
});

// También busca al presionar Enter dentro del input
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchPosts(searchInput.value);
  }
});

// Botón "Reintentar" del estado error — vuelve a intentar la última acción
btnRetry.addEventListener('click', () => {
  const query = searchInput.value;
  // Si hay texto en el buscador reintenta la búsqueda, si no trae todos los posts
  if (query.trim()) {
    searchPosts(query);
  } else {
    fetchAllPosts();
  }
});

// ---------------------------------------------------------------------------
// FORMULARIO — UI States (el POST se implementa en el Commit 3)
// ---------------------------------------------------------------------------

const formIdle    = document.getElementById('form-idle');
const formLoading = document.getElementById('form-loading');
const formSuccess = document.getElementById('form-success');
const formError   = document.getElementById('form-error');

// Alterna los estados del formulario, igual que setHomeState
function setFormState(state) {
  formIdle.classList.add('hidden');
  formLoading.classList.add('hidden');
  formSuccess.classList.add('hidden');
  formError.classList.add('hidden');

  switch (state) {
    case 'idle':    formIdle.classList.remove('hidden');    break;
    case 'loading': formLoading.classList.remove('hidden'); break;
    case 'success': formSuccess.classList.remove('hidden'); break;
    case 'error':   formError.classList.remove('hidden');   break;
  }
}

// Deja el formulario en estado inicial y limpia los campos
function resetFormStates() {
  setFormState('idle');
  document.getElementById('post-title').value = '';
  document.getElementById('post-body').value  = '';
  document.getElementById('post-tags').value  = '';
}

// ---------------------------------------------------------------------------
// CREAR POST — POST /posts/add
// Lee los campos del formulario, valida que no estén vacíos,
// y envía el JSON al endpoint. Actualiza los estados según el resultado.
// ---------------------------------------------------------------------------

// Guarda los datos del último intento para poder reintentarlo si hay error
let lastPostPayload = null;

function createPost(payload) {
  setFormState('loading');

  fetch(`${API_BASE}/posts/add`, {
    method: 'POST',
    headers: {
      // Le indicamos a la API que el body viene en formato JSON
      'Content-Type': 'application/json'
    },
    // Convertimos el objeto JS a string JSON para enviarlo en el body
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      // DummyJSON devuelve el post creado con un id asignado
      console.log('Post creado:', data);
      setFormState('success');
    })
    .catch(error => {
      console.error('createPost falló:', error);
      setFormState('error');
    });
}

// Botón "Publicar" — valida los campos y llama a createPost
const btnSubmit = document.getElementById('btn-submit');
btnSubmit.addEventListener('click', () => {
  const title = document.getElementById('post-title').value.trim();
  const body  = document.getElementById('post-body').value.trim();
  const tags  = document.getElementById('post-tags').value
                  .split(',')                    // separa por coma
                  .map(t => t.trim())            // limpia espacios de cada tag
                  .filter(t => t.length > 0);   // descarta tags vacíos

  // Validacion minima: titulo y contenido son obligatorios
  if (!title || !body) {
    alert('El titulo y el contenido son obligatorios.');
    return;
  }

  // Se construye el objeto que se enviara en el body del POST
  // userId: 1 es requerido por DummyJSON para aceptar el post
  lastPostPayload = { title, body, tags, userId: 1 };

  createPost(lastPostPayload);
});

// Retry del formulario — reintenta el POST con los mismos datos
const btnFormRetry = document.getElementById('btn-form-retry');
btnFormRetry.addEventListener('click', () => {
  if (lastPostPayload) {
    // Si hay un intento previo guardado, lo reenvía directamente
    createPost(lastPostPayload);
  } else {
    // Si no hay datos previos, vuelve al formulario para que el usuario los ingrese
    setFormState('idle');
  }
});

// ---------------------------------------------------------------------------
// INICIO — carga los posts al abrir la app
// ---------------------------------------------------------------------------
fetchAllPosts();