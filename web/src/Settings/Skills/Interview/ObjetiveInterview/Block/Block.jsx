import React, { useState } from 'react';
import Topic from './Topic/Topic';

export default function Block({ name, topics, onScoreChange }) {
	const [expanded, setExpanded] = useState(false);
	const [expandedTopics, setExpandedTopics] = useState([]);

	return <fieldset>
		<legend>
			<span className="btn material-icons" onClick={() => setExpanded(!expanded)}>{expanded ? 'expand_less' : 'expand_more'}</span>
			Bloque {name}
		</legend>
		<div className="pl-5">
			{expanded &&
				<div>
					{topics.map(t =>
						<Topic
							key={t.name}
							{...t}
							expanded={expandedTopics.indexOf(t) !== -1}
							onScoreChange={onScoreChange}
							onScoreComplete={() => {
								setExpandedTopics([...expandedTopics, topics[topics.indexOf(t) + 1]])
							}}
						/>
					)}
				</div>
			}
		</div>
	</fieldset>;
}
