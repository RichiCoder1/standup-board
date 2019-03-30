import React, { Component } from 'react';
import Issue from './Issue';

import './ColumnBody.scss';

export default class ColumnBody extends Component {
	render() {
		const { issues } = this.props;
		
		const issueCards = issues.map(issue => {
			const { id } = issue;
			
			return (
				<Issue key={id} data={issue} />
			);
		});
		
		return (
			<div className="columnBody">
				{issueCards}
			</div>
		);
	}
}
