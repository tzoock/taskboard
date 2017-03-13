const mainContent = document.getElementById('mainContent');

const appData = {
  lists: [],
  members: []
};

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
    const newList = {
      id: uuid.v4(),
      tasks: [],
      title: listName.textContent
    };
    appData.lists.push(newList);
    console.info(appData.lists);
  }

  if (list.type === undefined) {
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
  const target = event.target;
  const modal = target.closest('body').querySelector(".modal");
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

}

function addNewMember() {
  const memList = document.querySelector('.mem-list');
  const clickNewMember = document.createElement('li');
  clickNewMember.innerHTML = memberTemplate;
  clickNewMember.className = 'list-group-item member';
  clickNewMember.setAttribute('uuid', uuid.v4());
  memList.appendChild(clickNewMember);
clickNewMember.addEventListener('click', editMember);
}

function editMember() {
  const target = event.target;
  const currentLiElm = target.closest('.member');
  const memContent = currentLiElm.querySelector('.mem-content');
  const memInEdit = currentLiElm.querySelector('.mem-inEdit');
  const cancelEdit = currentLiElm.querySelector('.cancel-mem');
  const saveMemberBtn = currentLiElm.querySelector('.save-mem');
  
  saveMemberBtn.addEventListener('click', saveMember);
  
  //=====togglers====
  
  cancelEdit.addEventListener('click', (event) => {
    memContent.classList.toggle('hidden');
    memInEdit.classList.toggle('hidden');
  });
  
  memContent.classList.toggle('hidden');
  memInEdit.classList.toggle('hidden');

}

function saveMember() {
  console.info(event.target);
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
console.info(appData);
