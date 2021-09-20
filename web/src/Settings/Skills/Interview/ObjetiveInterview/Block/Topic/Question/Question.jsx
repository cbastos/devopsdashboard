import React, { useState, useEffect } from 'react';
import ScoreSelector from './ScoreSelector/ScoreSelector';

export default function Question({ question, onScoreChange, onChildScoreChange, isActive, currentQuestionId }) {
	const { text, started, start, stop } = useRecording()

	return <div style={{ backgroundColor: isActive ? 'rgb(244, 244, 244)' : '' }}>
		<span className={`btn material-icons ${isActive ? 'text-danger' : 'text-secondary'}`} onClick={() => started ? stop() : start()}>{started ? 'stop' : 'keyboard_voice'}</span>
		<span className={!isActive ? 'text-secondary' : ''}>{question.text} </span>
		<div className="float-right"><ScoreSelector isActive={isActive} question={question} onScoreChange={s => { onScoreChange(s); }} /></div>
		{(question.score === 0.5 || question.score === 1) && question.children && renderQuestions(question.children, currentQuestionId, onChildScoreChange)}
		<p>{text}</p>
	</div>
}

function useRecording() {
	const [recordedText, setRecordedText] = useState('');
	const [recognition, setRecognition] = useState();
	const [started, setStarted] = useState(false);

	useEffect(() => {
		let recognition = new window.webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.onresult = (event) => {
			const speechToText = event.results[0][0].transcript;
			setRecordedText(speechToText);
		};
		recognition.lang = 'es-ES';
		setRecognition(recognition);
		return () => recognition.stop();
	}, []);

	const start = () => {
		recognition.start();
		setStarted(true);
	};

	const stop = () => {
		recognition.stop();
		setStarted(false);
	};

	return { text: recordedText, started, start, stop };
}

export function renderQuestions(questions, currentQuestionId, onScoreChange) {
	if (!questions) return;
	return <ul>
		{
			questions.map((q, i) => {
				const isActivated = currentQuestionId === null || currentQuestionId === q.id;
				return <li
					style={{ display: 'block', borderLeft: currentQuestionId === null ? '' : currentQuestionId === q.id ? '5px solid green' : '' }} key={i}>
					<Question
						currentQuestionId={currentQuestionId}
						isActive={isActivated}
						onChildScoreChange={(cq, cs) => onScoreChange(cq, cs)}
						onScoreChange={(s) => onScoreChange(q, s)} question={q}
					/>
				</li>;
			})
		}
	</ul>;
}
