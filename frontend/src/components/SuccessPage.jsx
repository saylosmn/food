import { CheckCircle2, Clock, Landmark, MapPin, Phone } from "lucide-react";

export default function SuccessPage({ order, onNewOrder }) {
  if (!order) {
    return (
      <div data-testid="success-page" className="fade-up py-24 text-center">
        <p className="text-sm text-[#5A4A42]">Захиалгын мэдээлэл олдсонгүй.</p>
        <button data-testid="new-order-button" onClick={onNewOrder}
          className="mt-6 rounded-lg bg-[#C85C4A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b04c3c]">
          Цэс рүү буцах
        </button>
      </div>
    );
  }

  return (
    <div data-testid="success-page" className="fade-up mx-auto max-w-lg py-12 text-center">
      <CheckCircle2 size={72} className="mx-auto text-[#C85C4A]" data-testid="success-icon" />
      <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-bold text-[#3D2817]">Захиалга баталгаажлаа!</h1>
      <p className="mt-2 text-sm text-[#5A4A42]">Баярлалаа. Таны захиалгыг хүлээн авлаа.</p>

      <div className="mt-6 rounded-lg bg-white p-5 text-left shadow-sm">
        <div className="flex justify-between">
          <span className="text-sm text-[#5A4A42]">Захиалгын дугаар</span>
          <span data-testid="order-number" className="font-heading text-sm font-bold text-[#3D2817]">
            {order.order_number}
          </span>
        </div>
        <div className="mt-3 space-y-2 border-t border-[#3D2817]/10 pt-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-[#5A4A42]">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-semibold">{(item.price * item.quantity).toLocaleString()}₮</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-[#3D2817]/10 pt-3">
          <span className="text-sm font-semibold text-[#3D2817]">Нийт дүн</span>
          <span data-testid="success-total" className="font-heading text-lg font-bold text-[#C85C4A]">
            {order.total.toLocaleString()}₮
          </span>
        </div>
        <div className="mt-4 space-y-2 text-xs text-[#5A4A42]">
          <p className="flex items-center gap-2"><Clock size={13} /> Хүргэлт: {order.delivery_time}</p>
          <p className="flex items-center gap-2"><Phone size={13} /> {order.phone}</p>
          <p className="flex items-center gap-2"><MapPin size={13} /> {order.address}</p>
          <p className="flex items-center gap-2"><Landmark size={13} /> {order.bank_name} — {order.account_name}</p>
        </div>
        <p className="mt-4 rounded-lg bg-[#E8A76A]/20 px-3 py-2 text-xs font-semibold text-[#3D2817]">
          Төлбөрийг банкны шилжүүлгээр төлнө үү. Манай ажилтан тантай удахгүй холбогдох болно.
        </p>
      </div>

      <button data-testid="new-order-button" onClick={onNewOrder}
        className="mt-6 rounded-lg bg-[#C85C4A] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#b04c3c]">
        Шинэ захиалга өгөх
      </button>
    </div>
  );
}
