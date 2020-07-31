import { getChromeStorageApi } from './utils/chromeRequest/index';


// inner modal
const h = window.outerHeight;
const w = window.outerWidth;
var innerModal = document.createElement('div');
innerModal.style.border = '1px solid black';
innerModal.style.width = '400px';
innerModal.style.height = '400px';
innerModal.style.backgroundColor = 'white';
innerModal.style.margin = '0 auto';

// close button
var closeButton = document.createElement('span');
closeButton.innerText = 'x';
closeButton.addEventListener('click',function(ev) {
	// check if modal currently exists
	var shameModal = document.querySelector('#shame-modal');
	shameModal.remove();
});

// todos list element
const modalContainer = document.createElement('div')
modalContainer.id = "modal-todos";
modalContainer.innerHTML = `<div><ul>
	<li>q</li>
	<li>q</li>
	<li>q</li>
</ul>
</div>`;

innerModal.appendChild(closeButton);
innerModal.appendChild(modalContainer);
// getChromeStorageApi(['todos'], function(results) {
// 	console.log('initialize appstate', innerModal)
// 	const todoss = results['todos'];
// 	console.log(results)
// 	AppState.update({todos: todoss}); //initialize state


	

// 	console.log(document.getElementById('modal-todos'))
// });


(function() {
	var todos = document.createElement('ul');
	todos.style.listStyleType = 'none';
	console.log('create ul todos')
	getChromeStorageApi('todos', function(results) {
		var t = results['todos'];
		console.log('old code - grab the todos')
		t.forEach(todo => {
			let item = document.createElement('li');
			item.innerText = todo.value;
			todos.appendChild(item);
		});
	
	})
	console.log('append todos to innerModal', document.getElementById('modal-todos'))
	innerModal.appendChild(todos)

	var div = document.createElement('div');
	div.id = "shame-modal";
	div.style.position = 'absolute';
	div.style.top = '0';
	div.style.right = '0';
	div.style.zIndex = '9999';
	div.style.height = `${h}px`;
	div.style.width = `${w}px`;
	div.style.backgroundColor = 'yellow';
	div.style.border = '1px solid grey';

	div.appendChild(innerModal);

	document.body.appendChild(div);

})();


	


