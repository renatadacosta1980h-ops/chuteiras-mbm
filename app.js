const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const CART_KEY = 'mbm-cart';
const SETTINGS_KEY = 'mbm-admin-settings';
let catalogProducts = getStoreProducts();
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

const grid = document.querySelector('#product-grid');
const search = document.querySelector('#search');
const brandFilter = document.querySelector('#brand-filter');
const categoryFilter = document.querySelector('#category-filter');
const sort = document.querySelector('#sort');

function storeSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (_) { return {}; }
}

function productById(id) { return catalogProducts.find(product => product.id === id); }

function refreshBrandFilter() {
  const chosen = brandFilter.value;
  const brands = [...new Set(catalogProducts.map(product => product.brand))].sort();
  brandFilter.innerHTML = `<option value="Todas">Todas as marcas</option>${brands.map(brand => `<option value="${brand}">${brand}</option>`).join('')}`;
  brandFilter.value = brands.includes(chosen) ? chosen : 'Todas';
}

function filteredProducts() {
  const term = search.value.trim().toLowerCase();
  const result = catalogProducts.filter(product => isProductAvailable(product) &&
    (brandFilter.value === 'Todas' || product.brand === brandFilter.value) &&
    (categoryFilter.value === 'Todas' || product.category === categoryFilter.value) &&
    `${product.name} ${product.brand}`.toLowerCase().includes(term));
  return result.sort((a, b) => sort.value === 'low' ? a.price - b.price : sort.value === 'high' ? b.price - a.price : a.id - b.id);
}

function renderProducts() {
  const list = filteredProducts();
  document.querySelector('#result-count').textContent = `${list.length} ${list.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}`;
  grid.innerHTML = list.map(product => `<article class="product-card">
    <button class="image-button" data-product="${product.id}" aria-label="Ver ${product.name}"><img src="${product.image}" alt="${product.name}"></button>
    <div class="product-info"><p class="tag">${product.brand} · ${product.category}</p><h3>${product.name}</h3><p class="price">${money.format(product.price)}</p><p class="stock-label">${product.stock} pares disponíveis</p><button class="button add" data-add="${product.id}">Adicionar <span>+</span></button></div>
  </article>`).join('') || '<p class="empty">Nenhum modelo disponível com estes filtros.</p>';
}

function renderCart() {
  cart = cart.filter(item => isProductAvailable(productById(item.id)));
  document.querySelector('#cart-count').textContent = cart.reduce((total, item) => total + item.quantity, 0);
  const items = document.querySelector('#cart-items');
  items.innerHTML = cart.length ? cart.map(item => {
    const product = productById(item.id);
    return `<article class="cart-item"><img src="${product.image}" alt=""><div><h3>${product.name}</h3><p>${money.format(product.price)}</p><div class="quantity"><button data-quantity="${product.id}" data-step="-1">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-step="1">+</button><button class="remove" data-remove="${product.id}">Remover</button></div></div></article>`;
  }).join('') : '<p class="empty">Seu carrinho está vazio.</p>';
  document.querySelector('#cart-total').textContent = money.format(cart.reduce((sum, item) => sum + productById(item.id).price * item.quantity, 0));
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const product = productById(id);
  if (!isProductAvailable(product)) return;
  const entry = cart.find(item => item.id === id);
  entry ? entry.quantity += 1 : cart.push({ id, quantity: 1 });
  renderCart();
}

function changeQuantity(id, step) {
  const entry = cart.find(item => item.id === id);
  if (!entry) return;
  entry.quantity += step;
  if (entry.quantity <= 0) cart = cart.filter(item => item.id !== id);
  renderCart();
}

function showProduct(id) {
  const product = productById(id);
  if (!product || !isProductAvailable(product)) return;
  document.querySelector('#dialog-content').innerHTML = `<img class="dialog-image" src="${product.image}" alt="${product.name}"><div class="dialog-info"><p class="tag">${product.brand} · ${product.category}</p><h2>${product.name}</h2><p class="price">${money.format(product.price)}</p><p>${product.description}</p><p class="stock-label">${product.stock} pares disponíveis</p><p class="sizes">${product.sizes.map(size => `<span>${size}</span>`).join('')}</p><button class="button primary" data-add="${product.id}">Adicionar ao carrinho</button></div>`;
  document.querySelector('#product-dialog').showModal();
}

function checkout() {
  if (!cart.length) return;
  const settings = storeSettings();
  const whatsapp = settings.whatsapp || '5500000000000';
  const lines = cart.map(item => { const product = productById(item.id); return `• ${product.name} (${item.quantity}x) — ${money.format(product.price * item.quantity)}`; });
  const total = cart.reduce((sum, item) => sum + productById(item.id).price * item.quantity, 0);
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá, CHUTEIRAS MBM! Quero fazer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${money.format(total)}`)}`, '_blank', 'noopener');
}

function syncStore() {
  catalogProducts = getStoreProducts();
  refreshBrandFilter();
  renderProducts();
  renderCart();
  const settings = storeSettings();
  const whatsapp = settings.whatsapp || '5500000000000';
  const message = settings.message || 'Olá, CHUTEIRAS MBM! Preciso de ajuda para escolher uma chuteira.';
  document.querySelector('#whatsapp-float').href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

document.addEventListener('click', event => {
  const add = Number(event.target.closest('[data-add]')?.dataset.add); if (add) addToCart(add);
  const product = Number(event.target.closest('[data-product]')?.dataset.product); if (product) showProduct(product);
  if (event.target.dataset.quantity) changeQuantity(Number(event.target.dataset.quantity), Number(event.target.dataset.step));
  if (event.target.dataset.remove) { cart = cart.filter(item => item.id !== Number(event.target.dataset.remove)); renderCart(); }
});
[search, brandFilter, categoryFilter, sort].forEach(element => element.addEventListener(element === search ? 'input' : 'change', renderProducts));
document.querySelectorAll('.mode-card').forEach(button => button.addEventListener('click', () => { categoryFilter.value = button.dataset.category; renderProducts(); document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' }); }));
const drawer = document.querySelector('#cart-drawer'); const overlay = document.querySelector('#overlay');
document.querySelector('#open-cart').onclick = () => { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); };
function closeCart() { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
document.querySelector('#close-cart').onclick = closeCart; overlay.onclick = closeCart; document.querySelector('#checkout').onclick = checkout;
document.querySelector('#close-dialog').onclick = () => document.querySelector('#product-dialog').close();
const menu = document.querySelector('.menu-toggle'); const nav = document.querySelector('nav');
menu.onclick = () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); };
window.addEventListener('storage', event => { if ([MBM_CATALOG_KEY, SETTINGS_KEY].includes(event.key)) syncStore(); });
window.addEventListener('focus', syncStore);
syncStore();
