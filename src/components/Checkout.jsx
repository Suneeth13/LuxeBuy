const Checkout = ({ cart, products, onClose, onUpdateQuantity, onRemove, onClear }) => {
  const getProductById = (id) => products.find(p => p.id === id)
  const parsePrice = (price) => Number(price.replace(/[^0-9.]/g, ''))

  const total = cart.reduce((sum, item) => {
    const product = getProductById(item.id)
    if (!product) return sum

    return sum + parsePrice(product.price) * item.quantity
  }, 0)

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal glass" onClick={e => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>Your Collection</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="checkout-items">
          {cart.map(item => {
            const product = getProductById(item.id)
            if (!product) return null
            return (
              <div key={item.id} className="cart-item">
                <img src={product.image} alt={product.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{product.name}</h4>
                  <p className="cart-price">{product.price}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>Remove</button>
              </div>
            )
          })}
        </div>

        <div className="checkout-footer">
          <div className="total">
            Total: ${total.toFixed(2)}
          </div>
          <div className="checkout-actions">
            <button className="clear-btn" onClick={onClear}>Clear Collection</button>
            <button className="proceed-btn">Proceed to Payment</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .checkout-modal {
          max-width: 600px;
          max-height: 80vh;
          width: 100%;
          height: auto;
          border-radius: 24px;
          overflow-y: auto;
        }

        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid var(--glass-border);
        }

        .checkout-header h2 {
          margin: 0;
          color: var(--text-main);
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: var(--text-muted);
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .close-btn:hover {
          background: var(--glass);
          color: var(--primary);
        }

        .checkout-items {
          padding: 24px 32px;
          max-height: 400px;
          overflow-y: auto;
        }

        .cart-item {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid var(--glass-border);
        }

        .cart-item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 12px;
        }

        .cart-item-details h4 {
          margin: 0 0 4px 0;
          font-size: 1.1rem;
        }

        .cart-price {
          margin: 0;
          color: var(--primary);
          font-weight: 600;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--glass);
          padding: 8px 12px;
          border-radius: 20px;
        }

        .quantity-controls button {
          background: var(--primary);
          color: var(--bg-dark);
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-weight: 600;
        }

        .remove-btn {
          background: transparent;
          border: 1px solid var(--text-muted);
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
        }

        .remove-btn:hover {
          border-color: #ff4444;
          color: #ff4444;
        }

        .checkout-footer {
          padding: 24px 32px 32px;
          border-top: 1px solid var(--glass-border);
          background: rgba(0, 0, 0, 0.3);
        }

        .total {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary);
          text-align: center;
          margin-bottom: 20px;
        }

        .checkout-actions {
          display: flex;
          gap: 12px;
        }

        .clear-btn, .proceed-btn {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: var(--transition);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .clear-btn {
          background: transparent;
          border: 1px solid var(--text-muted);
          color: var(--text-muted);
        }

        .clear-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .proceed-btn {
          background: var(--primary);
          color: var(--bg-dark);
        }

        .proceed-btn:hover {
          background: var(--primary-dark);
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.4);
        }

        @media (max-width: 600px) {
          .checkout-modal {
            margin: 10px;
            max-height: 90vh;
          }

          .checkout-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default Checkout
