# Guía para añadir eventos a PAROGAME

## Estructura del proyecto

- `Index.html`: contiene la estructura de las pantallas y los elementos visibles.
- `styles.css`: contiene los colores, la distribución y el diseño responsivo.
- `script.js`: contiene los orígenes, las reglas y la lista de eventos.
- `guia.md`: explica cómo ampliar el juego sin cambiar la lógica principal.

## Cambiar la presentación

El botón **Vista web / Vista móvil** de la parte superior cambia la presentación visual entre una distribución amplia de PC y una distribución estrecha de móvil. Este cambio solo afecta al diseño; no modifica las reglas ni los datos de la partida.

## Iconos de origen

Las banderas de España, Colombia y Marruecos están dibujadas con SVG en `Index.html`, dentro de las tarjetas de selección de origen. Al usar SVG, los iconos se ven incluso en navegadores que no muestran emojis de banderas.

## Reglas actuales

1. Cada evento representa una decisión.
2. Cada decisión aumenta la edad en 1 año.
3. `dinero` y `estabilidad` no pueden ser negativos.
4. La `estabilidad` tampoco puede superar 100.
5. Si el dinero o la estabilidad llegan a 0, la partida termina.
6. Al terminar el último evento, se necesita:
   - 800 Parocoins o más.
   - 40% de estabilidad o más.

## Cómo añadir un nuevo evento

Abre `script.js` y busca la constante:

```javascript
const eventos = [
```

Añade un nuevo objeto antes del corchete final `];`. Por ejemplo:

```javascript
{
    edad: 23,
    titulo: "Una nueva oportunidad",
    texto: "Describe aquí la situación que vive el personaje.",
    opciones: [
        {
            texto: "Describir la primera decisión",
            efectos: { dinero: 100, estabilidad: 5 },
        },
        {
            texto: "Describir la segunda decisión",
            efectos: { dinero: -50, estabilidad: 10, experiencia: true },
        },
    ],
},
```

Después de añadir el evento, el juego calculará automáticamente la edad final usando la edad del último evento más 1.

## Campos de un evento

### `edad`

Número que indica la edad del personaje cuando ocurre el evento.

```javascript
edad: 23,
```

Usa una edad mayor que la del evento anterior.

### `titulo`

Título corto que se muestra en la tarjeta de la historia.

```javascript
titulo: "Una nueva oportunidad",
```

### `texto`

Descripción de la situación. Debe estar en español.

```javascript
texto: "Describe aquí la situación que vive el personaje.",
```

### `opciones`

Lista de decisiones disponibles. Cada opción necesita:

- `texto`: nombre de la decisión.
- `efectos`: cambios que produce la decisión.

Ejemplo:

```javascript
{
    texto: "Aceptar el trabajo",
    efectos: { dinero: 200, estabilidad: -5 },
}
```

## Atributos que pueden modificarse

Puedes usar estos nombres dentro de `efectos`:

| Atributo | Tipo | Significado |
| --- | --- | --- |
| `dinero` | número | Suma o resta Parocoins |
| `estabilidad` | número | Suma o resta estabilidad |
| `papeles` | `true` o `false` | Indica si el personaje tiene papeles |
| `titulo` | `true` o `false` | Indica si el personaje tiene formación |
| `experiencia` | `true` o `false` | Indica si el personaje tiene experiencia |
| `idioma` | `true` o `false` | Indica si el personaje domina el idioma |

Ejemplo con un cambio booleano:

```javascript
efectos: {
    dinero: -150,
    estabilidad: 8,
    papeles: true,
}
```

Los números se suman al valor actual. Por ejemplo, `dinero: -150` resta 150 Parocoins. Los valores booleanos sustituyen el valor anterior.

## Opciones con requisitos

Una opción puede requerir un atributo concreto. Si el personaje no cumple el requisito, la opción aparece desactivada.

```javascript
{
    texto: "Presentar una solicitud especial",
    requisitos: { papeles: true, titulo: true },
    efectos: { dinero: 300, estabilidad: 10 },
}
```

Puedes usar uno o varios requisitos:

```javascript
requisitos: { experiencia: true }
```

## Consejos para crear eventos

- Añade entre 2 y 4 opciones por evento.
- Equilibra las recompensas de dinero con pérdidas de estabilidad.
- No hagas que todas las opciones sean igualmente convenientes.
- Usa requisitos solo cuando quieras que el origen o las decisiones anteriores importen.
- Mantén los textos en español y con una longitud parecida a los eventos actuales.
- Prueba la partida con los tres orígenes después de añadir eventos.

## Cambiar las condiciones de victoria

Las condiciones finales están en `script.js`, dentro de `CONFIGURACION`:

```javascript
const CONFIGURACION = Object.freeze({
    edadInicial: 18,
    estabilidadMaxima: 100,
    dineroFinalMinimo: 800,
    estabilidadFinalMinima: 40,
});
```

Puedes cambiar `dineroFinalMinimo` y `estabilidadFinalMinima` si quieres hacer el juego más fácil o más difícil.

## Qué no es necesario modificar

Para añadir eventos normalmente no tienes que tocar:

- `Index.html`
- `styles.css`
- Las funciones que dibujan las pantallas
- Las funciones que aplican los efectos

Solo necesitas editar la lista `eventos` en `script.js`.
