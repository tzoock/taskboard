const addListBtn = document.getElementById('addList');
addListBtn.addEventListener('click', addList);

const listTemplate = `<div class="list-header panel-heading">
  <div class="list-name panel-title">
    New-List
  </div>
  <input type="text" class="hidden">
  <div class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="true">
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li>
        <a href="#">
          Delete List
        </a>
      </li>
    </ul>
  </div>
</div>
<div class="main-column panel-body">
  <ul class="cards-list list-group">
  </ul>
</div>
<div class="add-card panel-footer">Add a Card
</div>`;

const cardTemplate = `<button type="button" class="btn btn-primary btn-xs pull-right">
  Edit
</button>
<p class="card-text">
  ha ha ha
</p>
<div class="card-footer">
  <span class="label label-primary">FU</span>
  <span class="label label-primary">MT</span>
</div>`;

// addListenerToAddCard();
// addListenerToListName();
// addListenerToDrop();

function addList(board) {
  const wrapper = document.getElementById('contflex');
  const newColumn = document.createElement('div');
  newColumn.innerHTML = listTemplate;
  newColumn.setAttribute('class', 'column panel panel-default');
  wrapper.insertBefore(newColumn, addListBtn);
  const getCardBtn = newColumn.lastElementChild;
  getCardBtn.addEventListener('click', addCard);
  const listName = newColumn.querySelector('.list-name');
  listName.addEventListener('click', editName);
  const dropdownToggle = newColumn.querySelectorAll('.dropdown-toggle');
  console.info(dropdownToggle);
  dropdownToggle.addEventListener('click', openDeleteBtn);
  // addListenerToDrop();

  if (board) {
    newColumn.querySelector('.list-name').textContent = board.title;
    const tasks = board.tasks;
    for (let task of tasks) {
      const papa = newColumn.querySelector('.cards-list');
      addCard(task, papa);
    }
  }
}

function addCard(task, papa) {

  const newLi = document.createElement('li');
  newLi.className = 'card list-group-item';
  newLi.innerHTML = cardTemplate;
  if (task && papa) {
    papa.appendChild(newLi);
    newLi.querySelector('.card-text').textContent = task.text;
  }
  else {
    const cardList = event.target.parentNode.querySelector('.main-column > ul');
    console.info(cardList);
    cardList.appendChild(newLi);
  }
}

function editName() {
  const target = event.target;
  const preText = target.textContent;
  const showInput = target.parentNode.querySelector('.hidden');
  showInput.className = '';
  target.className = 'hidden';
  showInput.value = preText;
  showInput.focus();

  showInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      target.className = 'list-name';
      showInput.className = 'hidden';
      target.textContent = showInput.value;
    }
  });

  showInput.addEventListener('blur', (event) => {
    target.className = 'list-name';
    showInput.className = 'hidden';
    target.textContent = showInput.value;
  });
  addListenerToListName();
  addListenerToDrop()
}

function openDeleteBtn() {
  // const target = event.target;
  // const dropdownMenu = target.parentNode.querySelector('.dropdown-menu');

  if (dropdownMenu.style.display !== 'block') {
    dropdownMenu.style.display = 'block';
    const deleteBtn = dropdownMenu.firstElementChild.firstElementChild;
    const listStr = target.parentNode.parentNode.querySelector('.list-name').textContent;
    deleteBtn.addEventListener('click', (event) => {
      const confirmDel = confirm('Deleting ' + listStr + ' list. Are you sure?');
      if (confirmDel === true) {
        const Cya = target.parentNode.parentNode.parentNode;
        Cya.remove()
      }
      else {
      }
      deleteBtn.addEventListener('blur', (event) => {
        dropdownMenu.style.display = 'none'
      })
    })
  }
  else {
    dropdownMenu.style.display = 'none'
  }
}


function reqListener(event) {
  const target = event.target.response;
  const data = JSON.parse(target);
  for (let board of data.board) {
    addList(board);
  }

}

const oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "assets/board.json");
oReq.send();


