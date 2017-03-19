/*
 ============create by TzoocK=============
 */

/**
 * @AppData handlers
 */


/*

 */

const mainContent = document.getElementById('mainContent');

window.addEventListener('hashchange', initPageByHash);

function initPageByHash() {

  if (window.location.hash === '') {
    window.location.hash = '#board';
  }

  if (window.location.hash === '#board') {
    const targetTab = document.querySelector(".my-board");
    targetTab.className = "my-board active";
    targetTab.parentNode.querySelector('.my-members').classList.remove('active');

    const addListBtn = document.createElement('button');
    addListBtn.className = 'add-list btn btn-info';
    addListBtn.id = 'addList';
    addListBtn.textContent = 'Add a list...';
    mainContent.innerHTML = addListBtn.outerHTML;

    for (const list of appData.lists) {
      addList(list);
    }

    const addListBtnClick = mainContent.querySelector('.add-list');
    addListBtnClick.addEventListener('click', addList);
  }

  if (window.location.hash === '#members') {

    const targetTab = document.querySelector(".my-members");
    targetTab.className = "my-members active";
    targetTab.parentNode.querySelector('.my-board').classList.remove('active');

    const membersTemplate = ` <div>
 <h2 class="mem-head">Taskboard Members</h2>
  <ul class="list-group mem-list">
    
  </ul>
   <form type="submit" class="list-group-item add-member">
        <input type="text" class="add-mem-input" placeholder="Add New Member">
      <button class="add-mem btn btn-primary">Add</button>
    </form>
   </div>`;

    mainContent.innerHTML = membersTemplate;

    // const addMember = document.querySelector('.add-mem');
    //
    // addMember.addEventListener('click', addNewMember);

    const submitNewMember = document.querySelector('.add-member');

    submitNewMember.addEventListener('submit', addNewMember);
    for (const member of appData.members) {
      addNewMember(member);
    }
  }

}

function addList(list) {

  const listTemplate = `<div class="list-header panel-heading">
    <div class="list-name panel-title">New List
    </div>
    <input type="text" class="hidden">
<div class="dropdown">
      <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
              aria-expanded="true">
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
        <li>
          <a href="#">Delete List</a>
        </li>
      </ul>
    </div></div><div class="main-column panel-body"><ul class="cards-list list-group"></ul></div><div class="add-card panel-footer">Add a Card</div>`;

  const addListBtn = mainContent.querySelector('.add-list');
  const newColumn = document.createElement('div');
  newColumn.innerHTML = listTemplate;
  newColumn.setAttribute('class', 'column panel panel-default');
  mainContent.insertBefore(newColumn, addListBtn);

  const listName = newColumn.querySelector('.list-name');
  listName.addEventListener('click', editName);

  const getCardBtn = newColumn.lastElementChild;
  getCardBtn.addEventListener('click', addCard);

  const dropdownToggle = newColumn.querySelector('.dropdown-toggle');
  dropdownToggle.addEventListener('click', openDeleteBtn);

  if (list.type === 'click') {
    const uId = uuid.v4();
    const newList = {
      id: uId,
      tasks: [],
      title: listName.textContent
    };

    appData.lists.push(newList);

    newColumn.setAttribute('uuid', uId);
  }

  if (list.type === undefined) {
    newColumn.setAttribute('uuid', list.id);
    newColumn.querySelector('.list-name').textContent = list.title;
    const papa = newColumn.querySelector('.cards-list');
    for (const task of list.tasks) {
      addCard(task, papa);
    }
  }
}

function addCard(task, papa) {
  const target = event.target;

  const cardTemplate = `<button type="button" class="my-ed-btn btn btn-primary btn-xs">
  Edit
</button>
<p class="card-text">
  Empty Card 
</p>
<div class="card-footer">
</div>`;

  const newLi = document.createElement('li');
  newLi.className = 'card list-group-item';
  newLi.innerHTML = cardTemplate;

  const edBtn = newLi.querySelector('.btn-primary');
  edBtn.addEventListener('click', openModal);

  if (task && papa) {
    newLi.setAttribute('uuid', task.id);
    papa.appendChild(newLi);
    newLi.querySelector('.card-text').textContent = task.text;
    const cardFoote = newLi.querySelector(".card-footer");

    task.members.forEach((id) => {
      appData.members.forEach((member) => {
        if (id === member.id) {
          const fullName = member.name;
          const initialName = getFirstLetters(fullName);
          const newInitName = document.createElement('span');
          newInitName.className = "label label-primary";
          newInitName.setAttribute('title', fullName);
          newInitName.innerHTML = initialName;
          cardFoote.appendChild(newInitName);
        }
      });
    });

  }
  else {
    const cardList = target.parentNode.querySelector('.main-column > ul');
    cardList.appendChild(newLi);
    newLi.setAttribute('uuId', uuid.v4());
    const currntListId = target.closest('.column').getAttribute('uuid');
    const emptyCardText = newLi.querySelector('.card-text').textContent;
    const emptyCardMembers = newLi.querySelector('.card-footer').querySelectorAll('span');
    const cardId = newLi.getAttribute('uuid');
    appData.lists.forEach((list) => {

      if (list.id === currntListId) {
        const emptyCard = {
          id: cardId,
          text: emptyCardText,
          members: emptyCardMembers,
        };
        list.tasks.push(emptyCard);

      }
    });
  }
}

