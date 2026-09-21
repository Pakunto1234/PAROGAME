"use strict";

/*
 * Configuración general del juego.
 * Si cambias estos valores, también conviene actualizar la guía y los textos
 * que muestran las condiciones de victoria.
 */
const CONFIGURACION = Object.freeze({
    edadInicial: 18,
    estabilidadMaxima: 100,
    dineroFinalMinimo: 800,
    estabilidadFinalMinima: 40,
});

/*
 * Los orígenes definen los atributos con los que empieza cada partida.
 * Los valores booleanos representan condiciones especiales del personaje.
 */
const ORIGENES = {
    espanol: {
        nombre: "Origen local",
        dinero: 1100,
        estabilidad: 70,
        papeles: true,
        titulo: true,
        experiencia: false,
        idioma: true,
    },
    latinoamericano: {
        nombre: "Origen latinoamericano",
        dinero: 500,
        estabilidad: 62,
        papeles: false,
        titulo: false,
        experiencia: true,
        idioma: true,
    },
    magrebi: {
        nombre: "Origen magrebí",
        dinero: 500,
        estabilidad: 55,
        papeles: false,
        titulo: false,
        experiencia: false,
        idioma: false,
    },
};

/*
 * Lista principal de eventos.
 *
 * Para añadir una nueva decisión:
 * 1. Copia un objeto de esta lista.
 * 2. Añádelo antes del corchete final.
 * 3. Usa una edad superior a la del evento anterior.
 * 4. Define al menos una opción dentro de "opciones".
 *
 * Cada opción puede modificar "dinero", "estabilidad", "papeles", "titulo",
 * "experiencia" o "idioma". Los números se suman al valor actual; los valores
 * booleanos sustituyen el valor anterior.
 */
const eventos = [
    {
        edad: 18,
        titulo: "El primer contrato",
        texto: "Llegas a la ciudad con una mochila y una oferta de trabajo. El sueldo es modesto, pero el alquiler no espera.",
        opciones: [
            {
                texto: "Aceptar el turno completo",
                efectos: { dinero: 220, estabilidad: -4, experiencia: true },
            },
            {
                texto: "Buscar un trabajo mejor",
                efectos: { dinero: -80, estabilidad: 8 },
            },
            {
                texto: "Pedir ayuda a un conocido",
                efectos: { dinero: 50, estabilidad: -10 },
            },
        ],
    },
    {
        edad: 19,
        titulo: "La burocracia llama",
        texto: "Una carta oficial te recuerda que tus papeles deben estar en regla. El funcionario sonríe como si eso fuese sencillo.",
        opciones: [
            {
                texto: "Contratar un abogado",
                efectos: { dinero: -350, estabilidad: 12, papeles: true },
            },
            {
                texto: "Hacer el trámite tú mismo",
                efectos: { dinero: -100, estabilidad: -8, papeles: true },
            },
            {
                texto: "Ignorar la carta",
                efectos: { dinero: 0, estabilidad: -22 },
            },
        ],
    },
    {
        edad: 20,
        titulo: "Estudiar o sobrevivir",
        texto: "Una academia ofrece un título que puede abrirte puertas. También cuesta casi todo lo que has ahorrado.",
        opciones: [
            {
                texto: "Pagar los estudios",
                efectos: { dinero: -280, estabilidad: 16, titulo: true },
            },
            {
                texto: "Trabajar horas extra",
                efectos: { dinero: 260, estabilidad: -14, experiencia: true },
            },
            {
                texto: "Aprender por tu cuenta",
                efectos: { dinero: -30, estabilidad: 4 },
            },
        ],
    },
    {
        edad: 21,
        titulo: "El precio de pertenecer",
        texto: "Tus compañeros organizan una mudanza. Compartir piso abarata la vida, aunque significa ceder espacio y privacidad.",
        opciones: [
            {
                texto: "Compartir piso",
                efectos: { dinero: 180, estabilidad: -6 },
            },
            {
                texto: "Mantener tu habitación",
                efectos: { dinero: -230, estabilidad: 12 },
            },
            {
                texto: "Mudarte a las afueras",
                efectos: { dinero: -80, estabilidad: -2 },
            },
        ],
    },
    {
        edad: 22,
        titulo: "La oportunidad",
        texto: "Una entrevista puede cambiar tu situación. Te piden experiencia, papeles y que expliques qué sabes hacer.",
        opciones: [
            {
                texto: "Presentar todas tus credenciales",
                requisitos: { papeles: true, titulo: true },
                efectos: { dinero: 500, estabilidad: 18 },
            },
            {
                texto: "Apostar por tu experiencia",
                requisitos: { experiencia: true },
                efectos: { dinero: 250, estabilidad: 4 },
            },
            {
                texto: "Aceptar cualquier oferta",
                efectos: { dinero: 100, estabilidad: -12 },
            },
        ],
    },
];

