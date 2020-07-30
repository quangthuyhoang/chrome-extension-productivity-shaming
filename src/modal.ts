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

	innerModal.appendChild(closeButton);

(function() {
	var todos = document.createElement('ul');
	todos.style.listStyleType = 'none';
	getChromeStorageApi('todos', function(results) {
		var t = results['todos'];
	
		t.forEach(todo => {
			let item = document.createElement('li');
			item.innerText = todo.value;
			todos.appendChild(item);
		});
	
		
		console.log('inner todos', todos)
	})

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
