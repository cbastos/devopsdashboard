import { Tile } from '../../_shared/Tile';
import TileGroup from '../../_shared/TileGroup';
import { TILE_THEMES, Roles } from '../../_shared/config';
import SkillsMap from './SkillsMap/SkillsMap';
import { Typography } from '@material-ui/core';

export default function Dashboard({ employees, teams }) {
    const members = employees.filter(d => [Roles.SE_I, Roles.SE_II, Roles.S_SE_I, Roles.S_SE_II].includes(d.roleid)).length;
    const chapterRepresentants = employees.filter(d => d.roleid === Roles.TECHNICAL_LEAD).length;
    const developersWithoutUsername = employees.filter(d => !d.username);
    const developersWithoutSlackUsername = employees.filter(d => !d.slackid);
    const user_teams = {};
    teams.forEach(t => t.employees.forEach(d => user_teams[d.name + ' ' + d.surname] = user_teams[d.name + ' ' + d.surname] ? user_teams[d.name + ' ' + d.surname] + 1 : 1));
    const developersInMultipleTeams = Object.keys(user_teams).filter(u => user_teams[u] > 1).map(u => u);

    return <>
        <TileGroup spacing={1} id="dashboard">
            <Tile theme={TILE_THEMES.NEUTRAL} text="Teams" xs={12} sm={6} md={3}>
                <Typography align="center" variant="h4"><b>{teams.length}</b></Typography>
            </Tile>
            <Tile theme={TILE_THEMES.NEUTRAL} text="Members" xs={12} sm={6} md={3}>
                <Typography align="center" variant="h4"><b>{employees.length}</b></Typography>
            </Tile>
            <Tile theme={TILE_THEMES.NEUTRAL} text="Developers" xs={12} sm={6} md={3}>
                <Typography align="center" variant="h4"><b>{members}</b></Typography>
            </Tile>
            <Tile theme={TILE_THEMES.NEUTRAL} text="Chapter representants" xs={12} sm={6} md={3}>
                <Typography align="center" variant="h4"> <b>{chapterRepresentants}</b></Typography>
            </Tile>
            <Tile theme={developersWithoutUsername.length > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} title={developersWithoutUsername.map(d => d.name + ' ' + d.surname).join(', ')} text="Devs without Gitlab Account" xs={12} sm={4}>
                <Typography align="center" variant="h4"><b>{developersWithoutUsername.length}</b></Typography>
            </Tile>
            <Tile theme={developersWithoutSlackUsername.length > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} title={developersWithoutSlackUsername.map(d => d.name + ' ' + d.surname).join(', ')} text="Devs without Slack Account" xs={12} sm={4}>
                <Typography align="center" variant="h4"><b>{developersWithoutSlackUsername.length}</b></Typography>
            </Tile>
            <Tile theme={developersInMultipleTeams.length > 0 ? TILE_THEMES.ERROR_LOW : TILE_THEMES.SUCCESS_LOW} title={developersInMultipleTeams.join(', ')} text="Devs in multiple teams" xs={12} sm={4}>
                <Typography align="center" variant="h4"><b>{developersInMultipleTeams.length}</b></Typography>
            </Tile>
        </TileGroup>
        <SkillsMap employees={employees} />
    </>;
}