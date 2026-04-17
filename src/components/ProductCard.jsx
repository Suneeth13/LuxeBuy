import { useState } from 'react'

const ProductCard = ({ product, cartItem, onAdd, onUpdateQuantity, onRemove }) => {
  const [addedFlash, setAddedFlash] = useState(false)

  const handleAdd = () => {
    onAdd()
    setAddedFlash(true)
    setTimeout(() => setAddedFlash(false), 1200)
  }

  const inCart = cartItem !== null
  const quantity = cartItem?.quantity || 0

  return (
    <article className="product-card glass" role="listitem" aria-label={product.name}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="category-tag">{product.category}</div>
        {inCart && <div className="in-cart-badge">In Collection</div>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>

        {inCart ? (
          <div className="quantity-row">
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => onUpdateQuantity(quantity - 1)}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-count">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => onUpdateQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button className="remove-item-btn" onClick={onRemove} aria-label="Remove from cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            id={`add-to-cart-${product.id}`}
            className={`add-btn ${addedFlash ? 'flashing' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to collection`}
          >
            {addedFlash ? 'Added' : 'Add to Collection'}
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
