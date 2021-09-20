import React from 'react';
import { Gitgraph } from '@gitgraph/react';
import LanguageDetect from 'languagedetect';
import { Box } from '@material-ui/core';

const FACTORY_COMMITS_LANGUAGES = ['english', 'spanish'];

export function SourceTree({ commits, branch }) {
    const options = { template: "blackarrow", orientation: 'vertical' };
    var myTemplateConfig = {
        colors: ["#008fb5", "#979797", "#f1c109", "#33cc33"],
              branch: {
                lineWidth: 3,
                spacingX: 30,
                labelRotation: 0
              },
      commit: {
            spacingY: 40,
            dot: {
              size: 10
            },
            message: {
              displayAuthor: false,
              displayBranch: true,
              displayHash: true,
              font: "normal 14pt Arial"
            }
        }
        
    };
    return (
        <Box style={{ maxWidth: '1100', overflow: 'hidden' }}>
            <Gitgraph options={options}>
                {(gitgraph) => {
                    const master = gitgraph.branch(branch);
                    const lngDetector = new LanguageDetect();
                    commits.slice().reverse().forEach((c) => {
                        const language = lngDetector.detect(c.title, 5).filter(([language]) => FACTORY_COMMITS_LANGUAGES.includes(language))[0];
                        const user = '['+ c.author_name.toUpperCase() +' - '+c.author_email+']';

                        master.commit({
                            subject: `${c.title.substr(0,75)} - ${language ? '['+language[0].substr(0,3).toUpperCase()+']': '[???]'}`,
                            author: `${user}`,
                            hash: c.id,
                            tag: '',
                            options: {
                                message: 'sd',
                                messageColor: 'red'
                            }

                        });
                    });
                    // Simulate git commands with Gitgraph API.
                    /*const master = gitgraph.branch('master');
                    master.commit('Initial commit');
            
                    const develop = master.branch('develop');
                    develop.commit('Add TypeScript');
            
                    const aFeature = develop.branch('a-feature');
                    aFeature
                    .commit('Make it work')
                    .commit('Make it right')
                    .commit('Make it fast');
            
                    develop.merge(aFeature);
                    develop.commit('Prepare v1');
            
                    master.merge(develop).tag('v1.0.0');*/
                }}
            </Gitgraph>
        </Box>
    );
}