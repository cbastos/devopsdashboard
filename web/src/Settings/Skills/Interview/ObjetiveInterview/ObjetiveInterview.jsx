import React from 'react';
import 'react-accessible-accordion/dist/fancy-example.css';
import { questions, profiles } from '../../shared/questions'
import save from './save';
import Block from './Block/Block'
import { calculateScoreOf } from './scoreCalculator';
import ScoresChart from '../../shared/ScoresChart/ScoresChart';

export default class ObjetiveInterview extends React.Component {
	constructor(props) {
		super(props);
		const { profile } = props;
		const profileBlocks = profiles.find(p => p.id === profile.profileId).blocks;
		this.state = {
			score: { total: 0, blocks: [] },
			questions,
			selectedBlocks: profileBlocks,
			currentBlock: profileBlocks[0]
		};
	}

	calculateNewScore() {
		this.setState({ score: calculateScoreOf(this.state.questions.blocks) });
	}

	loadStateFrom(file) {
		const reader = new FileReader();
		reader.onload = (theFile) => {
			this.setState(JSON.parse(theFile.target.result))
		};
		reader.readAsText(file);
	}

	getScoresOf(blocks) {
		const scores = [];
		const profileBlocks = profiles.find(p => p.id === this.props.profile.profileId).blocks;
		blocks.filter(b => profileBlocks.includes(b.name)).forEach(b => {
			b.score.topics.forEach(t => {
				scores.push({ name: t.name, score: ((t.score * 100) / t.maxScore) });
			});
		});
		return scores;
	}

	render() {
		const selectedBlocks = this.state.questions.blocks.filter(b => this.state.selectedBlocks.includes(b.name));
		const personalTopics = selectedBlocks.find(b => b.name === 'personal').topics.map(t => t.name);
		const positionScores = this.getScoresOf(this.state.score.blocks);

		const candidatePersonalScores = this.props.profile.scores.filter(s => personalTopics.includes(s.name));
		const positionPersonalScores = positionScores.filter(s => personalTopics.includes(s.name));
		const candidateTechnicalScores = this.props.profile.scores.filter(s => !personalTopics.includes(s.name));
		const positionTechnicalScores = positionScores.filter(s => !personalTopics.includes(s.name));

		return (
			<div>
				<div className="row">
					<div className="col-md-6" style={{ overflow: 'auto', height: '500px' }}>
						{selectedBlocks.map(b => <Block key={b.name} {...b} onScoreChange={() => this.calculateNewScore()} />)}
					</div>
					<div className="col-md-6 align-middle" style={{ overflow: 'auto', height: '500px', width: '200px' }}>
						<button className="btn btn-primary float-right" onClick={() => save(JSON.stringify(this.state), 'results.json')}>Save test.json</button>
						<div class="custom-file">
							<input type="file" className="custom-file-input" id="inputGroupFile01" onChange={e => this.loadStateFrom(e.target.files[0])} />
							<label className="custom-file-label" htmlFor="inputGroupFile01">Load test</label>
						</div>
						<div className="row">
							<h4> Personal skills</h4>
							<ScoresChart scores={candidatePersonalScores} positionScores={positionPersonalScores} />
						</div>
						<div className="row">
							<h4> Technical skills</h4>
							<ScoresChart scores={candidateTechnicalScores} positionScores={positionTechnicalScores} />
						</div>
						<h4><b>Score:</b> {this.state.score.total}</h4>
					</div>
				</div>
			</div>
		);
	}
}


