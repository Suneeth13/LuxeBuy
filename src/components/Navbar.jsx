import { useState, useRef } from 'react'

const Navbar = ({ cartCount, searchQuery, onSearchChange, onCartClick }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef(null)

  const toggleSearch = () => {
    setSearchOpen(prev => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 100)
      } else {
        onSearchChange('')
      }
      return !prev
    })
  }

  return (
    <nav className="navbar glass" role="navigation" aria-label="Main navigation">
      <div className="nav-brand">luxe<span>buy</span></div>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#collections">Collections</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-actions">
        {/* Search */}
        <div className={`search-container ${searchOpen ? 'open' : ''}`}>
          {searchOpen && (
            <input
              ref={inputRef}
              id="navbar-search"
              className="search-input"
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && toggleSearch()}
              aria-label="Search products"
            />
          )}
          <button
            className="icon-btn"
            onClick={toggleSearch}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
          >
            {searchOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            )}
          </button>
        </div>

        {/* Cart */}
        <button
          id="cart-btn"
          className="icon-btn cart-btn"
          onClick={onCartClick}
          aria-label={`Open cart (${cartCount} items)`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span className="cart-badge" aria-hidden="true">{cartCount > 9 ? '9+' : cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
