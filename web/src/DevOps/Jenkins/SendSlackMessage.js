import React, { useState } from 'react';
import { WebClient } from '@slack/web-api';
import { Button } from '@material-ui/core';
import Icon from '../../_shared/Icon';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const SLACK_ICON = '/img/slack.png';


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


export default function SendSlackMessage({ message }) {
    const [opened, setOpened] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState();
    const [messageToSend, setMessageToSend] = useState(message(selectedDeveloper));
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);

    const sendMessage = () => {
        const FACTORY_DASHBOARD_TOKEN = 'xoxp-834172137877-826240906721-1194305127392-5707a5073b57ca993b15a83fca99ac00';
        const web = new WebClient(FACTORY_DASHBOARD_TOKEN);

        web.chat.postMessage({
            text: messageToSend,
            channel: selectedDeveloper,
            as_user: true
        }).then(() => { setOpened(false); });
    };

    function updateSelectedDeveloper({ target: { value } }) {
        setSelectedDeveloper(value);
        setMessageToSend(message(value));
    }
    const FACTORY_DEVELOPERS = []; // TODO: replace with db employees

    return <React.Fragment>
        <Button onClick={() => setOpened(true)}><Icon src={SLACK_ICON} /></Button>
        <Modal open={opened} onClose={() => setOpened(false)}>
            <React.Fragment>
                <div style={modalStyle} className={classes.paper}>
                    <h2 id="simple-modal-title">Send slack message</h2>
                    <p id="simple-modal-description">
                        Select the user and the message you want to send trough slack
                    </p>
                    <div>
                        <Select value={selectedDeveloper} onChange={updateSelectedDeveloper}>
                            {FACTORY_DEVELOPERS.map(({ name, slackid }) => {
                                return <MenuItem key={name} value={slackid} disabled={slackid === ''}>
                                    <ListItemText primary={name} />
                                </MenuItem>;
                            })}
                        </Select>
                    </div>
                    <div style={{ width: "100%" }}>
                        <TextareaAutosize rowsMax={4} value={messageToSend} onChange={({ target: { value } }) => setMessageToSend(value)} />
                    </div>
                    <Button color="primary" onClick={sendMessage}>Send message</Button>
                </div>
            </React.Fragment>
        </Modal>
    </React.Fragment>;
}
