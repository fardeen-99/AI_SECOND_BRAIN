import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RefreshCcw, SearchX, Sparkles, X, Zap,
  Link2, Upload, Hash, Grid3x3, ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useSelector } from 'react-redux';
import MainLayout from '../../components/layout/MainLayout';
import SaveLinkPanel from '../../features/content-ingest/components/SaveLinkPanel';
import UploadPanel from '../../features/content-ingest/components/UploadPanel';
import MasonryGrid from '../../components/content/MasonryGrid';
import ContentCard from '../../components/content/ContentCard';
import ContentViewer from '../../components/content/ContentViewer';
import TagChip from '../../components/content/TagChip';
import { normalizeContentCollection } from '../../components/content/utils';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import ResurfacingSection from '../../features/resurfacing/components/ResurfacingSection';
import {
  useGetContent, useSaveContent, useFilteredContent, useUploadContent,
} from '../../hooks/useContent';
import { useContentViewer } from '../../hooks/useContentViewer';
import { useLogout } from '../../hooks/useAuth';
import { useSemanticSearch } from '../../features/search/hooks/useSemanticSearch';
import { notify } from '../../utils/toast';

// ─── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Links', 'Documents', 'Images', 'Video', 'Social'];
const EASE       = [0.22, 1, 0.36, 1];

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: EASE },
  }),
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } },
};

// ─── Ambient orb — follows cursor gently in the header ────────────────────────
const AmbientOrb = () => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, { stiffness: 60, damping: 18 });
  const y    = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set(e.clientX - rect.left - rect.width  / 2);
      rawY.set(e.clientY - rect.top  - rect.height / 2);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [rawX, rawY]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-[80px]"
        style={{ x, y, background: 'var(--color-accent, #f8ae1d)' }}
      />
    </div>
  );
};

