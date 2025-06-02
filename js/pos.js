// POS System JavaScript

class POSSystem {
    constructor() {
        this.products = [];
        this.cart = [];
        this.tax = 0.18; // 18% tax
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.updateCart();
    }

    // Load products from local storage or API
    async loadProducts() {
        try {
            // Simulated product data - replace with actual API call
            this.products = [
                { id: 1, name: 'Product 1', price: 19.99, category: 'Category 1', stock: 50 },
                { id: 2, name: 'Product 2', price: 29.99, category: 'Category 2', stock: 30 },
                { id: 3, name: 'Product 3', price: 39.99, category: 'Category 1', stock: 20 },
                // Add more products as needed
            ];
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNotification('Error loading products', 'error');
        }
    }

    // Render products in the grid
    renderProducts() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `).join('');
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart')) {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId);
            }
            if (e.target.matches('.remove-from-cart')) {
                const productId = parseInt(e.target.dataset.productId);
                this.removeFromCart(productId);
            }
            if (e.target.matches('.checkout-btn')) {
                this.processCheckout();
            }
        });

        // Search functionality
        const searchInput = document.querySelector('#search-products');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
    }

    // Add product to cart
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        if (product.stock <= 0) {
            this.showNotification('Product out of stock', 'error');
            return;
        }

        const cartItem = this.cart.find(item => item.productId === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            this.cart.push({
                productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        product.stock--;
        this.updateCart();
        this.renderProducts();
        this.showNotification('Product added to cart', 'success');
    }

    // Remove product from cart
    removeFromCart(productId) {
        const cartItemIndex = this.cart.findIndex(item => item.productId === productId);
        if (cartItemIndex === -1) return;

        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.stock += this.cart[cartItemIndex].quantity;
        }

        this.cart.splice(cartItemIndex, 1);
        this.updateCart();
        this.renderProducts();
        this.showNotification('Product removed from cart', 'success');
    }

    // Update cart display
    updateCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');
        if (!cartItems || !cartTotal) return;

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="btn btn-danger remove-from-cart" data-product-id="${item.productId}">
                    Remove
                </button>
            </div>
        `).join('');

        const subtotal = this.calculateSubtotal();
        const tax = subtotal * this.tax;
        const total = subtotal + tax;

        cartTotal.innerHTML = `
            <div class="subtotal">Subtotal: $${subtotal.toFixed(2)}</div>
            <div class="tax">Tax (${(this.tax * 100)}%): $${tax.toFixed(2)}</div>
            <div class="total">Total: $${total.toFixed(2)}</div>
            <button class="btn btn-success checkout-btn" ${this.cart.length === 0 ? 'disabled' : ''}>
                Proceed to Checkout
            </button>
        `;
    }

    // Calculate cart subtotal
    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Search products
    searchProducts(query) {
        const searchQuery = query.toLowerCase();
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery)
        );
        
        this.renderFilteredProducts(filteredProducts);
    }

    // Render filtered products
    renderFilteredProducts(filteredProducts) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `).join('');
    }

    // Process checkout
    async processCheckout() {
        try {
            if (this.cart.length === 0) {
                this.showNotification('Cart is empty', 'error');
                return;
            }

            // Simulate API call for payment processing
            const orderData = {
                items: this.cart,
                subtotal: this.calculateSubtotal(),
                tax: this.calculateSubtotal() * this.tax,
                total: this.calculateSubtotal() * (1 + this.tax),
                timestamp: new Date().toISOString()
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear cart after successful checkout
            this.cart = [];
            this.updateCart();
            this.showNotification('Order completed successfully', 'success');
            
            // You would typically send orderData to your backend here
            console.log('Order completed:', orderData);
        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Error processing checkout', 'error');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize POS system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pos = new POSSystem();
}); 