/**
 * HAPPY BIRTHDAY KENEI - E-COMMERCE ENGINE & INTERACTIVE EXPERIENCE
 * Pure Vanilla JavaScript: Reactive Cart, Wishlist, Custom Confetti, Web Audio Chimes,
 * Dynamic Catalog Filtering, Guestbook, and Multi-Step Checkout.
 */

// ==========================================
// 1. PRODUCTS DATASET
// ==========================================
const PRODUCTS = [
  {
    id: 1,
    name: "Memory 1",
    price: 89.00,
    originalPrice: 110.00,
    rating: 5.0,
    reviews: 142,
    badge: "Memory #1",
    image: "assets/images/product-cake.jpg"
  },
  {
    id: 2,
    name: "Memory 2",
    price: 125.00,
    originalPrice: 160.00,
    rating: 4.9,
    reviews: 98,
    badge: "Memory #2",
    image: "assets/images/product-hamper.jpg"
  },
  {
    id: 3,
    name: "Memory 3",
    price: 48.00,
    originalPrice: 65.00,
    rating: 4.8,
    reviews: 85,
    badge: "Memory #3",
    image: "assets/images/product-balloons.jpg"
  },
  {
    id: 4,
    name: "Memory 4",
    price: 78.00,
    originalPrice: 95.00,
    rating: 5.0,
    reviews: 64,
    badge: "Memory #4",
    image: "assets/images/product-keepsake.jpg"
  }
];

