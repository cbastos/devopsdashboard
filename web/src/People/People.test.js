import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { render, screen, fireEvent, getByText } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import People from './People';
import rdd from "react-router-dom";


let container = null;

const fakeEmployees = [
    {
            "id": 1,
            "name": "DANIEL",
            "surname": "SANCHEZ ALVAREZ",
            "username": "dasanalv",
            "slackid": "U011QBN9K5M",
            "roleid": 4,
            "organizationid": 1,
            "skills": [
                {
                    "employeeid": 1,
                    "skillid": 1,
                    "knowledgelevelid": 6,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 2,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 3,
                    "knowledgelevelid": 6,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 4,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 5,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 6,
                    "knowledgelevelid": 2,
                    "experiencerangeid": 2
                },
                {
                    "employeeid": 1,
                    "skillid": 7,
                    "knowledgelevelid": 6,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 8,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 2
                },
                {
                    "employeeid": 1,
                    "skillid": 9,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 10,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 1
                },
                {
                    "employeeid": 1,
                    "skillid": 11,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 2
                },
                {
                    "employeeid": 1,
                    "skillid": 12,
                    "knowledgelevelid": 4,
                    "experiencerangeid": 2
                },
                {
                    "employeeid": 1,
                    "skillid": 13,
                    "knowledgelevelid": 4,
                    "experiencerangeid": 2
                },
                {
                    "employeeid": 1,
                    "skillid": 14,
                    "knowledgelevelid": 4,
                    "experiencerangeid": 3
                },
                {
                    "employeeid": 1,
                    "skillid": 15,
                    "knowledgelevelid": 1,
                    "experiencerangeid": 1
                },
                {
                    "employeeid": 1,
                    "skillid": 16,
                    "knowledgelevelid": 2,
                    "experiencerangeid": 1
                },
                {
                    "employeeid": 1,
                    "skillid": 17,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 18,
                    "knowledgelevelid": 6,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 19,
                    "knowledgelevelid": 4,
                    "experiencerangeid": 4
                },
                {
                    "employeeid": 1,
                    "skillid": 20,
                    "knowledgelevelid": 1,
                    "experiencerangeid": 1
                },
                {
                    "employeeid": 1,
                    "skillid": 21,
                    "knowledgelevelid": 5,
                    "experiencerangeid": 4
                }
            ]
    },

    {
            "id": 2,
            "name": "BRYAN RAUL",
            "surname": "VACA VARGAS",
            "username": "brvacvar",
            "slackid": "U01EP6ETXRS",
            "roleid": 4,
            "organizationid": 1,
            "skills": []
    }
]

const fakeTeams = [
    {
            "id": 1,
            "name": "Altamira",
            "description": "E-Shop B2C",
            "organizationid": 1,
            "employees": [
                {
                    "id": 13,
                    "teamid": 1,
                    "employeeid": 13,
                    "name": "JUAN DANIEL",
                    "surname": "MONTES MORALES",
                    "username": "jmontmor",
                    "slackid": "U01531Z6MQC",
                    "roleid": 2,
                    "organizationid": 1
                },
                {
                    "id": 17,
                    "teamid": 1,
                    "employeeid": 17,
                    "name": "JAVIER",
                    "surname": "MAROTO RODRIGUEZ",
                    "username": "jmarotor",
                    "slackid": "U010W3QS4SF",
                    "roleid": 4,
                    "organizationid": 1
                },
                {
                    "id": 18,
                    "teamid": 1,
                    "employeeid": 18,
                    "name": "IVAN",
                    "surname": "NAVARRO GARCIA",
                    "username": "inavarga",
                    "slackid": "U011QBNA147",
                    "roleid": 4,
                    "organizationid": 1
                }
            ]
    },

    {
            "id": 2,
            "name": "Endor",
            "description": "E-Care B2C & autónomos",
            "organizationid": 1,
            "employees": [
                {
                    "id": 1,
                    "teamid": 2,
                    "employeeid": 1,
                    "name": "DANIEL",
                    "surname": "SANCHEZ ALVAREZ",
                    "username": "dasanalv",
                    "slackid": "U011QBN9K5M",
                    "roleid": 4,
                    "organizationid": 1
                },
                {
                    "id": 2,
                    "teamid": 2,
                    "employeeid": 2,
                    "name": "BRYAN RAUL",
                    "surname": "VACA VARGAS",
                    "username": "brvacvar",
                    "slackid": "U01EP6ETXRS",
                    "roleid": 4,
                    "organizationid": 1
                },
                {
                    "id": 3,
                    "teamid": 2,
                    "employeeid": 3,
                    "name": "MOISES",
                    "surname": "MANRIQUE CORTES",
                    "username": "mmanriqc",
                    "slackid": "U011QBNAWMV",
                    "roleid": 4,
                    "organizationid": 1
                }
            ]
    }
]

