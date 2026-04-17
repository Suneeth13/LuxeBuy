import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import Checkout from './components/Checkout';
import Assistant from './components/Assistant';
import ConciergeEdit from './components/ConciergeEdit';
import productsData from './data/products';
import './index.css';

const conciergeEdits = [
  {
    id: 'all',
    kicker: 'Full House',
    title: 'The complete LuxeBuy floor',
    description: 'Browse every piece without constraints and let search guide the discovery.',
    highlight: 'Includes all six signature products.',
    productIds: null,
    assistantPrompt: 'Give me a quick overview of the best pieces in the LuxeBuy collection.'
  },
  {
    id: 'black-tie',
    kicker: 'Evening Dressing',
    title: 'Black-tie gala arrival',
    description: 'Built for a polished formal entrance with one statement garment and two refined finishers.',
    highlight: 'Focus: Azure Silk Gown, Golden Hour Timepiece, Sable Leather Tote.',
    productIds: [5, 2, 4],
    assistantPrompt: 'Curate a black-tie evening look from LuxeBuy and explain why each piece works together.'
  },
  {
    id: 'executive',
    kicker: 'Travel Edit',
    title: 'Executive arrival edit',
    description: 'A sharp travel-to-meeting combination for someone who wants authority without losing comfort.',
    highlight: 'Focus: Onyx Silk Blazer, Obsidian Chelsea Boots, Golden Hour Timepiece.',
    productIds: [1, 6, 2],
    assistantPrompt: 'Build an executive arrival look from LuxeBuy for a client meeting right after landing.'
  },
  {
    id: 'winter',
    kicker: 'Cold Weather',
    title: 'Winter atelier layers',
    description: 'Soft structure, warmer textures, and premium accessories for colder upscale outings.',
    highlight: 'Focus: Ivory Cashmere Coat, Onyx Silk Blazer, Sable Leather Tote.',
    productIds: [3, 1, 4],
    assistantPrompt: 'Recommend a winter luxury outfit from LuxeBuy for a stylish city evening.'
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeEditId, setActiveEditId] = useState('all');
  const [assistantSeed, setAssistantSeed] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();

    const savedCart = localStorage.getItem('luxeCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('luxeCart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luxeCart', JSON.stringify(cart));
  }, [cart]);

  // Filter handled in ProductGrid for consistency


  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeEdit = conciergeEdits.find((edit) => edit.id === activeEditId) ?? conciergeEdits[0];
  const visibleProducts = activeEdit.productIds
    ? products.filter((product) => activeEdit.productIds.includes(product.id))
    : products;

  const handleAddToCart = (id) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(item => item.id === id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentCart, { id, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((currentCart) => currentCart.filter(item => item.id !== id));
    } else {
      setCart((currentCart) => currentCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart((currentCart) => currentCart.filter(item => item.id !== id));
  };

  const handleClearCart = () => setCart([]);
  const handleAskAssistant = (edit) => setAssistantSeed(`${edit.assistantPrompt} Keep the answer under 80 words.`);

  return (
    <div className="app-container">
      <Navbar 
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={() => setShowCheckout(true)}
      />
      <main>
        <section className="page-intro">
          <p className="eyebrow">Curated luxury retail</p>
          <h1>LuxeBuy Collections</h1>
          <p className="lead">
            Discover statement pieces, premium essentials, and a Gemini-powered
            concierge designed to make the shopping journey feel personal.
          </p>
        </section>
        <ConciergeEdit
          edits={conciergeEdits}
          activeEditId={activeEditId}
          onSelect={setActiveEditId}
          onAskAssistant={handleAskAssistant}
        />
        <ProductGrid 
          products={visibleProducts}
          searchQuery={searchQuery}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
        />
      </main>
      {showCheckout && (
        <Checkout
          cart={cart}
          products={products}
          onClose={() => setShowCheckout(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
        />
      )}
      <Assistant suggestedPrompt={assistantSeed} />
    </div>
  );
}

export default App;
