/**
 * Created by Tzoock on 3/19/2017.
 */


const appData = {
  lists: [],
  members: []
};

function reqBoardListener(event) {
  const target = event.target.response;

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

function isAllDataReady() {
  if (appData.lists.length && appData.members.length) {
    return true
  }
  else {
    return false
  }
}

function getLists() {
  return appData.lists
}

function addListToData(data) {
  return appData.lists.push(data)
}

function addTask(currntListId, cardId, emptyCardText, emptyCardMembers) {
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

function isMemberInTask(checkedMe, memberId, taskId) {
  getLists().forEach((list) => {
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
}

function getMembers() {
  return appData.members
}

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

function getListIndexInAppdataById(id) {
  let index = 0;
  appData.lists.forEach((list, i) => {
    if (list.id === id) {
      index = i;
    }
  });
  return index;
}

function getTaskIndexInListInAppdataById(listId, taskId) {
  let index = 0;
  appData.lists.forEach((list) => {
    if (list.id === listId) {
      list.tasks.forEach((task, i) => {
        if (task.id === taskId) {
          index = i;
        }
      });
    }
  });

  return index;
}

function movingTaskToAnotherList(newListIndex, oldListIndex, taskIndex) {

  appData.lists[newListIndex].tasks.push(appData.lists[oldListIndex].tasks[taskIndex]);
  appData.lists[oldListIndex].tasks.splice(taskIndex, 1);

  if (newListIndex === undefined) {
    appData.lists[oldListIndex].push(appData.lists[oldListIndex].tasks[taskIndex])
  }
}

function updateListNameInAppData(changedListTitle, preText) {
  appData.lists.forEach((list, index) => {
    if (list.title === preText) {
      appData.lists[index].title = changedListTitle
    }
  });
}

function updateTask() {
  const target = event.target;
  const modal = target.closest('.modal');
  const modalCardText = modal.querySelector('#edit-text');
  const moveTo = modal.querySelector('.list-checkbox');
  const membersList = modal.querySelector('.memlist');
  const taskId = modal.getAttribute('taskId');
  const listId = modal.getAttribute('listId');

  const arrayOfMoveToOption = moveTo.querySelectorAll('option');
  let newListIndex = 0;

  arrayOfMoveToOption.forEach((option) => {
    if (option.selected) {
      const moveToListId = option.getAttribute('listid');
      newListIndex = getListIndexInAppdataById(moveToListId);
    }
  });

  const taskIndex = getTaskIndexInListInAppdataById(listId, taskId);
  const oldListIndex = getListIndexInAppdataById(listId);

  appData.lists.forEach((list) => {
    if (list.id === listId) {
      list.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.text = modalCardText.value;
          const resultArr = [];
          const membersToArray = membersList.querySelectorAll('input');
          membersToArray.forEach((input) => {
            if (input.checked === true) {
              const memId = input.getAttribute('uuid');
              resultArr.push(memId);
            }
          });
          task.members = resultArr;
        }
      })
    }
  });

  if (newListIndex !== oldListIndex) {
    movingTaskToAnotherList(newListIndex, oldListIndex, taskIndex);
  }


  closeModal();
  initPageByHash()
}

function deleteTask() {
  const target = event.target;
  const taskId = target.closest('.modal').getAttribute('taskid');
  const listId = target.closest('.modal').getAttribute('listid');
  const taskIndex = getTaskIndexInListInAppdataById(listId, taskId);
  const listIndex = getListIndexInAppdataById(listId);
  appData.lists[listIndex].tasks.splice(taskIndex, 1);
  closeModal()
}

function deleteListInAppData(listStr) {
  appData.lists.forEach((item) => {
    let index = appData.lists.indexOf(item);
    if (listStr === item.title) {
      appData.lists.splice(index, 1)
    }
  })
}

/*
 // function getNameById(id) {
 //   let name = '';
 //   appData.members.forEach((member) => {
 //     if (id === member.id) {
 //       name = member.name
 //     }
 //   });
 //   return name
 // }
 // function getListById(id) {
 //   let i = -1;
 //   appData.lists.forEach((list, index) => {
 //     if (list.id === id) {
 //       i = index
 //     }
 //   });
 //   return i
 // }
 // function getListById(id) {
 //   let i = -1;
 //   appData.lists.forEach((list, index) => {
 //     if (list.id === id) {
 //       i = index
 //     }
 //   });
 //   return i
 // }
 */