const fakeSkills = {
    "topics": [
        {
            "id": 1,
            "name": "Typescript",
            "description": "Typescript"
        },
        {
            "id": 2,
            "name": "Javascript",
            "description": "Javascript"
        },
        {
            "id": 3,
            "name": "HTML5",
            "description": "HTML5"
        },
        {
            "id": 4,
            "name": "SCSS/SASS",
            "description": "SCSS/SASS"
        },
        {
            "id": 5,
            "name": "CSS",
            "description": "CSS"
        },
        {
            "id": 6,
            "name": "Angular (+2) & WC",
            "description": "Angular (+2) & WC"
        },
        {
            "id": 7,
            "name": "Angular JS",
            "description": "Angular JS"
        },
        {
            "id": 8,
            "name": "Código limpio",
            "description": "Angular (+2) & WC"
        },
        {
            "id": 9,
            "name": "Testing",
            "description": ""
        },
        {
            "id": 10,
            "name": "Programación OO",
            "description": ""
        },
        {
            "id": 11,
            "name": "Principios de diseño",
            "description": ""
        },
        {
            "id": 12,
            "name": "Smells",
            "description": ""
        },
        {
            "id": 13,
            "name": "Refactoring",
            "description": ""
        },
        {
            "id": 14,
            "name": "Patrones de diseño",
            "description": "Patrones de diseño"
        },
        {
            "id": 15,
            "name": "Arquitectura",
            "description": "Conocimientos de arquitecturas como CQRS, Hexagonal, n-capas, etc"
        },
        {
            "id": 16,
            "name": "NodeJS & Express",
            "description": ""
        },
        {
            "id": 17,
            "name": "NPM",
            "description": ""
        },
        {
            "id": 18,
            "name": "VSCode",
            "description": ""
        },
        {
            "id": 19,
            "name": "Jenkins",
            "description": ""
        },
        {
            "id": 20,
            "name": "EKS & Dockers",
            "description": ""
        },
        {
            "id": 21,
            "name": "GIT",
            "description": ""
        }
    ],
    "knowledgeLevels": [
        {
            "id": 1,
            "name": "No lo conozco",
            "description": "Nunca he trabajado con esta tecnología, quizás haya leído sobre ella pero no la he usado"
        },
        {
            "id": 2,
            "name": "Lo estoy aprendiendo",
            "description": "He empezado a trabajar con ella, he empezado a hacer algún tutorial o formación"
        },
        {
            "id": 3,
            "name": "Básico, me defiendo",
            "description": "He empezado a trabajar con ella, he empezado a hacer algún tutorial o formación"
        },
        {
            "id": 4,
            "name": "Medio",
            "description": "Me defiendo, puedo resolver mis problemas del día a día con esta tecnología"
        },
        {
            "id": 5,
            "name": "Avanzado",
            "description": "Puedo resolver cualquier problema con esta tecnología utilizando mejores prácticas"
        },
        {
            "id": 6,
            "name": "Muy experto",
            "description": "Tiene pocos secretos para mí, puedo dar clases avanzadas sobre buenas prácticas, estoy al día sobre última tendencias sobre esta tecnología y domino el API"
        }
    ],
    "experienceRanges": [
        {
            "id": 1,
            "name": "No he trabajado con esta tecnología o práctica",
            "description": "Nunca he trabajado con esta tecnología, quizás haya leído sobre ella pero no la he usado"
        },
        {
            "id": 2,
            "name": "Menos de 1 año",
            "description": ""
        },
        {
            "id": 3,
            "name": "De 1 a 2 años",
            "description": ""
        },
        {
            "id": 4,
            "name": "De 3 a 4 años",
            "description": ""
        },
        {
            "id": 5,
            "name": "De 4 a 5 años",
            "description": ""
        },
        {
            "id": 6,
            "name": "5 años o más",
            "description": ""
        }
    ]
}

jest.mock('react-router-dom');

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    rdd.useParams = jest.fn().mockImplementation(() => ({organizationId: 1}));

    global.fetch = jest.fn()
    .mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve(fakeSkills)}))
    .mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve(fakeEmployees)}))
    .mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve(fakeTeams)}))
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("should render the dashboard ", async () => {
    await act(async () => render(<People/>, container));
    const [dashboardTab, teamsTab] = screen.getByRole('tablist').children;

    expect(dashboardTab.getAttribute('aria-selected')).toBe("true");
    expect(teamsTab.getAttribute('aria-selected')).toBe("false");
    expect(document.querySelector('#dashboard')).toBeTruthy();
    expect(document.querySelector('#teams')).toBeFalsy();
});


it("should render the teams ", async () => {
    await act(async () => render(<People/>, container));
    const [dashboardTab, teamsTab] = screen.getByRole('tablist').children;
    fireEvent.click(teamsTab);

    expect(dashboardTab.getAttribute('aria-selected')).toBe("false");
    expect(teamsTab.getAttribute('aria-selected')).toBe("true");
    expect(document.querySelector('#dashboard')).toBeFalsy();
    const teams = document.querySelector('#teams');
    expect(teams).toBeTruthy();
    expect(teams.children.length).toEqual(fakeTeams.length);
    fakeTeams.forEach((team, teamIndex) => team.employees.forEach(employee => 
        expect(getByText(teams.children[teamIndex], employee.name.concat(` ${employee.surname}`))).toBeTruthy()
    ))
});