/*
 * El estado guarda únicamente los datos que cambian durante la partida.
 * Los eventos y los orígenes permanecen separados para que puedas editarlos
 * sin tocar la lógica del juego.
 */
const estado = {
    origen: null,
    atributos: null,
    indiceEvento: 0,
};

/* Referencias cortas a los elementos del HTML. */
const $ = (selector) => document.querySelector(selector);
const elementos = {
    pantallaCreacion: $("#pantalla-creacion"),
    formulario: $("#formulario-personaje"),
    descripcionCreacion: $("#descripcion-creacion"),
    contadorEventos: $("#contador-eventos"),
    vistaPreviaDinero: $("#vista-previa-dinero"),
    vistaPreviaEstabilidad: $("#vista-previa-estabilidad"),
    vistaPreviaPapeles: $("#vista-previa-papeles"),
    pantallaJuego: $("#pantalla-juego"),
    hudEdad: $("#hud-edad"),
    hudDinero: $("#hud-dinero"),
    hudEstabilidad: $("#hud-estabilidad"),
    hudPapeles: $("#hud-papeles"),
    hudTitulo: $("#hud-titulo"),
    eventoCapitulo: $("#evento-capitulo"),
    eventoOrigen: $("#evento-origen"),
    eventoTitulo: $("#evento-titulo"),
    eventoTexto: $("#evento-texto"),
    contadorOpciones: $("#contador-opciones"),
    listaOpciones: $("#lista-opciones"),
    pantallaFinal: $("#pantalla-final"),
    finalIndicador: $("#final-indicador"),
    finalTitulo: $("#final-titulo"),
    finalTexto: $("#final-texto"),
    finalEdad: $("#final-edad"),
    finalDinero: $("#final-dinero"),
    finalEstabilidad: $("#final-estabilidad"),
    finalPapeles: $("#final-papeles"),
    botonReiniciar: $("#boton-reiniciar"),
    botonVista: $("#boton-vista"),
    textoVista: $("#texto-vista"),
};

const formatoNumero = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0,
});

/* Devuelve la edad final calculada a partir del último evento disponible. */
function obtenerEdadFinal() {
    const ultimoEvento = eventos[eventos.length - 1];
    return ultimoEvento ? ultimoEvento.edad + 1 : CONFIGURACION.edadInicial + 1;
}