// ─── Ingest toggle — compact tab strip for Save Link / Upload ─────────────────
const IngestToggle = ({ active, onChange }) => (
  <div className="inline-flex items-center p-1 rounded-artifact fine-border bg-obsidian-900/60 gap-1">
    {[
      { id: 'link',   icon: Link2,   label: 'Save Link'   },
      { id: 'upload', icon: Upload,  label: 'Upload File' },
    ].map(({ id, icon: Icon, label }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold
          transition-all duration-200
          ${active === id
            ? 'bg-accent text-ink-950 shadow-sm'
            : 'text-ivory/40 hover:text-ivory'}
        `}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
        {label}
      </button>
    ))}
  </div>
);

// ─── Stat pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full fine-border bg-obsidian-900/40">
    <span className="text-ivory text-sm font-bold tabular-nums">{value}</span>
    <span className="text-ivory/25 text-[10px] font-semibold uppercase tracking-[0.12em]">{label}</span>
  </div>
);

// ─── Category strip ────────────────────────────────────────────────────────────
const CategoryStrip = ({ categories, selected, onChange }) => (
  <div className="flex items-center gap-1.5 overflow-x-auto obsidian-scroll pb-0.5">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={`
          relative shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold
          transition-all duration-200
          ${selected === cat
            ? 'text-ink-950 bg-accent'
            : 'text-ivory/40 hover:text-ivory fine-border bg-obsidian-900/40 hover:border-ivory/15'}
        `}
      >
        {cat}
        {selected === cat && (
          <motion.span
            layoutId="cat-indicator"
            className="absolute inset-0 rounded-full bg-accent -z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    ))}
  </div>
);

// ─── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ icon: Icon, children }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full fine-border bg-obsidian-900/60 border-accent/15">
    <Icon className="w-3 h-3 text-accent" />
    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/80">{children}</span>
  </div>
);

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user }                       = useSelector((s) => s.auth);
  const { items, loading, error }      = useSelector((s) => s.content);
  const { getContent }                 = useGetContent();
  const { saveContent, loading: saveLoading }   = useSaveContent();
  const { upload, loading: uploadLoading }      = useUploadContent();
  const { performLogout, loading: logoutLoading } = useLogout();
  const { selectedContent, isViewerOpen, closeViewer } = useContentViewer();

  const {
    query: searchQuery, setQuery: setSearchQuery,
    results: semanticResults, loading: semanticLoading, error: semanticError,
    runSearch, clearSearch, isSearchActive,
  } = useSemanticSearch({ autoSearch: true, debounceMs: 350, topK: 12 });

  const [urlInput,       setUrlInput]       = useState('');
  const [uploadTitle,    setUploadTitle]    = useState('');
  const [selectedFile,   setSelectedFile]   = useState(null);
  const [selectedTag,    setSelectedTag]    = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isResultsHighlighted, setIsResultsHighlighted] = useState(false);
  const [pendingCanvasFocusToken, setPendingCanvasFocusToken] = useState(0);
  const [ingestMode,     setIngestMode]     = useState('link');
  const [ingestOpen,     setIngestOpen]     = useState(true);

  const saveInputRef        = useRef(null);
  const fileInputRef        = useRef(null);
  const resultsSectionRef   = useRef(null);
  const pendingResultsFocusRef  = useRef(null);
  const scrollTimeoutRef    = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const canvasFocusFrameRef = useRef(null);
  const hasMountedRef       = useRef(false);

  useEffect(() => { getContent(); }, []); // eslint-disable-line

  useEffect(() => () => {
    window.clearTimeout(scrollTimeoutRef.current);
    window.clearTimeout(highlightTimeoutRef.current);
    window.cancelAnimationFrame(canvasFocusFrameRef.current);
  }, []);

  useEffect(() => () => { closeViewer(); }, [closeViewer]);

  const handleSave = async (e) => {
    e.preventDefault();
    const url = urlInput.trim();
    if (!url) { notify.info('Paste a URL to archive it.', { toastId: 'save-url-empty' }); return; }
    if (!isValidHttpUrl(url)) { notify.warning('Enter a valid URL starting with http:// or https://.', { toastId: 'save-url-invalid' }); return; }
    const result = await saveContent({ url });
    if (result.success) { setUrlInput(''); setPendingCanvasFocusToken(Date.now()); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) { setSelectedFile(null); return; }
    if (!isSupportedUploadFile(file)) {
      notify.warning('Choose a PDF or image file to upload.', { toastId: 'upload-file-invalid' });
      e.target.value = '';
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) { notify.info('Select a PDF or image before uploading.', { toastId: 'upload-file-empty' }); return; }
    const fd = new FormData();
    fd.append('file', selectedFile);
    const t = uploadTitle.trim();
    if (t) fd.append('title', t);
    const result = await upload(fd);
    if (result.success) {
      setSelectedFile(null); setUploadTitle('');
      setPendingCanvasFocusToken(Date.now());
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    items.forEach((item) => {
      (item.tags || []).forEach((tag) => {
        const t = String(tag || '').toLowerCase().trim();
        if (t && t !== 'upload') tags.add(t);
      });
    });
    return Array.from(tags).slice(0, 12);
  }, [items]);

  const flashResultsSection = useCallback(() => {
    window.clearTimeout(highlightTimeoutRef.current);
    setIsResultsHighlighted(true);
    highlightTimeoutRef.current = window.setTimeout(() => setIsResultsHighlighted(false), 700);
  }, []);

  const scrollToResults = useCallback(() => {
    const el = resultsSectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = el.getBoundingClientRect().top;
    if (top < 96 || top > window.innerHeight * 0.35) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
    flashResultsSection();
  }, [flashResultsSection]);

  const queueResultsFocus = useCallback((type) => {
    pendingResultsFocusRef.current = type === 'search'
      ? { type: 'search', phase: 'awaiting-search-start' }
      : { type: 'filter', phase: 'ready' };
  }, []);

  const handleSearchChange = useCallback((q) => {
    const v = String(q || '');
    if (v.trim()) queueResultsFocus('search');
    else { pendingResultsFocusRef.current = null; setIsResultsHighlighted(false); }
    setSearchQuery(v);
  }, [queueResultsFocus, setSearchQuery]);

  const handleCategoryChange = useCallback((cat) => {
    if (cat === selectedCategory) return;
    if (!isSearchActive) queueResultsFocus('filter');
    setSelectedCategory(cat);
  }, [isSearchActive, queueResultsFocus, selectedCategory]);

  const handleTagChange = useCallback((tag) => {
    if (tag === selectedTag) return;
    queueResultsFocus('filter');
    setSelectedTag(tag);
  }, [queueResultsFocus, selectedTag]);

  const handleClearSearch = useCallback(() => {
    pendingResultsFocusRef.current = null;
    setIsResultsHighlighted(false);
    clearSearch();
  }, [clearSearch]);

  const { filteredContent: filteredItems } = useFilteredContent(items, { selectedTag, selectedCategory });
  const hasInitialLoadingState = loading && !items.length;

  const availableContentIds = useMemo(
    () => new Set(items.map((i) => String(i?._id || i?.id || '').trim()).filter(Boolean)),
    [items],
  );

  const normalizedFeedItems   = useMemo(() => normalizeContentCollection(filteredItems, { context: 'feed' }), [filteredItems]);
  const normalizedSearchItems = useMemo(
    () => normalizeContentCollection(semanticResults, { context: 'search' }).filter((item) => {
      if (!item?.deleteId || !availableContentIds.size) return true;
      return availableContentIds.has(String(item.deleteId).trim());
    }),
    [availableContentIds, semanticResults],
  );

  const dataToRender  = isSearchActive ? normalizedSearchItems : normalizedFeedItems;
  const isGridLoading = isSearchActive ? semanticLoading : hasInitialLoadingState;
  const activeError   = isSearchActive ? semanticError : error;
  const resultCount   = dataToRender.length;
  const totalCount    = isSearchActive ? normalizedSearchItems.length : items.length;

  useEffect(() => {
    if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
    const pf = pendingResultsFocusRef.current;
    if (!pf) return;
    if (pf.type === 'search') {
      if (pf.phase === 'awaiting-search-start') {
        if (!semanticLoading) return;
        pendingResultsFocusRef.current = { type: 'search', phase: 'awaiting-search-complete' };
        return;
      }
      if (semanticLoading) return;
    }
    if (pf.type === 'filter' && hasInitialLoadingState) return;
    window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      scrollToResults();
      pendingResultsFocusRef.current = null;
    }, 80);
    return () => window.clearTimeout(scrollTimeoutRef.current);
  }, [activeError, dataToRender.length, hasInitialLoadingState, scrollToResults, searchQuery, selectedCategory, selectedTag, semanticLoading]);

  useEffect(() => {
    if (!pendingCanvasFocusToken) return;
    window.cancelAnimationFrame(canvasFocusFrameRef.current);
    canvasFocusFrameRef.current = window.requestAnimationFrame(() => {
      scrollToResults();
      setPendingCanvasFocusToken(0);
    });
    return () => window.cancelAnimationFrame(canvasFocusFrameRef.current);
  }, [pendingCanvasFocusToken, scrollToResults]);

  return (
    <MainLayout
      user={user}
      searchValue={searchQuery}
      onSearchChange={handleSearchChange}
      categories={CATEGORIES}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      onPrimaryAction={() => saveInputRef.current?.focus()}
      onLogout={performLogout}
      logoutLoading={logoutLoading}
      searchPlaceholder="Search your second brain…"
    >
      <div className="relative min-h-screen pb-24">

        {/* ── Page-level ambient glow ─────────────────────────────────────── */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px]"
            style={{ opacity: isSearchActive ? 0.08 : 0.04, background: 'var(--color-accent)', transition: 'opacity 0.8s ease' }}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1 — COMMAND HEADER
            Full-width editorial band. Title, greeting, live stats, ingest controls.
        ═══════════════════════════════════════════════════════════════════ */}
        <header className="relative border-b border-ivory/[0.05] overflow-hidden">
          <AmbientOrb />

          <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

              {/* Left — identity + heading */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
                className="flex flex-col gap-4"
              >
                <motion.div variants={fadeUp}>
                  <SectionLabel icon={Zap}>Knowledge Canvas</SectionLabel>
                </motion.div>

                <motion.div variants={fadeUp} custom={1}>
                  <h1
                    className="font-serif font-black text-ivory leading-[1.04] tracking-[-0.035em]"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}
                  >
                    {isSearchActive ? (
                      <>
                        Searching{' '}
                        <span className="text-accent italic">"{searchQuery}"</span>
                      </>
                    ) : (
                      <>
                        Good{' '}
                        <span className="text-accent">
                          {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
                        </span>
                        {user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
                      </>
                    )}
                  </h1>
                  <p className="mt-2 text-ivory/35 text-sm leading-relaxed max-w-[48ch]">
                    {isSearchActive
                      ? `${resultCount} semantic match${resultCount !== 1 ? 'es' : ''} retrieved from your archive.`
                      : 'Your captured knowledge, ready to recall.'}
                  </p>
                </motion.div>

                {/* Live stats row */}
                <motion.div variants={fadeUp} custom={2} className="flex flex-wrap items-center gap-2.5 mt-1">
                  <StatPill value={items.length} label="archived" />
                  <StatPill value={allTags.length - 1} label="tags" />
                  {isSearchActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <StatPill value={resultCount} label="matches" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              {/* Right — ingest panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                className="lg:min-w-[420px] xl:min-w-[480px]"
              >
                {/* Panel chrome */}
                <div className="rounded-artifact-xl fine-border bg-obsidian-900/50 backdrop-blur-sm overflow-hidden shadow-deep">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ivory/[0.05]">
                    <IngestToggle active={ingestMode} onChange={setIngestMode} />
                    <button
                      onClick={() => setIngestOpen((v) => !v)}
                      className="text-ivory/20 hover:text-ivory/50 transition-colors"
                      aria-label={ingestOpen ? 'Collapse panel' : 'Expand panel'}
                    >
                      <motion.div animate={{ rotate: ingestOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                  </div>

                  {/* Panel body */}
                  <AnimatePresence initial={false}>
                    {ingestOpen && (
                      <motion.div
                        key="ingest-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="p-5">
                          <AnimatePresence mode="wait">
                            {ingestMode === 'link' ? (
                              <motion.div key="link" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <SaveLinkPanel
                                  value={urlInput}
                                  onChange={setUrlInput}
                                  onSubmit={handleSave}
                                  loading={saveLoading}
                                  inputRef={saveInputRef}
                                />
                              </motion.div>
                            ) : (
                              <motion.div key="upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                                <UploadPanel
                                  selectedFile={selectedFile}
                                  title={uploadTitle}
                                  onTitleChange={setUploadTitle}
                                  onFileChange={handleFileChange}
                                  onSubmit={handleUpload}
                                  loading={uploadLoading}
                                  fileInputRef={fileInputRef}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2 — RESURFACING (only in feed mode)
        ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {!isSearchActive && (
            <motion.div
              key="resurfacing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
                <ResurfacingSection />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3 — CANVAS TOOLBAR + FEED
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 mt-10">

          {/* ── Toolbar ────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8"
          >
            {/* Left: section label + count */}
            <div className="flex items-center gap-4">
              <SectionLabel icon={isSearchActive ? Sparkles : Grid3x3}>
                {isSearchActive ? 'Search Results' : 'Archive'}
              </SectionLabel>
              <span className="text-ivory/20 text-xs font-medium tabular-nums">
                {resultCount} / {totalCount}
              </span>
            </div>

            {/* Right: tag filter OR clear search */}
            <AnimatePresence mode="wait">
              {isSearchActive ? (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleClearSearch}
                  className="
                    group inline-flex items-center gap-2
                    px-4 py-2 rounded-artifact fine-border
                    text-ivory/40 text-xs font-semibold
                    hover:text-ivory hover:border-ivory/20
                    transition-all duration-200
                  "
                >
                  <X className="w-3.5 h-3.5" />
                  Clear search
                </motion.button>
              ) : (
                <motion.div
                  key="tags"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  {/* Category row */}
                  <CategoryStrip
                    categories={CATEGORIES}
                    selected={selectedCategory}
                    onChange={handleCategoryChange}
                  />
                  {/* Tag row */}
                  {allTags.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto obsidian-scroll pb-0.5">
                      <Hash className="w-3 h-3 text-ivory/20 shrink-0" aria-hidden="true" />
                      {allTags.map((tag) => (
                        <TagChip
                          key={tag}
                          label={tag}
                          active={selectedTag === tag}
                          onClick={() => handleTagChange(tag)}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Inline error banner ─────────────────────────────────────────── */}
          <AnimatePresence>
            {!isSearchActive && activeError && items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <GlassCard className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-ivory/50 border-red-500/10 bg-red-500/[0.04]">
                  <p>{typeof activeError === 'string' ? activeError : 'Something went wrong while refreshing your archive.'}</p>
                  <Button type="button" variant="surface" leadingIcon={<RefreshCcw className="h-4 w-4" />} onClick={getContent}>
                    Retry
                  </Button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Results container ───────────────────────────────────────────── */}
          <div
            ref={resultsSectionRef}
            className={`
              scroll-mt-32 rounded-artifact-xl transition-all duration-500
              ${isResultsHighlighted
                ? 'ring-1 ring-accent/20 shadow-[0_0_40px_rgba(248,174,29,0.08)]'
                : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {activeError && !dataToRender.length && !isGridLoading ? (
                <motion.div key="error" variants={scaleIn} initial="hidden" animate="visible">
                  <DashboardErrorState
                    onRetry={isSearchActive ? () => runSearch(searchQuery) : getContent}
                    message={activeError}
                    eyebrow={isSearchActive ? 'Search Error' : 'Sync Error'}
                    title={isSearchActive ? 'The knowledge query could not be completed.' : 'The archive could not be loaded.'}
                    actionLabel={isSearchActive ? 'Retry Search' : 'Retry'}
                  />
                </motion.div>
              ) : dataToRender.length > 0 || isGridLoading ? (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  <MasonryGrid
                    items={dataToRender}
                    loading={isGridLoading}
                    renderItem={(item, index) => <ContentCard content={item} index={index} />}
                  />
                </motion.div>
              ) : (
                <motion.div key="empty" variants={scaleIn} initial="hidden" animate="visible">
                  <DashboardEmptyState
                    mode={
                      isSearchActive ? 'search'
                        : selectedTag !== 'All' || selectedCategory !== 'All' ? 'filter'
                          : 'default'
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <ContentViewer content={selectedContent} isOpen={isViewerOpen} onClose={closeViewer} />
    </MainLayout>
  );
};

// ─── Error state ───────────────────────────────────────────────────────────────
function DashboardErrorState({ message, onRetry, eyebrow = 'Sync Error', title, actionLabel = 'Retry' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-14 h-14 rounded-artifact flex items-center justify-center bg-red-500/10 border border-red-500/20 mb-6">
        <RefreshCcw className="w-6 h-6 text-red-400" strokeWidth={1.5} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400/70 mb-3">{eyebrow}</p>
      <h2 className="font-serif font-black text-ivory text-2xl tracking-tight mb-3">{title}</h2>
      <p className="text-ivory/30 text-sm leading-relaxed max-w-sm mb-8">
        {typeof message === 'string' ? message : 'A network error interrupted the dashboard refresh.'}
      </p>
      <button
        onClick={onRetry}
        className="
          inline-flex items-center gap-2 px-6 py-3 rounded-artifact
          bg-ivory text-ink-950 text-sm font-bold
          hover:bg-accent hover:text-white
          transition-all duration-200 shadow-artifact
        "
      >
        <RefreshCcw className="w-4 h-4" />
        {actionLabel}
      </button>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function DashboardEmptyState({ mode = 'default' }) {
  const copy = {
    search:  { title: 'No semantic matches', body: 'Try rephrasing your question or broadening the query to surface a different slice.' },
    filter:  { title: 'Nothing here yet', body: 'Try adjusting the tag or category filters to explore your archive.' },
    default: { title: 'Your archive is empty', body: 'Save a link or upload a document above to start building your knowledge canvas.' },
  }[mode];

  return (
    <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
      {/* Animated icon */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-artifact flex items-center justify-center bg-accent/8 border border-accent/15 mb-8"
      >
        <SearchX className="w-7 h-7 text-accent/60" strokeWidth={1.5} />
      </motion.div>

      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 mb-3">
        {mode === 'search' ? 'Semantic Search' : mode === 'filter' ? 'Filtered View' : 'Getting Started'}
      </p>
      <h2 className="font-serif font-black text-ivory text-2xl tracking-tight mb-3">{copy.title}</h2>
      <p className="text-ivory/30 text-sm leading-relaxed max-w-[36ch]">{copy.body}</p>

      {/* Decorative dots */}
      <div aria-hidden="true" className="flex gap-1.5 mt-10">
        {[0.3, 0.6, 1, 0.6, 0.3].map((o, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-accent"
            animate={{ opacity: [o * 0.3, o, o * 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

function isSupportedUploadFile(file) {
  if (!file) return false;
  const t = String(file.type || '').toLowerCase();
  const n = String(file.name || '').toLowerCase();
  return t === 'application/pdf' || t.startsWith('image/')
    || /\.(pdf|png|jpe?g|webp|gif|bmp|svg)$/i.test(n);
}

export default Dashboard;