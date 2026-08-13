const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const CART_KEY = 'mbm-cart';
const SETTINGS_KEY = 'mbm-admin-settings';
const COUPONS_KEY = 'mbm-admin-coupons';
let catalogProducts = getStoreProducts();
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
let appliedCoupon = null;

const grid = document.querySelector('#product-grid');
const search = document.querySelector('#search');
const brandFilter = document.querySelector('#brand-filter');
const categoryFilter = document.querySelector('#category-filter');
const sort = document.querySelector('#sort');

function storeSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (_) { return {}; } }
function storeCoupons() { try { return JSON.parse(localStorage.getItem(COUPONS_KEY)) || []; } catch (_) { return []; } }
function isCouponValid(coupon) { if (!coupon || !coupon.active || !String(coupon.code || '').trim() || Number(coupon.discount) <= 0) return false; return !coupon.validity || new Date(`${coupon.validity}T23:59:59`).getTime() >= Date.now(); }
function cartSubtotal() { return cart.reduce((sum, item) => { const product = productById(item.id); return sum + (product ? Number(product.price) * item.quantity : 0); }, 0); }
function cartDiscount() { return appliedCoupon && isCouponValid(appliedCoupon) ? cartSubtotal() * Math.min(Math.max(Number(appliedCoupon.discount) || 0, 0), 100) / 100 : 0; }
function cartTotal() { return Math.max(0, cartSubtotal() - cartDiscount()); }
function productById(id) { return catalogProducts.find(product => product.id === id); }
function productPrice(product) { return Number(product.price) > 0 ? money.format(product.price) : 'Consulte o preço'; }
function productAction(product) { return Number(product.price) > 0 ? `<button class="button add" data-add="${product.id}">Adicionar <span>+</span></button>` : `<button class="button add" data-consult="${product.id}">Consultar pelo WhatsApp</button>`; }

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
    <div class="product-info"><p class="tag">${product.brand} · ${product.category}</p><h3>${product.name}</h3><p class="price">${productPrice(product)}</p><p class="stock-label">${product.stock} pares disponíveis</p>${productAction(product)}</div>
  </article>`).join('') || '<p class="empty">Nenhum modelo disponível com estes filtros.</p>';
}

function renderCart() {
  cart = cart.filter(item => isProductAvailable(productById(item.id)) && Number(productById(item.id).price) > 0);
  document.querySelector('#cart-count').textContent = cart.reduce((total, item) => total + item.quantity, 0);
  const items = document.querySelector('#cart-items');
  items.innerHTML = cart.length ? cart.map(item => { const product = productById(item.id); return `<article class="cart-item"><img src="${product.image}" alt=""><div><h3>${product.name}</h3><p>${productPrice(product)}</p><div class="quantity"><button data-quantity="${product.id}" data-step="-1">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-step="1">+</button><button class="remove" data-remove="${product.id}">Remover</button></div></div></article>`; }).join('') : '<p class="empty">Seu carrinho está vazio.</p>';
  if (!isCouponValid(appliedCoupon)) appliedCoupon = null;
  const discount = cartDiscount();
  const discountRow = document.querySelector('#coupon-discount');
  discountRow.hidden = !discount;
  discountRow.querySelector('strong').textContent = discount ? `- ${money.format(discount)} (${appliedCoupon.code})` : '';
  document.querySelector('#cart-total').textContent = money.format(cartTotal());
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function showStoreToast(text) { const toast = document.querySelector('#store-toast'); toast.textContent = text; toast.classList.add('show'); clearTimeout(window.mbmStoreToast); window.mbmStoreToast = setTimeout(() => toast.classList.remove('show'), 2800); }
function applyCoupon() { const input = document.querySelector('#coupon-code'); const code = input.value.trim().toUpperCase(); const coupon = storeCoupons().find(item => String(item.code || '').trim().toUpperCase() === code); if (!code || !isCouponValid(coupon)) { appliedCoupon = null; renderCart(); showStoreToast('Cupom inválido ou expirado.'); return; } appliedCoupon = coupon; input.value = coupon.code.toUpperCase(); renderCart(); showStoreToast(`Cupom ${coupon.code.toUpperCase()} aplicado: ${coupon.discount}% OFF.`); }
function addToCart(id) { const product = productById(id); if (!isProductAvailable(product) || Number(product.price) <= 0) return; const entry = cart.find(item => item.id === id); entry ? entry.quantity += 1 : cart.push({ id, quantity: 1 }); renderCart(); showStoreToast(`${product.name} foi adicionada ao carrinho.`); }
function changeQuantity(id, step) { const entry = cart.find(item => item.id === id); if (!entry) return; entry.quantity += step; if (entry.quantity <= 0) cart = cart.filter(item => item.id !== id); renderCart(); }
function configuredWhatsapp(settings) { const number = String(settings.whatsapp || '').replace(/\D/g, ''); return !number || number === '5500000000000' ? '5531983058097' : number; }
function consultProduct(id) { const product = productById(id); if (!product) return; const settings = storeSettings(); const whatsapp = configuredWhatsapp(settings); window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá, CHUTEIRAS MBM! Quero saber o preço da ${product.name}.`)}`, '_blank', 'noopener'); }

function showProduct(id) {
  const product = productById(id); if (!product || !isProductAvailable(product)) return;
  document.querySelector('#dialog-content').innerHTML = `<img class="dialog-image" src="${product.image}" alt="${product.name}"><div class="dialog-info"><p class="tag">${product.brand} · ${product.category}</p><h2>${product.name}</h2><p class="price">${productPrice(product)}</p><p>${product.description}</p><p class="stock-label">${product.stock} pares disponíveis</p><p class="sizes">${product.sizes.map(size => `<span>${size}</span>`).join('')}</p>${productAction(product)}</div>`;
  document.querySelector('#product-dialog').showModal();
}

function checkout() { if (!cart.length) return; const settings = storeSettings(); const whatsapp = configuredWhatsapp(settings); const payment = document.querySelector('#payment-method').value; const lines = cart.map(item => { const product = productById(item.id); const imageUrl = new URL(product.image, window.location.href).href; return `• Modelo: ${product.name}\n  Quantidade: ${item.quantity}\n  Valor: ${money.format(product.price * item.quantity)}\n  Imagem: ${imageUrl}`; }); const discount = cartDiscount(); const couponLine = discount ? `\nCupom: ${appliedCoupon.code.toUpperCase()} (${appliedCoupon.discount}% OFF)\nDesconto: - ${money.format(discount)}` : ''; const message = `Olá, CHUTEIRAS MBM! Quero finalizar este pedido:\n\n${lines.join('\n\n')}\n\nMétodo de pagamento: ${payment}\nSubtotal: ${money.format(cartSubtotal())}${couponLine}\nTotal do pedido: ${money.format(cartTotal())}`; window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener'); }

function syncStore() { catalogProducts = getStoreProducts(); refreshBrandFilter(); renderProducts(); renderCart(); const settings = storeSettings(); const whatsapp = configuredWhatsapp(settings); const message = settings.message || 'Olá, CHUTEIRAS MBM! Preciso de ajuda para escolher uma chuteira.'; document.querySelector('#whatsapp-float').href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`; }

