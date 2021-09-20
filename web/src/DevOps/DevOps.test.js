import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';
import DevOps from './DevOps';
import rdd from "react-router-dom";
import useProjects from '../_shared/useProjects';
import Pipeline from './Pipeline';
import getMetricAverageFrom from '../_shared/commonDevops';
import getMetricSummatoryFrom from '../_shared/commonDevops';
import IdleJobTimeAverageTile from './Jenkins/metrics/IdleJobTimeAverageTile';
import BuildTimeAverageTile from './Jenkins/metrics/BuildTimeAverageTile';
import FailureResolutionDaysAverageTile from './Jenkins/metrics/FailureResolutionDaysAverageTile';
import BuildStatusPercentagesPieChart from './Jenkins/metrics/BuildStatusPercentagesPieChart';


let container = null;
const fakeProjectTypes = [
    {
        id: 0,
        name: "Unknown",
        description: "Unknown"
    },
    {
        id: 1,
        name: "SPA",
        description: "Single Page Application"
    },
    {
        id: 2,
        name: "Web Component",
        description: "Web Component"
    },
    {
        id: 3,
        name: "Experience Layer Api",
        description: "Experience Layer Api"
    },
    {
        id: 4,
        name: "Experience Layer Api Config",
        description: "Experience Layer Api Config"
    },
    {
        id: 5,
        name: "Facade Api",
        description: "Facade Api"
    },
    {
        id: 6,
        name: "Facade Api Config",
        description: "Facade Api Config"
    },
    {
        id: 7,
        name: "Web Component Config",
        description: "Web Componentn Config"
    }
]

