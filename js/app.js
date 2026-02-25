const tareas = [];
let filtroActual = 'todas';

// Referencias DOM
const formularioTarefa = document.getElementById('task-form');
const campoTarefa = document.getElementById('new-task');
const listaTarefas = document.getElementById('task-list');
const mensaxeBaleiro = document.getElementById('empty-message');
const botonsFiltro = Array.from(document.querySelectorAll('.filter-btn'));
const anunciador = document.getElementById('announcer');
const contador = document.getElementById('counter');

function cargarTarefas() {
  const gardadas = localStorage.getItem('tasks');
  if (gardadas) {
    try {
      const parsed = JSON.parse(gardadas);
      if (Array.isArray(parsed)) {
        tareas.splice(0, tareas.length, ...parsed);
      }
    } catch (_) {
      // se falla JSON, arrinca baleiro
    }
  }
  renderizarTarefas();
}

function gardarTarefas() {
  localStorage.setItem('tasks', JSON.stringify(tareas));
}

function anunciar(mensaxe) {
  anunciador.textContent = mensaxe;
  if (mensaxe) {
    setTimeout(() => { anunciador.textContent = ''; }, 2000);
  }
}

function actualizarBotonsFiltro() {
  botonsFiltro.forEach((btn) => {
    const activo = btn.dataset.filter === filtroActual;
    btn.classList.toggle('active', activo);
    btn.setAttribute('aria-pressed', String(activo));
  });
}

function actualizarContador(tarefasFiltradas) {
  const total = tarefasFiltradas.length;
  contador.textContent = total === 1 ? '1 tarefa' : `${total} tarefas`;
}

function renderizarTarefas() {
  let tarefasFiltradas;
  if (filtroActual === 'pendentes') {
    tarefasFiltradas = tareas.filter((t) => !t.completado);
  } else if (filtroActual === 'completadas') {
    tarefasFiltradas = tareas.filter((t) => t.completado);
  } else {
    tarefasFiltradas = [...tareas];
  }

  if (!tarefasFiltradas.length) {
    listaTarefas.replaceChildren();
    mensaxeBaleiro.hidden = false;
    anunciar('Non hai tarefas que mostrar.');
    actualizarBotonsFiltro();
    actualizarContador(tarefasFiltradas);
    return;
  }

  mensaxeBaleiro.hidden = true;
  const fragmento = document.createDocumentFragment();

  tarefasFiltradas.forEach((tarefa) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (tarefa.completado ? ' completed' : '');
    li.dataset.id = tarefa.id;

    const span = document.createElement('span');
    span.className = 'task-name';
    span.textContent = tarefa.nome;

    const divAccions = document.createElement('div');
    divAccions.className = 'actions';

    const btnCompletar = document.createElement('button');
    btnCompletar.className = 'btn-ghost btn-success';
    btnCompletar.textContent = tarefa.completado ? 'Desfacer' : 'Completar';
    btnCompletar.setAttribute('aria-label', `${tarefa.completado ? 'Desfacer' : 'Completar'} tarefa: ${tarefa.nome}`);
    btnCompletar.addEventListener('click', () => alternarCompletado(tarefa.id));

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-ghost btn-danger';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.setAttribute('aria-label', `Eliminar tarefa: ${tarefa.nome}`);
    btnEliminar.addEventListener('click', () => eliminarTarefa(tarefa.id));

    divAccions.append(btnCompletar, btnEliminar);
    li.append(span, divAccions);
    fragmento.append(li);
  });

  listaTarefas.replaceChildren(fragmento);
  actualizarBotonsFiltro();
  actualizarContador(tarefasFiltradas);
}

function engadirTarefa(nome) {
  if (!nome.trim()) {
    anunciar('Non se pode engadir unha tarefa baleira.');
    return;
  }
  const novaTarefa = {
    id: String(Date.now()),
    nome: nome.trim(),
    completado: false,
  };
  tareas.push(novaTarefa);
  gardarTarefas();
  renderizarTarefas();
  anunciar(`Tarefa engadida: ${novaTarefa.nome}`);
}

function alternarCompletado(id) {
  const tarefa = tareas.find((t) => t.id === id);
  if (!tarefa) return;
  tarefa.completado = !tarefa.completado;
  gardarTarefas();
  renderizarTarefas();
  anunciar(tarefa.completado ? `Tarefa completada: ${tarefa.nome}` : `Tarefa marcada como pendente: ${tarefa.nome}`);
}

function eliminarTarefa(id) {
  const idx = tareas.findIndex((t) => t.id === id);
  if (idx === -1) return;
  const nome = tareas[idx].nome;
  tareas.splice(idx, 1);
  gardarTarefas();
  renderizarTarefas();
  anunciar(`Tarefa eliminada: ${nome}`);
}

function definirFiltro(filtro) {
  filtroActual = filtro;
  renderizarTarefas();
  if (filtro === 'todas') anunciar('Mostrando todas as tarefas');
  else if (filtro === 'pendentes') anunciar('Mostrando tarefas pendentes');
  else anunciar('Mostrando tarefas completadas');
}

// Eventos
aFormulario();

function aFormulario() {
  formularioTarefa.addEventListener('submit', (e) => {
    e.preventDefault();
    engadirTarefa(campoTarefa.value);
    campoTarefa.value = '';
    campoTarefa.focus();
  });

  botonsFiltro.forEach((btn) => {
    btn.addEventListener('click', () => definirFiltro(btn.dataset.filter));
  });

  cargarTarefas();
}
