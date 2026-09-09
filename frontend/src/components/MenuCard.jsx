import { Plus } from "lucide-react";

export default function MenuCard({ item, index, onAdd }) {
  return (
    <article
      data-testid={`menu-item-${item.id}`}
      className="menu-card fade-up overflow-hidden rounded-lg bg-white shadow-sm"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="h-44 overflow-hidden">
        <img src={item.img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-base font-bold text-[#3D2817]">{item.name}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.portions.map((p) => (
            <span key={p} className="rounded-full bg-[#F5F1ED] px-2.5 py-1 text-[11px] font-medium text-[#5A4A42]">
              {p}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span data-testid={`menu-item-price-${item.id}`} className="font-heading text-lg font-bold text-[#C85C4A]">
            {item.price.toLocaleString()}₮
          </span>
          <button
            data-testid={`add-to-cart-${item.id}`}
            onClick={() => onAdd(item)}
            className="flex items-center gap-1.5 rounded-md bg-[#C85C4A] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#b04c3c]"
          >
            <Plus size={14} /> Сагсанд
          </button>
        </div>
      </div>
    </article>
  );
}
