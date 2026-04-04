import React from 'react';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Archive,
  BookOpenText,
  BrainCircuit,
  Compass,
  FolderArchive,
  LifeBuoy,
  PanelLeftClose,
  Settings,
  Share2,
  Sparkles,
  Wifi,
  X,
} from 'lucide-react';
import Button from '../ui/Button';

const navigationItems = [
  { label: 'Knowledge Graph', icon: Share2, path: '/graph' },
  { label: 'Library', icon: BookOpenText, path: '/dashboard' },
  { label: 'Deep Focus Ai Chat', icon: BrainCircuit, path: '/deep-focus' },
  { label: 'Recent Discoveries', icon: Compass },
  { label: 'Archived Thoughts', icon: FolderArchive },
  { label: 'Settings', icon: Settings },
];

const Sidebar = ({
  user,
  isCompact = false,
  isMobile = false,
  onToggleCompact,
  onClose,
  onPrimaryAction,
}) => {
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'relative flex h-full flex-col border-r border-neutral-800 bg-[#0f1115] px-5 py-6',
        isCompact && !isMobile ? 'w-24 items-center px-2' : 'w-[280px]'
      )}
    >
      {/* HEADER */}
      <div className={clsx('flex items-start gap-3', isCompact && !isMobile && 'justify-center')}>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-800 text-neutral-200 shadow-sm">
          <Archive className="h-5 w-5" />
        </div>

        {!isCompact || isMobile ? (
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold text-neutral-100 tracking-tight">
             HumanBrain-AI
            </p>
            <p className="text-[11px] uppercase tracking-widest text-neutral-500">
              Knowledge System
            </p>
          </div>
        ) : null}

        {isMobile ? (
          <button
            onClick={onClose}
            className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        ) : onToggleCompact ? (
          <button
            onClick={onToggleCompact}
            className={clsx(
              'rounded-md p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white transition',
              isCompact && 'absolute right-2 top-5'
            )}
          >
            <PanelLeftClose
              className={clsx('h-4 w-4 transition', isCompact && 'rotate-180')}
            />
          </button>
        ) : null}
      </div>

      {/* ROLE TAG */}
      {!isCompact || isMobile ? (
        <div className="mt-6 inline-flex w-fit items-center rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Curator
        </div>
      ) : null}

      {/* NAVIGATION */}
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navigationItems.map((item) => {
          const NavIcon = item.icon;
          const isActive = item.path
            ? location.pathname.startsWith(item.path)
            : false;

          const baseClassName = clsx(
            'group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
            isCompact && !isMobile && 'justify-center px-0'
          );

          if (item.path) {
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                className={baseClassName}
              >
                {React.createElement(NavIcon, {
                  className: clsx(
                    'h-4 w-4 shrink-0 transition',
                    !isCompact || isMobile ? 'mr-3' : ''
                  ),
                })}
                {!isCompact || isMobile ? <span>{item.label}</span> : null}
              </NavLink>
            );
          }

          return (
            <button key={item.label} className={baseClassName}>
              {React.createElement(NavIcon, {
                className: clsx(
                  'h-4 w-4 shrink-0',
                  !isCompact || isMobile ? 'mr-3' : ''
                ),
              })}
              {!isCompact || isMobile ? <span>{item.label}</span> : null}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto w-full">
        <Button
          type="button"
          className={clsx(
            'w-full rounded-xl py-3 text-sm font-semibold bg-white text-black hover:bg-neutral-200 transition',
            isCompact && !isMobile && 'px-0'
          )}
          leadingIcon={<Sparkles className="h-4 w-4" />}
          onClick={onPrimaryAction}
        >
          {!isCompact || isMobile ? 'Capture Thought' : null}
        </Button>

        {!isCompact || isMobile ? (
          <div className="mt-6 space-y-3 border-t border-neutral-800 pt-5 text-xs text-neutral-500">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wifi className="h-3.5 w-3.5" />
                Sync Status
              </span>
              <span className="font-medium text-neutral-300">
                {user ? 'Online' : 'Idle'}
              </span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <LifeBuoy className="h-3.5 w-3.5" />
              Support
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default Sidebar;