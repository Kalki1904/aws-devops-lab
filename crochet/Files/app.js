// ============================================================
//  KNOTTED & LOVED — App Logic
// ============================================================

let cart = JSON.parse(localStorage.getItem('kl_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('kl_wishlist') || '[]');
let currentFilter = '';
let selectedColor = 'Terracotta';
let selectedSize = 'S';
let customBasePrice = 599;

// ── Initialise ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS);
  updateBadges();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    renderProducts(filtered);
  });

  // Customize form live preview
  document.querySelectorAll('input[name="itemType"]').forEach(r => {
    r.addEventListener('change', () => {
      customBasePrice = parseInt(r.dataset.base);
      document.getElementById('previewEmoji').textContent = r.dataset.emoji;
      document.getElementById('previewLabel').textContent = r.value.charAt(0).toUpperCase() + r.value.slice(1);
      document.getElementById('pItem').textContent = r.value.charAt(0).toUpperCase() + r.value.slice(1);
      updatePreviewPrice();
    });
  });

  // Default selected colour
  const firstDot = document.querySelector('.color-dot');
  if (firstDot) {
    document.getElementById('colorSwatch').style.background = firstDot.style.background;
    document.getElementById('pColor').textContent = firstDot.dataset.color;
  }
});

// ── Render Products ─────────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">No products found 😔 Try a different search!</div>`;
    return;
  }
  grid.innerHTML = list.map(p => productCard(p)).join('');
}

function productCard(p) {
  const inWish = wishlist.some(w => w.id === p.id);
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
  return `
  <div class="product-card" onclick="openProductModal(${p.id})">
    <div class="product-img-wrap">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/f5e6d3/8B5E3C?text=${encodeURIComponent(p.emoji)}'"/>
      ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
      ${discount ? `<span class="discount-badge">-${discount}%</span>` : ''}
      <button class="wish-btn ${inWish?'active':''}" onclick="toggleWishItem(event,${p.id})">
        <i class="fa${inWish?'s':'r'} fa-heart"></i>
      </button>
    </div>
    <div class="product-info">
      <h3 class="product-name">${p.emoji} ${p.name}</h3>
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span class="review-count">(${p.reviews})</span>
      </div>
      <div class="color-dots">
        ${p.colors.map(c=>`<span class="mini-dot" style="background:${c}"></span>`).join('')}
      </div>
      <div class="product-price">
        <span class="price">₹${p.price.toLocaleString()}</span>
        ${p.originalPrice ? `<span class="orig-price">₹${p.originalPrice.toLocaleString()}</span>` : ''}
      </div>
      <button class="btn btn-add" onclick="addToCart(event,${p.id})">Add to Bag</button>
    </div>
  </div>`;
}

// ── Filter & Sort ───────────────────────────────────────────
function filterProducts(cat) {
  currentFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.cat === cat);
  });
  const filtered = cat ? PRODUCTS.filter(p => p.category === cat) : PRODUCTS;
  renderProducts(filtered);
  document.getElementById('shop').scrollIntoView({behavior:'smooth'});
}

function sortProducts(val) {
  let list = currentFilter ? PRODUCTS.filter(p=>p.category===currentFilter) : [...PRODUCTS];
  if (val === 'price-asc') list.sort((a,b)=>a.price-b.price);
  else if (val === 'price-desc') list.sort((a,b)=>b.price-a.price);
  else if (val === 'popular') list.sort((a,b)=>b.reviews-a.reviews);
  renderProducts(list);
}

