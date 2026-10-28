import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CommunityCategory } from '../types.ts';
import { X, Plus, Trash2, BarChart2, Sparkles, Image as ImageIcon } from 'lucide-react';

const CATEGORIES: CommunityCategory[] = [
  'Dúvida',
  'Curiosidade',
  'Notícia',
  'Review',
  'LFG',
];

export const CreatePostModal: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen, createPost } = useApp();

  const [category, setCategory] = useState<CommunityCategory>('Dúvida');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Poll state
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  if (!isCreatePostOpen) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions((prev) => [...prev, '']);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateOption = (idx: number, val: string) => {
    setPollOptions((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const validPollOptions = pollOptions.map((o) => o.trim()).filter(Boolean);

    createPost({
      category,
      content: content.trim(),
      tags,
      imageUrl: imageUrl.trim() || undefined,
      pollQuestion: showPoll && pollQuestion.trim() ? pollQuestion.trim() : undefined,
      pollOptions:
        showPoll && validPollOptions.length >= 2 ? validPollOptions : undefined,
    });

    // Reset and close
    setContent('');
    setTagsInput('');
    setImageUrl('');
    setShowPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setIsCreatePostOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={() => setIsCreatePostOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
    >
      <div
        className="w-full max-w-lg bg-[#0D0D14] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0A0A0E]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-5 bg-[#39FF14] rounded-sm shadow-[0_0_8px_#39FF14]" />
            <h2 id="create-post-title" className="font-orbitron font-bold text-white text-base sm:text-lg">
              CRIAR NOVO TÓPICO
            </h2>
          </div>
          <button
            onClick={() => setIsCreatePostOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase font-orbitron mb-2">
              Selecione a Categoria
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    category === cat
                      ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.4)]'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {category === 'LFG' && (
              <p className="mt-1.5 text-[11px] text-[#39FF14]">
                Procurando squad ou time? Inclua seu rank, jogo, servidor e requisitos.
              </p>
            )}
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase font-orbitron mb-1.5">
              Conteúdo do Post
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sua opinião, pergunta, achado no jogo ou recrutamento..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase font-orbitron mb-1.5">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ex: CS2, Hype, Build, LFG, Dicas"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase font-orbitron mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#00FFFF]" />
              URL de Imagem / Screenshot (Opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/screenshot.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]"
            />
          </div>

          {/* Poll Accordion Toggle */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowPoll(!showPoll)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                showPoll ? 'text-[#00FFFF]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>{showPoll ? 'Remover Enquete' : '+ Adicionar Enquete ao Tópico'}</span>
            </button>

            {showPoll && (
              <div className="mt-3 p-3.5 rounded-xl bg-white/[0.03] border border-[#00FFFF]/30 space-y-3">
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Pergunta da enquete (ex: Qual mapa é o melhor?)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFFF]"
                />

                <div className="space-y-2">
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateOption(i, e.target.value)}
                        placeholder={`Opção ${i + 1}`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFFF]"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePollOption(i)}
                          className="p-1.5 text-gray-500 hover:text-red-400"
                          aria-label={`Remover opção ${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-[11px] font-bold text-[#00FFFF] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar opção
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#39FF14] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Ganha +50 XP ao publicar</span>
            </div>

            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-sm hover:bg-[#32e012] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all"
            >
              Publicar no Feed
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
