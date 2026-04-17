import ProductCard from './ProductCard'

const ProductGrid = ({ products, searchQuery = '', cart, onAddToCart, onUpdateQuantity, onRemoveFromCart }) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCartItem = (id) => cart.find(item => item.id === id) || null;

  return (
    <div className="product-grid" role="list" aria-label="Product collection">
      {filteredProducts.length > 0 ? filteredProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          cartItem={getCartItem(product.id)}
          onAdd={() => onAddToCart(product.id)}
          onUpdateQuantity={(qty) => onUpdateQuantity(product.id, qty)}
          onRemove={() => onRemoveFromCart(product.id)}
        />
      )) : (
        <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No products match your search. Try different keywords like "blazer" or "Menswear".
        </div>
      )}
    </div>
  )
}

export default ProductGrid
