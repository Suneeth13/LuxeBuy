import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App.jsx';

vi.mock('../../components/Navbar', () => ({
  default: () => <nav><span aria-label="cart-count">0</span></nav>
}));
vi.mock('../../components/ProductGrid', () => ({
  default: () => <ul aria-label="Product collection">mock grid</ul>
}));
vi.mock('../../components/ConciergeEdit', () => ({
  default: () => <section>Concierge Edit</section>
}));
vi.mock('../../data/products', () => ({ default: [] }));
vi.mock('../../components/Checkout', () => ({
  default: () => null
}));
vi.mock('../../components/Assistant', () => ({
  default: () => null
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders app without crashing', () => {
    render(<App />);
  });

  it('renders LuxeBuy title', () => {
    render(<App />);
    expect(screen.getByText(/LuxeBuy Collections/)).toBeInTheDocument();
  });

  it('renders cart count 0', () => {
    render(<App />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders concierge edit', () => {
    render(<App />);
    expect(screen.getByText('Concierge Edit')).toBeInTheDocument();
  });

  it('renders product grid aria-label', () => {
    render(<App />);
    expect(screen.getByLabelText('Product collection')).toBeInTheDocument();
  });
});
