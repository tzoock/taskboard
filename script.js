
const btn = document.getElementById('addList');
const listTamplate = `<header class="list-header panel-default panel">
      <div class="list-name">New List</div>
      <span>
        Edit
        <button class="del-list-btn">
          Delete List
        </button>
      </span>
    </header>
    <div class="main-column">
      <ul class="cards-list"></ul>
    </div>
    <footer>
      <button class="add-card btn btn-default">
        Add a Card
      </button>
    </footer>`;

btn.addEventListener('click', addList);
addListenerToAddCard();
titels();
addListenerToEditBtn();

function addList() {
  const wraper = document.getElementById('contflex');
  const newColumn = document.createElement('div');
  newColumn.innerHTML = listTamplate;
  newColumn.setAttribute('class', 'column');
  wraper.insertBefore(newColumn, btn);
  addListenerToAddCard();
  titels();
  addListenerToEditBtn();
}

function addListenerToAddCard() {
  let addCardBtn = document.querySelectorAll(".add-card");
  for (let i = 0; i < addCardBtn.length; i++) {
    addCardBtn[i].addEventListener("click", addCard)
  }
}

function addCard() {
  const newLi = document.createElement('li');
  newLi.textContent = 'new card';
  const findPapa = event.target.parentNode.previousSibling.previousSibling;
  const parentElm = findPapa.querySelector('.cards-list');
  parentElm.appendChild(newLi);
}

function titels() {
  const getListNameElms = document.getElementsByClassName('list-name');

  for (let listName of getListNameElms) {
    listName.addEventListener('click', editName);
  }
}

function editName() {
  const target = event.target;
  // const preText = target.textContent;
  const papa = target.parentNode;
  const newInput = document.createElement('input');
  papa.replaceChild(newInput, target);
  // newInput.textContent = preText;
  newInput.focus();

  newInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      const mama = document.createElement('div');
      const newTitle = event.target;
      papa.replaceChild(mama, newTitle);
      mama.textContent = newTitle.value;
      mama.addEventListener('click', editName);
      mama.className='list-name';
    }
  });

  newInput.addEventListener('blur', (event) => {
    const mama = document.createElement('div');
    const newTitle = event.target;
    papa.replaceChild(mama, newTitle);
    mama.textContent = newTitle.value;
    mama.addEventListener('click', editName)
  })
}

function addListenerToEditBtn() {
  const makeEditBtnArray = document.querySelectorAll('.column header span');
  for (let v of makeEditBtnArray) {
    v.addEventListener('click', openDeleteBtn)
  }
}

function openDeleteBtn() {
  const editBtn = event.target;
  const delListBtn = editBtn.querySelector('button');

  if (delListBtn.style.display !== 'block') {
    delListBtn.style.display = 'block'
  }
  else {
    delListBtn.style.display = 'none'
  }
  delListBtn.addEventListener('click', (event) => {
    const target = event.target;
    const promptDel = prompt('Deleting TODO list. Are you sure?');
    if (promptDel === '') {
      const EE = target.parentNode.parentNode.parentNode;
      console.info(EE);
      EE.remove()
    }
    else {
    }
  })
}





