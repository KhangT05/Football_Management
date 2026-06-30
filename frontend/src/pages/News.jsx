import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, Tag, ChevronRight, Search } from 'lucide-react';
import { articleApi } from '../api';
import Pagination from '../components/ui/Pagination';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    articleApi.getTags()
      .then(res => {
        const tags = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setAvailableTags(tags);
      })
      .catch(() => {
        // Backend error, fail gracefully without alarming console
        setAvailableTags([]);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    const fetchNews = async () => {
      setLoading(true);
      
      try {
        // Build query params
        const params = {
          page: currentPage,
          per_page: itemsPerPage,
          status: 'published', // only show published articles to public
        };
        if (searchQuery) params.q = searchQuery;
        if (activeTag) params.tag = activeTag;

        const res = await articleApi.getArticles(params);
        if (!cancelled) {
          setArticles(res.data.data || []);
          setTotalPages(res.data.meta?.last_page || 1);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Không thể tải danh sách tin tức.');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    fetchNews();
      
    return () => { cancelled = true; };
  }, [currentPage, itemsPerPage, searchQuery, activeTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // the useEffect will trigger because searchQuery state (if bound to input) changes, 
    // but here we might want to decouple input state from query state if we want to submit on enter.
    // Assuming searchQuery is bound directly to input onChange for live search, or we can use a separate state.
  };

  return (
    <div className="py-12 lg:py-16 bg-navy-dark min-h-screen relative">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Title */}
          <div className="text-center mb-10 md:mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon uppercase italic tracking-tight mb-4 drop-shadow-md">
              Tin <span className="text-white">Tức</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium">
              Cập nhật những thông tin mới nhất về giải đấu, các đội bóng và cầu thủ.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 animate-fade-in bg-navy/40 backdrop-blur-xl border border-navy-light rounded-4xl p-6 shadow-2xl">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input 
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-navy-dark/80 border border-navy-light rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
            
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 md:flex-wrap items-center">
              <button
                onClick={() => { setActiveTag(''); setCurrentPage(1); }}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTag === '' ? 'bg-blue-600 text-white shadow-lg' : 'bg-navy-dark text-gray-400 hover:text-white border border-navy-light'
                }`}
              >
                Tất cả
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => { setActiveTag(tag); setCurrentPage(1); }}
                  className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                    activeTag === tag ? 'bg-blue-600 text-white shadow-lg' : 'bg-navy-dark text-gray-400 hover:text-white border border-navy-light'
                  }`}
                >
                  <Tag className="w-3 h-3" /> {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-navy/50 border border-navy-light rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400 bg-navy/30 rounded-3xl border border-red-500/20 backdrop-blur-sm">
              <p>{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-5 text-gray-500 animate-fade-in bg-navy/30 rounded-4xl border border-navy-light/50 border-dashed backdrop-blur-sm">
              <div className="p-5 bg-navy border border-navy-light rounded-full shadow-lg">
                <Newspaper className="w-12 h-12 text-blue-400" />
              </div>
              <p className="font-bold text-lg text-white">Chưa có bài viết nào.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {articles.map(article => (
                  <Link to={`/tin-tuc/${article.slug}`} key={article.id} className="group flex flex-col bg-navy/80 border border-navy-light hover:border-blue-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1">
                    <div className="aspect-video bg-navy-dark relative overflow-hidden">
                      {article.cover_image ? (
                        <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Newspaper className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-blue-600/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
                            {article.tags[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN')}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-blue-400 text-sm font-bold uppercase tracking-wider group-hover:text-neon transition-colors mt-auto">
                        Đọc tiếp <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(limit) => { setItemsPerPage(limit); setCurrentPage(1); }}
                  />
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
