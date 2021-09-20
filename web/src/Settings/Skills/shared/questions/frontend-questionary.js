const frontendQuestions = {
	"name": "frontend",
	"topics": [
		{
			"name": "JavaScript ES5",
			"questions": [
				{
					"id": "f5cd2d05-1e36-4272-b668-4eefae22ba4f",
					"text": "Dime alguna mala práctica en Javascript",
					"solution": " (ej. variables globales)",
					"level": 10,
					"children": []
				},
				{
					"id": "d97e616a-470e-457a-ab98-faa2681a56dd",
					"text": "¿Podrías explicar qué es una Closure?",
					"solution": "https://www.w3schools.com/js/js_function_closures.asp",
					"level": 10,
					"children": []
				},
				{
					"id": "5556bd52-81ba-4b50-a0d8-9da66dfdf71b",
					"text": "¿Qué es el Hoisting?",
					"solution": "https://www.w3schools.com/js/js_hoisting.asp",
					"level": 10,
					"children": []
				},
				{
					"id": "c2ee313d-6db1-465e-9d8d-762e02263ca0",
					"text": "¿Cuál es la diferencia entre una comparación con doble o triple igual en javascript?",
					"solution": "(triple igual también comprueba tipo, no solo valor",
					"level": 10,
					"children": []
				},
				{
					"id": "24c29706-9ae7-40e1-9f92-ed0164e764b4",
					"text": "¿Qué significa \"this\" en Javascript?",
					"solution": "Contexto en el que se ejecuta el código, puede cambiar el tiempo de ejecución",
					"level": 10,
					"children": [
						{
							"id": "2c588f59-ed25-4e8b-a465-cc3cfd96c933",
							"text": "¿Cómo modifico el contexto (“this”) en una función?",
							"solution": "(sol. call, bind, apply…)",
							"level": 20,
							"children": []
						}
					]
				},
				{
					"id": "c078a768-90c3-4427-a9ad-e3f736f6f790",
					"text": "¿Cómo defino un tipo/clase en Javascript? ¿Cómo la instancio?",
					"solution": "(sol. function y new del function)",
					"level": 10,
					"children": []
				},
				{
					"id": "c1a68103-43c2-4ae0-8869-0333e5cb8501",
					"text": "Declaración de funciones públicas/privadas sobre tipos",
					"solution": "(sol. prototypes)",
					"level": 20,
					"children": []
				},
				{
					"id": "2d074837-efbf-4a6b-ae2a-e9fc538024e2",
					"text": "¿Ventaja de usar prototype?",
					"solution": "(La ventaja de usar prototipos es la eficiencia. Lo que se defina en el prototipo es compartido a nivel de memoria entre todos los objetos de ese tipo)",
					"level": 30,
					"children": []
				}
			]
		},
		{
			"name": "JavaScript ES6",
			"questions": [
				{
					"id": "498ed62e-1192-4987-911a-0b1656d25ac9",
					"text": "Diferencia entre “var”, “let” y “const”",
					"solution": "Cosa L1 es..",
					"level": 10,
					"children": []
				},
				{
					"id": "f8349e57-f17b-4d56-8a91-522c3f3003a6",
					"text": "¿Qué funciones de Array has utilizado? ¿reduce?",
					"solution": "Cosa L1 es..",
					"level": 10,
					"children": []
				},
				{
					"id": "0855b091-4acc-4413-8a8d-fd7573c98e03",
					"text": "Control de asincronía. Promesas. Promise.all, Promise.race… Ventajas de await",
					"solution": "Cosa L1 es..",
					"level": 20,
					"children": []
				}
			]
		},
		{
			"name": "Typescript",
			"questions": [
				{
					"id": "f6f9008f-f586-438e-9fd5-bee353250361",
					"text": "¿Has utilizado typescript?",
					"solution": "Cosa L1 es..",
					"level": 10,
					"children": [
						{
							"id": "e6b35565-73a2-4f3f-a2c7-e54d6108be40",
							"text": "TypeScript vs JavaScript, ¿Qué ventajas/inconvenientes ves a cada uno?",
							"solution": "Cosa L1 es..",
							"level": 20,
							"children": []
						}
					]
				},
			]
		},
		{
			"name": "Angular",
			"questions": [
				{
					"id": "2b5229de-df6c-4646-a699-eb726cca9e62",
					"text": "Explícame el ciclo de vida de los componentes",
					"solution": "Cosa L1 es..",
					"level": 10,
					"children": []
				},
				{
					"id": "b49a6ad1-12ff-4f8d-af8c-5bda5f03f3c8",
					"text": "Explícame cómo funciona la inyección de dependencias (DI)",
					"solution": "Cosa L1 es..",
					"level": 20,
					"children": []
				},
				{
					"id": "374e4ce2-c97d-41b7-91b3-a9e83ee41c43",
					"text": "Explícame cada tipo de componente en Angular (pipes, directives, services…)",
					"solution": "Cosa L1 es..",
					"level": 10,
					"children": []
				},
				{
					"id": "629e7154-4476-4195-8daa-25f722f13073",
					"text": "¿Sabes qué es una pipe?",
					"solution": "Cosa L1 es..",
					"level": 10,
					"children": [
						{
							"id": "3d768d26-8d81-4865-9090-acacc832b6f1",
							"text": "¿Sabes la diferencia entre pipe pura e impura?",
							"solution": "Cosa L2 es..",
							"level": 20,
							"children": [
								{
									"id": "6c97a939-1e41-4f2e-8998-d8e7febfbd24",
									"text": "¿Sabes cuándo actualiza el valor una pipe impura?",
									"solution": "Cosa L3 es..",
									"level": 30,
									"children": []
								}
							]
						}
					]
				},
				{
					"id": "3a2eae6e-4453-4107-9e34-fc3747380fd5",
					"text": "¿Qué estrategias de detección de cambios has utilizado?",
					"solution": "(por ejemplo, OnPush)",
					"level": 30,
					"children": []
				},
				{
					"id": "85288110-a7d4-4196-902f-2f254800a45d",
					"text": "RxJs. ¿Qué tipos de observables/subjects has utilizado?",
					"solution": "Cosa L1 es..",
					"level": 20,
					"children": []
				},
				{
					"id": "8342621c-909f-4df1-81b9-30e535bae6e7",
					"text": "¿Sabes qué es un Injection token?",
					"solution": "Cosa L1 es..",
					"level": 30,
					"children": []
				},
				{
					"id": "1dfa26d8-f65f-4bb0-b17d-f69127213ec0",
					"text": "¿Has utilizado NgRx?",
					"solution": "Cosa L1 es..",
					"level": 20,
					"children": []
				}
			]
		},
		{
			"name": "Arquitectura e Infraestructura en SPAs",
			"questions": [
				{
					"id": "f000cc8d-3498-4bf6-988e-7560e087229e",
					"text": "¿Cómo has autenticado tus SPAs? (Gestión de tokens)",
					"solution": "Cosa L1 es..",
					"level": 20,
					"children": []
				},
				{
					"id": "7ea8854-3a65-492d-95c6-40d60f27f82a",
					"text": "¿Qué arquitectura has implementado en tus aplicaciones? (lógica y física)",
					"solution": "Cosa L1 es..",
					"level": 30,
					"children": []
				},
				{
					"id": "d1684943-b1cf-473f-ae75-045725ab9bc5",
					"text": "¿Sabrías explicarme qué es la programación reactiva?",
					"solution": "Cosa L1 es..",
					"level": 20,
					"children": []
				},
				{
					"id": "edb4031a-577b-43da-b971-5085d6ec8f7f",
					"text": "¿Has trabajado con alguna suite de testing? (Selenium, Jasmine, Karma, Protractor, etc.",
					"solution": "Cosa L1 es..",
					"level": 20,
					"children": []
				},
				{
					"id": "8157edab-7401-4ee0-a986-5935a83b7c55",
					"text": "Npm: scripts, publicación de packages, configuración de feeds…",
					"solution": "Cosa L1 es..",
					"level": 30,
					"children": []
				},
				{
					"id": "ab9c3cf9-aa08-4ea5-9f72-b531ab2c1c8c",
					"text": "¿Cómo gestionas el control de errores y traza de excepciones?",
					"solution": "Cosa L1 es..",
					"level": 30,
					"children": []
				}
			]
		},
		{
			"name": "React",
			"questions": [
				{
					"id": "4ffa14d1-bac6-487f-accf-84f2eec959d2",
					"text": "¿Sabes qué es una HOC?",
					"solution": "Cosa L1 es..",
					"level": 30
				},
				{
					"id": "2bf16107-bfbc-4d38-ba6e-d2f7b8e81344",
					"text": "¿Sabes la diferencia entre un componente stateful y stateless?",
					"solution": "Cosa L1 es..",
					"level": 20
				},
				{
					"id": "c820ebd5-5c2c-4483-af18-0b3411098bc5",
					"text": "¿Podrías describir qué hacen los métodos del ciclo de vida de un componente?",
					"solution": "Cosa L1 es..",
					"level": 20
				},
				{
					"id": "cf8f1b97-25b2-4c8b-9553-a0d49c27d529",
					"text": "¿Sabes qué es una hook?",
					"solution": "Cosa L1 es..",
					"level": 30
				}
			]
		}
	]
};

export default frontendQuestions;