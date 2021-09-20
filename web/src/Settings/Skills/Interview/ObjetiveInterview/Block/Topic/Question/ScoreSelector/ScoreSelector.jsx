import React from 'react';
import './ScoreSelector.css';

const options = [
	{ value: 1, text: 'bg-success' },
	{ value: 0.5, text: 'bg-warning' },
	{ value: 0, text: 'bg-danger' }
];

export default function ScoreSelector({ question, onScoreChange = () => { }, isActive }) {
	return options.map(o => {
		const selected = o.value === question.score;
		return <button
			key={o.value}
			value={o.value}
			style={{ top: 12, float: 'right', marginRight: '3px', border: selected ? '2px solid black' : '', width: 30, height: 20 }}
			className={`btn ${isActive ? o.text : 'bg-secondary'}`} onClick={e => {
				question.score = o.value;
				onScoreChange(o.value);
			}}>
		</button>
	});
}