function getFirstLetters(name) {
  let initialName = '';
  const sepNames = name.split(' ');
  sepNames.forEach((word) => {
    initialName += word[0];
  });
  return initialName
}

function openModal() {

  const modalTamplate = `<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="my-close-btn close" data-dismiss="modal" aria-label="Close"><span
          aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Edit Card</h4>
      </div>
      <div class="modal-body">
        <form class="form-horizontal">
          <div class="form-group">
            <label for="edit-text" class="col-sm-2 control-label">Card Text</label>
            <div class="col-sm-10">
              <textarea class="form-control" rows="3" id="edit-text"></textarea>
            </div>
          </div>
          <div class="form-group">
            <label for="list-checkbox" class="col-sm-2 control-label">Move to:</label>
            <div class="col-sm-10">
              <select class="form-control list-checkbox" id="list-checkbox">
              </select>
            </div>
          </div>
          <div class="form-group">

            <label for="memlist" class="col-sm-2 control-label">Members:</label>

            <div class="col-sm-7 hold-mem panel panel-default">
              <ul class="memlist" id="memlist">
             
              </ul>
            </div>

          </div>
          <div class="form-group">

            <button type="button" class="my-ins-delbtn btn btn-danger">Delete Card</button>

          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default my-close-btn" data-dismiss="modal">Close</button>
        <button type="button" class="save-changes btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>`;
  const target = event.target;
  const modal = document.createElement('div');
  const body = document.querySelector('body');
  const card = target.closest('.card');
  const list = target.closest('.column');
  const taskId = card.getAttribute('uuid');
  const listId = list.getAttribute('uuid');

  body.appendChild(modal);
  modal.className = 'modal';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.innerHTML = modalTamplate;
  modal.style.display = 'block';
  modal.setAttribute('taskId', taskId);
  modal.setAttribute('listId', listId);
  const cardText = card.querySelector('.card-text').textContent;
  const modalCardText = modal.querySelector('#edit-text');
  modalCardText.value = cardText;

  const modalMoveTo = modal.querySelector('#list-checkbox');
  appData.lists.forEach((list) => {
    const newOption = document.createElement('option');
    newOption.textContent = list.title;
    newOption.setAttribute('listId', list.id);
    const optionId = newOption.getAttribute('listId');
    if (optionId === listId) {
      newOption.selected = true
    }
    modalMoveTo.appendChild(newOption)
  });


  const modalMembers = modal.querySelector('#memlist');
  appData.members.forEach((member) => {
    const newLi = document.createElement('li');
    const tamplete = `
<label class="checkbox-name">
  <input type="checkbox" uuId="${member.id}">
  ${member.name}
  </label>
`;
    newLi.innerHTML = tamplete;
    modalMembers.appendChild(newLi);


    const checkedMe = newLi.querySelector(`[uuid="${member.id}"]`);
    appData.lists.forEach((list) => {
      list.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.members.forEach((id) => {
            if (checkedMe.getAttribute('uuid') === id) {
              checkedMe.checked = true;
            }
          });
        }
      });
    });
  });


  const saveBtn = modal.querySelector('.save-changes');
  saveBtn.addEventListener('click', updateTask);

  const deleteBtn = modal.querySelector('.my-ins-delbtn');
  deleteBtn.addEventListener('click', deleteTask);

  const closeBtn = modal.querySelectorAll('.my-close-btn');
  for (let x of closeBtn) {
    x.addEventListener("click", closeModal);
  }

}

function closeModal() {
  const modalElm = event.target.closest('.modal');
  modalElm.style.display = 'none';
}

function editName(event) {
  const target = event.target;

  const preText = target.textContent;

  const inputElm = target.parentNode.querySelector('.hidden');

  inputElm.classList.toggle('hidden');
  target.classList.toggle('hidden');
  inputElm.value = preText;
  inputElm.focus();

  inputElm.addEventListener('keydown', enterInp);
  inputElm.addEventListener('blur', blurInp);

}

function blurInp() {
  const target = event.target;
  const changedListTitle = target.value;
  const listTitle = target.parentNode.querySelector('.list-name');
  const preText = listTitle.textContent;
  listTitle.textContent = changedListTitle;
  target.classList.add('hidden');
  listTitle.classList.remove('hidden');

  updateListNameInAppData(changedListTitle, preText);
}

function enterInp() {
    const target = event.target;

    if (event.keyCode === 13) {
      const changedListTitle = target.value;
      const listTitle = target.parentNode.querySelector('.list-name');
      const preText = listTitle.textContent;
    listTitle.textContent = changedListTitle;
    target.classList.add('hidden');
    listTitle.classList.remove('hidden');
      updateListNameInAppData(changedListTitle, preText);
  }
}