// ==========================================
// 2. APPLICATION STATE
// ==========================================
const state = {
  cart: JSON.parse(localStorage.getItem('hbk_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('hbk_wishlist') || '[]'),
  appliedPromo: null,
  searchQuery: '',
  isAudioEnabled: false
};

// ==========================================
// 3. AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================
class CelebrationAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime() {
    try {
      this.init();
      if (!this.ctx) return;

      // Pentatonic Arpeggio frequencies: C5, E5, G5, A5, C6
      const notes = [523.25, 659.25, 783.99, 880.00, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch (e) {
      console.warn("Audio playback not allowed without user interaction.", e);
    }
  }

  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }
}

const audioPlayer = new CelebrationAudio();

// ==========================================
// 4. CONFETTI CANVAS ENGINE
// ==========================================
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 70) {
    const colors = ['#ff85a2', '#ffb6c1', '#ffa8bd', '#ffccd5', '#ffffff', '#f5c469', '#d8315b', '#ffeef2'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 80,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  rain() {
    // Blast from both corners for grand celebration
    this.burst(window.innerWidth * 0.2, window.innerHeight * 0.4, 60);
    this.burst(window.innerWidth * 0.8, window.innerHeight * 0.4, 60);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotSpeed;
      p.life++;
      p.opacity = Math.max(0, 1 - p.life / p.maxLife);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();

      if (p.life >= p.maxLife || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

const confetti = new ConfettiEngine('confetti-canvas');

// ==========================================
// 5. TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3200);
}


// ==========================================
// 7. CATALOG RENDERING & SEARCH
// ==========================================
function getFilteredProducts() {
  return PRODUCTS.filter(product => {
    if (!state.searchQuery) return true;
    const query = state.searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query);
  });
}

function renderCatalog() {
  const grid = document.getElementById('products-grid');
  const noResults = document.getElementById('no-results');
  const countBadge = document.getElementById('results-count');
  if (!grid || !countBadge) return;
  const filtered = getFilteredProducts();

  countBadge.textContent = filtered.length === PRODUCTS.length 
    ? `Showing all ${PRODUCTS.length} memories` 
    : `Showing ${filtered.length} of ${PRODUCTS.length} memories`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  grid.innerHTML = filtered.map(item => {
    const isFav = state.wishlist.includes(item.id);
    return `
      <article class="product-card" data-id="${item.id}">
        <div class="product-image-wrap">
          <span class="product-badge">${item.badge}</span>
          <button class="favorite-btn ${isFav ? 'favorited' : ''}" 
                  data-action="toggle-wishlist" 
                  data-id="${item.id}"
                  title="${isFav ? 'Remove from Wishlist' : 'Save to Wishlist'}" 
                  aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy">
        </div>
        <div class="product-body">
          <h3 class="product-title">${item.name}</h3>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="review-count">(${item.reviews})</span>
          </div>
          <div class="product-footer">
            <div class="price-box">
              <span class="current-price">Priceless</span>
            </div>
            <button class="add-cart-btn" data-action="add-to-cart" data-id="${item.id}">
              <span>Add to Cart</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================
// 8. CART & WISHLIST LOGIC
// ==========================================
function saveCart() {
  localStorage.setItem('hbk_cart', JSON.stringify(state.cart));
  updateHeaderBadges();
  renderCartDrawer();
}

function saveWishlist() {
  localStorage.setItem('hbk_wishlist', JSON.stringify(state.wishlist));
  updateHeaderBadges();
  renderWishlistDrawer();
}

function addToCart(productId, qty = 1, customNote = '') {
  const item = PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const existing = state.cart.find(c => c.id === productId);
  if (existing) {
    existing.quantity += qty;
    if (customNote) existing.note = customNote;
  } else {
    state.cart.push({
      id: productId,
      quantity: qty,
      note: customNote
    });
  }

  saveCart();
  audioPlayer.playPop();
  confetti.burst(window.innerWidth - 80, 80, 25);
  showToast(`Added "${item.name}" to celebration cart!`, '🎁');
}

function updateCartQty(productId, delta) {
  const existing = state.cart.find(c => c.id === productId);
  if (!existing) return;

  existing.quantity += delta;
  if (existing.quantity <= 0) {
    state.cart = state.cart.filter(c => c.id !== productId);
    showToast('Item removed from cart.', '🗑️');
  }
  saveCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(c => c.id !== productId);
  saveCart();
  showToast('Item removed from cart.', '🗑️');
}

function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);

  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`Removed from saved favorites.`, '🤍');
  } else {
    state.wishlist.push(productId);
    confetti.burst(window.innerWidth - 120, 80, 20);
    showToast(`Saved "${product ? product.name : 'Gift'}" to Wishlist!`, '💖');
  }

  saveWishlist();
  renderCatalog();
}

function updateHeaderBadges() {
  const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const cartTotalPill = document.getElementById('header-cart-total');

  if (cartBadge) cartBadge.textContent = totalCartCount;
  if (wishlistBadge) wishlistBadge.textContent = state.wishlist.length;

  if (cartTotalPill) {
    cartTotalPill.textContent = totalCartCount > 0 ? 'Priceless' : '$0.00';
  }
}

// Calculate totals with promo discount
function getCartFinancials() {
  return { subtotal: 0, discount: 0, shipping: 0, grandTotal: 0 };
}

function renderCartDrawer() {
  const listEl = document.getElementById('cart-items-list');
  const countEl = document.getElementById('cart-items-count');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');
  const progressText = document.getElementById('shipping-progress-text');
  const progressFill = document.getElementById('shipping-progress-fill');
  const checkoutTotalDisplay = document.getElementById('checkout-total-display');
  if (!listEl || !countEl || !subtotalEl || !totalEl) return;

  const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);

  countEl.textContent = totalCount;
  subtotalEl.textContent = 'Priceless';
  totalEl.textContent = 'Priceless';
  if (checkoutTotalDisplay) {
    checkoutTotalDisplay.textContent = 'Priceless';
  }

  // Free celebration delivery status
  if (progressText && progressFill) {
    progressText.innerHTML = `🎉 Every birthday gift for Kenei is 100% <strong>Priceless & Free</strong>!`;
    progressFill.style.width = '100%';
  }
  if (shippingEl) {
    shippingEl.textContent = 'Free';
  }
  if (discountRow) {
    discountRow.style.display = 'none';
  }

  // Render items list
  if (state.cart.length === 0) {
    listEl.innerHTML = `
      <div class="drawer-empty-state">
        <div class="empty-icon">🎂</div>
        <h4>Your Birthday Cart is Empty</h4>
        <p>Explore our celebration memories to celebrate Kenei!</p>
        <button class="btn btn-primary btn-sm mt-3" onclick="closeDrawer('cart-drawer'); document.getElementById('catalog-section').scrollIntoView();">
          Browse Memories
        </button>
      </div>
    `;
    return;
  }

  listEl.innerHTML = state.cart.map(cartItem => {
    const product = PRODUCTS.find(p => p.id === cartItem.id);
    if (!product) return '';

    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${product.name}</h4>
          <div class="cart-item-price">Priceless &bull; Qty: ${cartItem.quantity}</div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" data-action="cart-qty" data-id="${product.id}" data-delta="-1" aria-label="Decrease quantity">&minus;</button>
              <span class="qty-val">${cartItem.quantity}</span>
              <button class="qty-btn" data-action="cart-qty" data-id="${product.id}" data-delta="1" aria-label="Increase quantity">&plus;</button>
            </div>
            <button class="cart-item-remove" data-action="cart-remove" data-id="${product.id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderWishlistDrawer() {
  const container = document.getElementById('wishlist-items-container');
  const countTitle = document.getElementById('wishlist-count-title');
  const footer = document.getElementById('wishlist-footer');
  if (!container || !countTitle) return;

  countTitle.textContent = state.wishlist.length;

  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div class="drawer-empty-state">
        <div class="empty-icon">💖</div>
        <h4>No Saved Favorites Yet</h4>
        <p>Click the heart icon on any birthday memory to save it for later!</p>
      </div>
    `;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';

  container.innerHTML = state.wishlist.map(favId => {
    const product = PRODUCTS.find(p => p.id === favId);
    if (!product) return '';

    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${product.name}</h4>
          <div class="cart-item-price">Priceless</div>
          <div class="cart-item-controls">
            <button class="btn btn-primary btn-sm" data-action="wishlist-to-cart" data-id="${product.id}">Add to Cart</button>
            <button class="cart-item-remove" data-action="wishlist-remove" data-id="${product.id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 9. QUICK VIEW MODAL
// ==========================================
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const content = document.getElementById('quickview-content');

  content.innerHTML = `
    <div class="quickview-gallery">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="quickview-details">
      <span class="quickview-badge">${product.badge}</span>
      <h2 class="quickview-title">${product.name}</h2>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span class="review-count">(${product.reviews} celebration reviews)</span>
      </div>
      <div class="quickview-price">Priceless</div>

      <div class="quickview-actions">
        <div class="qty-stepper">
          <button class="qty-btn" id="qv-minus">&minus;</button>
          <span class="qty-val" id="qv-qty">1</span>
          <button class="qty-btn" id="qv-plus">&plus;</button>
        </div>
        <button class="btn btn-primary flex-1" id="qv-add-btn">
          <span>Add to Birthday Cart</span>
        </button>
      </div>
    </div>
  `;

  // Wire up quantity in modal
  let qvQty = 1;
  const qtyValEl = document.getElementById('qv-qty');
  document.getElementById('qv-minus').addEventListener('click', () => {
    if (qvQty > 1) {
      qvQty--;
      qtyValEl.textContent = qvQty;
    }
  });
  document.getElementById('qv-plus').addEventListener('click', () => {
    qvQty++;
    qtyValEl.textContent = qvQty;
  });

  document.getElementById('qv-add-btn').addEventListener('click', () => {
    addToCart(product.id, qvQty);
    closeModal('quickview-modal');
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}


// ==========================================
// 11. CHECKOUT LOGIC & ORDER CONFIRMATION
// ==========================================
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty! Add a gift first.', '⚠️');
    return;
  }
  closeDrawer('cart-drawer');

  const modal = document.getElementById('checkout-modal');
  const step1 = document.getElementById('checkout-step-1');
  const stepSuccess = document.getElementById('checkout-step-success');

  step1.style.display = 'block';
  stepSuccess.style.display = 'none';

  // Set default delivery date tomorrow
  const dateInput = document.getElementById('delivery-date');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.value = tomorrow.toISOString().split('T')[0];

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const step1 = document.getElementById('checkout-step-1');
  const stepSuccess = document.getElementById('checkout-step-success');
  const recipientInput = document.getElementById('cust-name');
  const deliveryDateInput = document.getElementById('delivery-date');

  // Populate receipt details
  const randomId = Math.floor(1000 + Math.random() * 9000);
  document.getElementById('receipt-order-id').textContent = `#HBK-2026-${randomId}`;
  document.getElementById('receipt-recipient').textContent = recipientInput.value || 'Kenei';
  document.getElementById('receipt-date').textContent = deliveryDateInput.value;
  document.getElementById('receipt-total').textContent = 'Priceless ✨';

  step1.style.display = 'none';
  stepSuccess.style.display = 'block';

  // Celebration Fireworks
  confetti.rain();
  audioPlayer.playChime();

  // Clear cart
  state.cart = [];
  saveCart();
}

// ==========================================
// 12. DRAWERS & MODALS CONTROLLER
// ==========================================
function openDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ==========================================
// 13. GLOBAL EVENT LISTENERS & SETUP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Render Catalog, Cart & Wishlist
  renderCatalog();
  renderCartDrawer();
  renderWishlistDrawer();
  updateHeaderBadges();

  // Header Drawer Buttons
  document.getElementById('open-cart-btn')?.addEventListener('click', () => openDrawer('cart-drawer'));
  document.getElementById('close-cart-btn')?.addEventListener('click', () => closeDrawer('cart-drawer'));

  document.getElementById('open-wishlist-btn')?.addEventListener('click', () => openDrawer('wishlist-drawer'));
  document.getElementById('close-wishlist-btn')?.addEventListener('click', () => closeDrawer('wishlist-drawer'));

  // Modals Close Buttons
  document.getElementById('close-quickview-btn')?.addEventListener('click', () => closeModal('quickview-modal'));
  document.getElementById('close-checkout-btn')?.addEventListener('click', () => closeModal('checkout-modal'));

  // Close backdrops on click outside
  ['cart-drawer', 'wishlist-drawer'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      if (e.target.id === id) closeDrawer(id);
    });
  });

  ['quickview-modal', 'checkout-modal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      if (e.target.id === id) closeModal(id);
    });
  });

  // Announcement Bar Promo Copy
  document.getElementById('copy-promo-banner')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('KENEIBDAY');
    showToast("Copied discount code 'KENEIBDAY' to clipboard!", "🎉");
    audioPlayer.playPop();
    confetti.burst(window.innerWidth / 2, 50, 20);
  });

  document.getElementById('close-announcement')?.addEventListener('click', () => {
    const bar = document.getElementById('announcement-bar');
    if (bar) bar.style.display = 'none';
  });

  // Chime / Audio Music Button
  document.getElementById('chime-toggle-btn')?.addEventListener('click', () => {
    audioPlayer.playChime();
    confetti.burst(event.clientX, event.clientY, 30);
    showToast("Playing celebratory chimes for Kenei! 🎶", "🔔");
  });

  // Global Confetti Triggers (Pop Confetti buttons)
  document.querySelectorAll('.celebrate-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      confetti.burst(x, y, 60);
      audioPlayer.playPop();
    });
  });

  // Search Filter
  const searchInput = document.getElementById('global-search');
  const clearSearch = document.getElementById('clear-search');

  searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    clearSearch.style.display = state.searchQuery ? 'block' : 'none';
    renderCatalog();
  });

  clearSearch?.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearch.style.display = 'none';
    renderCatalog();
  });

  // Promo Code Application in Cart
  document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
    const input = document.getElementById('promo-input');
    const msgEl = document.getElementById('promo-message');
    const code = input.value.trim().toUpperCase();

    if (code === 'KENEIBDAY') {
      state.appliedPromo = { code: 'KENEIBDAY', discountPercent: 25 };
      msgEl.className = 'promo-message success';
      msgEl.textContent = '🎉 Code KENEIBDAY applied: Special VIP Birthday Perk!';
      msgEl.style.display = 'block';
      confetti.burst(window.innerWidth - 100, window.innerHeight - 200, 35);
      audioPlayer.playChime();
    } else {
      msgEl.className = 'promo-message error';
      msgEl.textContent = 'Invalid promo code. Please use KENEIBDAY!';
      msgEl.style.display = 'block';
    }
    renderCartDrawer();
  });

  // Move All Wishlist to Cart Button
  document.getElementById('move-all-to-cart-btn')?.addEventListener('click', () => {
    if (state.wishlist.length === 0) return;
    state.wishlist.forEach(id => {
      const existing = state.cart.find(c => c.id === id);
      if (existing) existing.quantity++;
      else state.cart.push({ id, quantity: 1, note: '' });
    });
    state.wishlist = [];
    saveWishlist();
    saveCart();
    closeDrawer('wishlist-drawer');
    openDrawer('cart-drawer');
    confetti.rain();
    showToast('Moved all saved gifts into your cart!', '🛒');
  });

  // Proceed to Checkout
  document.getElementById('open-checkout-btn')?.addEventListener('click', openCheckoutModal);

  // Checkout Form Submission
  document.getElementById('checkout-form')?.addEventListener('submit', handleCheckoutSubmit);

  // Continue Shopping after successful order
  document.getElementById('continue-shopping-btn')?.addEventListener('click', () => {
    closeModal('checkout-modal');
    document.getElementById('catalog-section').scrollIntoView({ behavior: 'smooth' });
  });

  // Newsletter Form
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    confetti.burst(window.innerWidth / 2, window.innerHeight - 100, 30);
    showToast("Welcome to Kenei's Birthday VIP Club!", "💌");
    e.target.reset();
  });

  // Delegated Event Handlers for Product Grid & Drawers
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (action === 'add-to-cart') {
      addToCart(id);
    } else if (action === 'toggle-wishlist') {
      toggleWishlist(id);
    } else if (action === 'quickview') {
      openQuickView(id);
    } else if (action === 'cart-qty') {
      const delta = Number(target.dataset.delta);
      updateCartQty(id, delta);
    } else if (action === 'cart-remove') {
      removeFromCart(id);
    } else if (action === 'wishlist-to-cart') {
      addToCart(id);
      toggleWishlist(id);
    } else if (action === 'wishlist-remove') {
      toggleWishlist(id);
    }
  });

  // Payment Options Selection UI
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const cardFields = document.getElementById('card-fields');
      if (cardFields) {
        cardFields.style.display = radio.value === 'card' ? 'block' : 'none';
      }
    });
  });
});