// ── Product Modal ───────────────────────────────────────────
function openProductModal(id) {
  const p = PRODUCTS.find(x=>x.id===id);
  if (!p) return;
  const inWish = wishlist.some(w=>w.id===id);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img-side">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/500x400/f5e6d3/8B5E3C?text=${encodeURIComponent(p.emoji)}'"/>
    </div>
    <div class="modal-info-side">
      <span class="modal-tag">${p.tag||''}</span>
      <h2>${p.emoji} ${p.name}</h2>
      <div class="modal-rating">★★★★★ <span>${p.rating} (${p.reviews} reviews)</span></div>
      <div class="modal-price">
        ₹${p.price.toLocaleString()}
        ${p.originalPrice?`<span class="orig-price">₹${p.originalPrice.toLocaleString()}</span>`:''}
      </div>
      <p class="modal-desc">${p.description}</p>
      <div class="modal-colors">
        <strong>Available Colors:</strong>
        <div class="color-row">${p.colors.map(c=>`<span class="color-dot" style="background:${c}"></span>`).join('')}</div>
      </div>
      <div class="modal-stock ${p.stock<5?'low':''}">
        ${p.stock<5?`⚠️ Only ${p.stock} left!`:`✅ In Stock (${p.stock} available)`}
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="addToCart(event,${p.id}); closeProductModal()">🛍️ Add to Bag</button>
        <button class="btn btn-outline ${inWish?'wished':''}" onclick="toggleWishItem(event,${p.id}); closeProductModal()">
          ${inWish?'❤️ Wishlisted':'🤍 Wishlist'}
        </button>
      </div>
      <a href="#customize" class="customize-link" onclick="closeProductModal()">✏️ Want this customized? Click here</a>
    </div>`;
  document.getElementById('productModal').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}

function closeProductModal(e) {
  if (e && e.target !== document.getElementById('productModal')) return;
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ── Cart ────────────────────────────────────────────────────
function addToCart(e, id) {
  e.stopPropagation();
  const p = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if (existing) existing.qty++;
  else cart.push({...p, qty:1});
  saveCart();
  showToast(`🧶 ${p.name} added to bag!`);
}

function toggleCart() {
  const s = document.getElementById('cartSidebar');
  const o = document.getElementById('overlay');
  const open = s.classList.toggle('open');
  o.classList.toggle('show', open);
  document.getElementById('wishlistSidebar').classList.remove('open');
  if (open) renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (!cart.length) {
    container.innerHTML = `<div class="empty-state">Your bag is empty 🧶<br/><a href="#shop" onclick="toggleCart()">Start shopping!</a></div>`;
    footer.innerHTML = '';
    return;
  }
  container.innerHTML = cart.map(item=>`
    <div class="cart-item">
      <div class="cart-item-img"><span style="font-size:2rem">${item.emoji}</span></div>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>₹${item.price.toLocaleString()}</span>
        <div class="qty-control">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fa fa-trash"></i></button>
    </div>`).join('');
  const total = cart.reduce((s,i)=>s+(i.price*i.qty),0);
  const count = cart.reduce((s,i)=>s+i.qty,0);
  footer.innerHTML = `
    <div class="cart-total">
      <span>Total (${count} items)</span>
      <strong>₹${total.toLocaleString()}</strong>
    </div>
    ${total>=999?'<div class="free-ship">🎉 You qualify for free shipping!</div>':'<div class="free-ship">Add ₹'+(999-total)+' more for free shipping</div>'}
    <button class="btn btn-primary full-width" onclick="checkout()">Proceed to Checkout →</button>
    <button class="btn btn-outline full-width" style="margin-top:.5rem" onclick="clearCart()">Clear Bag</button>`;
}

function changeQty(id, delta) {
  const item = cart.find(c=>c.id===id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c=>c.id!==id);
  saveCart();
  renderCart();
  showToast('Item removed from bag');
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function checkout() {
  showToast('🎉 Redirecting to checkout... (demo mode)');
  setTimeout(()=>showToast('Payment gateway integration coming soon!'), 2000);
}

function saveCart() {
  localStorage.setItem('kl_cart', JSON.stringify(cart));
  updateBadges();
}

// ── Wishlist ────────────────────────────────────────────────
function toggleWishItem(e, id) {
  e.stopPropagation();
  const p = PRODUCTS.find(x=>x.id===id);
  const idx = wishlist.findIndex(w=>w.id===id);
  if (idx>=0) { wishlist.splice(idx,1); showToast('Removed from wishlist'); }
  else { wishlist.push(p); showToast(`❤️ ${p.name} wishlisted!`); }
  localStorage.setItem('kl_wishlist', JSON.stringify(wishlist));
  updateBadges();
  renderProducts(currentFilter ? PRODUCTS.filter(p=>p.category===currentFilter) : PRODUCTS);
}

function toggleWishlist() {
  const s = document.getElementById('wishlistSidebar');
  const o = document.getElementById('overlay');
  const open = s.classList.toggle('open');
  o.classList.toggle('show', open);
  document.getElementById('cartSidebar').classList.remove('open');
  if (open) renderWishlist();
}

function renderWishlist() {
  const c = document.getElementById('wishlistItems');
  if (!wishlist.length) {
    c.innerHTML = `<div class="empty-state">No saved items yet ❤️<br/>Tap the heart on any product!</div>`;
    return;
  }
  c.innerHTML = wishlist.map(item=>`
    <div class="cart-item">
      <div class="cart-item-img"><span style="font-size:2rem">${item.emoji}</span></div>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>₹${item.price.toLocaleString()}</span>
        <button class="btn btn-add" style="margin-top:.4rem;padding:.3rem .8rem" onclick="addToCart(event,${item.id})">Add to Bag</button>
      </div>
      <button class="remove-btn" onclick="toggleWishItem(event,${item.id}); renderWishlist()"><i class="fa fa-times"></i></button>
    </div>`).join('');
}

function closeAll() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('wishlistSidebar').classList.remove('open');
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

function updateBadges() {
  document.getElementById('cartBadge').textContent = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('wishBadge').textContent = wishlist.length;
}

// ── Customize Form ──────────────────────────────────────────
function selectColor(el) {
  document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('selected'));
  el.classList.add('selected');
  selectedColor = el.dataset.color;
  document.getElementById('pColor').textContent = selectedColor;
  document.getElementById('colorSwatch').style.background = el.style.background;
}

function selectSize(el, size) {
  document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  selectedSize = size;
  document.getElementById('pSize').textContent = size;
  updatePreviewPrice();
}

function updatePreviewPrice() {
  const sizeExtra = {S:0, M:100, L:150, XL:200, Custom:350};
  const yarnEl = document.getElementById('yarnType');
  const yarnExtra = yarnEl ? ({cotton:0,wool:200,acrylic:0,'bamboo':150}[yarnEl.value]||0) : 0;
  const total = customBasePrice + (sizeExtra[selectedSize]||0) + yarnExtra;
  document.getElementById('pPrice').textContent = `₹${total.toLocaleString()}`;
}

function submitCustomOrder(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value;
  const contact = document.getElementById('custContact').value;
  const item = document.querySelector('input[name="itemType"]:checked');
  if (!item) { showToast('⚠️ Please select an item type!', 'error'); return; }
  showToast(`🧶 Custom order placed, ${name}! We'll contact you at ${contact} soon.`);
  e.target.reset();
  document.getElementById('previewEmoji').textContent = '🧸';
  document.getElementById('pItem').textContent = 'Not selected';
  document.getElementById('pColor').textContent = 'Not selected';
}

function submitSellerForm(e) {
  e.preventDefault();
  showToast('🌟 Application received! Our team will review and reach out within 48 hours.');
  e.target.reset();
}

function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('💌 You\'re subscribed! Welcome to the Knotted & Loved family!');
  e.target.reset();
}

// ── Mobile Menu ─────────────────────────────────────────────
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ── Toast ───────────────────────────────────────────────────
function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 3500);
}
