const addListBtn = document.getElementById('addList');
const listTamplate = ` <div class="list-header panel-heading">
      <div class="list-name panel-title">Back-Log</div>
      <input type="text" class="hidden">
      <div class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="true">
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li><a href="#">Delete List</a></li>
        </ul>
      </div>
    </div>
    <div class="main-column panel-body">
      <ul class="cards-list list-group">
      
      </ul>
    </div>
    <div class="panel-footer add-card">
      Add a Card
    </div>`;

const cardTemplate = ` <button type="button" class="btn btn-primary btn-xs pull-right">Edit</button>
          <div>
            <p contenteditable="true">
              ha ha ha
            </p>
          </div>
          <div class="card-footer">
            <span class="label label-primary">FU</span>
            <span class="label label-primary">MT</span>
          </div>`;

addListBtn.addEventListener('click', addList);
addListenerToAddCard();
addListenerToListName();
addListenerToDrop();

function addList() {
  const wraper = document.getElementById('contflex');
  const newColumn = document.createElement('div');
  newColumn.innerHTML = listTamplate;
  newColumn.setAttribute('class', 'column panel panel-default');
  wraper.insertBefore(newColumn, addListBtn);
  addListenerToAddCard();
  addListenerToListName();
  addListenerToDrop();
}

function addListenerToAddCard() {
  let addCardBtn = document.querySelectorAll(".add-card");
  for (let i = 0; i < addCardBtn.length; i++) {
    addCardBtn[i].addEventListener("click", addCard);
  }
}

function addCard() {
  console.info(event.target);
  const newLi = document.createElement('li');
  newLi.innerHTML = cardTemplate;
  newLi.className= 'card list-group-item';
  const parentElm = event.target.parentNode.querySelector('.cards-list');
  console.info(newLi);
  console.info(parentElm);
  parentElm.appendChild(newLi);
}

function addListenerToListName() {
  const getListNameElms = document.getElementsByClassName('list-name');

  for (let listName of getListNameElms) {
    listName.addEventListener('click', editName);
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

function addListenerToDrop() {
  const makeEditBtnArray = document.querySelectorAll('.dropdown-toggle');
  for (let v of makeEditBtnArray) {
    v.addEventListener('click', openDeleteBtn);
  }
}

function openDeleteBtn() {
  const target = event.target;
console.info(target);
  const dropdownMenu = target.parentNode.querySelector('.dropdown-menu');

  if (dropdownMenu.style.display !== 'block') {
    dropdownMenu.style.display = 'block';
    const deleteBtn = dropdownMenu.firstElementChild.firstElementChild;
    const listStr = target.parentNode.parentNode.querySelector('.list-name').textContent;
    console.info(listStr);
    deleteBtn.addEventListener('click', (event) => {
      const confirmDel = confirm('Deleting ' + listStr + ' list. Are you sure?');
      if (confirmDel === true) {
        const Cya = target.parentNode.parentNode.parentNode;
        Cya.remove()
      }
      else {}
      deleteBtn.addEventListener('blur', (event) => {
        dropdownMenu.style.display = 'none'
      })
    })
  }
  else {
    dropdownMenu.style.display = 'none'
  }
}





