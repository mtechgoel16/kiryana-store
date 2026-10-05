let activeCatalog = [
  { id: 1, batch_id: 1, name: 'Madhur Pure Sugar', category: 'Grains & Staples', is_loose: true, selling_price: 44, mrp: 48, base_unit: 'kg', current_stock: 12 },
  { id: 2, batch_id: 2, name: 'Parle-G Biscuit 100g', category: 'Snacks', is_loose: false, selling_price: 10, mrp: 10, base_unit: 'packet', current_stock: 45 },
  { id: 3, batch_id: 3, name: 'Harvest Gold Bread 400g', category: 'Daily Fresh', is_loose: false, is_short_shelf_life: true, selling_price: 40, mrp: 40, base_unit: 'packet', current_stock: 14 },
  { id: 4, batch_id: 4, name: 'Aashirvaad Atta 10kg', category: 'Grains & Staples', is_loose: false, selling_price: 410, mrp: 440, base_unit: 'packet', current_stock: 32 }
];

function loadCatalog() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  const filtered = activeCatalog.filter(p => {
    return (!search || p.name.toLowerCase().includes(search)) && (!cat || p.category === cat);
  });
  const grid = document.getElementById('productGrid');
  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div>
        ${p.is_loose ? '<span class="tag-loose">Loose Item</span>' : ''}
        ${p.is_short_shelf_life ? '<span class="tag-fresh">7-Day Fresh</span>' : ''}
        <h3>${p.name}</h3>
        <p class="selling-price">₹${p.selling_price} <span style="font-size:0.8rem; color:#64748b;">/ ${p.base_unit}</span></p>
        <p style="font-size:0.85rem;">Stock: ${p.current_stock} ${p.base_unit}</p>
      </div>
      <button class="btn-primary" style="margin-top:10px;" onclick="addToCartItem('${p.name}', ${p.selling_price})">Add to Cart</button>
    </div>
  `).join('');
}

function addToCartItem(name, price) {
  let cart = JSON.parse(localStorage.getItem('kirana_cart') || '[]');
  cart.push({ name, price, quantity: 1 });
  localStorage.setItem('kirana_cart', JSON.stringify(cart));
  alert(name + ' added to cart!');
  document.getElementById('cartCount').innerText = cart.length;
}
loadCatalog();
