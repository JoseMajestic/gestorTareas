## Pseudocódigo aplicación TODO list

```
// Variables globais
tarefas = lista baleira
filtroActual = 'todas'

// Referencias aos elementos da páxina
formularioTarefa = elemento con id 'task-form'
campoTarefa = elemento con id 'new-task'
listaTarefas = elemento con id 'task-list'
mensaxeBaleiro = elemento con id 'empty-message'
botonsFiltro = lista de elementos con clase 'filter-btn'
anunciador = elemento con id 'announcer'

// Función cargarTarefas
    tarefasGardadas = localStorage.obter('tasks')
    se tarefasGardadas existe
        tarefas = convertir dende JSON(tarefasGardadas)
    senón
        tarefas = lista baleira
    fin se
    renderizarTarefas()

// Función gardarTarefas
    localStorage.gardar('tasks', convertir a JSON(tarefas))

// Función renderizarTarefas
    // Aplicar filtro
    se filtroActual é 'pendentes'
        tarefasFiltradas = filtrar tarefas onde completado é falso
    se non se filtroActual é 'completadas'
        tarefasFiltradas = filtrar tarefas onde completado é verdadeiro
    se non
        tarefasFiltradas = tarefas
    fin se

    se tarefasFiltradas está baleira
        listaTarefas.baleirar()
        mensaxeBaleiro.amosar()
        anunciar("Non hai tarefas que mostrar.")
    se non
        mensaxeBaleiro.agochar()
        fragmento = novo DocumentFragment
        para cada tarefa en tarefasFiltradas
            crear elemento li
            engadir clase 'task-item' e se completado, 'completed'
            asignar atributo data-id co id da tarefa

            crear span co nome da tarefa
            crear div para accións
            crear botón completar/desfacer
                texto: se completado entón 'Desfacer' se non 'Completar'
                atributo aria-label descritivo
                engadir evento click que chame a alternarCompletado(id)
            crear botón eliminar
                texto: 'Eliminar'
                atributo aria-label
                engadir evento click que chame a eliminarTarefa(id)
            engadir botóns ao div de accións
            engadir span e div ao li
            engadir li ao fragmento
        fin para
        listaTarefas.baleirar()
        listaTarefas.engadir(fragmento)
    fin se
    actualizarBotonsFiltro()

// Función actualizarBotonsFiltro
    para cada botón en botonsFiltro
        filtro = botón.dataset.filter
        se filtro é igual a filtroActual
            engadir clase 'active' ao botón
            establecer aria-pressed a verdadeiro
        se non
            quitar clase 'active'
            establecer aria-pressed a falso
        fin se
    fin para

// Función anunciar(mensaxe)
    anunciador.texto = mensaxe
    esperar 2 segundos
    anunciador.texto = baleiro

// Función engadirTarefa(nome)
    se nome sen espazos é baleiro
        anunciar("Non se pode engadir unha tarefa baleira.")
        rematar
    fin se
    novaTarefa = crear obxecto {
        id: timestamp actual (en string)
        nome: nome sen espazos
        completado: falso
    }
    engadir novaTarefa a tarefas
    gardarTarefas()
    renderizarTarefas()
    anunciar("Tarefa engadida: " + nome)

// Función alternarCompletado(id)
    atopar tarefa en tarefas con ese id
    se existe
        tarefa.completado = non tarefa.completado
        gardarTarefas()
        renderizarTarefas()
        se tarefa.completado
            anunciar("Tarefa completada: " + tarefa.nome)
        se non
            anunciar("Tarefa marcada como pendente: " + tarefa.nome)
        fin se
    fin se

// Función eliminarTarefa(id)
    atopar índice da tarefa en tarefas
    se existe
        nome = tarefas[índice].nome
        eliminar tarefa do array tarefas
        gardarTarefas()
        renderizarTarefas()
        anunciar("Tarefa eliminada: " + nome)
    fin se

// Función definirFiltro(filtro)
    filtroActual = filtro
    renderizarTarefas()
    // Anunciar filtro
    se filtro é 'todas'
        anunciar("Mostrando todas as tarefas")
    se non se filtro é 'pendentes'
        anunciar("Mostrando tarefas pendentes")
    se non
        anunciar("Mostrando tarefas completadas")
    fin se

// Eventos
cando formularioTarefa sexa enviado (submit)
    evitar comportamento por defecto
    chamar engadirTarefa co valor do campoTarefa
    baleirar campoTarefa
    poñer foco no campoTarefa

para cada botón en botonsFiltro
    cando botón sexa pulsado (click)
        chamar definirFiltro co valor do atributo data-filter do botón

// Inicialización
cargarTarefas()
```

