const basketCount = document.querySelector('#basket-count');
const buttons = document.querySelectorAll('.add-product');
let basket = [];

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    basket.push(button.dataset.product);
    basketCount.textContent = basket.length;
    button.classList.add('added');
    button.innerHTML = 'Added to basket <span>✓</span>';
    window.setTimeout(() => {
      button.classList.remove('added');
      button.innerHTML = 'Add another <span>+</span>';
    }, 1800);
  });
});
