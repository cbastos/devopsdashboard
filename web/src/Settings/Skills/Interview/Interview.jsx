import React, { useState } from 'react';
import { decrypt } from '../shared/Encryption';
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Chat from './Chat/Chat';
import ObjetiveInterview from './ObjetiveInterview/ObjetiveInterview'
import CompanyCulture from './CompanyCulture/CompanyCulture';
import OfficeOrganization from './OfficeOrganization/OfficeOrganization';
import Close from './Close/Close';
import InterviewContext from './InterviewerContext';

const Interview = ({ match }) => {
	const [profile, setProfile] = useState(null);
	const [interviewerName, setInterviewerName] = useState('');
	const [password, setPassword] = useState('');
	const { encryptedProfile } = match.params;
	const loadDecryptedProfile = () => setProfile(decryptProfile(password, encryptedProfile));
	return (
		<InterviewContext.Provider value={{ interviewerName }}>
			{!profile &&
				<div className="text-center">
					<input type="text" placeholder="Your name" value={interviewerName} onChange={e => setInterviewerName(e.target.value)} />
					<input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
					<button onClick={loadDecryptedProfile}>Access</button>
				</div>
			}
			{profile && <div className="row">
				<div className="col-md-9">
					<Accordion>
						<AccordionItem>
							<AccordionItemTitle>1. Presentación de entrevistadores</AccordionItemTitle>
							<AccordionItemBody>
								<div>Puesto y equipo al que perteneces</div>
							</AccordionItemBody>
						</AccordionItem>
						<AccordionItem>
							<AccordionItemTitle>2. Trayectoria (+ preguntas técnicas subjetivas)</AccordionItemTitle>
							<AccordionItemBody>
								<div>Que cuente su trayectoria de atrás hacia delante.</div>
							</AccordionItemBody>
						</AccordionItem>
						<AccordionItem>
							<AccordionItemTitle>3. Entrevista objetiva</AccordionItemTitle>
							<AccordionItemBody><ObjetiveInterview profile={profile} /></AccordionItemBody>
						</AccordionItem>
						<AccordionItem>
							<AccordionItemTitle>4. Speech de la empresa, cultura y beneficios generales</AccordionItemTitle>
							<AccordionItemBody> <CompanyCulture /> </AccordionItemBody>
						</AccordionItem>
						<AccordionItem>
							<AccordionItemTitle>5. Organización interna local</AccordionItemTitle>
							<AccordionItemBody> <OfficeOrganization /> </AccordionItemBody>
						</AccordionItem>
						<AccordionItem>
							<AccordionItemTitle>6. Cierre</AccordionItemTitle>
							<AccordionItemBody> <Close /> </AccordionItemBody>
						</AccordionItem>
					</Accordion>
				</div>
				<div className="col-md-3">
					<Chat />
				</div>
			</div>}
		</InterviewContext.Provider>);
}

function decryptProfile(password, encryptedProfile) {
	const profileDecrtypted = decrypt(decodeURIComponent(encryptedProfile), password);
	if (profileDecrtypted) {
		return JSON.parse(profileDecrtypted);
	}
};

export default Interview;