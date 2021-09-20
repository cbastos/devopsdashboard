import frontendQuestions from './frontend-questionary';
import backendQuestions from './backend-questionary';
import developmentQuestions from './development-questionary';
import managementQuestions from './management-questionary';
import layoutQuestions from './layout-questionary';
import personalQuestions from './personal-questionary';

export const questions = {
  blocks: [
    frontendQuestions,
    backendQuestions,
    developmentQuestions,
    managementQuestions,
    personalQuestions,
    layoutQuestions
  ]
};

export const profiles = [
  { name: 'Frontend Developer', id: 1, blocks: ['frontend', 'development', 'personal'] },
  { name: 'Backend Developer', id: 2, blocks: ['backend', 'development', 'personal'] },
  { name: 'FullStack Developer', id: 3, blocks: ['backend', 'frontend', 'development', 'personal'] },
  { name: 'UI Developer', id: 4, blocks: ['personal', 'layout'] },
  { name: 'Delivery Manager', id: 5, blocks: ['management', 'personal'] },
  { name: 'AI Developer', id: 6, blocks: ['development', 'personal'] },
  { name: 'Sharepoint Developer', id: 7, blocks: ['development', 'personal'] }
];
