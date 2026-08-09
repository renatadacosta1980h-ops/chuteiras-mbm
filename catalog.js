const MBM_CATALOG_KEY = 'mbm-shared-catalog-v2';
const MBM_LEGACY_CATALOG_KEY = 'mbm-shared-catalog-v1';
const NEW_NIKE_REFERENCE_IDS = new Set([4, 5, 6, 7]);

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
    const current = JSON.parse(localStorage.getItem(MBM_CATALOG_KEY));
    if (Array.isArray(current)) return current.map(prepareProduct);
    const previous = JSON.parse(localStorage.getItem(MBM_LEGACY_CATALOG_KEY));
    if (Array.isArray(previous)) {
      const legacyById = new Map(previous.map(product => [Number(product.id), product]));
      const migrated = products.map((product, index) => {
        const id = Number(product.id) || index + 1;
        const legacy = legacyById.get(id);
        return prepareProduct(NEW_NIKE_REFERENCE_IDS.has(id) || !legacy ? product : { ...product, ...legacy }, index);
      });
      localStorage.setItem(MBM_CATALOG_KEY, JSON.stringify(migrated));
      return migrated;
    }
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
