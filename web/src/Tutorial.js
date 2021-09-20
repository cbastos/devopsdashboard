import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, LIFECYCLE } from 'react-joyride';

function useSteps() {
    const [steps, setSteps] = useState([]);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (document.getElementById('people-menu-button') && !loaded) {
            setLoaded(true);
            setSteps([
                {
                    title: 'People & Team\'s information',
                    content: (
                        <div>
                            Here you have data about the people of selected tribe: teams with related members, people activity, people skills, global skills map, etc
                        </div>
                    ),
                    disableBeacon: true,
                    disableOverlayClose: true,
                    hideCloseButton: false,
                    placement: 'bottom',
                    spotlightClicks: true,
                    styles: { options: { zIndex: 10000 } },
                    target: '#people-menu-button',
                },
                {
                    title: 'Information from code to production',
                    content: (
                        <div>
                            Here you have code repository statistics (gitlab), CI server (jenkins) performance, deployments statistics (XL Deploy), etc
                        </div>
                    ),
                    disableBeacon: true,
                    disableOverlayClose: true,
                    hideCloseButton: false,
                    placement: 'bottom',
                    spotlightClicks: true,
                    styles: { options: { zIndex: 10000 } },
                    target: '#devops-menu-button',
                },
                {
                    title: 'Information from backlog issues point of view',
                    content: (
                        <div>
                            Here you have information about backlog performance (cycle time, blocked time average, etc)
                        </div>
                    ),
                    disableBeacon: true,
                    disableOverlayClose: true,
                    hideCloseButton: false,
                    placement: 'bottom',
                    spotlightClicks: true,
                    styles: { options: { zIndex: 10000 } },
                    target: '#work-menu-button',
                },
                {
                    title: 'Information filtered by product for tribe',
                    content: (
                        <div>
                            Here you have information from Employees, DevOps and Work filtered by products in selected tribe
                        </div>
                    ),
                    disableBeacon: true,
                    disableOverlayClose: true,
                    hideCloseButton: false,
                    placement: 'bottom',
                    spotlightClicks: true,
                    styles: { options: { zIndex: 10000 } },
                    target: '#product-menu-button',
                },
                {
                    title: 'Tool configuration',
                    content: (
                        <div>
                            Here you have configurations about projets, teams, team members, etc.
                        </div>
                    ),
                    disableBeacon: true,
                    disableOverlayClose: true,
                    hideCloseButton: false,
                    placement: 'bottom',
                    spotlightClicks: true,
                    styles: { options: { zIndex: 10000 } },
                    target: '#settings-menu-button',
                }
            ]);

        }
    });
    return [steps];
}

function useRunTutorial() {
    const [run, setRun] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem('tutorial')) {
            setTimeout(() => {
                setRun(true);
            }, 400);
        }
    }, []);
    return [run, setRun];
}

export default function Tutorial() {
    const [steps] = useSteps();
    const [run, setRun] = useRunTutorial();
    let [stepIndex, setStepIndex] = useState(0);

    return (
        <Joyride
            continuous={true}
            run={run}
            steps={steps}
            stepIndex={stepIndex}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            callback={({ action, lifecycle }) => {
                if (action === ACTIONS.CLOSE && lifecycle === LIFECYCLE.COMPLETE) {
                    localStorage.setItem('tutorial', 'done');
                    setRun(false);
                    setStepIndex(0);
                } else if (action === ACTIONS.NEXT && lifecycle === LIFECYCLE.COMPLETE) {
                    setStepIndex(++stepIndex);
                } else if (action === ACTIONS.PREV && lifecycle === LIFECYCLE.COMPLETE) {
                    setStepIndex(--stepIndex);
                }
            }}
        />
    );
}
