import React, { Component } from 'react';

import './ColumnHeader.scss';

function sumPoints(issues) {
	return issues.reduce((total, issue) => {
		return total + (issue.fields.estimate || 0);
	}, 0);
}

export default class ColumnHeader extends Component {
	render() {
		const { data, issues } = this.props;
		
		const totalPointsInColumn = sumPoints(issues);
		
		return (
			<div className="columnHeader">
				<h2>{data.name}</h2>
				Points: {totalPointsInColumn}
			</div>
		);
	}
}
