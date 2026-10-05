function renderCart() {
  let cart = JSON.parse(localStorage.getItem('kirana_cart') || '[]');
  let list = document.getElementById('cartItemsList');
  if(!cart.length) { list.innerHTML = '<p>Cart is empty.</p>'; return; }
  let total = 0;
  list.innerHTML = cart.map(i => { total += i.price; return `<div>${i.name} - ₹${i.price}</div>`; }).join('');
  document.getElementById('orderTotal').innerText = 'Total: ₹' + total;
}
function processOrderCheckout() {
  if(!document.getElementById('orderConfirmCheck').checked) return alert('Please check the verification box.');
  alert('Order placed successfully!');
  localStorage.removeItem('kirana_cart');
  window.location.href = 'index.html';
}
renderCart();
