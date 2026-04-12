
import React from 'react';
import { HookTopGruposVip } from '../hooks/Hook.Top.Grupos.Vip';
import { Group } from '../types';

// Componentes de UI reutilizáveis podem ser criados para o Pódio e a Lista
const PodiumItem: React.FC<{ group: Group, rank: number, onClick: (group: Group) => void }> = ({ group, rank, onClick }) => {
    const rankClasses = {
        1: { container: 'first-place', crown: 'text-2xl -top-8', cover: 'w-100px h-100px', name: 'text-sm font-bold text-[#FFD700]' },
        2: { container: 'second-place', cover: 'w-80px h-80px', name: 'text-xs font-bold text-gray-400' },
        3: { container: 'third-place', cover: 'w-80px h-80px', name: 'text-xs font-bold text-gray-500' },
    }[rank] || {};

    return (
        <div className={`podium-item ${rankClasses.container}`} onClick={() => onClick(group)}>
            {rank === 1 && <i className={`fa-solid fa-crown absolute text-[#FFD700] ${rankClasses.crown}`}></i>}
            <div className={`podium-cover ${rankClasses.cover}`}>
                {group.coverImage ? <img src={group.coverImage} alt={group.name} /> : <i className="fa-solid fa-crown"></i>}
            </div>
            <div className="rank-badge">{rank}</div>
            <div className={`podium-name mt-4 ${rankClasses.name}`}>{group.name}</div>
        </div>
    );
};

const RankListItem: React.FC<{ group: Group, rank: number, onClick: (group: Group) => void }> = ({ group, rank, onClick }) => (
    <div className="rank-item" onClick={() => onClick(group)}>
        <div className="w-8 font-bold text-[#FFD700]">#{rank}</div>
        <div className="flex-grow font-semibold">{group.name}</div>
        <button className="action-btn">Assinar</button>
    </div>
);

export const TopGroupsVip: React.FC = () => {
  const {
    rankedGroups,
    loading,
    handleGroupAction,
    handleTabNavigation,
    handleBack,
  } = HookTopGruposVip();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
       <style>{`
        header { display:flex; align-items:center; padding:16px; background: #0c0f14; position:fixed; width:100%; z-index:10; border-bottom:1px solid rgba(255,255,255,0.1); top: 0; height: 65px; }
        header button { background:none; border:none; color:#fff; font-size:22px; cursor:pointer; padding-right: 15px; }
        header h1 { font-size:20px; font-weight:700; color: #FFD700; text-transform: uppercase; letter-spacing: 1px; }
        main { padding-top: 80px; padding-bottom: 40px; width: 100%; max-w: 600px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        .tabs-container { display: flex; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 4px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.1); }
        .tab-btn { flex: 1; padding: 10px; border: none; background: transparent; color: #aaa; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 8px; transition: 0.3s; }
        .tab-btn.active { background: linear-gradient(145deg, #FFD700, #B8860B); color: #000; box-shadow: 0 2px 10px rgba(255,215,0,0.3); }
        .top-three-container { display: flex; justify-content: center; align-items: flex-end; margin-bottom: 40px; gap: 10px; }
        .podium-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.3s; position: relative; width: 33%; }
        .podium-cover { border-radius: 16px; object-fit: cover; background: #333; display: flex; align-items: center; justify-content: center; color: #555; overflow: hidden; width: 80px; height: 80px; border: 2px solid #FFD700; }
        .first-place .podium-cover { width: 100px; height: 100px; border: 4px solid #FFD700; box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
        .rank-badge { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; color: #000; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; border: 2px solid #0c0f14; background: #FFD700; }
        .rank-list { display: flex; flex-direction: column; gap: 10px; }
        .rank-item { display: flex; align-items: center; padding: 15px; background: rgba(255,215,0,0.05); border-radius: 12px; border: 1px solid rgba(255,215,0,0.1); transition: background 0.2s; cursor: pointer; }
        .action-btn { border: none; border-radius: 20px; padding: 6px 16px; font-size: 12px; font-weight: 700; cursor: pointer; background: #FFD700; color: #000; }
      `}</style>
      <header>
        <button onClick={handleBack}><i className="fa-solid fa-arrow-left"></i></button>
        <h1>Ranking VIP</h1>
      </header>
      <main>
        <div className="tabs-container">
            <button className="tab-btn" onClick={() => handleTabNavigation('/top-groups/public')}>Públicos</button>
            <button className="tab-btn" onClick={() => handleTabNavigation('/top-groups/private')}>Privados</button>
            <button className="tab-btn active">VIP</button>
        </div>
        {loading ? <div className="text-center mt-10"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#FFD700]"></i></div> : (
            <>
                <div className="top-three-container">
                    {rankedGroups[1] && <PodiumItem group={rankedGroups[1]} rank={2} onClick={handleGroupAction} />}
                    {rankedGroups[0] && <PodiumItem group={rankedGroups[0]} rank={1} onClick={handleGroupAction} />}
                    {rankedGroups[2] && <PodiumItem group={rankedGroups[2]} rank={3} onClick={handleGroupAction} />}
                </div>
                <div className="rank-list">
                    {rankedGroups.map((group, index) => index > 2 && (
                        <RankListItem key={group.id} group={group} rank={index + 1} onClick={handleGroupAction} />
                    ))}
                </div>
            </>
        )}
      </main>
    </div>
  );
};