function openDeleteBtn(event) {
  const target = event.target;
  const dropdownMenu = target.closest('.dropdown').querySelector('.dropdown-menu');

  if (dropdownMenu.style.display !== 'block') {
    dropdownMenu.style.display = 'block';

    const deleteBtn = dropdownMenu.firstElementChild.firstElementChild;
    const listStr = target.closest('.list-header').querySelector('.list-name').textContent;

    function deleteList() {
      const confirmDel = window.confirm('Deleting ' + listStr + ' list. Are you sure?');

      if (confirmDel === true) {
        const columElm = target.closest('.column');
        columElm.remove();
        appData.lists.forEach((item) => {
          let index = appData.lists.indexOf(item);
          if (listStr === item.title) {
            appData.lists.splice(index, 1)
          }
        })
      }
      else {
        dropdownMenu.style.display = 'none'
      }
    }

    deleteBtn.addEventListener('click', deleteList);
  }
  else {
    dropdownMenu.style.display = 'none'
  }
}

function addNewMember(member) {

  const memberTemplate = `<div class="mem-content">
        <label for="inp-name" class="mem-name">
          New Member
        </label>
        <div class="mem-btns">
          <button type="button" class="edit-mem-btn btn btn-info btn-xs">Edit</button>
          <button type="button" class="delete-mem btn btn-danger btn-xs">Delete</button>
        </div>
    </div>
      <div class="hidden mem-inEdit">
        <input type="text" class="form-control inp-name" id="inp-name">
        <div class="mem-inEdit-btns">
          <button type="button" class="cancel-mem btn btn-default btn-xs">Cancel</button>
          <button type="button" class="save-mem btn btn-success btn-xs">Save</button>
        </div>
      </div>`;

  const memList = document.querySelector('.mem-list');
  const newMember = document.createElement('li');
  newMember.innerHTML = memberTemplate;
  newMember.className = 'list-group-item member';
  newMember.querySelector('.mem-name').textContent = member.name;

  if (member.type === 'submit') {
    const membersFooter = event.target;
    const footerInput = membersFooter.querySelector('input');
    const newMemName = newMember.querySelector('.mem-name');

    newMember.setAttribute('uuid', uuid.v4());

    newMemName.textContent = footerInput.value;
    if (footerInput.value === '') {
      newMemName.textContent = "New Member"
    }

    const memberId = newMember.getAttribute('uuid');
    updateNewMember(memberId, newMemName.textContent);
    footerInput.value = ''
  }

  if (typeof member === 'object') {
    newMember.setAttribute('uuid', member.id);
  }

  memList.appendChild(newMember);

  const editMemberBtn = newMember.querySelector('.edit-mem-btn');
  editMemberBtn.addEventListener('click', editMember);

  const deleteMemberBtn = newMember.querySelector('.delete-mem');
  deleteMemberBtn.addEventListener('click', deleteMember);

}

function editMember() {

  const target = event.target;
  const currentLiElm = target.closest('.member');
  const memContent = currentLiElm.querySelector('.mem-content');
  const memInEdit = currentLiElm.querySelector('.mem-inEdit');
  const cancelEdit = currentLiElm.querySelector('.cancel-mem');
  const saveMemberBtn = currentLiElm.querySelector('.save-mem');
  const inputMember = currentLiElm.querySelector('.inp-name');
  const memberName = currentLiElm.querySelector('.mem-name');

  inputMember.value = memberName.textContent;

  saveMemberBtn.addEventListener('click', saveMember);

  //=====togglers====
  function togglers() {
    memContent.classList.toggle('hidden');
    memInEdit.classList.toggle('hidden');
    inputMember.focus();
  }

  cancelEdit.addEventListener('click', togglers);

  togglers();
}

function saveMember() {
  const target = event.target;
  const currentLiElm = target.closest('.member');
  const memContent = currentLiElm.querySelector('.mem-content');
  const memInEdit = currentLiElm.querySelector('.mem-inEdit');
  const inputMember = currentLiElm.querySelector('.inp-name');
  const memberName = currentLiElm.querySelector('.mem-name');
  const memberId = currentLiElm.getAttribute('uuid');
  const memName = inputMember.value;
  updateMemberName(memberId, memName);


  memberName.textContent = inputMember.value;

  memContent.classList.toggle('hidden');
  memInEdit.classList.toggle('hidden');
}

function deleteMember() {

  const target = event.target;
  const currentLiElm = target.closest('.member');
  const memberId = currentLiElm.getAttribute('uuid');

  updateDeleteMember(memberId);

  currentLiElm.remove()
}

function initBoard() {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqBoardListener);
  oReq.open("GET", "assets/board-advanced.json");
  oReq.send();
}

function initMember() {
  const mReq = new XMLHttpRequest();
  mReq.addEventListener("load", reqMembersListener);
  mReq.open("GET", "assets/members.json");
  mReq.send();
}

initBoard();
initMember();

