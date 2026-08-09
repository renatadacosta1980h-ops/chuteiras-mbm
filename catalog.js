const MBM_CATALOG_KEY = 'mbm-shared-catalog-v1';

function prepareProduct(product, index) {
  return {
    ...product,
    id: Number(product.id) || index + 1,
    stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 5,
    active: product.active !== false,
    sizes: Array.isArray(product.sizes) ? product.sizes : [38, 39, 40, 41, 42, 43, 44]
  };
}

function getStoreProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(MBM_CATALOG_KEY));
    if (Array.isArray(stored)) return stored.map(prepareProduct);
  } catch (_) {}
  const initial = products.map(prepareProduct);
  localStorage.setItem(MBM_CATALOG_KEY, JSON.stringify(initial));
  return initial;
}

function saveStoreProducts(items) {
  localStorage.setItem(MBM_CATALOG_KEY, JSON.stringify(items.map(prepareProduct)));
  window.dispatchEvent(new Event('mbm-catalog-updated'));
}

function isProductAvailable(product) {
  return Boolean(product) && product.active !== false && Number(product.stock) > 0;
}
