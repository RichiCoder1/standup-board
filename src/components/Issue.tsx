import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { getColor } from '../services/color';
import IssueDetail from './IssueDetail';

import './Issue.scss';

const MILLISECONDS_PER_DAY = (1000 * 60 * 60 * 24);

export default function Issue({ data }: { data: any }) {
	const [isDetailOpen, setDetailOpen] = useState(false);
	const handleIssuePreview = useCallback(() => {
		setDetailOpen(true);
	}, []);
	const handleIssuePreviewClose = useCallback(() => {
		setDetailOpen(false);
	}, []);
	const { assignee, epic, estimate, issuetype, parent, summary, timeInColumn, impediment } = data.fields;
	
	const issueColor = parent ? getColor(parent.id) : 'black';

	let millisecondsInColumnSinceLastMove: number | null = null;
	let daysInColumn: number | null = null;
	
	if (timeInColumn) {
		const { cumulativeDurationInColumn, enteredCurrentStatusTime } = timeInColumn;
		millisecondsInColumnSinceLastMove = Date.now() - enteredCurrentStatusTime;
		const millisecondsInColumnTotal = (cumulativeDurationInColumn + millisecondsInColumnSinceLastMove);
		daysInColumn = millisecondsInColumnTotal / MILLISECONDS_PER_DAY;
	}
	
	const issueClassName = classNames({
		'issue': true,
		'issue--recentStatusChange': timeInColumn && millisecondsInColumnSinceLastMove && millisecondsInColumnSinceLastMove <= MILLISECONDS_PER_DAY,
		'issue--impeded': impediment,
		'issue--isDefect': issuetype.name === "Defect"
	});
	
	return (
		<>
			{isDetailOpen && (
				<IssueDetail
					data={data}
					onClose={handleIssuePreviewClose}
				/>
			)}
			
			<div className={issueClassName} onClick={handleIssuePreview}>
				{!!impediment && (
					<span className="issue-impediment">{`Impediment: ${impediment}`}</span>
				)}
				{!!parent && (
					<span className="issue-parent" style={{ color: issueColor }}>{parent.fields.summary}</span>
				)}
				{issuetype.name === "Defect" ? <img src={issuetype.iconUrl} alt={issuetype.name}/> : ''}
				<div className={!!parent ? "subtask-issue-summary" : "issue-summary"}>
					{data.key} {summary}
				</div>
				<span className="issue-assignee">
					{(assignee && assignee.displayName) || 'Unassigned'}
				</span>
				{!!estimate && (
					<span className="issue-estimate">{estimate}</span>
				)}
				{!!epic && (
					<span className="issue-epic">{epic.name}</span>
				)}
				{!!daysInColumn && (
					<span className="issue-age">
						{daysInColumn.toFixed(1)}
					</span>
				)}
			</div>
		</>
	);
}