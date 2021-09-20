import React, { useState, useEffect, useContext } from 'react';
import GlobalContext from '../../GlobalContext';
import InterviewerContext from '../InterviewerContext';

import './Chat.css';

export default function Chat() {
	const [messages, setMessages] = useState([]);
	const [textToSend, setTextToSend] = useState('');
	const { socket } = useContext(GlobalContext);
	const { interviewerName } = useContext(InterviewerContext);

	useEffect(() => {
		function updateMessages(msg) {
			setMessages([...messages, msg]);
		}
		socket.on('chat message', updateMessages);
		return () => socket.off('chat message', updateMessages);
	});

	const sendCurrentTextMessage = () => {
		sendMessage(textToSend)
		setTextToSend('');
	};

	const sendMessage = (message) => {
		socket.emit('chat message', {
			from: {
				name: interviewerName,
				img: 'https://ptetutorials.com/images/user-profile.png',
				at: new Date().toLocaleDateString()
			},
			message: message
		});
	}

	return <div>
		<div className="mesgs">
			{messages.map((m, i) => {
				if (m.from.name !== interviewerName) {
					return <div key={i} className="incoming_msg">
						<div className="incoming_msg_img">
							<img src={m.from.img} alt={m.from.name} />
						</div>
						<div className="received_msg">
							<div className="received_withd_msg">
								<b>{m.from.name}</b><p>{m.message}</p>
								<span className="time_date">{m.at}</span></div>
						</div>
					</div>
				} else {
					return <div key={i} className="outgoing_msg">
						<div className="sent_msg">
							<p>{m.message}</p>
							<span className="time_date float-right"> {m.at}</span>
						</div>
					</div>
				}
			})}
			<div className="type_msg">
				<div className="input_msg_write">
					<input
						type="text"
						className="write_msg"
						placeholder="Type a message"
						value={textToSend}
						onKeyPress={e => e.key === 'Enter' && textToSend !== '' && void sendCurrentTextMessage()}
						onChange={e => setTextToSend(e.target.value)}
					/>
					<button disabled={textToSend === ''} className="btn float-right" type="button" onClick={sendCurrentTextMessage}>
						<i className="material-icons" aria-hidden="true">send</i>
					</button>
				</div>
			</div>
		</div >
		<div className="row">
			<button className="btn btn-info" type="button" onClick={() => sendMessage('Quiero intervenir :)')}>
				Quiero intervenir
			</button>
			<button className="btn btn-info" onClick={() => sendMessage('Avanza :)')}>
				Avanza
			</button>
			<button className="btn btn-danger" onClick={() => sendMessage('Por mi está descartado')}>
				Descartado
			</button>
		</div>
	</div>;
}