import React from 'react';
import { Tile } from '../../_shared/Tile';
import TileGroup from '../../_shared/TileGroup';
import { GITLAB_URL, TILE_THEMES } from '../../_shared/config';
import ExternalLink from '../../_shared/ExternalLink';
import { SourceTree } from './SourceTree';
import { FullOption } from '../../_shared/FullOption';
import { Typography } from '@material-ui/core';

export default function Repository({ id, commits, branch, merges }) {
    const stats_total_average = get_stats_average(commits, c => c.total);
    const stats_additions_average = get_stats_average(commits, c => c.additions);
    const stats_deletions_average = get_stats_average(commits, c => c.deletions);
    const stats = `${stats_additions_average} additions, ${stats_deletions_average} deletions`
    const contributors_commits = get_contributors_commits_in(commits);
    const fix_commits_percentage = get_percentage_that_starts_with(commits, 'fix:');
    const feat_commits_percentage = get_percentage_that_starts_with(commits, 'feat:');
    const chore_commits_percentage = get_percentage_that_starts_with(commits, 'chore:');
    const merge_commits_percentage = get_percentage_that_starts_with(commits, 'Merge branch');
    const unknown_commits_percentage = 100 - fix_commits_percentage - feat_commits_percentage - chore_commits_percentage - merge_commits_percentage;

    const fix_commits_stats_percentage = get_stats_percentage_that_starts_with(commits, 'fix:');
    const feat_commits_stats_percentage = get_stats_percentage_that_starts_with(commits, 'feat:');
    const chore_commits_stats_percentage = get_stats_percentage_that_starts_with(commits, 'chore:');
    const merge_commits_stats_percentage = get_stats_percentage_that_starts_with(commits, 'Merge branch');
    const unknown_commits_stats_percentage = 100 - fix_commits_stats_percentage - feat_commits_stats_percentage - chore_commits_stats_percentage - merge_commits_stats_percentage;

    const max_contributor = get_max_of(contributors_commits);
    return <div width="100px">
        <ExternalLink href={`${GITLAB_URL}/projects/${id}`}><b>Gitlab Repository</b></ExternalLink><br /><br />

        <TileGroup spacing={1}>
            <Tile text='Max Contributor' title={`(${max_contributor.count} commits)`} theme={TILE_THEMES.NEUTRAL} md={3} sm={4} >
                <Typography align="center" variant="h6"><a href={`mailto:${max_contributor.author_email}`}>{max_contributor.author_name}</a></Typography>
            </Tile>
            <Tile text='Contributors' theme={contributors_commits.length <= 1 || contributors_commits.length > 12 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} title={contributors_commits.map(c => c.author_name).join(', ')} md={3} sm={4} >
                <Typography align="center" variant="h5"><b>{contributors_commits.length}</b></Typography>
            </Tile>
            <Tile text='Commits' theme={TILE_THEMES.NEUTRAL} md={3} sm={4} >
                <Typography align="center" variant="h5"><b>{commits.length}</b></Typography>
            </Tile>
            <Tile text='Total stats average' theme={stats_total_average > 100 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} title={stats} md={3} sm={4} >
                <Typography align="center" variant="h5"><b>{stats_total_average}</b></Typography>
            </Tile>
            <Tile text='MR opened' theme={TILE_THEMES.NEUTRAL} md={4} sm={4} >
                <Typography align="center" variant="h5"><b>{merges.opened.length}</b></Typography>
            </Tile>
            <Tile text='MR completed' theme={TILE_THEMES.NEUTRAL} md={4} sm={4} >
                <Typography align="center" variant="h5"><b>{merges.merged.length}</b></Typography>
            </Tile>
            <Tile text='MR closed' theme={TILE_THEMES.NEUTRAL} md={4} sm={4} >
                <Typography align="center" variant="h5"><b>{merges.closed.length}</b></Typography>
            </Tile>
            <Tile theme={TILE_THEMES.NEUTRAL} text="By commits number" xs={12} md={6}>
                <FullOption
                    data={[
                        { title: 'Feature commits', value: feat_commits_percentage, color: '#FC6E51', backgroundColor: '#E9573F' },
                        { title: 'Chore commits', value: chore_commits_percentage, color: '#EC87C0', backgroundColor: '#D770AD' },
                        { title: 'Fix commits', value: fix_commits_percentage, color: '#5D9CEC', backgroundColor: '#4A89DC' },
                        { title: 'Merge commits', value: merge_commits_percentage, color: '#48CFAD', backgroundColor: '#37BC9B' },
                        { title: 'Unknown commits', value: unknown_commits_percentage, color: '#ED5565', backgroundColor: '#DA4453' },
                    ]}
                />
            </Tile>
            <Tile theme={TILE_THEMES.NEUTRAL} text="By commits stats size" xs={12} sm={6}>
                <FullOption
                    data={[
                        { title: 'Feature commits stats', value: feat_commits_stats_percentage, color: '#FC6E51', backgroundColor: '#E9573F' },
                        { title: 'Chore commits stats', value: chore_commits_stats_percentage, color: '#EC87C0', backgroundColor: '#D770AD' },
                        { title: 'Fix commits stats', value: fix_commits_stats_percentage, color: '#5D9CEC', backgroundColor: '#4A89DC' },
                        { title: 'Merge commits stats', value: merge_commits_stats_percentage, color: '#48CFAD', backgroundColor: '#37BC9B' },
                        { title: 'Unknown commits stats', value: unknown_commits_stats_percentage, color: '#ED5565', backgroundColor: '#DA4453' },
                    ]}
                />
            </Tile>
        </TileGroup>
        <SourceTree commits={commits} branch={branch} style={{ maxWidth: 100 }} />
    </div>;
}