## Esquemas da aplicación

### 1. Estrutura de datos
- **Array `tarefas`**: cada elemento é un obxecto con:
  - `id`: string único (xerado con `Date.now()`)
  - `nome`: texto da tarefa
  - `completado`: booleano (true/false)

### 2. Compoñentes da interfaz
- **Formulario** (`#task-form`): campo de texto + botón enviar
- **Lista** (`#task-list`): contenedor das tarefas
- **Mensaxe de lista baleira** (`#empty-message`): móstrase cando non hai tarefas co filtro actual
- **Botóns de filtro** (`.filter-btn`): tres botóns (todas, pendentes, completadas)
- **Anunciador** (`#announcer`): elemento oculto para lectores de pantalla

### 3. Fluxo principal da aplicación

```
[ INICIO ]
    |
    v
[ Cargar tarefas de localStorage ]
    |
    v
[ Renderizar tarefas segundo filtroActual ]
    |
    v
[ Esperar eventos do usuario ]
    |
    +------------------------+---------------------+
    |                        |                     |
[ Enviar formulario ]   [ Clic en completar ]  [ Clic en eliminar ]  [ Clic en filtro ]
    |                        |                     |                     |
    v                        v                     v                     v
[ engadirTarefa() ]      [ alternarCompletado() ] [ eliminarTarefa() ]  [ definirFiltro() ]
    |                        |                     |                     |
    +------------------------+---------------------+---------------------+
    |
    v
[ Gardar tarefas en localStorage ]
    |
    v
[ Renderizar tarefas actualizado ]
    |
    v
[ Anunciar acción (accesibilidade) ]
```

### 4. Diagrama de fluxo da función `renderizarTarefas`

```
       INICIO renderizar
            |
            v
    Aplicar filtro actual
    para obter tarefasFiltradas
            |
            v
    ¿Hai tarefasFiltradas?
    /                   \
   SI                   NON
    |                    |
    v                    v
Ocultar mensaxe       Mostrar mensaxe
de lista baleira      de lista baleira
    |                    |
    |                    v
    |              Anunciar "Non hai
    |              tarefas que mostrar"
    v
Crear fragmento
Para cada tarefa en tarefasFiltradas:
    Crear elemento <li>
    Engadir clase e data-id
    Crear <span> co nome
    Crear <div> para accións
    Crear botón completar/desfacer
        (con evento ligado a alternarCompletado)
    Crear botón eliminar
        (con evento ligado a eliminarTarefa)
    Engadir todo ó <li>
    Engadir <li> ó fragmento
Fin para
    |
    v
Limpar listaTarefas
Engadir fragmento á lista
    |
    v
Actualizar estado activo
dos botóns de filtro
    |
    v
       FIN
```

### 5. Notas de accesibilidade
- **`aria-label`** nos botóns: describe a acción e a tarefa asociada.
- **`aria-pressed`** nos botóns de filtro: indica cal está activo.
- **Anuncios dinámicos**: mediante o elemento `#announcer` (con `aria-live="polite"` no HTML) para que os lectores de pantalla notifiquen os cambios sen mover o foco.

---

Reconstruír o script comprendendo a lóxica, a estrutura de datos e a interacción co DOM e localStorage. Lembrade que o código final en JavaScript deberá respectar a sintaxe propia da linguaxe, pero o pseudocódigo sirve de guía para os pasos a seguir.