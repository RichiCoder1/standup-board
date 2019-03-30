import React, { Fragment, useContext, useState, useEffect } from 'react';
import Spinner from '@atlaskit/spinner';
import ColumnBody from './ColumnBody';
import ColumnHeader from './ColumnHeader';
import ColumnOverlay from './ColumnOverlay';
import './Container.scss';
import { BoardContext } from '../../src/services/BoardContext';
import { getJiraBoard } from '../queries/jira';
import { ModuleContext } from '../ModuleContext';

export default function Container() {
	const moduleInfo = useContext(ModuleContext);
	const board = useContext(BoardContext);
	const [loading, setLoading] = useState(true);
	const [boardData, setBoardData] = useState({} as any);

	useEffect(() => {
		const { id: boardId } = board;
		getJiraBoard(moduleInfo, boardId).then(boardData => {
			setBoardData(boardData);
			setLoading(false);
			
			// get the sprint's linked confluence pages. only displays if there's only 1 
			// linked page. not sure how to deal with more than one. display them all?
			// if (boardData.sprint.remoteLinks.length === 1) {
			// 	const linkedPageUrl = boardData.sprint.remoteLinks[0].url
			// 	const linkedPageId = linkedPageUrl.slice(linkedPageUrl.lastIndexOf("=") + 1);
				
			// 	getConfluencePage(linkedPageId).then(pageData => {
			// 		this.setState({
			// 			linkedPage: pageData.body.view.value
			// 		});
			// 	});
			// }
		});
	}, [board, moduleInfo]); 

	if (loading) {
		return (
			<Spinner />
		);
	}

	
	const columns = boardData.columns.map((columnData: { name: any; statuses: any; }) => {
		const { name, statuses } = columnData;
		const statusIds = statuses.map((status: { id: any; }) => status.id);
		const issuesInThisColumn = boardData.issues.filter((issue: { fields: { status: { id: any; }; }; }) => {
			const issueStatusId = issue.fields.status.id;
			return statusIds.includes(issueStatusId);
		});
		const allIssues = boardData.issues
		
		return {
			key: name,
			header: (
				<ColumnHeader
					data={columnData}
					issues={issuesInThisColumn}
				/>
			),
			body: (
				<ColumnBody
					data={columnData}
					issues={issuesInThisColumn}
				/>
			),
			overlay: (
				<ColumnOverlay
					issues={issuesInThisColumn}
					allIssues={allIssues}
				/>
			),
		};
	});

	const sprintGoal = boardData.sprint.goal
	const boardUrl = `https://teamuship.atlassian.net/secure/RapidBoard.jspa?rapidView=${boardData.sprint.originBoardId}`
	const sprintName = boardData.sprint.name
	const daysRemaining = boardData.sprint.daysRemaining

	// based on the assumption that the sprint is 10 days. should probably make this dynamic.
	const sprintLength = 10
	const percentageCompletion = ((sprintLength - daysRemaining) / sprintLength) * 100



	const linkedPageHtml = boardData.linkedPage
			
	return (
		<div className="container">
			<div className="container-header">
				<div><h1><a href={boardUrl} target="_blank" rel="noopener noreferrer">{sprintName}</a></h1></div>
				<div className='sprintGoal'><strong>Goal</strong>: {sprintGoal}</div>
				<div>
					{daysRemaining} days remaining ({percentageCompletion.toFixed(0)}% elapsed)
				</div>
				<div>
					<a href='/'>configure dashboard</a>
				</div>
			</div>
		
			<div className="container-columns">
				{columns.map((column: { key: string | number | undefined; overlay: React.ReactNode; header: React.ReactNode; body: React.ReactNode; }) => (
					<Fragment key={column.key}>
						{column.overlay}
						{column.header}
						{column.body}
					</Fragment>
				))}
			</div>
			
			<div className="container-gadgets">
				<div dangerouslySetInnerHTML={{ __html: linkedPageHtml }} />
				<iframe
					src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showNav=0&amp;showDate=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;mode=AGENDA&amp;height=200&amp;wkst=2&amp;bgcolor=%23ffffff&amp;src=uship.com_drqd1oc1knnr9cb8pnlnh9gdlg%40group.calendar.google.com&amp;color=%238D6F47&amp;ctz=America%2FChicago"
					frameBorder="0" scrolling="no" title="calendar"
				/>
			</div>
		</div>
	);
}