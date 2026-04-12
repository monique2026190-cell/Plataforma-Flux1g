
import React, { useState } from 'react';

// Definição de tipos
interface InviteLink {
  id: string;
  name: string;
  url: string;
  type: 'permanent' | 'uses' | 'time' | 'time_uses';
  usesLeft?: number;
  expiresAt?: Date;
  isActive: boolean;
}

// Mock de dados
const mockLinks: InviteLink[] = [
  {
    id: '1',
    name: 'Link Padrão',
    url: 'https://flux.com/invite/a1b2c3d4',
    type: 'permanent',
    isActive: true,
  },
  {
    id: '2',
    name: 'Marketing de Influência',
    url: 'https://flux.com/invite/e5f6g7h8',
    type: 'uses',
    usesLeft: 50,
    isActive: true,
  },
  {
    id: '3',
    name: 'Promoção de Fim de Semana',
    url: 'https://flux.com/invite/i9j0k1l2',
    type: 'time',
    expiresAt: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // 48 horas a partir de agora
    isActive: true,
  },
  {
    id: '4',
    name: 'Parceria Especial',
    url: 'https://flux.com/invite/m3n4o5p6',
    type: 'time_uses',
    usesLeft: 100,
    expiresAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de agora
    isActive: true,
  },
  {
    id: '5',
    name: 'Link Expirado',
    url: 'https://flux.com/invite/q7r8s9t0',
    type: 'time',
    expiresAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Ontem
    isActive: false,
  },
];

const CardGeracaoLinks: React.FC = () => {
  const [links, setLinks] = useState<InviteLink[]>(mockLinks);
  const [newLinkName, setNewLinkName] = useState('');
  const [linkType, setLinkType] = useState<'permanent' | 'uses' | 'time' | 'time_uses'>('permanent');
  const [uses, setUses] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [timeUnit, setTimeUnit] = useState<'hours' | 'days'>('days');

  const generateRandomUrl = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `https://flux.com/invite/${result}`;
  };

  const handleCreateLink = () => {
    if (!newLinkName) {
      alert('Por favor, dê um nome ao link.');
      return;
    }

    const newLink: InviteLink = {
      id: String(Date.now()),
      name: newLinkName,
      url: generateRandomUrl(),
      type: linkType,
      isActive: true,
    };

    if (linkType === 'uses' || linkType === 'time_uses') {
      if (!uses || uses <= 0) {
        alert('Por favor, insira um número de usos válido.');
        return;
      }
      newLink.usesLeft = uses;
    }

    if (linkType === 'time' || linkType === 'time_uses') {
      if (!time || time <= 0) {
        alert('Por favor, insira um tempo de duração válido.');
        return;
      }
      const now = new Date();
      const durationInMs = time * (timeUnit === 'hours' ? 3600000 : 86400000);
      newLink.expiresAt = new Date(now.getTime() + durationInMs);
    }

    setLinks([newLink, ...links]);
    setNewLinkName('');
    setUses('');
    setTime('');
  };

  const handleRevokeLink = (id: string) => {
    setLinks(links.map(link => (link.id === id ? { ...link, isActive: false } : link)));
  };

  const getLinkInfo = (link: InviteLink) => {
    if (!link.isActive) return 'Link revogado';

    const parts = [];
    switch (link.type) {
      case 'permanent':
        return 'Vitalício, usos ilimitados';
      case 'uses':
        return `${link.usesLeft} usos restantes`;
      case 'time':
        return `Expira em: ${link.expiresAt?.toLocaleString('pt-BR')}`;
      case 'time_uses':
        if(link.usesLeft) parts.push(`${link.usesLeft} usos restantes`);
        if(link.expiresAt) parts.push(`expira em: ${link.expiresAt?.toLocaleString('pt-BR')}`);
        return parts.join(', ');
      default:
        return '';
    }
  };

  return (
    <div className="bg-[#1a1d23] rounded-2xl overflow-hidden shadow-lg border border-white/10">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">Gerenciar Links de Convite</h2>

        {/* Formulário de Criação */}
        <div className="space-y-4 mb-8 p-4 bg-[#14171c] rounded-lg">
          <input
            type="text"
            value={newLinkName}
            onChange={(e) => setNewLinkName(e.target.value)}
            placeholder="Nome do Link (ex: Marketing)"
            className="w-full bg-[#0c0f14] text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
          />

          <select
            value={linkType}
            onChange={(e) => setLinkType(e.target.value as any)}
            className="w-full bg-[#0c0f14] text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
          >
            <option value="permanent">Vitalício</option>
            <option value="uses">Por quantidade de usos</option>
            <option value="time">Por tempo de uso</option>
            <option value="time_uses">Por tempo e quantidade</option>
          </select>

          {(linkType === 'uses' || linkType === 'time_uses') && (
            <input
              type="number"
              value={uses}
              onChange={(e) => setUses(Number(e.target.value))}
              placeholder="Número de usos"
              className="w-full bg-[#0c0f14] text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
            />
          )}

          {(linkType === 'time' || linkType === 'time_uses') && (
            <div className="flex gap-2">
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                placeholder="Duração"
                className="flex-grow bg-[#0c0f14] text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as any)}
                className="bg-[#0c0f14] text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
              >
                <option value="hours">Horas</option>
                <option value="days">Dias</option>
              </select>
            </div>
          )}

          <button
            onClick={handleCreateLink}
            className="w-full bg-gradient-to-r from-[#00c2ff] to-[#00a2ff] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={!newLinkName || ((linkType === 'uses' || linkType === 'time_uses') && !uses) || ((linkType === 'time' || linkType === 'time_uses') && !time)}
          >
            <i className="fa-solid fa-plus mr-2"></i> Criar Novo Link
          </button>
        </div>

        {/* Lista de Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Links Ativos</h3>
          {links.filter(l => l.isActive).map(link => (
            <div key={link.id} className="bg-[#14171c] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-grow">
                <p className="font-bold text-white text-base">{link.name}</p>
                <p className="text-sm text-cyan-400 break-all">{link.url}</p>
                <p className="text-xs text-white/60 mt-1">{getLinkInfo(link)}</p>
              </div>
              <div className="flex gap-2 self-end sm:self-center">
                  <button 
                      onClick={() => navigator.clipboard.writeText(link.url)}
                      className="bg-[#2a2d33] text-white px-3 py-1.5 rounded-md text-xs hover:bg-[#3a3d43] transition-colors"
                  >
                      <i className="fa-solid fa-copy mr-1"></i> Copiar
                  </button>
                  <button 
                      onClick={() => handleRevokeLink(link.id)}
                      className="bg-red-600/20 text-red-400 px-3 py-1.5 rounded-md text-xs hover:bg-red-600/40 transition-colors"
                  >
                      <i className="fa-solid fa-trash mr-1"></i> Revogar
                  </button>
              </div>
            </div>
          ))}

          {links.filter(l => !l.isActive).length > 0 && (
              <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2 pt-6">Links Revogados</h3>
          )}
          {links.filter(l => !l.isActive).map(link => (
            <div key={link.id} className="bg-[#14171c] p-4 rounded-lg opacity-60">
              <p className="font-bold text-white/70 line-through">{link.name}</p>
              <p className="text-sm text-cyan-400/70 break-all line-through">{link.url}</p>
              <p className="text-xs text-white/50 mt-1">Link revogado</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CardGeracaoLinks;
