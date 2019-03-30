import React from 'react';
import ModialDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Comment from './Comment';
import './IssueDetail.scss';

export default function  IssueDetail({ onClose, data }) {
	const { assignee, epic, estimate, parent, summary, timeInColumn, description, comment } = data.fields;
	
	//const { cumulativeDurationInColumn, enteredCurrentStatusTime } = timeInColumn;
	//const millisecondsInColumn = (cumulativeDurationInColumn + Date.now() - enteredCurrentStatusTime);
	//const daysInColumn = (millisecondsInColumn / (1000 * 60 * 60 * 24));
	const countComments = comment.total

	const comments = comment.comments.reverse().slice(0,2).map(comment => {
		const { id } = comment;
		return (
			<Comment key={id} data={comment} />
		)
	});

	const issueUrl = `https://teamuship.atlassian.net/browse/${data.key}`


	return (
		<ModalTransition>
			<ModialDialog
				isOpen
				onClose={onClose}
			>
				<div className='details'>
					<h2><a href={issueUrl} target="_blank" rel="noopener noreferrer">[{data.key}] {summary}</a></h2>
					<h3>{parent ? `Subtask of: ${parent.fields.summary}` : ''}</h3>
					<ul>
						<li><strong>Assignee</strong>: {(assignee && assignee.displayName) || 'Unassigned'}</li>
						<li><strong>Story Points</strong>: {estimate}</li>
						<li><strong>Epic</strong>: {epic && epic.name}</li>
						{/*<li><strong>Total days in status</strong>: {daysInColumn.toFixed(2)}</li>*/}
					</ul>
					<h4>Description</h4>
					{description}
				</div>
				<div className = 'comments'>
						<h4>Comments</h4>
						<em>Displaying the {comments.length} most recent comments out of {countComments} total comments.</em>
						{comments}
				</div>
			</ModialDialog>		
		</ModalTransition>
	);
}

