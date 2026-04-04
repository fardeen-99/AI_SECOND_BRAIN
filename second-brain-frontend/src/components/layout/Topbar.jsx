import React from 'react';
import clsx from 'clsx';
import { Bell, LogOut, Menu, PanelLeft, Search, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Topbar = ({
  user,
  searchValue,
  onSearchChange,
  showSearch = true,
  categories = [],
  selectedCategory,
  onCategoryChange,
  onOpenSidebar,
  onToggleCompact,
  onLogout,
  logoutLoading,
  isSidebarCompact = false,
  stableDesktopInset = false,
  searchPlaceholder = 'Search the archive...',
  rightMetaLabel,
}) => {
  const initials = getUserInitials(user);
  const hasCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 z-30 transition-all duration-300 ',
        stableDesktopInset || !isSidebarCompact
          ? 'lg:left-[280px]'
          : 'lg:left-24',
        'left-0'
      )}
    >
      <div className="border-b border-neutral-800 bg-[#0f1115]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">

          {/* TOP ROW */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            <Button
              type="button"
              variant="icon"
              className="lg:hidden"
              onClick={onOpenSidebar}
              leadingIcon={<Menu className="h-4 w-4" />}
              aria-label="Open navigation"
            />

            {/* DESKTOP COLLAPSE */}
            <Button
              type="button"
              variant="icon"
              className="hidden xl:inline-flex"
              onClick={onToggleCompact}
              leadingIcon={<PanelLeft className="h-4 w-4" />}
              aria-label="Toggle sidebar"
            />

            {/* SEARCH */}
            {showSearch ? (
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-neutral-600 focus:bg-neutral-900"
                />
              </div>
            ) : (
              <div className="flex-1" />
            )}

            {/* ACTIONS */}
            <div className="hidden items-center gap-2 md:flex">

              <ActionIcon>
                <Bell className="h-4 w-4" />
              </ActionIcon>

              <ActionIcon>
                <Sparkles className="h-4 w-4" />
              </ActionIcon>

              <ActionIcon
                onClick={onLogout}
                loading={logoutLoading}
              >
                {!logoutLoading && <LogOut className="h-4 w-4" />}
              </ActionIcon>

              {/* AVATAR */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-sm font-semibold text-white hover:bg-neutral-700 transition"
                title={user?.username || user?.email || 'Profile'}
              >
                {initials}
              </button>

            </div>
          </div>

          {/* CATEGORY ROW */}
          {hasCategories || rightMetaLabel ? (
            <div className="flex flex-wrap items-center justify-between gap-3">

              {/* CATEGORY PILLS */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={clsx(
                      'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                      selectedCategory === category
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-500 hover:text-white hover:bg-neutral-800'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* META TEXT */}
              <div className="hidden text-xs uppercase tracking-wider text-neutral-500 md:block">
                {rightMetaLabel || `Curated for ${user?.username || 'your library'}`}
              </div>

            </div>
          ) : null}

        </div>
      </div>
    </header>
  );
};

/* SMALL CLEAN COMPONENT (NO FUNCTIONAL CHANGE) */
const ActionIcon = ({ children, onClick, loading }) => (
  <button
    onClick={onClick}
    className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
  >
    {loading ? (
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-white" />
    ) : (
      children
    )}
  </button>
);

function getUserInitials(user) {
  const source = String(user?.username || user?.name || user?.email || 'SB').trim();
  const segments = source.split(/[\s@._-]+/).filter(Boolean);

  if (!segments.length) {
    return 'SB';
  }

  return segments
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('');
}

export default Topbar;