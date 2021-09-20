const layoutQuestions = {
	"name": "layout",
	"topics": [
		{
			"name": "CSS",
			"questions": [
				{
					"id": "8779e709-ea48-4fa9-a2b5-0d06807a7a20",
					"text": "Dime alguna mala práctica en CSS",
					"solution": "(ej. ¡Importants, estilar con ids, estilar en línea, uso excesivo de px)",
					"level": 10,
					"children": []
				},
				{
					"id": "5a7e1e95-02c1-4319-918a-0925cdf5ba8d",
					"text": "¿Conoces cómo se aplicas las normas de especificidad? ¿Qué pesa más una clase o un elemento o id?",
					"solution": "(Ordenados de menor peso a mayor elemento – clase – id)",
					"level": 10,
					"children": []
				},
				{
					"id": "90c56fe5-918f-424b-a061-1fbd25092a27",
					"text": "¿Conoces las unidades de medida que existen en CSS? ¿Qué diferencia hay entre REM, EM y PX.",
					"solution": "(Existen diferentes unidades de medida como %, px, em, rem, etc… PX son unidades absolutas que siempre tienen el mismo valor, REM son unidades relativas, asociadas al tamaño de fuente del navegador y que son modificables si se cambia el tamaño de fuente del navegador, EM es parecida a REM pero coge el tamaño de fuente de su elemento padre",
					"level": 30,
					"children": []
				},
				{
					"id": "63178af3-bd90-42e6-a148-1af1f3884808",
					"text": "¿Cómo sueles trabajar con los iconos?",
					"solution": "(generar una fuente o un Sprite, nunca cargando por separado los iconos, aunque en el caso de que sean pocos se podría valorar, pero lo ideal es agruparlos para reducir el número de llamadas al servidor.)",
					"level": 20,
					"children": []
				},
				{
					"id": "309ddbba-6e21-4521-9402-8d2000f482a1",
					"text": "¿Conoces cómo funciona el box-model? ¿Cómo afecta la propiedad box-sizing al box-model? ",
					"solution": "(Cómo funciona el padding, margin, border con respecto a un elemento. El box-sizing afecta a la forma en la que el div calcula su tamaño, border-box contempla el padding y el border, content-box no tiene encuentra ninguna propiedad)",
					"level": 20,
					"children": []
				},
				{
					"id": "80a478ee-db71-4f9f-8500-c6e66b6a4878",
					"text": "¿Has usado media queries alguna vez? ¿Sabes cómo se construye una media query? ",
					"solution": "(Uso de @media(min/max: size))",
					"level": 10,
					"children": []
				}, {
					"id": "d9bed2fa-5992-43e1-b7d9-610088bbca60",
					"text": "¿Sabes cómo maquetar en mobile-first?",
					"solution": "(Las media queries deben empezar de menor a mayor, teniendo en cuenta que las reglas aplicadas por defecto serán para la versión de pantalla más pequeña)",
					"level": 20,
					"children": []
				}, {
					"id": "68daf609-61ab-4064-97df-5c12a7d1bac7",
					"text": "FLEXBOX: Si tenemos un elemento con un display: flex y justify-content: space-around y contiene 3 elementos dentro ¿Cómo se sitúan estos tres elementos?",
					"solution": "(Los elementos quedarán separados entre sí con la misma distancia entre ellos y entre los límites de su padre)",
					"level": 30,
					"children": []
				}, {
					"id": "219f9b62-e9eb-4436-a508-317c27fd0336",
					"text": "FLEXBOX: ¿Cómo se comportan las propiedades align-items y justify-content cuando la propiedad flex-flow es igual a row?¿Y cuando el valor es columna?",
					"solution": "(Por defecto, cuando flex-flow:row la propiedad justify-content posiciona los elementos sobre el eje X y align-items sobre el eje Y, cuando cambiamos a column, estas propiedades se intercambian de eje, justify-content posiciona sobre el eje Y e align-items posiciona sobre el eje X.)",
					"level": 30,
					"children": []
				}, {
					"id": "f4828b15-8c59-4629-8433-5698b0185624",
					"text": "GRID LAYOUT: ¿Qué propiedades utilizamos para separar las filas y las columnas entre sí?",
					"solution": "(Grid-gap: para separar tanto filas como columnas, grid-row-gap: para separar las filas, grid-column-gap: para separar columnas)",
					"level": 30,
					"children": []
				}, {
					"id": "2550c069-ecec-48b7-ae43-566aab3bfcc6",
					"text": "GRID LAYOUT: ¿Cómo se definen el número de columnas que tiene un grid y su tamaño?",
					"solution": "(Utilizamos la propiedad grid-template o la propiedad grid-template-columns)",
					"level": 30,
					"children": []
				}
			]
		}, {
			"name": "HTML",
			"questions": [
				{
					"id": "410483ca-e288-46c6-bbb8-d940b16549e2",
					"text": "¿Qué novedades hay en html5?",
					"solution": "(Html5 mejora semánticamente y añade elementos como footer, header, aside, nav que le dan un significado a su contenido. Se añaden las apis de drag&drop, geolocalización)",
					"level": 20,
					"children": []
				}, {
					"id": "7b40e30d-1814-470c-a8d1-47ddf138ba76",
					"text": "¿En qué situación utilizarías las etiquetas label, span y p? ",
					"solution": "(label se usan en formularios, span se utiliza para resaltar partes de un texto y p para párrafos completos de texto)",
					"level": 10,
					"children": []
				}, {
					"id": "677778c9-e26e-46a7-9d5d-5521d1ff9a41",
					"text": "¿Para qué se utiliza la etiqueta fieldset?",
					"solution": "(Se utiliza para agrupar un conjuntos de campos dentro de un formulario)",
					"level": 20,
					"children": []
				}, {
					"id": "ae57262c-4165-4bd7-9726-75a5d3556742",
					"text": "¿Conoces los niveles de accesibilidad web?",
					"solution": "A, AA y AAA",
					"level": 30,
					"children": []
				}, {
					"id": "5e6ea85d-d701-4f27-8812-7c7b08efd6bf",
					"text": "¿Qué prácticas realizas para mejorar la accesibilidad de tu web?",
					"solution": "(Utilizar los elementos html correctamente según su significado semántico, uso de atributos title, alt en imágenes, uso de los atributos aria-)",
					"level": 20,
					"children": []
				}
			]
		}, {
			"name": "Preprocesadores",
			"questions": [
				{
					"id": "4a2bd992-94d8-4a35-95d7-bf9d8e717bda",
					"text": "¿Cómo declaras variables en Sass y less ?",
					"solution": "($ en sass y @ en less)",
					"level": 10,
					"children": []
				},
				{
					"id": "9ee5b38d-c341-40f7-9385-9bf412b4ce09",
					"text": "¿Cómo se declara un mixin y un extend en sass y qué diferencias hay entre ellos?",
					"solution": "@mixin mixName (@include mixName) y %nameExtend (@extend %nameExtend), cuando compilamos el Código el mixin repite su contenido en cada una de las reglas en las que se ha utilizado, el extend agrupa todas las reglas separadas por comas.",
					"level": 20,
					"children": []
				},
				{
					"id": "29acbcf5-da8c-46dd-82e9-f74a3cac85a0",
					"text": "¿Conoces alguna función nativa de sass? ¿Conoces alguna función de color de sass?",
					"solution": "(map-get, mix, rgba, darken, lighten)",
					"level": 20,
					"children": []
				},
				{
					"id": "e58ec35b-ae3a-4fa6-8d4c-c2887cd2389d",
					"text": "¿Para qué utilizarías un @each o un @for en sass?",
					"solution": "Para generar clases css de forma recursiva o recorrer arrays de variables sass.",
					"level": 30,
					"children": []
				},
				{
					"id": "2a83878a-fefa-446b-980e-09efeca66afc",
					"text": "¿Cómo declaras en sass 2 clases contenidas en el mismo elemento? <div class=”clase1 clase2”></div>",
					"solution": "(se utiliza & para anidar)",
					"level": 10,
					"children": []
				}
			]
		}, {
			"name": "Metodologías",
			"questions": [
				{
					"id": "7268fed6-d700-4d57-bae7-cb3067bafd30",
					"text": "¿Utilizas algún tipo de arquitectura (estructura de ficheros)?¿Cuál? ",
					"solution": "(SMACSS, ITCSS, 7-1 PATTERN o alguna propia)",
					"level": 10,
					"children": []
				}, {
					"id": "e96d924e-cffb-42dd-9dab-7bdd72614f49",
					"text": "¿Conoces alguna metodología de nomenclatura de clases?, Si la respuesta  es sí, preguntar en detalle.",
					"solution": "(BEM, SMACSS, BEMIT o alguna propia)",
					"level": 10,
					"children": []
				},
				{
					"id": "bf8646dc-1cb4-4a7d-8fb4-2dbc7fd687dd",
					"text": "¿Has usado alguna vez CSSMODULES? ¿en qué consiste?¿Sabes cómo declarar estilos globales?",
					"solution": "(CssModules permite encapsular los estilos de un componente de forma que dejan de aplicarse como estilos globales, es habitual que modifique el nombre de la clase con un sufijo o un hash. :global{})",
					"level": 30,
					"children": []
				}, {
					"id": "e6e944fa-99ff-4ffe-a3ad-02d26392af78",
					"text": "¿Has usado alguna librería de css en js? Explica cómo funciona y para qué lo usarías.",
					"solution": "(Styled-components o parecida, se usa para encapsular el código css).",
					"level": 30,
					"children": []
				}, {
					"id": "e5d61880-4c20-4c3c-88cc-2e4426cd2e0f",
					"text": "BOOTSTRAP: ¿Cómo funciona el sistema de filas y columnas y cómo se gestiona el comportamiento responsive?",
					"solution": "(col-media-tamaño, hidden-xs…, container, container-fluid)…",
					"level": 20,
					"children": []
				}, {
					"id": "7d9dff47-60db-4045-88ec-2526703be141",
					"text": "BOOTSTRAP: ¿Qué diferencia hay entre la versión 3.x de Bootstrap y la versión 4.x?",
					"solution": "(4.x se empieza a utilizar flexbox en lugar de float y deja de usar less para usar sass, la cantidad de columnas que se usa…)",
					"level": 40,
					"children": []
				}, {
					"id": "10bbb5ed-88b4-43fe-99c0-ded4169e7b0e",
					"text": "MAIL: ¿Cómo se estructura un email?",
					"solution": "(Con tablas y estilos en línea)",
					"level": 20,
					"children": []
				}
			]
		}
	]
};

export default layoutQuestions;
