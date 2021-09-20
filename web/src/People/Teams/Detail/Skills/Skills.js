import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { Radar } from 'react-chartjs-2';
import { fetchApiJson } from '../../../../_shared/fetchJson';

function useSkills() {
  const [skills, setSkills] = useState({ topics: [], knowledgeLevels: [], experienceRanges: [] });
  useEffect(() => {
    fetchApiJson('/skills').then((newSkills) => { setSkills(newSkills); });
  }, []);
  return [skills];
}

function useEmployeeSkills(employeeId) {
  const [employeeSkills, setEmployeeSkills] = useState([]);
  useEffect(() => {
    fetchApiJson(`/employees/${employeeId}/skills`).then((skills) => {
      setEmployeeSkills(skills);
    });
  }, [employeeId]);
  return [employeeSkills];
}

export default ({ developer }) => {
  const [skills] = useSkills();
  const [employeeSkills] = useEmployeeSkills(developer.employeeid);
  const skillsLevels = getSkillsRadarDataSet(skills.topics, employeeSkills);
  const options = { scale: { ticks: { min: 1, max: 6, stepSize: 1 } } };

  return (<div>
    <LegendFor serie={skills.knowledgeLevels} borderColor="rgba(226, 43, 43, 1)" backgroundColor="rgba(226, 43, 43, 0.2)" />
    <LegendFor serie={skills.experienceRanges} borderColor="darkblue" backgroundColor="rgba(115, 210, 247, 0.3)" />
    <Typography variant="h5"> Skills </Typography>    
    <Radar options={options} data={skillsLevels} />
  </div>
  );
};

function LegendFor({ serie, borderColor, backgroundColor }) {
  return <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ width: 30, height: 30, display: 'inline-block', border: `2px solid ${borderColor}`, backgroundColor }} />
    {serie.map(({ id, name }) => <span key={id}><b  style={{ marginRight: 5, marginLeft: 5 }}>{id}:</b>{name}.</span>)}
  </div>
}

function getSkillsRadarDataSet(skillsTopics, employeeSkills) {
  let labels = [];
  let knowledgeSerie = [];
  let experienceSerie = [];

  skillsTopics.forEach(skill => {
    labels.push(skill.name);
    if (employeeSkills.length) {
      knowledgeSerie.push(employeeSkills.find(s => s.skillid === skill.id).knowledgelevelid);
      experienceSerie.push(employeeSkills.find(s => s.skillid === skill.id).experiencerangeid);
    }
  });
  return {
    labels,
    datasets: [
      {
        label: 'Knowledge',
        backgroundColor: 'rgba(226, 43, 43, 0.2)',
        borderColor: 'rgba(226, 43, 43, 1)',
        pointBorderColor: 'rgba(226, 43, 43, 1)',
        pointBackgrounColor: 'rgba(226, 43, 43, 1)',
        pointRadius: 1,
        data: knowledgeSerie
      },
      {
        label: 'Experience',
        backgroundColor: 'rgba(115, 210, 247, 0.3)',
        borderColor: 'darkblue',
        pointBorderColor: 'darkblue',
        pointBackgrounColor: 'darkblue',
        pointRadius: 1,
        data: experienceSerie
      }
    ]
  };
}