const fakePipelines = [
    {
        "project":{
        "id":1,
        "coderepositoryid":1802,
        "name":"a-project-name",
        "codeanalyzerprojectid":"",
        "projecttypeid":1,
        "confluence":{
            "space":"",
            "page":""
        },
        "repositorypackageid":"",
        "jenkins":{
            "group":"componenteslegacy",
            "name":""
        },
        "commits":[
            {
                "id":"a77945333b6d0796dbe6f2e841c02039dfbf97c0",
                "short_id":"a7794533",
                "created_at":"2021-03-18T20:01:10.000+00:00",
                "parent_ids":[
                    "d79e3c80c76f1a10436db675b537ccc02ccf2ff2"
                ],
                "title":"CHORE: [ci-skip] Update package.config.json/package.json to version 3.40.17-SNAPSHOT before release released",
                "message":"CHORE: [ci-skip] Update package.config.json/package.json to version 3.40.17-SNAPSHOT before release released\n",
                "author_name":"jenkins",
                "author_email":"author@domain.com",
                "authored_date":"2021-03-18T20:01:10.000+00:00",
                "committer_name":"jenkins",
                "committer_email":"author@domain.com",
                "committed_date":"2021-03-18T20:01:10.000+00:00",
                "stats":{
                    "additions":1,
                    "deletions":1,
                    "total":2
                }
            }
        ],
        "sonarqubeStatus":{
            "metric":"alert_status",
            "value":"OK"
        },
        "sonarqubeMeasures":[
            {
                "metric":"sqale_index",
                "value":"0",
                "periods":[
                    {
                    "index":1,
                    "value":"0"
                    }
                ]
            },
            {
                "metric":"reliability_rating",
                "value":"1.0",
                "periods":[
                    {
                    "index":1,
                    "value":"0.0"
                    }
                ]
            },
            {
                "metric":"duplicated_lines_density",
                "value":"0.0",
                "periods":[
                    {
                    "index":1,
                    "value":"0.0"
                    }
                ]
            },
            {
                "metric":"vulnerabilities",
                "value":"0",
                "periods":[
                    {
                    "index":1,
                    "value":"0"
                    }
                ]
            },
            {
                "metric":"alert_status",
                "value":"OK"
            },
            {
                "metric":"ncloc",
                "value":"3647",
                "periods":[
                    {
                    "index":1,
                    "value":"-1"
                    }
                ]
            },
            {
                "metric":"coverage",
                "value":"72.1",
                "periods":[
                    {
                    "index":1,
                    "value":"0.0"
                    }
                ]
            },
            {
                "metric":"security_rating",
                "value":"1.0",
                "periods":[
                    {
                    "index":1,
                    "value":"0.0"
                    }
                ]
            },
            {
                "metric":"code_smells",
                "value":"0",
                "periods":[
                    {
                    "index":1,
                    "value":"0"
                    }
                ]
            },
            {
                "metric":"bugs",
                "value":"0",
                "periods":[
                    {
                    "index":1,
                    "value":"0"
                    }
                ]
            },
            {
                "metric":"sqale_rating",
                "value":"1.0",
                "periods":[
                    {
                    "index":1,
                    "value":"0.0"
                    }
                ]
            }
        ]
        },
        "executions":[
            {
                "created_at":"2021-03-18T19:53:23.880Z",
                "started_at":"2021-03-18T19:53:23.951Z",
                "finished_at":"2021-03-18T19:59:48.530Z",
                "duration_in_minutes":6.40965,
                "idle_job_average_in_seconds":0.071,
                "status":"false"
            },
            {
                "created_at":"2021-03-18T13:36:23.128Z",
                "started_at":"2021-03-18T13:36:23.192Z",
                "finished_at":"2021-03-18T13:47:57.111Z",
                "duration_in_minutes":11.565316666666666,
                "idle_job_average_in_seconds":0.064,
                "status":"success"
            }
        ],
        "coderepositoryid":1802
    },
    {
        "project":{
        "id":2,
        "coderepositoryid":1802,
        "name":"checkout",
        "codeanalyzerprojectid":"",
        "projecttypeid":2,
        "confluence":{
            "space":"",
            "page":""
        },
        "repositorypackageid":"npm/check-out-service-fixed",
        "jenkins":{
            "group":"componenteslegacy",
            "name":"check-out-service-fixed-library-typescript-build"
        },
        "commits":[
            {
                "id":"a77945333b6d0796dbe6f2e841c02039dfbf97c0",
                "short_id":"a7794533",
                "created_at":"2021-03-18T20:01:10.000+00:00",
                "parent_ids":[
                    "d79e3c80c76f1a10436db675b537ccc02ccf2ff2"
                ],
                "title":"CHORE: [ci-skip] Update package.config.json/package.json to version 3.40.17-SNAPSHOT before release released",
                "message":"CHORE: [ci-skip] Update package.config.json/package.json to version 3.40.17-SNAPSHOT before release released\n",
                "author_name":"jenkins",
                "author_email":"author@domain.com",
                "authored_date":"2021-03-18T20:01:10.000+00:00",
                "committer_name":"jenkins",
                "committer_email":"author@domain.com",
                "committed_date":"2021-03-18T20:01:10.000+00:00",
                "stats":{
                    "additions":1,
                    "deletions":1,
                    "total":2
                }
            },
            {
                "id":"d79e3c80c76f1a10436db675b537ccc02ccf2ff2",
                "short_id":"d79e3c80",
                "created_at":"2021-03-18T19:52:27.000+00:00",
                "parent_ids":[
                    "e7af4ca563ef4151eacecbb4aa81aefb8624e3f5",
                    "0510a3977f25a48ebaa25c35b1bd8770746d0061"
                ],
                "title":"Merge branch 'feature-COMTDI-2778' into 'develop'",
                "message":"Merge branch 'feature-COMTDI-2778' into 'develop'\n\nfix: force build\n\nSee merge request componenteslegacy/check-out-service-fixed-library-typescript!58",
                "author_name":"RUBEN JIMINEZ TRIGUERO",
                "author_email":"ruben.jimenez.triguero.sa@everis.com",
                "authored_date":"2021-03-18T19:52:27.000+00:00",
                "committer_name":"RUBEN JIMINEZ TRIGUERO",
                "committer_email":"ruben.jimenez.triguero.sa@everis.com",
                "committed_date":"2021-03-18T19:52:27.000+00:00",
                "stats":{
                    "additions":1,
                    "deletions":1,
                    "total":2
                }
            }
        ],
        "sonarqubeStatus":{
            "metric":"alert_status",
            "value":"OK"
        },
        "sonarqubeMeasures":[
            {
                "metric":"sqale_index",
                "value":"0",
                "periods":[
                    {
                    "index":1,
                    "value":"0"
                    }
                ]
            },
            {
                "metric":"reliability_rating",
                "value":"1.0",
                "periods":[
                    {
                    "index":1,
                    "value":"0.0"
                    }
                ]
            }
        ]
        },
        "executions":[
        {
            "created_at":"2021-03-18T19:53:23.880Z",
            "started_at":"2021-03-18T19:53:23.951Z",
            "finished_at":"2021-03-18T19:59:48.530Z",
            "duration_in_minutes":6.40965,
            "idle_job_average_in_seconds":0.071,
            "status":"success"
        },
        {
            "created_at":"2021-03-18T13:36:23.128Z",
            "started_at":"2021-03-18T13:36:23.192Z",
            "finished_at":"2021-03-18T13:47:57.111Z",
            "duration_in_minutes":11.565316666666666,
            "idle_job_average_in_seconds":0.064,
            "status":"success"
        }
        ],
        "coderepositoryid":1802
    },
    {
        "project":{
        "id":3,
        "coderepositoryid":1784,
        "name":"fake-project-1",
        "codeanalyzerprojectid":"",
        "projecttypeid":2,
        "confluence":{
            "space":"",
            "page":""
        },
        "repositorypackageid":"npm/shopping-cart-alt-resume",
        "jenkins":{
            "group":"componenteslegacy",
            "name":"shopping-cart-alt-resume-library-typescript-build"
        },
        "commits":[
            {
                "id":"5fafcecfb8cdb1871eb5967d97904c65b421eebb",
                "short_id":"5fafcecf",
                "created_at":"2021-03-21T08:43:13.000+00:00",
                "parent_ids":[
                    "56ff6613a75f61ec4ca66f9d8d8a9bcfe6d997f6"
                ],
                "title":"CHORE: [ci-skip] Update package.config.json/package.json to version 3.42.4-SNAPSHOT before release released",
                "message":"CHORE: [ci-skip] Update package.config.json/package.json to version 3.42.4-SNAPSHOT before release released\n",
                "author_name":"jenkins",
                "author_email":"author@domain.com",
                "authored_date":"2021-03-21T08:43:13.000+00:00",
                "committer_name":"jenkins",
                "committer_email":"author@domain.com",
                "committed_date":"2021-03-21T08:43:13.000+00:00",
                "stats":{
                    "additions":1,
                    "deletions":1,
                    "total":2
                }
            }
        ],
        "sonarqubeStatus":{
            "metric":"alert_status",
            "value":"WARN"
        },
        "sonarqubeMeasures":[
            {
                "metric":"duplicated_lines_density",
                "value":"1.6",
                "periods":[
                    {
                    "index":1,
                    "value":"0.0"
                    }
                ]
            },
            {
                "metric":"vulnerabilities",
                "value":"0",
                "periods":[
                    {
                    "index":1,
                    "value":"0"
                    }
                ]
            }
        ]
        },
        "executions":[
        {
            "created_at":"2021-03-21T08:36:39.338Z",
            "started_at":"2021-03-21T08:36:39.403Z",
            "finished_at":"2021-03-21T08:41:58.087Z",
            "duration_in_minutes":5.311400000000001,
            "idle_job_average_in_seconds":0.065,
            "status":"success"
        },
        {
            "created_at":"2021-03-18T13:06:57.795Z",
            "started_at":"2021-03-18T13:06:57.874Z",
            "finished_at":"2021-03-18T13:13:51.280Z",
            "duration_in_minutes":6.8901,
            "idle_job_average_in_seconds":0.079,
            "status":"success"
        }
        ],
        "coderepositoryid":1784
    }
]

