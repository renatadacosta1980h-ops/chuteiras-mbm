const KEYS = { orders: 'mbm-admin-orders', coupons: 'mbm-admin-coupons', settings: 'mbm-admin-settings', session: 'mbm-admin-session' };
const moneyAdmin = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const get = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
const put = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let catalog = getStoreProducts();
let orders = get(KEYS.orders, []);
let coupons = get(KEYS.coupons, []);
let settings = get(KEYS.settings, { storeName: 'CHUTEIRAS MBM', whatsapp: '5531983058097', message: 'Olá! Quero saber mais sobre uma chuteira.' });

function save() { saveStoreProducts(catalog); put(KEYS.orders, orders); put(KEYS.coupons, coupons); put(KEYS.settings, settings); }
function notice(text) { const toast = $('#toast'); toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); }
function statusClass(status) { return status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '-'); }
function availability(product) { return Number(product.stock) <= 0 ? 'Esgotado' : product.active === false ? 'Pausado' : 'Ativo'; }

function renderDashboard() {
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  $('#metric-revenue').textContent = moneyAdmin.format(revenue);
  $('#metric-orders').textContent = orders.filter(order => order.status !== 'Enviado').length;
  $('#metric-products').textContent = catalog.filter(isProductAvailable).length;
  $('#metric-stock').textContent = catalog.filter(product => Number(product.stock) > 0 && Number(product.stock) < 4).length;
  $('#recent-orders').innerHTML = orders.slice(0, 4).map(order => `<div class="mini-order"><div><strong>${order.id}</strong><span>${order.customer} · ${order.items} item(ns)</span></div><div><b>${moneyAdmin.format(order.total)}</b><em class="status ${statusClass(order.status)}">${order.status}</em></div></div>`).join('') || '<p class="empty">Ainda não há pedidos cadastrados.</p>';
}

function renderProducts() {
  const term = $('#admin-product-search').value.toLowerCase();
  const list = catalog.filter(product => `${product.name} ${product.brand}`.toLowerCase().includes(term));
  $('#admin-product-count').textContent = `${list.length} produtos`;
  $('#admin-products-table').innerHTML = list.map(product => `<tr>
    <td><div class="table-product"><img src="${product.image}" alt=""><strong>${product.name}</strong></div></td>
    <td>${product.brand}</td><td>${product.category}</td><td>${moneyAdmin.format(product.price)}</td>
    <td class="${Number(product.stock) < 4 ? 'low-stock' : ''}">${product.stock} pares</td>
    <td><span class="status ${availability(product) === 'Ativo' ? 'active-status' : 'inactive'}">${availability(product)}</span></td>
    <td><div class="table-actions"><button class="icon-button" data-edit="${product.id}">Editar</button><button class="icon-button" data-toggle="${product.id}">${product.active === false ? 'Ativar' : 'Pausar'}</button><button class="icon-button" data-soldout="${product.id}">Esgotada</button><button class="icon-button danger" data-delete="${product.id}">Remover</button></div></td>
  </tr>`).join('') || '<tr><td colspan="7" class="empty">Nenhum produto encontrado.</td></tr>';
}

