import { ShoppingCart, Clock, UtensilsCrossed } from "lucide-react";

export default function Header({ cartCount, onCartClick, onLogoClick }) {
  return (
    <header data-testid="app-header" className="sticky top-0 z-20 bg-[#3D2817] shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-5 py-4">
        <button data-testid="logo-button" onClick={onLogoClick} className="flex items-center gap-3 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8A76A] text-[#3D2817]">
            <UtensilsCrossed size={22} />
          </span>
          <span>
            <span className="block font-heading text-base sm:text-lg font-bold leading-tight text-[#F5F1ED]">
              Степпе Тэйбл
            </span>
            <span className="hidden sm:flex items-center gap-1 text-xs text-[#E8A76A]">
              <Clock size={12} /> 20-60 мин хүргэлт
            </span>
          </span>
        </button>
        <button
          data-testid="cart-button"
          onClick={onCartClick}
          className="relative flex items-center gap-2 rounded-lg bg-[#C85C4A] px-4 py-2.5 text-sm font-semibold text-[#F5F1ED] transition-colors hover:bg-[#b04c3c]"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Сагс</span>
          <span data-testid="cart-count-badge"
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E8A76A] px-1 text-xs font-bold text-[#3D2817]">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}
