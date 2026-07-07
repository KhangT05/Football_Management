import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, ChevronRight, Link2, Check,
  List, ArrowUp, FileQuestion,
} from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import { articleApi } from '../api';

const getTagLabel = (tag) => {
  if (typeof tag === 'string') return tag;
  if (tag && typeof tag === 'object') return tag.tag || '';
  return '';
};

const estimateReadTime = (html) => {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));  
};

const slugify = (text, fallback) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48) || `muc-${fallback}`;

// Injects stable ids into h2/h3 headings inside the article HTML and
// returns a lightweight table of contents built from them.
const useProcessedContent = (html) =>
  useMemo(() => {
    if (!html) return { html: '', toc: [] };
    const toc = [];
    let counter = 0;
    const processed = html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
      counter += 1;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      if (!text) return match;
      const id = `${slugify(text, counter)}-${counter}`;
      toc.push({ id, text, level: tag });
      const cleanedAttrs = attrs.replace(/\sid="[^"]*"/i, '');
      return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
    });
    return { html: processed, toc };
  }, [html]);

// Single scroll listener shared by the top progress bar, the sticky
// compact header, and the back-to-top button.
const useScrollInfo = () => {
  const [state, setState] = useState({ progress: 0, scrollY: 0 });
  useEffect(() => {
    const handle = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setState({
        progress: total > 0 ? (el.scrollTop / total) * 100 : 0,
        scrollY: el.scrollTop,
      });
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  return state;
};

function FacebookShareLink({ compact = false }) {
  const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="Chia sẻ lên Facebook"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-light text-gray-300 hover:text-white hover:bg-navy border border-navy-light transition-colors"
      >
        <FaFacebook className="w-4 h-4" />
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-navy-light text-gray-300 hover:text-white border border-navy-light hover:bg-navy transition-colors"
    >
      <FaFacebook className="w-4 h-4" /> Facebook
    </a>
  );
}

function CopyLinkBtn({ compact = false }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };
  if (compact) {
    return (
      <button
        onClick={copy}
        title="Sao chép liên kết"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-light text-gray-300 hover:text-white hover:bg-navy border border-navy-light transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
      </button>
    );
  }
  return (
    <button onClick={copy} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-navy-light text-gray-300 hover:text-white hover:bg-navy border border-navy-light">
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
      {copied ? 'Đã sao chép' : 'Sao chép liên kết'}
    </button>
  );
}

function ReadingProgressBar({ progress }) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-60 bg-transparent">
      <div className="h-full bg-blue-500 transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}

function StickyHeader({ visible, title, onBack }) {
  return (
    <div
      className={`fixed top-1 left-0 w-full z-50 bg-navy-dark/90 backdrop-blur-md border-b border-navy-light transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
      }`}
    >
      <div className="container mx-auto px-4 max-w-5xl flex items-center gap-3 py-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-300 hover:text-white hover:bg-navy-light transition-colors shrink-0"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <p className="text-sm font-semibold text-white line-clamp-1 flex-1">{title}</p>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <FacebookShareLink compact />
          <CopyLinkBtn compact />
        </div>
      </div>
    </div>
  );
}

