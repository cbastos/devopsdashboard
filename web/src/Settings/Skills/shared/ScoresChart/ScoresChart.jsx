import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js';

export default function ScoresChart({ scores, positionScores = [] }) {
	const ref = useRef();
	useRadarChartOn(ref, scores, positionScores);
	return <canvas width="600px" ref={ref}></canvas>;
}

function useRadarChartOn(ref, scores, positionScores) {
	let [chart, setChart] = useState();
	useEffect(() => {
		if (chart) {
			chart.data.datasets[0].data = scores.map(b => Math.floor(b.score));
			chart.data.datasets[1].data = positionScores.map(b => Math.floor(b.score));
			chart.update();
		} else {
			setChart(installChartOn(ref.current, scores, positionScores));
		}
	});
}

function installChartOn(element, scores, positionScores) {
	return new Chart(element, {
		type: 'radar',
		data: {
			labels: scores.map(b => b.name),
			datasets: [
				{
					label: 'Desired position score',
					data: positionScores.map(b => b.score),
					backgroundColor: '#07d0ff73',
					borderColor: '#07d0ff',
					borderWidth: 1
				},
				{
					label: 'Candidate score',
					data: scores.map(b => b.score),
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					borderWidth: 1
				}
			]
		},
		options: {
			scale: {
				ticks: {
					callback: function (value, index, values) {
						return { 0: '', 25: 'Junior', 50: 'Middle', 75: 'Senior', 100: 'Rockstar' }[value];
					},
					beginAtZero: true,
					min: 0,
					max: 100,
					stepSize: 25
				}
			}
		}
	});
}