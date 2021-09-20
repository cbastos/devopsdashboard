export function calculateScoreOf(blocks) {
  let score = 0;
  let blocksScores = [];
  blocks.forEach((b) => {
    const blockScore = { total: 0, topics: [] };
    b.topics.forEach(t => {
      let topicScore = 0;
      let maxPossibleScore = 0;
      t.questions.forEach(q => {
        const questionScore = claculateQuestionScore(q);
        topicScore += questionScore.score;
        maxPossibleScore += questionScore.maxScore;
      });
      blockScore.total += topicScore;
      blockScore.topics.push({ name: t.name, score: topicScore, maxScore: maxPossibleScore });
    });
    score += blockScore.total;
    blocksScores.push({ name: b.name, score: blockScore });
  });
  return { total: score, blocks: blocksScores };
}

function claculateQuestionScore(question) {
  let maxScore = (question.level * 1);
  let score = ((question.score || 0) * question.level);

  if (question.children) {
    question.children.forEach((c) => {
      const childScore = claculateQuestionScore(c);
      score += childScore.score;
      maxScore += childScore.maxScore;
    });
  }

  return { score, maxScore };
}