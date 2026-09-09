import { ArrowLeft, Minus, Plus, Trash2, Clock } from "lucide-react";

export default function CartPage({ cart, total, onUpdate, onRemove, onBack, onCheckout }) {
  if (cart.length === 0) {
    return (
      <div data-testid="empty-cart" className="fade-up py-24 text-center">
        <h2 className="font-heading text-2xl font-bold text-[#3D2817]">Сагс хоосон байна</h2>
        <p className="mt-2 text-sm text-[#5A4A42]">Цэснээс хоол сонгоод сагсандаа нэмээрэй.</p>
        <button data-testid="back-to-menu-button" onClick={onBack}
          className="mt-6 rounded-lg bg-[#C85C4A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b04c3c]">
          Цэс рүү буцах
        </button>
      </div>
    );
  }

  return (
    <div data-testid="cart-page" className="fade-up py-8">
      <div className="flex items-center gap-3">
        <button data-testid="cart-back-button" onClick={onBack} aria-label="Буцах"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#3D2817] shadow-sm transition-colors hover:bg-[#E8A76A]/30">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3D2817]">Сагс</h1>
      </div>

      <div className="mt-6 space-y-3">
        {cart.map((item) => (
          <div key={item.id} data-testid={`cart-item-${item.id}`}
            className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
            <img src={item.img} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-heading text-sm font-bold text-[#3D2817]">{item.name}</h3>
              <p className="text-xs text-[#5A4A42]">{item.price.toLocaleString()}₮ × {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button data-testid={`qty-decrease-${item.id}`} onClick={() => onUpdate(item.id, item.quantity - 1)} aria-label="Буурах"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F1ED] text-[#3D2817] transition-colors hover:bg-[#E8A76A]/40">
                <Minus size={14} />
              </button>
              <span data-testid={`qty-value-${item.id}`} className="w-6 text-center text-sm font-bold text-[#3D2817]">
                {item.quantity}
              </span>
              <button data-testid={`qty-increase-${item.id}`} onClick={() => onUpdate(item.id, item.quantity + 1)} aria-label="Нэмэх"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F1ED] text-[#3D2817] transition-colors hover:bg-[#E8A76A]/40">
                <Plus size={14} />
              </button>
            </div>
            <button data-testid={`remove-item-${item.id}`} onClick={() => onRemove(item.id)} aria-label="Устгах"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#C85C4A]/10 text-[#C85C4A] transition-colors hover:bg-[#C85C4A]/20">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#5A4A42]">Нийт төлөх дүн</span>
          <span data-testid="cart-total" className="font-heading text-xl font-bold text-[#C85C4A]">
            {total.toLocaleString()}₮
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5A4A42]">
          <Clock size={13} /> Хүргэлт: 20-60 минут
        </p>
        <button data-testid="checkout-button" onClick={onCheckout}
          className="mt-4 w-full rounded-lg bg-[#C85C4A] py-4 text-base font-bold text-white transition-colors hover:bg-[#b04c3c]">
          Захиалга оруулах
        </button>
      </div>
    </div>
  );
}