function get_stats_average(commits, statsFieldSelector) {
    let total = 0;
    commits.forEach(c => {
        total += statsFieldSelector(c.stats);
    });
    return Math.round(total / commits.length);
}

function get_contributors_commits_in(commits) {
    let contributors = {};
    commits.forEach((c) => {
        const contributor_commits_count = contributors[c.author_name] ? contributors[c.author_name].count + 1 : 1;
        const stats_total_count = contributors[c.author_name] ? contributors[c.author_name].stats + c.stats.total : c.stats.total;
        contributors[c.author_name] = {
            author_name: c.author_name,
            author_email: c.author_email,
            stats: stats_total_count,
            count: contributor_commits_count
        };
    });
    return Object.keys(contributors).map(author_name => contributors[author_name]);
}

function get_max_of(contributors_commits) {
    return contributors_commits.sort(byCommitsCount)[contributors_commits.length - 1];
}

function byCommitsCount(a, b) {
    if (a.stats < b.stats) {
        return -1;
    }
    if (a.stats > b.stats) {
        return 1;
    }
    return 0;
}

function get_percentage_that_starts_with(commits, text) {
    const commits_that_starts_with_text = commits.filter(c => c.title.toLowerCase().startsWith(text.toLowerCase()));
    return Math.round(commits_that_starts_with_text.length / commits.length * 100);
}

function get_stats_percentage_that_starts_with(commits, text) {
    let total_stats = 0;
    let with_text_stats = 0;
    commits.forEach(c => {
        total_stats += c.stats.total;
        if (c.title.toLowerCase().startsWith(text.toLowerCase())) {
            with_text_stats += c.stats.total;
        }
    });
    return Math.round(with_text_stats / total_stats * 100);
}

/*
author_email: "jgallmar@everis.com"
author_name: "Ezequiel Gallardo"
authored_date: "2020-05-20T17:27:24.000+02:00"
committed_date: "2020-05-20T17:27:24.000+02:00"
committer_email: "jgallmar@everis.com"
committer_name: "Ezequiel Gallardo"
created_at: "2020-05-20T17:27:24.000+02:00"
id: "009b39f899bc1239254b128381c329ec9c60a6b2"
message: "Merge branch 'develop'↵"
parent_ids: (2) ["6bdc95afd4dc8efeca3ca3cc103ffce84d0ea69f", "646c3b8f9bfe6aa4a64619e5c134ce2e78deeb20"]
short_id: "009b39f8"
stats: {additions: 5, deletions: 5, total: 10}
title: "Merge branch 'develop'"*/