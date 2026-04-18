import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../../store';
import { setSearchQuery } from '../productsSlice';

export const SearchBar = () => {
  const searchQuery = useSelector((state: RootState) => state.products.searchQuery);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = useCallback((value: string) => {
    dispatch(setSearchQuery(value));
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, [dispatch, navigate, location]);

  return (
    <div className="flex-1 flex max-w-2xl relative">
      <input
        type="text"
        className="w-full pl-5 pr-12 py-2.5 text-[15px] border-2 border-transparent bg-slate-100/80 rounded-full focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-slate-400 text-slate-900 shadow-inner block"
        placeholder="Search for products, brands, categories…"
        aria-label="Search for products"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
    </div>
  );
};
