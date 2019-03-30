import React, { Component } from 'react';

import './ColumnOverlay.scss';

function fillBackground(percentToFill) {
	const percentFormatted = percentToFill.toFixed(2) * 100;
	
	return {
		background: `linear-gradient(to bottom, transparent ${100 - percentFormatted}%, #dcdcdc ${percentFormatted}%)`,
	};
}

function sumPoints(issues) {
	return issues.reduce((total, issue) => {
		return total + (issue.fields.estimate || 0);
	}, 0);
}

export default class ColumnOverlay extends Component {
	render() {
		const { allIssues, issues } = this.props;
		
		const totalPoints = sumPoints(allIssues)
		const totalPointsInColumn = sumPoints(issues);
		const percentPointsOfTotal = totalPointsInColumn / totalPoints;
		
		return (
			<div
				className="columnOverlay"
				style={fillBackground(percentPointsOfTotal)}
			/>
		);
	}
}
