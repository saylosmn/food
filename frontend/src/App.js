import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import "@/App.css";
import Header from "@/components/Header";
import MenuPage from "@/components/MenuPage";
import CartPage from "@/components/CartPage";
import CheckoutPage from "@/components/CheckoutPage";
import SuccessPage from "@/components/SuccessPage";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function App() {
  const [page, setPage] = useState("menu");
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mfd_cart")) || []; } catch { return []; }
  });
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    localStorage.setItem("mfd_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    axios.get(`${API}/menu`)
      .then((r) => setMenu(r.data))
      .catch(() => toast.error("Цэс ачаалагдсангүй. Дахин оролдоно уу."))
      .finally(() => setLoading(false));
  }, []);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  const addToCart = (item) => {
    setCart((c) => {
      const existing = c.find((x) => x.id === item.id);
      if (existing) return c.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...c, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} сагсанд нэмэгдлээ`);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((c) => c.filter((x) => x.id !== id));
    } else {
      setCart((c) => c.map((x) => x.id === id ? { ...x, quantity } : x));
    }
  };

  const removeFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id));

  const total = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const count = cart.reduce((s, x) => s + x.quantity, 0);

  const placeOrder = async (form) => {
    setPlacing(true);
    try {
      const res = await axios.post(`${API}/orders`, {
        items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        ...form,
      });
      setOrder(res.data);
      setCart([]);
      navigate("success");
    } catch {
      toast.error("Захиалга амжилтгүй. Мэдээллээ шалгаад дахин оролдоно уу.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Toaster position="top-center" richColors />
      <Header cartCount={count} onCartClick={() => navigate("cart")} onLogoClick={() => navigate("menu")} />
      <main className="mx-auto max-w-6xl px-4 sm:px-5 pb-16">
        {page === "menu" && <MenuPage menu={menu} loading={loading} onAdd={addToCart} />}
        {page === "cart" && (
          <CartPage cart={cart} total={total} onUpdate={updateQuantity} onRemove={removeFromCart}
            onBack={() => navigate("menu")} onCheckout={() => navigate("checkout")} />
        )}
        {page === "checkout" && (
          <CheckoutPage cart={cart} total={total} placing={placing}
            onBack={() => navigate("cart")} onSubmit={placeOrder} />
        )}
        {page === "success" && <SuccessPage order={order} onNewOrder={() => navigate("menu")} />}
      </main>
    </div>
  );
}