jest.mock('react-router-dom');
jest.mock('../_shared/useProjects');
jest.mock('./Pipeline')

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    rdd.useParams = jest.fn().mockImplementation(() => ({organizationId: 1}));
    useProjects.mockImplementation(() => React.useState(fakePipelines));

    Pipeline.mockImplementation(({project}) => <div className="Pipeline"><span>{project.name}</span></div>)
    
    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve(fakeProjectTypes)}))
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});


it("should render the project types selector ", async () => {
    await ReactTestUtils.act(async () => render(<DevOps/>, container));

    fireEvent.mouseDown(document.querySelector('.MuiSelect-selectMenu'));
    await waitFor(() => document.querySelector('#menu-'))

    expect(document.querySelector('#menu-')).toBeTruthy();
    const DOMprojectTypes = screen.getAllByRole('option');
    expect(DOMprojectTypes.length).toEqual(fakeProjectTypes.length);
    DOMprojectTypes.forEach((dpt, i) => 
        expect(dpt.querySelector('.MuiTypography-body1').textContent).toEqual(fakeProjectTypes[i].name)
    )
});


it("should render the metrics ", async () => {
    await ReactTestUtils.act(async () => render(<DevOps/>, container));

    const codeCoverage = screen.getByText('Code coverage').parentElement.querySelector('b').textContent;
    const projectsCodeCoverageAverage = getMetricAverageFrom(fakePipelines, 'coverage').toString();
    expect(codeCoverage).toEqual(projectsCodeCoverageAverage);

    const bugs = screen.getByText('Bugs').parentElement.querySelector('b').textContent;
    const projectsBugsTotal = getMetricSummatoryFrom(fakePipelines, 'bugs').toString();
    expect(bugs).toEqual(projectsBugsTotal);

    const technicalDebt = screen.getByText('Technical Debt').parentElement.querySelector('b').textContent;
    const technicalDebtTotal = getMetricSummatoryFrom(fakePipelines, 'sqale_index').toString();
    expect(technicalDebt).toEqual(technicalDebtTotal);

    const vulnerabilities = screen.getByText('Vulnerabilities').parentElement.querySelector('b').textContent;
    const vulnerabilitiesTotal = getMetricSummatoryFrom(fakePipelines, 'vulnerabilities').toString();
    expect(vulnerabilities).toEqual(vulnerabilitiesTotal);

    let mergedFilteredExecutions = [];
    fakePipelines.forEach(
        ({ executions: filteredExecutions }) => mergedFilteredExecutions = [...mergedFilteredExecutions, ...filteredExecutions]
    );

    await ReactTestUtils.act(async () => render (<IdleJobTimeAverageTile executions={mergedFilteredExecutions}/>));
    const idleJobAverage = screen.getAllByText('Idle job average').map(ija => ija.parentElement.querySelector('b').textContent);
    expect(idleJobAverage[0]).toEqual(idleJobAverage[1]);

    await ReactTestUtils.act(async () => render (<BuildTimeAverageTile executions={mergedFilteredExecutions}/>));
    const buildTimeAverage = screen.getAllByText('Build time average').map(bta => bta.parentElement.querySelector('b').textContent);
    expect(buildTimeAverage[0]).toEqual(buildTimeAverage[1]);

    await ReactTestUtils.act(async () => render (<FailureResolutionDaysAverageTile executions={mergedFilteredExecutions}/>));
    const failureResolutionDaysAverageTile = screen.getAllByText('Recovery time average').map(rta => rta.parentElement.querySelector('b').textContent);
    expect(failureResolutionDaysAverageTile[0]).toEqual(failureResolutionDaysAverageTile[1]);

    await ReactTestUtils.act(async () => render (<BuildStatusPercentagesPieChart executions={mergedFilteredExecutions}/>));
    const recoveryTimeAverage = screen.getAllByText('Build Statistics').map(bs => bs.parentElement.querySelector('canvas'));
    expect(recoveryTimeAverage[0]).toEqual(recoveryTimeAverage[1]);
});


it("should render the projects ", async () => {
    const onlyUnique = (value, index, self) => self.indexOf(value) === index;
    await ReactTestUtils.act(async () => render(<DevOps/>, container));
    const differentProjectGroupIDs = fakePipelines.map(p => p.project.projecttypeid).filter(onlyUnique);
    const projectsToRender = differentProjectGroupIDs.map(i => fakeProjectTypes.find(fpt => fpt.id === i));
    
    const DOMprojectGroups = projectsToRender
    .map(ptr => screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'h2' && content.startsWith(ptr.name)
    }))
    .map(_ => _.textContent)

    expect(DOMprojectGroups.length).toEqual(differentProjectGroupIDs.length)
});
