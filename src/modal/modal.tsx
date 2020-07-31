import React, { useState, useEffect } from "react";
import * as ReactDOM from 'react-dom';
import './modal.scss';
import List from './../popup/components/List/List';
import { getChromeStorageApi } from './../utils/chromeRequest/index';
import { TOption } from "../utils/types";

type Props = {};
type State = { todos: TOption[]};

const height = window.outerHeight;
const width = window.outerWidth;
// Edge case when body width is not 100% with view screen
// const leftOffset = (this.document.body.offsetWidth - this.visualViewport.width) / 2 ;

function CustomItem(props) {
	const { value } = props;
	return (
	<div>{value}</div>
	)
}

class Main extends React.Component<Props, State> {
	constructor(props){
		super(props)
		this.state = {
			todos: []
		}
	}

	componentWillMount(){
		console.log('will mount init');
		getChromeStorageApi('todos', (results) => {
			const todos = results['todos'];
			this.setState({todos});
		})
	}

	render() {
		const { todos } = this.state;
			return (
					<div  className="container" style={{height: height, width: width}}>

							<h1>Hello world - My first Extension</h1>
							<p>Words of encouragement</p>
							<List options={todos} />
								
					</div>
			)
	}
}

const app = document.createElement('div');
app.id = "my-extension-root";
app.style.position = 'absolute';
app.style.top = '0';
app.style.left = '0';

document.body.appendChild(app);
ReactDOM.render(<Main />, app);