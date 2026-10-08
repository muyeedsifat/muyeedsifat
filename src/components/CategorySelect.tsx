'use client';

import { useRouter } from 'next/navigation';

type CategoryOption = {
  name: string;
  count: number;
};

export function CategorySelect({
  categories,
  activeCategory = '',
  totalCount,
  searchQuery = ''
}: {
  categories: CategoryOption[];
  activeCategory?: string;
  totalCount: number;
  searchQuery?: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const sp = new URLSearchParams();
    if (searchQuery) sp.set('q', searchQuery);
    if (val) sp.set('category', val);
    const qs = sp.toString();
    router.push(qs ? `/blog?${qs}` : '/blog');
  }

  return (
    <div className="categoryFilterDropdownWrap">
      <label htmlFor="blogCategorySelect" className="categorySelectLabel">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span>Category:</span>
      </label>
      <div className="categorySelectBox">
        <select
          id="blogCategorySelect"
          className="categorySelectControl"
          value={activeCategory}
          onChange={handleChange}
          aria-label="Filter blog posts by category"
        >
          <option value="">All Categories ({totalCount})</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
        <span className="categorySelectArrow" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}
