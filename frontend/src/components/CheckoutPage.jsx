import { useState } from "react";
import { ArrowLeft, Clock, Phone, MapPin, Landmark, User, StickyNote } from "lucide-react";

const BANKS = ["Хаан банк", "Голомт банк", "Төрийн банк", "Хас банк", "Капитрон банк", "Тээвэр хөгжлийн банк", "Бусад"];

export default function CheckoutPage({ cart, total, placing, onBack, onSubmit }) {
  const [form, setForm] = useState({ phone: "", address: "", bank_name: "", account_name: "", notes: "" });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.phone.trim()) errs.phone = true;
    if (!form.address.trim()) errs.address = true;
    if (!form.bank_name) errs.bank_name = true;
    if (!form.account_name.trim()) errs.account_name = true;
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(form);
  };

  const inputCls = (bad) =>
    `w-full rounded-lg border bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors ${
      bad ? "border-[#C85C4A]" : "border-[#3D2817]/10 focus:border-[#C85C4A]"}`;

  return (
    <div data-testid="checkout-page" className="fade-up py-8">
      <div className="flex items-center gap-3">
        <button data-testid="checkout-back-button" onClick={onBack} aria-label="Буцах"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#3D2817] shadow-sm transition-colors hover:bg-[#E8A76A]/30">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3D2817]">Захиалга баталгаажуулах</h1>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div data-testid="order-summary" className="rounded-lg bg-white p-5 shadow-sm lg:col-span-2 h-fit">
          <h3 className="font-heading text-base font-bold text-[#3D2817]">Хоолны жагсаалт</h3>
          <div className="mt-3 space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-[#5A4A42]">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-semibold">{(item.price * item.quantity).toLocaleString()}₮</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-[#3D2817]/10 pt-3">
            <span className="text-sm font-semibold text-[#3D2817]">Нийт</span>
            <span data-testid="checkout-total" className="font-heading text-lg font-bold text-[#C85C4A]">
              {total.toLocaleString()}₮
            </span>
          </div>
          <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#E8A76A]/20 px-3 py-2 text-xs font-semibold text-[#3D2817]">
            <Clock size={13} /> Хүргэлтийн хугацаа: 20-60 минут
          </p>
        </div>

        <form data-testid="checkout-form" onSubmit={submit} className="rounded-lg bg-white p-5 shadow-sm lg:col-span-3">
          <h3 className="font-heading text-base font-bold text-[#3D2817]">Таны мэдээлэл</h3>
          <div className="mt-4 space-y-4">
            <div className="relative">
              <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5A4A42]/50" />
              <input data-testid="phone-input" value={form.phone} onChange={set("phone")}
                placeholder="Утасны дугаар *" className={inputCls(errors.phone)} />
            </div>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5A4A42]/50" />
              <input data-testid="address-input" value={form.address} onChange={set("address")}
                placeholder="Хүргэлтийн хаяг *" className={inputCls(errors.address)} />
            </div>
            <div className="relative">
              <Landmark size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5A4A42]/50" />
              <select data-testid="bank-name-select" value={form.bank_name} onChange={set("bank_name")}
                className={`${inputCls(errors.bank_name)} appearance-none ${form.bank_name ? "" : "text-[#5A4A42]/60"}`}>
                <option value="" disabled>Банкны нэр *</option>
                {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5A4A42]/50" />
              <input data-testid="account-name-input" value={form.account_name} onChange={set("account_name")}
                placeholder="Эзэмшигчийн нэр *" className={inputCls(errors.account_name)} />
            </div>
            <div className="relative">
              <StickyNote size={16} className="pointer-events-none absolute left-4 top-3.5 text-[#5A4A42]/50" />
              <textarea data-testid="notes-input" value={form.notes} onChange={set("notes")} rows={3}
                placeholder="Нэмэлт тайлбар" className={`${inputCls(false)} resize-none`} />
            </div>
          </div>
          {Object.keys(errors).length > 0 && (
            <p data-testid="form-error" className="mt-3 text-xs font-semibold text-[#C85C4A]">
              Бүх шаардлагатай талбарыг бөглөнө үү.
            </p>
          )}
          <p className="mt-3 text-xs text-[#5A4A42]">
            Төлбөрийг захиалга баталгаажсаны дараа банкны шилжүүлгээр төлнө. Манай ажилтан тантай утсаар холбогдоно.
          </p>
          <button data-testid="place-order-button" type="submit" disabled={placing || cart.length === 0}
            className="mt-4 w-full rounded-lg bg-[#C85C4A] py-4 text-base font-bold text-white transition-colors hover:bg-[#b04c3c] disabled:opacity-60">
            {placing ? "Илгээж байна..." : "Захиалга баталгаажуулах"}
          </button>
        </form>
      </div>
    </div>
  );
}