/* Cambia entre las pantallas de creación, juego y final. */
function mostrarPantalla(pantalla) {
    elementos.pantallaCreacion.hidden = pantalla !== "creacion";
    elementos.pantallaJuego.hidden = pantalla !== "juego";
    elementos.pantallaFinal.hidden = pantalla !== "final";

    if (pantalla !== "creacion") {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

/* Lee el origen seleccionado en el formulario inicial. */
function obtenerOrigenSeleccionado() {
    const seleccion = document.querySelector("input[name='origen']:checked");
    return seleccion ? ORIGENES[seleccion.value] : null;
}

/* Actualiza los valores que se muestran antes de empezar la partida. */
function actualizarVistaPrevia() {
    const origen = obtenerOrigenSeleccionado();
    if (!origen) return;

    elementos.vistaPreviaDinero.textContent = formatoNumero.format(origen.dinero);
    elementos.vistaPreviaEstabilidad.textContent = `${origen.estabilidad}%`;
    elementos.vistaPreviaPapeles.textContent = origen.papeles ? "Sí" : "No";
}

/* Muestra todos los atributos actuales en la parte superior del juego. */
function actualizarHUD() {
    const { edad, dinero, estabilidad, papeles, titulo } = estado.atributos;

    elementos.hudEdad.textContent = edad;
    elementos.hudDinero.textContent = formatoNumero.format(dinero);
    elementos.hudEstabilidad.textContent = `${estabilidad}%`;
    elementos.hudPapeles.textContent = papeles ? "Sí" : "No";
    elementos.hudTitulo.textContent = titulo ? "Sí" : "No";
}

/* Comprueba si una opción puede elegirse con los atributos actuales. */
function opcionDisponible(opcion) {
    return Object.entries(opcion.requisitos || {}).every(([atributo, valor]) => {
        return estado.atributos[atributo] === valor;
    });
}

/*
 * Aplica los efectos de una decisión.
 * Los valores numéricos son cambios relativos; la estabilidad nunca baja de 0
 * ni supera 100, y el dinero nunca baja de 0.
 */
function aplicarEfectos(efectos) {
    Object.entries(efectos).forEach(([atributo, cambio]) => {
        if (!Object.hasOwn(estado.atributos, atributo)) return;

        if (typeof cambio === "boolean") {
            estado.atributos[atributo] = cambio;
            return;
        }

        const valorActual = Number(estado.atributos[atributo]) || 0;
        const nuevoValor = valorActual + Number(cambio);

        if (atributo === "estabilidad") {
            estado.atributos[atributo] = Math.min(
                CONFIGURACION.estabilidadMaxima,
                Math.max(0, nuevoValor),
            );
        } else if (atributo === "dinero") {
            estado.atributos[atributo] = Math.max(0, nuevoValor);
        } else {
            estado.atributos[atributo] = nuevoValor;
        }
    });
}

/* Crea un botón seguro para cada decisión sin usar HTML dinámico. */
function crearBotonOpcion(opcion, indice) {
    const boton = document.createElement("button");
    const indiceVisual = document.createElement("span");
    const texto = document.createElement("span");
    const flecha = document.createElement("span");
    const disponible = opcionDisponible(opcion);

    boton.type = "button";
    boton.className = "choice-button";
    boton.dataset.indice = String(indice);
    boton.disabled = !disponible;
    boton.setAttribute("aria-label", disponible ? opcion.texto : `${opcion.texto}. Requisitos no cumplidos`);

    indiceVisual.className = "choice-index";
    indiceVisual.textContent = `0${indice + 1}`;

    texto.className = "choice-texto";
    texto.textContent = opcion.texto;

    flecha.className = "choice-arrow";
    flecha.setAttribute("aria-hidden", "true");
    flecha.textContent = "→";

    boton.append(indiceVisual, texto, flecha);
    return boton;
}

/* Dibuja el evento actual y sus decisiones en la pantalla de juego. */
function renderizarEvento() {
    const evento = eventos[estado.indiceEvento];
    const notaIdioma = estado.origen.idioma
        ? ""
        : " La barrera del idioma hace que algunas opciones resulten más difíciles.";

    elementos.eventoCapitulo.textContent = `${evento.edad} años · Decisión ${estado.indiceEvento + 1}/${eventos.length}`;
    elementos.eventoOrigen.textContent = estado.origen.nombre;
    elementos.eventoTitulo.textContent = evento.titulo;
    elementos.eventoTexto.textContent = `${evento.texto}${notaIdioma}`;
    elementos.contadorOpciones.textContent = `${evento.opciones.length} opciones`;
    elementos.listaOpciones.replaceChildren(
        ...evento.opciones.map(crearBotonOpcion),
    );

    actualizarHUD();
}

/* Calcula el resultado final y muestra la pantalla de cierre. */
function mostrarFinal() {
    const { edad, dinero, estabilidad, papeles } = estado.atributos;
    const exito = dinero >= CONFIGURACION.dineroFinalMinimo
        && estabilidad >= CONFIGURACION.estabilidadFinalMinima;

    elementos.finalIndicador.textContent = exito
        ? `Evaluación a los ${edad} años`
        : "La historia se detiene aquí";
    elementos.finalTitulo.textContent = exito ? "Vida encaminada" : "Equilibrio pendiente";
    elementos.finalTexto.textContent = exito
        ? "Llegas al final con recursos y estabilidad. No tienes la vida resuelta, pero ahora puedes elegir el siguiente paso."
        : `Llegas a los ${edad} años, pero no alcanzas los ${formatoNumero.format(CONFIGURACION.dineroFinalMinimo)} Parocoins y el ${CONFIGURACION.estabilidadFinalMinima}% de estabilidad necesarios para superar esta etapa.`;

    elementos.finalEdad.textContent = edad;
    elementos.finalDinero.textContent = formatoNumero.format(dinero);
    elementos.finalEstabilidad.textContent = `${estabilidad}%`;
    elementos.finalPapeles.textContent = papeles ? "Sí" : "No";

    mostrarPantalla("final");
}

/* Gestiona una decisión elegida por el jugador. */
function elegirOpcion(indice) {
    const evento = eventos[estado.indiceEvento];
    const opcion = evento.opciones[indice];

    if (!opcion || !opcionDisponible(opcion)) return;

    aplicarEfectos(opcion.efectos);

    if (estado.atributos.dinero <= 0 || estado.atributos.estabilidad <= 0) {
        const motivo = estado.atributos.dinero <= 0
            ? "Tus Parocoins llegaron a cero."
            : "Tu estabilidad cayó a cero.";
        elementos.finalIndicador.textContent = "La historia se detiene aquí";
        elementos.finalTitulo.textContent = "Fracaso vital";
        elementos.finalTexto.textContent = `${motivo} La vida adulta no perdona los números rojos.`;
        elementos.finalEdad.textContent = estado.atributos.edad;
        elementos.finalDinero.textContent = formatoNumero.format(estado.atributos.dinero);
        elementos.finalEstabilidad.textContent = `${estado.atributos.estabilidad}%`;
        elementos.finalPapeles.textContent = estado.atributos.papeles ? "Sí" : "No";
        mostrarPantalla("final");
        return;
    }

    estado.atributos.edad += 1;

    if (estado.indiceEvento === eventos.length - 1) {
        mostrarFinal();
        return;
    }

    estado.indiceEvento += 1;
    renderizarEvento();
}

/* Prepara una nueva partida con el origen elegido por el jugador. */
function iniciarJuego(evento) {
    evento.preventDefault();

    const origen = obtenerOrigenSeleccionado();
    if (!origen) return;

    estado.origen = origen;
    estado.atributos = {
        edad: CONFIGURACION.edadInicial,
        dinero: origen.dinero,
        estabilidad: origen.estabilidad,
        papeles: origen.papeles,
        titulo: origen.titulo,
        experiencia: origen.experiencia,
        idioma: origen.idioma,
    };
    estado.indiceEvento = 0;

    mostrarPantalla("juego");
    renderizarEvento();
}

/* Vuelve a la pantalla inicial y restablece la selección de origen. */
function reiniciarJuego() {
    estado.origen = null;
    estado.atributos = null;
    estado.indiceEvento = 0;
    elementos.formulario.reset();
    actualizarVistaPrevia();
    mostrarPantalla("creacion");
}

/* Actualiza los textos iniciales que dependen del número de eventos. */
function inicializarTextos() {
    elementos.descripcionCreacion.textContent = `Empiezas con ${CONFIGURACION.edadInicial} años, una mochila y un puñado de Parocoins. Cada decisión avanza un año hasta los ${obtenerEdadFinal()}.`;
    elementos.contadorEventos.textContent = `${eventos.length} decisiones · 1 año por decisión`;
}

/* Alterna la presentación visual entre la vista web y la vista móvil. */
function cambiarVista() {
    const esVistaMovil = document.body.classList.toggle("vista-movil");
    document.body.classList.toggle("vista-escritorio", !esVistaMovil);

    elementos.botonVista.setAttribute("aria-pressed", String(esVistaMovil));
    elementos.botonVista.setAttribute("aria-label", esVistaMovil ? "Cambiar a vista web" : "Cambiar a vista móvil");
    elementos.textoVista.textContent = esVistaMovil ? "Vista móvil" : "Vista web";
}

/* Registra los controles del juego. */
document.querySelectorAll("input[name='origen']").forEach((input) => {
    input.addEventListener("change", actualizarVistaPrevia);
});

elementos.formulario.addEventListener("submit", iniciarJuego);
elementos.listaOpciones.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-indice]");
    if (!boton || boton.disabled) return;
    elegirOpcion(Number(boton.dataset.indice));
});
elementos.botonReiniciar.addEventListener("click", reiniciarJuego);
elementos.botonVista.addEventListener("click", cambiarVista);

inicializarTextos();
actualizarVistaPrevia();
