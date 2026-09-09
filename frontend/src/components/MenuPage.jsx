import { useState } from "react";
import { Search, Clock, Landmark } from "lucide-react";
import MenuCard from "@/components/MenuCard";

const CATEGORIES = [
  { id: "all", name: "Бүх" },
  { id: "pizza", name: "Пицца" },
  { id: "meat", name: "Махан" },
  { id: "chicken", name: "Куриц" },
  { id: "set", name: "Сэт" },
  { id: "noodle", name: "Нүүр" },
  { id: "drink", name: "Ундаа" },
];

export default function MenuPage({ menu, loading, onAdd }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = menu.filter((item) =>
    (category === "all" || item.category === category) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="menu-page" className="fade-up">
      <section className="py-8 sm:py-10">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight text-[#3D2817]">
          Монгол аялгууд,<br />ширээн дээр тань
        </h1>
        <p className="mt-3 max-w-xl text-sm sm:text-base text-[#5A4A42]">
          Халуун шинэ хоолыг 20-60 минутад хүргэж өгнө. Төлбөрөө банкны шилжүүлгээр төлөөрэй.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 rounded-full bg-[#E8A76A]/25 px-3 py-1.5 text-[#3D2817]">
            <Clock size={13} /> 20-60 минут
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#E8A76A]/25 px-3 py-1.5 text-[#3D2817]">
            <Landmark size={13} /> Банкны шилжүүлэг
          </span>
        </div>
      </section>

      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5A4A42]/60" />
        <input
          data-testid="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Хоол хайх..."
          className="w-full rounded-lg border border-[#3D2817]/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-[#C85C4A]"
        />
      </div>

      <div data-testid="category-bar" className="mt-5 flex gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            data-testid={`category-pill-${cat.id}`}
            onClick={() => setCategory(cat.id)}
            className={`pill-btn whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold ${
              category === cat.id
                ? "border-[#C85C4A] bg-[#C85C4A] text-[#F5F1ED]"
                : "border-[#3D2817]/15 bg-white text-[#5A4A42] hover:border-[#C85C4A]/50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p data-testid="menu-loading" className="py-16 text-center text-sm text-[#5A4A42]">Цэс ачааллаж байна...</p>
      ) : filtered.length === 0 ? (
        <p data-testid="menu-empty" className="py-16 text-center text-sm text-[#5A4A42]">Илэрц олдсонгүй.</p>
      ) : (
        <div data-testid="menu-grid" className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
