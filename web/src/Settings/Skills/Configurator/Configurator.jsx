import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { questions, profiles } from '../shared/questions'
import ScoresChart from '../shared/ScoresChart/ScoresChart';
import { encrypt } from '../shared/Encryption';

export default () => {
	const [selectedProfileId, setSelectedProfileId] = useState(profiles[0].id);
	const [positions, setPositions] = useState([]);
	const selectedProfile = profiles.find(p => p.id === selectedProfileId);
	let selectedProfileBlocksTopics = [];
	questions.blocks.filter(b => selectedProfile.blocks.includes(b.name)).forEach((b) => {
		selectedProfileBlocksTopics = selectedProfileBlocksTopics.concat(b.topics);
	});
	const [selectedTopicsScores, setSelectedTopicsScores] = useState(selectedProfileBlocksTopics);
	const [password, setPassword] = useState('');

	const marks = {
		0: 'No conoce',
		25: 'Junior',
		50: 'Middle',
		75: 'Senior',
		100: 'Rockstar'
	};

	const addPosition = () => {
		const scores = selectedTopicsScores.map(t => ({ name: t.name, score: t.value }));
		const encryptedScores = encrypt(JSON.stringify({ scores, profileId: selectedProfileId }), password);
		setPositions(positions.concat([{ profile: selectedProfile, scores: encryptedScores }]))
	};

	return <React.Fragment>
		<div className="navbar navbar-dark bg-dark box-shadow">
			<div className="container d-flex justify-content-between">
				<a href="#/" className="navbar-brand d-flex align-items-center">
					<strong>Positions</strong>
				</a>
			</div>
		</div>
		<div className="container">
			<div>
				<h4>Crear posición</h4>
				<select onChange={(e) => setSelectedProfileId(parseInt(e.target.value))}>
					{profiles.map(p => <option key={p.name} value={p.id}> {p.name} </option>)}
				</select>
			</div>
			<div style={{ display: 'flex' }}>
				<div>
					{
						selectedProfileBlocksTopics.map(b =>
							<div key={b.name} style={{ width: 300, height: 80 }}>
								<label>
									{b.name}
								</label>
								<Slider min={0} max={100} defaultValue={0} marks={marks} step={null} value={b.value} onChange={(v) => {
									selectedProfileBlocksTopics.find(s => s.name === b.name).value = v;
									setSelectedTopicsScores([...selectedProfileBlocksTopics]);
								}} />
							</div>
						)
					}
				</div>
				<div style={{ margin: "5%" }}>
					<ScoresChart scores={selectedProfileBlocksTopics.map(t => ({ name: t.name, score: t.value }))} />
				</div>
			</div>
			<input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<button onClick={() => addPosition()}>Crear</button>
			<fieldset>
				<legend>Posiciones</legend>
				<ul>
					{positions.map(p => {
						return <li key={p.profile.name}> ({p.profile.name} position):
            <a href={`/interview/${encodeURIComponent(p.scores)}`}>Link de entrevista:</a>
						</li>
					})}
				</ul>
			</fieldset>
		</div >
	</React.Fragment>;
};