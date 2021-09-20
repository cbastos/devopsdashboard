import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Work from './Work'; 

let container = null;
const fakeProjects = [
    {
        id: "23604",
        key: "DEGRES",
        name: " TEAM-DESPL-GRIET REGION ESTE",
    },
    {
        id: "98765",
        key: "XQ2ES",
        name: "Altamira",
    }
]

const fakeIssueType = {
    self: "https://jiraurl.domain/rest/api/2/issuetype/10000",
    id: "10000",
    description: "Created by Jira Software - do not edit or delete. Issue type for a big user story that needs to be broken down.",
    iconUrl: "https://jiraurl.domain/images/icons/issuetypes/epic.svg",
    name: "Epic",
    subtask: false
}

const fakeIssues = {
    Bug: {
        to_do_time_average: null,
        dev_time_average: null,
        blocked_time_average:0, 
        test_time_average: null,
        cycle_time_average: null,
        items:[]
    },
    Story: {
        to_do_time_average: null,
        dev_time_average:null,
        blocked_time_average: 0,
        test_time_average: null,
        cycle_time_average: null,
        items:[]
    }
}


beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    global.fetch = jest.fn()
    .mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve([fakeIssueType])}))
    .mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve(fakeProjects)}))
    .mockImplementationOnce(() => Promise.resolve({json: () => Promise.resolve(fakeIssues)}));
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("should render the projects list selector ", async () => {
    await act(async () => {
        render(<Work/>, container);
    });
    fireEvent.click(screen.queryByTitle('Open'));
    await waitFor(() => screen.getByRole('listbox'))
    const listbox = screen.getByRole('listbox');
    expect(listbox.children.length).toBe(2);
    expect([...listbox.children].map(_ => _.textContent)).toEqual(fakeProjects.map(fp => fp.name));
});

it("should render the issues selector ", async () => {
    await act(async () => {
        render(<Work/>, container);
    });
    const issuesNames = Object.keys(fakeIssues);
    const issuesSelected = screen.getByDisplayValue(issuesNames.join(','));
    expect(issuesSelected.nodeName).toBe('INPUT');
});

it("should render the issues ", async () => {
    await act(async () => {
        render(<Work/>, container);
    });
    const issuesNames = Object.keys(fakeIssues);
    const DOMissues = issuesNames.map(fi => screen.getByText(fi));
    expect(DOMissues.length).toEqual(issuesNames.length);
    DOMissues.forEach(di => expect(di.parentElement.className.indexOf('MuiTypography-root')).not.toBe(-1));
});