document.addEventListener('click', event => { const add = Number(event.target.closest('[data-add]')?.dataset.add); if (add) addToCart(add); const consult = Number(event.target.closest('[data-consult]')?.dataset.consult); if (consult) consultProduct(consult); const product = Number(event.target.closest('[data-product]')?.dataset.product); if (product) showProduct(product); if (event.target.dataset.quantity) changeQuantity(Number(event.target.dataset.quantity), Number(event.target.dataset.step)); if (event.target.dataset.remove) { cart = cart.filter(item => item.id !== Number(event.target.dataset.remove)); renderCart(); } });
[search, brandFilter, categoryFilter, sort].forEach(element => element.addEventListener(element === search ? 'input' : 'change', renderProducts));
document.querySelectorAll('.mode-card').forEach(button => button.addEventListener('click', () => { categoryFilter.value = button.dataset.category; renderProducts(); document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' }); }));
const drawer = document.querySelector('#cart-drawer'); const overlay = document.querySelector('#overlay');
document.querySelector('#open-cart').onclick = () => { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); };
function closeCart() { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
document.querySelector('#close-cart').onclick = closeCart; overlay.onclick = closeCart; document.querySelector('#checkout').onclick = checkout; document.querySelector('#apply-coupon').onclick = applyCoupon; document.querySelector('#coupon-code').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); applyCoupon(); } });
document.querySelector('#close-dialog').onclick = () => document.querySelector('#product-dialog').close();
const menu = document.querySelector('.menu-toggle'); const nav = document.querySelector('nav'); menu.onclick = () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); };
window.addEventListener('storage', event => { if ([MBM_CATALOG_KEY, SETTINGS_KEY, COUPONS_KEY].includes(event.key)) syncStore(); }); window.addEventListener('focus', syncStore); syncStore();
