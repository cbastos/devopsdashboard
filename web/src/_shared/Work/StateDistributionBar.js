import React from 'react';
import { Container } from '@material-ui/core';
import TileGroup from '../TileGroup';

export default function StateDistributionBar({ to_do_time_average, dev_time_average, test_time_average, blocked_time_average }) {
    const working_time_average = to_do_time_average + dev_time_average + blocked_time_average + test_time_average;
    const to_do_time_percentage = Math.round(to_do_time_average / working_time_average * 100);
    const dev_time_percentage = Math.round((dev_time_average + blocked_time_average) / working_time_average * 100);
    const blocked_time_percentage = Math.round(blocked_time_average / dev_time_average * 100);
    const test_time_percentage = Math.round(test_time_average / working_time_average * 100);

    return <Container>
        <TileGroup>
            <div className="container created"><b> Created </b></div>
            <div className="states-bar">
                {to_do_time_percentage != 0 && <div className="container blue" style={{ width: `${to_do_time_percentage}%` }}>
                    To do ({to_do_time_percentage || 0}%)
                </div>}
                {dev_time_percentage != 0 && <div className="container yellow" style={{ width: `${dev_time_percentage}%` }}>
                    In progress ({dev_time_percentage || 0}%)
                    {blocked_time_percentage ?
                        <div className="blocked-indicator" style={{ width: `${blocked_time_percentage}%`, whiteSpace: 'nowrap', overflow: 'visible'}}>
                            {blocked_time_percentage || 0}% Blocked
                        </div> : ''
                    }
                </div>}
                {test_time_percentage != 0 && <div className="container green" style={{ width: `${test_time_percentage}%` }}>
                    Test ({test_time_percentage || 0}%)
                </div>}
            </div>
            <div className="container done"><b> Done </b></div>
        </TileGroup>
    </Container>
}