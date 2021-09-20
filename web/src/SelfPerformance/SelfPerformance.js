import React, { useEffect, useState } from 'react';

// TODO: get from env variable in docker
const outlookOwaUrl = '';

export function SelfPerformance() {
    const [{ meetings }, setState] = useState({ meetings: [] });
    useEffect(() => void getMeetingsInfo().then(meetings => setState({ meetings })), []);
    return <p>{meetings.length} meetings</p>;
}

function getMeetingsInfo() {
    return fetch(
        `${outlookOwaUrl}/me/calendarview?startDateTime=2020-03-01T01:00:00&endDateTime=2020-05-31T23:00:00`,
        { credentials: "include" }
    ).then(response => response.json()).then(a => {
        const meetings = a.value.map(m => ({
            categories: m.Categories,
            isOrganizer: m.IsOrganizer,
            date: m.Start.DateTime,
            subject: m.Subject,
            isCancelled: m.IsCancelled,
            organizer: { name: m.Organizer.EmailAddress.Name, email: m.Organizer.EmailAddress.Address }
        }));
        return meetings;
    });
}