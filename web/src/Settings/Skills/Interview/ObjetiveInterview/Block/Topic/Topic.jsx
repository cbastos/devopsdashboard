import React, { useState, useContext, useEffect } from 'react';
import { renderQuestions } from './Question/Question';
import GlobalContext from '../../../../GlobalContext';

export default function Topic({ name, expanded, questions, onScoreChange, onScoreComplete }) {
	const [isExpanded, setExpanded] = useState(expanded);
	const [currentQuestionId, setCurrentQuestion] = useState(questions[0].id);
	const { socket } = useContext(GlobalContext);

	useEffect(() => {
		function updateCurrentQuestion(newCurrentQuestionId) {
			setCurrentQuestion(newCurrentQuestionId);
		}
		socket.on('current question change', updateCurrentQuestion);
		return () => socket.off('current question change', updateCurrentQuestion);
	});

	const questionsWithParentIds = setParentIdOn(null, questions);
	return <fieldset key={name} >
		<legend>
			<span className="btn material-icons" onClick={() => setExpanded(!isExpanded)}>{isExpanded ? 'expand_less' : 'expand_more'}</span>
			{name}
			<button className="btn bg-success material-icons float-right mr-20 ml-20" onClick={() => setExpanded(false)}>navigate_next</button>
			<button className="btn bg-danger material-icons  float-right" onClick={() => setExpanded(false)}>navigate_next</button>
		</legend>
		{isExpanded && <div>
			{renderQuestions(questionsWithParentIds, currentQuestionId, (question, score) => {
				if (question.children && question.children.length > 0) {
					const nexQuestionId = question.children[0].id;
					setCurrentQuestion(nexQuestionId);
					socket.emit('current question change', nexQuestionId);
				} else {
					const nexQuestion = getNexQuestionOfId(questionsWithParentIds, question.id);
					const nexQuestionId = nexQuestion ? nexQuestion.id : null;
					setCurrentQuestion(nexQuestionId);
					socket.emit('current question change', nexQuestionId);
					if (!nexQuestion) {
						setExpanded(false);
						onScoreComplete();
					}
				}
				onScoreChange();
			})}
		</div>}
	</fieldset>;
}

function setParentIdOn(parentId, questions) {
	questions.forEach(q => {
		q.parentId = parentId;
		if (q.children && q.children.length > 0) {
			setParentIdOn(q.id, q.children);
		}
	});
	return questions;
}

function getNexQuestionOfId(questions, id, parentLevelQuestions) {
	for (let i = 0, l = questions.length; i < l; ++i) {
		const currentQuestion = questions[i];
		if (currentQuestion.id === id) {
			if (i < questions.length - 1) {
				return questions[i + 1];
			} else if (parentLevelQuestions) {
				return getNexQuestionOfId(parentLevelQuestions, currentQuestion.parentId);
			}
		}
		if (currentQuestion.children && currentQuestion.children.length > 0) {
			const childQuestion = getNexQuestionOfId(currentQuestion.children, id, questions);
			if (childQuestion) {
				return childQuestion;
			}
		}
	}
}