function renderOrders() { $('#orders-table').innerHTML = orders.map((order, index) => `<tr><td><strong>${order.id}</strong></td><td>${order.customer}</td><td>${order.items} item(ns)</td><td>${moneyAdmin.format(order.total)}</td><td><select class="order-status" data-order="${index}"><option ${order.status === 'Novo' ? 'selected' : ''}>Novo</option><option ${order.status === 'Em separação' ? 'selected' : ''}>Em separação</option><option ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option><option ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option></select></td><td>${order.date}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Ainda não há pedidos cadastrados.</td></tr>'; }
function renderCustomers() { const customers = [...new Map(orders.map(order => [order.customer, order])).values()]; $('#customers-grid').innerHTML = customers.map((customer, index) => `<article class="customer-card"><span>${customer.customer[0]}</span><div><h3>${customer.customer}</h3><p>${index + 1} pedido${index ? 's' : ''} · Último: ${customer.date}</p><strong>${moneyAdmin.format(customer.total)}</strong></div></article>`).join('') || '<p class="empty">Ainda não há clientes cadastrados.</p>'; }
function renderCoupons() { $('#coupons-grid').innerHTML = coupons.map((coupon, index) => `<article class="coupon-card"><p>${coupon.active ? 'ATIVO' : 'PAUSADO'}</p><h3>${coupon.code}</h3><strong>${coupon.discount}% OFF</strong><span>Válido até ${new Date(coupon.validity + 'T12:00:00').toLocaleDateString('pt-BR')}</span><button data-coupon="${index}">${coupon.active ? 'Pausar' : 'Ativar'}</button></article>`).join(''); }
function render() { renderDashboard(); renderProducts(); renderOrders(); renderCustomers(); renderCoupons(); }

function switchView(view) { $$('.admin-nav button').forEach(button => button.classList.toggle('active', button.dataset.view === view)); $$('.admin-view').forEach(section => section.classList.toggle('active', section.id === `view-${view}`)); $('#admin-title').textContent = { dashboard: 'Visão geral', products: 'Produtos', orders: 'Pedidos', customers: 'Clientes', coupons: 'Cupons', settings: 'Configurações' }[view]; window.scrollTo({ top: 0, behavior: 'smooth' }); }
function openProduct(id) {
  const product = catalog.find(item => item.id === id);
  $('#product-form-wrap').hidden = false; $('#product-form').reset();
  if (product) { $('#product-id').value = product.id; $('#product-name').value = product.name; $('#product-brand').value = product.brand; $('#product-category').value = product.category; $('#product-price').value = product.price; $('#product-stock').value = product.stock; $('#product-image').value = product.image; $('#product-description').value = product.description; }
  else { $('#product-stock').value = 5; }
  $('#product-name').focus();
}

function syncCatalog() { catalog = getStoreProducts(); render(); }
function start() {
  if (!settings.whatsapp || settings.whatsapp === '5500000000000') { settings.whatsapp = '5531983058097'; put(KEYS.settings, settings); }
  if (localStorage.getItem(KEYS.session) === 'true') { $('#admin-login').hidden = true; $('#admin-app').hidden = false; }
  $('#setting-store-name').value = settings.storeName; $('#setting-whatsapp').value = settings.whatsapp; $('#setting-message').value = settings.message;
  $('#new-order').hidden = true;
  render();
}

$('#login-form').onsubmit = event => { event.preventDefault(); if ($('#admin-email').value === 'admin@chuteirasmbm.com' && $('#admin-password').value === 'mbm2026') { localStorage.setItem(KEYS.session, 'true'); $('#admin-login').hidden = true; $('#admin-app').hidden = false; notice('Bem-vinda ao painel MBM.'); } else notice('E-mail ou senha inválidos.'); };
$('#logout').onclick = () => { localStorage.removeItem(KEYS.session); location.reload(); };
$$('.admin-nav button').forEach(button => button.onclick = () => switchView(button.dataset.view));
$$('[data-go]').forEach(button => button.onclick = () => switchView(button.dataset.go));
$('#open-product-form').onclick = () => openProduct(); $('#cancel-product').onclick = () => $('#product-form-wrap').hidden = true; $('#admin-product-search').oninput = renderProducts;

$('#product-form').onsubmit = event => {
  event.preventDefault(); const id = Number($('#product-id').value); const old = catalog.find(product => product.id === id);
  const item = { id: id || Date.now(), name: $('#product-name').value.trim(), brand: $('#product-brand').value, category: $('#product-category').value, price: Number($('#product-price').value), stock: Number($('#product-stock').value), image: $('#product-image').value.trim(), description: $('#product-description').value.trim() || 'Produto original. Consulte disponibilidade e tamanhos com a CHUTEIRAS MBM.', sizes: old?.sizes || [38, 39, 40, 41, 42, 43, 44], active: old?.active ?? true };
  catalog = id ? catalog.map(product => product.id === id ? item : product) : [item, ...catalog]; save(); $('#product-form-wrap').hidden = true; render(); notice('Produto salvo e vitrine atualizada.');
};

$('#admin-products-table').onclick = event => {
  const id = Number(event.target.dataset.edit || event.target.dataset.toggle || event.target.dataset.soldout || event.target.dataset.delete); if (!id) return;
  if (event.target.dataset.edit) return openProduct(id);
  if (event.target.dataset.toggle) { catalog = catalog.map(product => product.id === id ? { ...product, active: !product.active } : product); save(); render(); notice('Disponibilidade atualizada na vitrine.'); return; }
  if (event.target.dataset.soldout) { catalog = catalog.map(product => product.id === id ? { ...product, stock: 0 } : product); save(); render(); notice('Produto marcado como esgotado.'); return; }
  if (event.target.dataset.delete && window.confirm('Remover este produto do site?')) { catalog = catalog.filter(product => product.id !== id); save(); render(); notice('Produto removido da vitrine.'); }
};
$('#orders-table').onchange = event => { const index = Number(event.target.dataset.order); if (Number.isInteger(index)) { orders[index].status = event.target.value; save(); render(); notice('Status do pedido atualizado.'); } };
$('#open-coupon-form').onclick = () => $('#coupon-form-wrap').hidden = false;
$('#coupon-form').onsubmit = event => { event.preventDefault(); coupons.unshift({ code: $('#coupon-code').value.trim().toUpperCase(), discount: Number($('#coupon-discount').value), validity: $('#coupon-validity').value, active: true }); save(); $('#coupon-form-wrap').hidden = true; event.target.reset(); renderCoupons(); notice('Cupom criado.'); };
$('#coupons-grid').onclick = event => { const index = Number(event.target.dataset.coupon); if (Number.isInteger(index)) { coupons[index].active = !coupons[index].active; save(); renderCoupons(); notice('Cupom atualizado.'); } };
$('#settings-form').onsubmit = event => { event.preventDefault(); settings = { storeName: $('#setting-store-name').value.trim(), whatsapp: $('#setting-whatsapp').value.replace(/\D/g, ''), message: $('#setting-message').value.trim() }; save(); notice('Configurações salvas.'); };
window.addEventListener('storage', event => { if (event.key === MBM_CATALOG_KEY) syncCatalog(); });
start();