function BackToTop({ visible }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Lên đầu trang"
      className={`fixed bottom-6 right-5 sm:right-8 z-50 w-11 h-11 rounded-full bg-navy border border-navy-light text-gray-300 hover:text-white hover:border-gray-500 shadow-lg flex items-center justify-center transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef(null);

  const { progress, scrollY } = useScrollInfo();
  const showStickyHeader = scrollY > 360;
  const showBackToTop = scrollY > 700;

  useEffect(() => {
    let cancelled = false;
    const fetchArticle = async () => {
      setLoading(true); setError('');
      try {
        const res = await articleApi.getArticleBySlug(slug);
        if (!cancelled) {
          const data = res?.data ?? res;
          setArticle(data);
          const firstTag = data?.tags?.[0];
          const tagLabel = getTagLabel(firstTag);
          if (tagLabel) {
            articleApi.getArticles({ tag: tagLabel, per_page: 4, status: 'published' })
              .then(r => {
                const payload = typeof r?.status === 'boolean' ? r.data : r;
                const items = Array.isArray(payload?.data) ? payload.data : [];
                if (!cancelled) setRelated(items.filter(a => a.slug !== slug).slice(0, 3));
              }).catch(() => {});
          }
        }
      } catch { if (!cancelled) setError('Không tìm thấy bài viết hoặc bài viết đã bị xóa.'); }
      finally { if (!cancelled) setLoading(false); }
    };
    fetchArticle(); window.scrollTo({ top: 0 });
    return () => { cancelled = true; };
  }, [slug]);

  const { html: processedHtml, toc } = useProcessedContent(article?.content);

  // Highlight the heading currently in view inside the table of contents.
  useEffect(() => {
    if (!toc.length) return;
    const headingEls = toc.map(t => document.getElementById(t.id)).filter(Boolean);
    if (!headingEls.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-110px 0px -70% 0px', threshold: 0 }
    );
    headingEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  const scrollToHeading = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-navy-light border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Đang tải nội dung...</p>
      </div>
    </div>
  );

  if (error || !article) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-dark gap-6">
      <div className="bg-navy border border-navy-light rounded-2xl p-8 text-center max-w-sm w-full mx-4">
        <div className="w-14 h-14 rounded-full bg-navy-light flex items-center justify-center mx-auto mb-5">
          <FileQuestion className="w-6 h-6 text-gray-400" />
        </div>
        <p className="font-bold text-white mb-2 text-lg">Không tìm thấy bài viết</p>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button onClick={() => navigate('/tin-tuc')} className="px-5 py-2.5 bg-navy-light hover:bg-navy text-white font-medium rounded-lg transition-colors border border-navy-light text-sm">Quay lại danh sách</button>
      </div>
    </div>
  );

  const publishDate = article.published_at || article.created_at;
  const readTime = estimateReadTime(article.content);
  const tags = (article.tags || []).map(getTagLabel).filter(Boolean);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <>
      <ReadingProgressBar progress={progress} />
      <StickyHeader visible={showStickyHeader} title={article.title} onBack={() => navigate(-1)} />
      <BackToTop visible={showBackToTop} />

      <div className="min-h-screen bg-navy-dark">
        {/* Hero */}
        <div className="relative w-full overflow-hidden bg-navy-dark">
          {article.cover_image ? (
            <div className="h-[240px] sm:h-[340px] md:h-[420px] relative">
              <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-navy-dark via-navy-dark/5 to-transparent" />
            </div>
          ) : (
            <div className="h-[160px] sm:h-[200px] relative">
              <div className="absolute -top-16 right-0 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="absolute -bottom-20 left-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" />
            </div>
          )}
          <Link
            to="/tin-tuc"
            className="absolute top-6 left-4 sm:left-8 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium bg-navy-dark/70 backdrop-blur text-gray-300 hover:text-white border border-navy-light hover:border-gray-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Trở về
          </Link>
        </div>

        <div className="container mx-auto px-4 max-w-5xl pb-24">
          {/* Intro card, overlapping the hero */}
          <header className="relative -mt-10 sm:-mt-14 z-10 bg-navy border border-navy-light rounded-2xl shadow-2xl shadow-black/20 p-6 sm:p-10 animate-slide-up">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <Link key={tag} to={`/tin-tuc?tag=${encodeURIComponent(tag)}`} className="px-3 py-1 bg-navy-light text-gray-300 hover:text-white rounded-full text-xs font-medium transition-colors border border-navy-light">
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed font-medium mb-6">
                {article.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 border-t border-navy-light text-sm text-gray-400">
              {publishDate && (
                <span className="inline-flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-navy-light">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                  {new Date(publishDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-navy-light">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                </span>
                {readTime} phút đọc
              </span>
            </div>

            {/* Share row + collapsible ToC, visible below the desktop breakpoint only */}
            <div className="lg:hidden flex items-center gap-3 mt-6">
              <FacebookShareLink compact />
              <CopyLinkBtn compact />
            </div>

            {toc.length > 0 && (
              <details className="lg:hidden mt-6 bg-navy-light/40 border border-navy-light rounded-xl group">
                <summary className="flex items-center justify-between cursor-pointer list-none px-5 py-3.5 text-sm font-semibold text-white">
                  <span className="flex items-center gap-2"><List className="w-4 h-4" /> Mục lục</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                </summary>
                <nav className="flex flex-col gap-1 px-3 pb-4">
                  {toc.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={scrollToHeading(item.id)}
                      className={`text-sm py-1.5 px-3 rounded-md transition-colors leading-snug ${item.level === 'h3' ? 'pl-6 text-[13px]' : ''} ${
                        activeId === item.id ? 'text-blue-400 bg-navy font-medium' : 'text-gray-400 hover:text-white hover:bg-navy/60'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </details>
            )}
          </header>

          {/* Content + sticky rails */}
          <div className="grid grid-cols-1 lg:grid-cols-[56px_minmax(0,1fr)_260px] gap-x-8 gap-y-10 mt-10">
            {/* Left: sticky share dock (desktop only) */}
            <aside className="hidden lg:flex flex-col items-center gap-3 sticky top-24 self-start h-fit">
              <FacebookShareLink compact />
              <CopyLinkBtn compact />
              <div className="w-6 h-px bg-navy-light my-1" />
              <div className="relative w-11 h-11">
                <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
                  <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-navy-light" />
                  <circle
                    cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    className="text-blue-500"
                    style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset, transition: 'stroke-dashoffset 120ms linear' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-300">
                  {Math.round(progress)}%
                </span>
              </div>
            </aside>

            {/* Main article */}
            <article ref={contentRef} className="min-w-0 animate-slide-up">
              <div
                className="prose prose-invert max-w-none [&_h2]:scroll-mt-28 [&_h3]:scroll-mt-28 prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-blockquote:border-l-4 prose-blockquote:border-gray-500 prose-blockquote:bg-navy-light/30 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:text-gray-400 prose-blockquote:not-italic prose-img:rounded-xl prose-img:mx-auto prose-code:bg-navy-light prose-code:text-gray-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-navy prose-pre:border prose-pre:border-navy-light prose-pre:rounded-xl prose-hr:border-navy-light prose-li:text-gray-300 wrap-break-word"
                style={{ overflowWrap: 'anywhere' }}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />

              <div className="mt-12 pt-8 border-t border-navy-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-white mb-3">Chia sẻ bài viết</p>
                  <div className="flex items-center flex-wrap gap-3">
                    <FacebookShareLink />
                    <CopyLinkBtn />
                  </div>
                </div>
                {tags.length > 0 && (
                  <div className="sm:text-right">
                    <p className="text-sm font-semibold text-white mb-3">Chủ đề</p>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {tags.map(tag => (
                        <Link key={tag} to={`/tin-tuc?tag=${encodeURIComponent(tag)}`} className="px-3 py-1 rounded-full text-sm font-medium bg-transparent text-gray-400 border border-navy-light hover:text-white hover:bg-navy-light transition-colors">#{tag}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Right: sticky ToC (desktop only), falls back to tags */}
            <aside className="hidden lg:block sticky top-24 self-start h-fit">
              {toc.length > 0 ? (
                <div className="bg-navy-light/40 border border-navy-light rounded-xl p-5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                    <List className="w-3.5 h-3.5" /> Mục lục
                  </p>
                  <nav className="flex flex-col gap-1 max-h-[55vh] overflow-y-auto pr-1">
                    {toc.map(item => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={scrollToHeading(item.id)}
                        className={`text-sm py-1.5 px-2.5 rounded-md transition-colors leading-snug ${item.level === 'h3' ? 'pl-5 text-[13px]' : ''} ${
                          activeId === item.id ? 'text-blue-400 bg-navy font-medium' : 'text-gray-400 hover:text-white hover:bg-navy/60'
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              ) : tags.length > 0 ? (
                <div className="bg-navy-light/40 border border-navy-light rounded-xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Chủ đề</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Link key={tag} to={`/tin-tuc?tag=${encodeURIComponent(tag)}`} className="px-3 py-1 bg-navy text-gray-300 hover:text-white rounded-full text-xs font-medium transition-colors border border-navy-light">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="border-t border-navy-light pt-10 mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Bài viết liên quan</h2>
                <Link to="/tin-tuc" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1">Xem tất cả <ChevronRight className="w-4 h-4" /></Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map(a => (
                  <Link key={a.id} to={`/tin-tuc/${a.slug}`} className="group block bg-navy rounded-xl overflow-hidden border border-navy-light hover:border-gray-500 transition-colors">
                    {(a.cover_image || a.thumbnail) ? (
                      <div className="w-full h-40 overflow-hidden bg-navy-light">
                        <img src={a.cover_image || a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-navy-light flex items-center justify-center border-b border-navy-light">
                        <span className="text-gray-500 font-medium">Bài viết</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors mb-3 leading-snug">{a.title}</h3>
                      <div className="flex items-center justify-between">
                        {(a.published_at || a.created_at) && (
                          <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />{new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}