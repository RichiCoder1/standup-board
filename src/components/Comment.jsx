import React, { Component } from 'react';
import './Comment.scss';

export default class Comment extends Component {
	render() {
		const { data } = this.props;
		
		return (
			<div className='comment'>
				<strong>{data.author.displayName}</strong> - {new Date(data.created).toLocaleString()}
				<div className='comment-body'>{data.body}</div>
			</div>
		);
	}
}
