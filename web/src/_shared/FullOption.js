import React from 'react';
import { Doughnut } from "react-chartjs-2";

export function FullOption({ data }) {
    const labels = data.map(d => `${d.title} ${d.value} %`);
    const colors = data.map(d => d.color);
    const backgroundColors = data.map(d => d.backgroundColor);
    const data2 = data.map(d => d.value);
    return  <Doughnut  data={{ labels, datasets: [{  data: data2, backgroundColor: backgroundColors, borderColor: colors, borderWidth: 1 }] }} />
}
