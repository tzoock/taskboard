const mainContent = document.getElementById('mainContent');


/**
 * @AppData handlers
 */
const appData = {
  lists: [],
  members: []
};

function updateMemberName(memberId, memName) {
  appData.members.forEach((member) => {
    if (memberId === member.id) {
      member.name = memName;
    }
  })
}

function updateDeleteMember(memberId) {
  appData.members.forEach((member, index) => {
    if (memberId === member.id) {
      appData.members.splice(index, 1)
    }
  })
}

function updateNewMember(memberId, memberName) {
  const newMember = {
    "id": memberId,
    "name": memberName
  };
  appData.members.push(newMember)
}

window.addEventListener('hashchange', (event) => {
  initPageByHash();
});

function initPageByHash() {

  if (window.location.hash === '') {
    window.location.hash = '#board';
  }

  if (window.location.hash === '#board') {
    const targetTab = document.querySelector(".my-board");
    targetTab.className = "my-board active";
    targetTab.parentNode.querySelector('.my-members').classList.remove('active');

    const addListBtn = document.createElement('button');
    addListBtn.className = 'add-list btn-default btn';
    addListBtn.id = 'addList';
    addListBtn.textContent = 'Add List';
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
   <div class="list-group-item add-member">
        <input type="text" class="add-mem-input form-control" placeholder="Add New Member">
      <button class="add-mem btn btn-primary">Add</button>
    </div>
   </div>`;

    mainContent.innerHTML = membersTemplate;

    const addMember = document.querySelector('.add-mem');

    addMember.addEventListener('click', addNewMember);

    for (const member of appData.members) {
      initMembers(member);
    }
  }

}

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
    console.info(appData.lists);

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
    newLi.setAttribute('uuid', task.id)
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
    newLi.setAttribute('uuId', uuid.v4());
    const currntListTitle = target.closest('.column').querySelector('.list-name').textContent;
    const emptyCardText = newLi.querySelector('.card-text').textContent;
    const emptyCardMembers = newLi.querySelector('.card-footer').querySelectorAll('span');

    appData.lists.forEach((list) => {

      if (list.title === currntListTitle) {
        const emptyCard = {
          text: emptyCardText,
          members: emptyCardMembers,
        };
        list.tasks.push(emptyCard);

      }
    });
  }
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
            <label for="mem-checkbox" class="col-sm-2 control-label">Move to:</label>
            <div class="col-sm-10">
              <select class="form-control mem-checkbox" id="mem-checkbox">
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

  const modalMoveTo = modal.querySelector('#mem-checkbox');
  appData.lists.forEach((list) => {
    const newOption = document.createElement('option');
    newOption.textContent = list.title;
    modalMoveTo.appendChild(newOption)
  });

  const modalMembers = modal.querySelector('#memlist');
  appData.members.forEach((member) => {
    const newLi = document.createElement('li');
    const tamplete = `
<label>
  <input type="checkbox">
  </label>
`;
    newLi.innerHTML = tamplete;
    const nameHere = newLi.querySelector('label');
    nameHere.textContent = member.name;
    // const newMem = document.createElement('label');
    // const newCheckbox = document.createElement('input');
    // newCheckbox.setAttribute('type', 'checkbox');
    // newMem.appendChild(newCheckbox);
    // newMem.textContent = member.name;
    // newLi.appendChild(newMem);
    modalMembers.appendChild(newLi)
  });


  const saveBtn = modal.querySelector('.save-changes');
  saveBtn.addEventListener('click', updateTask);

  const closeBtn = modal.querySelectorAll('.my-close-btn');
  for (let x of closeBtn) {
    x.addEventListener("click", closeModal);
  }
}

function closeModal() {

  const modalElm = event.target.closest('.modal');
  modalElm.style.display = 'none';
  initPageByHash()
}

function updateTask() {
  const target = event.target;
  const modalCardText = target.closest('.modal').querySelector('#edit-text');
  const taskId = target.closest('.modal').getAttribute('taskId');
  const listId = target.closest('.modal').getAttribute('listId');

  appData.lists.forEach((list) => {
    if (list.id === listId) {
      list.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.text = modalCardText.value;
          console.info('im the one');
          closeModal()
        }
      })
    }
  })
}

function editName(event) {
  const target = event.target;
  // console.info('target', target);
  const preText = target.textContent;
  // console.info('preText', preText);
  const showInput = target.parentNode.querySelector('.hidden');
  // console.info('showInput', showInput);
  showInput.className = '';
  target.className = 'hidden';
  showInput.value = preText;
  showInput.focus();

  showInput.addEventListener('keydown', enterInp);
  showInput.addEventListener('blur', blurInp);

}

function enterInp() {
  const target = event.target;
  const showInput = target.parentNode.querySelector('.hidden');


  if (event.keyCode === 13) {
    const preText = showInput.textContent;
    showInput.textContent = target.value;
    target.className = 'hidden';

    appData.lists.forEach((list, index) => {
      if (list.title === preText) {
        appData.lists[index].title = target.value
      }
    });
  }

}

function blurInp() {
  const target = event.target;
  const showInput = target.parentNode.querySelector('.hidden');
  const preText = showInput.textContent;
  showInput.textContent = target.value;
  target.className = 'hidden';
  showInput.className = 'list-name panel-title';

  appData.lists.forEach((list, index) => {

    if (list.title === preText) {
      appData.lists[index].title = target.value
    }
  });
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

function initMembers(member) {

  const memList = document.querySelector('.mem-list');

  const newMember = document.createElement('li');
  newMember.innerHTML = memberTemplate;
  newMember.className = 'list-group-item member';
  newMember.querySelector('.mem-name').textContent = member.name;
  newMember.setAttribute('uuid', member.id);
  memList.appendChild(newMember);


  const editMemberBtn = newMember.querySelector('.edit-mem-btn');
  editMemberBtn.addEventListener('click', editMember);

  const deleteMemberBtn = newMember.querySelector('.delete-mem');
  deleteMemberBtn.addEventListener('click', deleteMember)
}

function addNewMember() {

  const memList = document.querySelector('.mem-list');
  const clickNewMember = document.createElement('li');

  clickNewMember.innerHTML = memberTemplate;
  clickNewMember.className = 'list-group-item member';
  clickNewMember.setAttribute('uuid', uuid.v4());
  memList.appendChild(clickNewMember);

  const editMemberBtn = clickNewMember.querySelector('.edit-mem-btn');
  editMemberBtn.addEventListener('click', editMember);

  const deleteMemberBtn = clickNewMember.querySelector('.delete-mem');
  deleteMemberBtn.addEventListener('click', deleteMember);

  const memberName = clickNewMember.querySelector('.mem-name').textContent;
  const memberId = clickNewMember.getAttribute('uuid');

  updateNewMember(memberId, memberName);

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

  memContent.classList.toggle('hidden');
  memInEdit.classList.toggle('hidden');

  cancelEdit.addEventListener('click', (event) => {
    memContent.classList.toggle('hidden');
    memInEdit.classList.toggle('hidden');
  });

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
  console.info(event.target);
  const target = event.target;
  const currentLiElm = target.closest('.member');
  const memberId = currentLiElm.getAttribute('uuid');

  updateDeleteMember(memberId);

  currentLiElm.remove()
}

function isAllDataReady() {
  if (appData.lists.length && appData.members.length) {
    return true
  }
  else {
    return false
  }
}

function reqBoardListener(event) {
  const target = event.target.response;
  // console.info(target);
  const data = JSON.parse(target);

  appData.lists = data.board;

  if (isAllDataReady()) {
    initPageByHash();
  }
}

function reqMembersListener(event) {
  const target = event.target.response;
  const data = JSON.parse(target);

  appData.members = data.members;

  if (isAllDataReady()) {
    initPageByHash();
  }
}

function initBoard() {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqBoardListener);
  oReq.open("GET", "assets/board.json");
  oReq.send();
}

function initMember() {
  const mReq = new XMLHttpRequest();
  mReq.addEventListener("load", reqMembersListener);
  mReq.open("GET", "assets/members.json");
  mReq.send();
}

/**
 * testing
 */
// function getListByTitle() {
//   const colArr = document.querySelectorAll('.column');
//   colArr.forEach((title) => {
//     const colTitle = title.querySelector('.list-name');
//     appData.lists.forEach((dataList, index) => {
//       let dataListTitle = dataList.title;
//       console.info(dataListTitle, index);
//       if (colTitle.textContent === dataListTitle) {
//         console.info(colTitle);
//       }
//     });
//   });
// }


initBoard();
initMember();

