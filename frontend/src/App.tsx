import { useCallback, useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { store } from './store';
import type { RootState } from './store';
import { ProductListContainer, ProductDetailPage, SearchBar } from './features/products';
import { Basket, BasketIcon } from './features/basket';
import { setSearchQuery } from './features/products/productsSlice';

function Home() {
  const activeSearch = useSelector((state: RootState) => state.products.searchQuery);
  return (
    <>
      <div className="mb-6">
        <nav className="text-xs text-slate-500 mb-2 flex items-center">
          <span>Home</span>
          {activeSearch && (
            <>
              <span className="mx-2">›</span>
              <span className="text-slate-800">"{activeSearch}"</span>
            </>
          )}
        </nav>
        <h1 className="text-2xl font-bold text-slate-900 m-0">
          {activeSearch ? `Results for "${activeSearch}"` : 'Electronics & Tech'}
        </h1>
      </div>

      <ProductListContainer />
    </>
  );
}

function AppContent() {
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const dispatch = useDispatch();

  const openBasket = useCallback(() => setIsBasketOpen(true), []);
  const closeBasket = useCallback(() => setIsBasketOpen(false), []);

  const handleLogoClick = () => {
    dispatch(setSearchQuery(''));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-5 outline-none">
          <Link to="/" onClick={handleLogoClick} className="shrink-0 cursor-pointer select-none text-2xl font-extrabold text-blue-900 tracking-tight no-underline outline-none">
            mini<span className="text-orange-500">shop</span>
          </Link>

          <SearchBar />

          <div className="shrink-0 ml-auto flex items-center">
            <BasketIcon onClick={openBasket} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto p-6 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto py-5">
        <div className="text-center text-xs text-slate-500 font-medium">
          © 2026 MiniShop. All rights reserved.
        </div>
      </footer>

      <Basket isOpen={isBasketOpen} onClose={closeBasket} />
    </div>
  );
}

import { Toaster } from './components/Toast';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toaster />
    </Provider>
  );
}
