const addListBtn = document.getElementById('addList');
addListBtn.addEventListener('click', function () {
  const emptyList = {
    "title": "New List",
    "tasks": []
  };

  addList(emptyList);

});

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

const cardTemplate = `<button type="button" class="my-ed-btn btn btn-primary btn-xs">
  Edit
</button>
<p class="card-text">
  ha ha ha
</p>
<div class="card-footer">
</div>`;

const memberTemplate = `<label for="inp-name" class="mem-name">
        New Member
      </label>
      <input type="text" class="form-control inp-name" id="inp-name">
      <div class="mem-btns">
        <button type="button" class="btn btn-info btn-xs">Edit</button>
        <button type="button" class="btn btn-danger btn-xs">Delete</button>
      </div>
      <div class="mem-edit-btns">
        <button type="button" class="btn btn-default btn-xs">Cancel</button>
        <button type="button" class="btn btn-success btn-xs">Save</button>
      </div>`;

const tabsNav = document.querySelector('.nav-tabs');
tabsNav.addEventListener('click', (event) => {
  const target = event.target;
  if (target.textContent === 'Board') {
    target.closest('.nav-tabs').querySelector()
  }

  console.info(target.closest('.nav-tabs'));
  target.closest('.nav-tabs')
});

// function switchTab() {
//   const target = event.target;
//   if (target.textContent === 'Board') {
//     boardTab.className = '"my-board active';
//     membersTab.className = 'my-members';
//
//   }
//   if (target.textContent === 'Members') {
//     boardTab.className = '"my-board';
//     membersTab.className = 'my-members active';
//   }
//
// }
function addList(list) {
  const wrapper = document.getElementById('contflex');
  const newColumn = document.createElement('div');
  newColumn.innerHTML = listTemplate;
  newColumn.querySelector('.list-name').textContent = 'New-List';
  newColumn.setAttribute('class', 'column panel panel-default');
  wrapper.insertBefore(newColumn, addListBtn);
  const getCardBtn = newColumn.lastElementChild;
  getCardBtn.addEventListener('click', addCard);
  const listName = newColumn.querySelector('.list-name');
  listName.addEventListener('click', editName);
  const dropdownToggle = newColumn.querySelector('.dropdown-toggle');
  dropdownToggle.addEventListener('click', openDeleteBtn);

  newColumn.querySelector('.list-name').textContent = list.title;
  const tasks = list.tasks;
  for (const task of tasks) {
    const papa = newColumn.querySelector('.cards-list');
    addCard(task, papa);
  }
}

function addCard(task, papa) {

  const newLi = document.createElement('li');
  newLi.className = 'card list-group-item';
  newLi.innerHTML = cardTemplate;

  const edBtn = newLi.querySelector('.btn-primary');
  edBtn.addEventListener('click', openModal);

  if (task && papa) {
    papa.appendChild(newLi);
    newLi.querySelector('.card-text').textContent = task.text;
    const cardFoote = newLi.querySelector(".card-footer");
    const members = task.members;

    for (const difNames of members) {
      let initials = '';
      const sepNames = difNames.split(' ');
      for (const name of sepNames) {
        initials += name[0];
      }
      const newInitName = document.createElement('span');
      newInitName.className = "label label-primary";
      newInitName.setAttribute('title', difNames);
      newInitName.innerHTML = initials;
      cardFoote.appendChild(newInitName);
    }
  }
  else {
    const cardList = event.target.parentNode.querySelector('.main-column > ul');
    cardList.appendChild(newLi);
  }
}

function openModal() {
  const target = event.target;
  const main = target.closest('body');
  const modal = main.querySelector(".modal");
  modal.style.display = 'block';
  const card = target.closest('.card');
  const closeBtn = modal.querySelectorAll('.my-close-btn');
  for (let x of closeBtn) {
    x.addEventListener("click", (event) => {
      const modalElm = event.target.closest('.modal');
      modalElm.style.display = 'none';
    });
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

  showInput.addEventListener('keydown', enterInp);
  showInput.addEventListener('blur', blurInp);

  function enterInp() {
    if (event.keyCode === 13) {
      target.className = 'list-name';
      showInput.className = 'hidden';
      target.textContent = showInput.value;
    }
  }

  function blurInp() {
    target.className = 'list-name';
    showInput.className = 'hidden';
    target.textContent = showInput.value;
  }
}

function openDeleteBtn() {
  const target = event.target;
  const dropdownMenu = target.parentNode.querySelector('.dropdown-menu');
  if (dropdownMenu.style.display !== 'block') {
    dropdownMenu.style.display = 'block';
    const deleteBtn = dropdownMenu.firstElementChild.firstElementChild;
    const listStr = target.parentNode.parentNode.querySelector('.list-name').textContent;
    deleteBtn.addEventListener('click', (deleteList));

    function deleteList() {
      const confirmDel = confirm('Deleting ' + listStr + ' list. Are you sure?');
      if (confirmDel === true) {
        const Cya = target.parentNode.parentNode.parentNode;
        Cya.remove()
      }
      else {
        dropdownMenu.style.display = 'none'
      }
    }
  }
  else {
    dropdownMenu.style.display = 'none'
  }
}

function memberialia(data) {
  // console.info(data);
  const mainMembers = document.querySelector('.members-stuff');
  // console.info(mainMembers);
  const memList = document.createElement('ul');
  memList.innerHTML = `<ul class="list-group mem-list">
</ul>`;
  // console.info(memList);
  const addMember = memList.querySelector('.add-member');
  const newMember = document.createElement('li');
  newMember.innerHTML = memberTemplate;
  newMember.className = 'list-group-item member';
  memList.appendChild(newMember);
}

function reqBoardListener(event) {

  const target = event.target.response;
  const data = JSON.parse(target);
  for (const list of data.board) {
    addList(list);
  }
}

function reqMembersListener(event) {
  const target = event.target.response;
  const data = JSON.parse(target);
 memberialia(data)
}

function initBoard() {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqBoardListener);
  oReq.open("GET", "assets/board.json");
  oReq.send();
}

function initMember () {
  const mReq = new XMLHttpRequest();
  mReq.addEventListener("load", reqMembersListener);
  mReq.open("GET", "assets/members.json");
  mReq.send();
}

window.addEventListener('hashchange', (event) => {
  // console.log(window.location.hash);
  // console.info(event.target);
  if (window.location.hash.includes('#members')) {
    initMember()
  }
  if (window.location.hash.includes('#board')) {
    initBoard()
  }
});
