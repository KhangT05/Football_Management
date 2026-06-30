import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react';
import { articleApi } from '../api';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await articleApi.getArticleBySlug(slug);
        if (!cancelled) setArticle(res.data);
      } catch (err) {
        if (!cancelled) {
          setError('Không tìm thấy bài viết hoặc bài viết đã bị xóa.');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    fetchArticle();
      
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 lg:py-32 bg-navy-dark min-h-screen relative flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-navy-light border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-20 lg:py-32 bg-navy-dark min-h-screen relative flex flex-col items-center justify-center">
        <p className="text-red-400 mb-6">{error}</p>
        <button onClick={() => navigate('/tin-tuc')} className="px-6 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-colors">
          Quay lại danh sách tin tức
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-16 bg-navy-dark min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Back button */}
          <Link to="/tin-tuc" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Trở về
          </Link>

          {/* Article Header */}
          <div className="mb-10 animate-slide-up">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
              <span className="flex items-center gap-1.5 bg-navy border border-navy-light px-3 py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              
              {article.tags && article.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-lg md:text-xl text-gray-300 font-medium italic border-l-4 border-blue-500 pl-4 py-1 bg-navy/30 rounded-r-lg">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="w-full aspect-21/9 rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-blue-900/20 border border-navy-light animate-fade-in">
              <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Article Body */}
          <div className="bg-navy/40 backdrop-blur-xl border border-navy-light rounded-4xl p-6 md:p-12 shadow-2xl animate-slide-up">
            <div 
              className="prose prose-invert prose-blue max-w-none 
                         prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight 
                         prose-a:text-neon hover:prose-a:text-blue-400
                         prose-img:rounded-2xl prose-img:border prose-img:border-navy-light prose-img:shadow-xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Share / Footer */}
            <div className="mt-12 pt-8 border-t border-navy-light/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chia sẻ bài viết</span>
                <button className="w-10 h-10 rounded-full bg-navy border border-navy-light flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
