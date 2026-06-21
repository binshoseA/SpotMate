import { CATEGORY_STYLES } from "@/lib/constants";
import type { ActivityCategory } from "@/lib/types";

export function CategoryBadge({ category }: { category: ActivityCategory }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${CATEGORY_STYLES[category]}`}
    >
      {category}
    </span>
  );
}
