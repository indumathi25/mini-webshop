import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../store';
import { fetchProductById } from '../api';
import { addItem } from '../../basket';
import { useToast } from '../../../hooks/useToast';
import { getStockStatus } from '../utils';

export default function ProductDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: selectedProduct, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  const { items } = useSelector((state: RootState) => state.basket);
  const basketItem = items.find(i => i.id === productId);
  const basketQuantity = basketItem ? basketItem.quantity : 0;
  const isMaxStockReached = selectedProduct ? basketQuantity >= selectedProduct.stock : false;

  if (!productId) return <div className="p-12 text-center text-slate-600">Invalid product ID.</div>;

  const handleAdd = () => {
    if (selectedProduct && selectedProduct.stock > 0 && !isMaxStockReached) {
      dispatch(addItem(selectedProduct));
      showToast(`Added ${selectedProduct.name} to basket`);
    }
  };

  const stockStatus = selectedProduct ? getStockStatus(selectedProduct.stock) : { label: '', colorClass: '' };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
      {/* Content wrapper */}
      <div className="p-6 sm:p-8 md:p-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 px-5 rounded-full border-none cursor-pointer transition-colors"
        >
          <span>←</span> Back to selection
        </button>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full mb-4"></div>
              <div className="text-slate-600 text-sm font-medium">Loading product details...</div>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-600 font-medium bg-red-50 rounded-lg">
              Failed to load product details. Please try again.
            </div>
          ) : selectedProduct ? (
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
              <div className="flex-1 w-full lg:max-w-md xl:max-w-lg bg-slate-50 rounded-xl p-8 flex items-center justify-center border border-slate-100">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  width={512}
                  height={400}
                  className="w-full h-auto max-h-[400px] object-contain mix-blend-multiply"
                />
              </div>
              
              <div className="flex-[1.5] w-full flex flex-col py-2">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-100">
                    {selectedProduct.category}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-slate-900 mt-5 mb-3 leading-tight tracking-tight shrink-0">
                  {selectedProduct.name}
                </h1>
                <div className="flex items-baseline gap-3 my-2">
                  <p className="text-4xl font-extrabold text-slate-900 shrink-0 m-0">
                    €{selectedProduct.price.toFixed(2)}
                  </p>
                  <p className={`text-sm font-bold ${stockStatus.colorClass} m-0`}>● {stockStatus.label}</p>
                </div>
                
                <div className="flex-1 mt-8 mb-10">
                  <h2 className="m-0 mb-3 text-[15px] font-bold text-slate-900 border-b border-slate-100 pb-3">Product Description</h2>
                  <p className="text-[15px] text-slate-600 leading-relaxed max-w-prose">
                    {selectedProduct.description}
                  </p>
                </div>
                
                <div className="mt-auto shrink-0 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleAdd}
                    disabled={selectedProduct.stock <= 0 || isMaxStockReached}
                    className={`w-full flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 font-bold rounded-lg text-[15px] cursor-pointer border-none transition-colors shadow-sm ${
                      selectedProduct.stock <= 0 || isMaxStockReached
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                     {selectedProduct.stock <= 0 ? (
                       'Out of Stock'
                     ) : isMaxStockReached ? (
                        'Max stock reached'
                     ) : (
                       <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        Add to basket
                       </>
                     )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
