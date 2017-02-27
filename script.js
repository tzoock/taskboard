const wraper = document.getElementById('contflex');
const btn = document.getElementById('addList');
btn.addEventListener('click', addList);

function addList() {
  const newColumn = document.createElement('div');
  newColumn.innerHTML = `
    <header>List name</header>
    <div class="main-column">
      <ul class="cards-list">

      </ul>
    </div>
    <footer><button class="add-card">Add a Card</button></footer>`;
  newColumn.setAttribute('class', 'column');
  wraper.insertBefore(newColumn, btn);
  newCardBtn();
}



function newCardBtn() {
  let addCardBtn = document.querySelectorAll(".add-card");
  for (let i = 0; i < addCardBtn.length; i++) {
    addCardBtn[i].addEventListener("click", addCard)
  }
}
newCardBtn();

// addCardBtn[i].addEventListener("click", addCard(i));

function addCard() {

  const newLi = document.createElement('li');
  newLi.textContent = 'new card';
  const ul = event.target.parentNode.previousSibling.previousSibling;
const cardsList = ul.querySelector('.cards-list');
  console.log(cardsList);
  cardsList.appendChild(newLi);
}




