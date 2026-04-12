
import React from 'react';
import { HookQuadroDeLideres } from '../hooks/Hook.Quadro.De.Lideres';
import { PodiumItem } from '../Componentes/ComponentesDeLeaderboard/Componentes/PodiumItem';
import { LeaderboardListItem } from '../Componentes/ComponentesDeLeaderboard/Componentes/LeaderboardListItem';

export const Leaderboard: React.FC = () => {
  const {
    rankedUsers,
    loading,
    handleUserClick,
    handleBack,
    topThree,
    leaderboardList
  } = HookQuadroDeLideres();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }
        
        header {
            display:flex; align-items:center; padding:16px;
            background: #0c0f14; position:fixed; width:100%; z-index:10;
            border-bottom:1px solid rgba(255,255,255,0.1); top: 0; height: 65px;
        }
        header button {
            background:none; border:none; color:#fff; font-size:22px; cursor:pointer;
            transition:0.3s; padding-right: 15px;
        }
        header h1 { font-size:20px; font-weight:700; color: #FFD700; text-transform: uppercase; letter-spacing: 1px; }
        
        main {
            padding-top: 110px; padding-bottom: 40px;
            width: 100%; max-width: 600px; margin: 0 auto; padding-left: 20px; padding-right: 20px;
        }

        .top-three-container {
            display: flex; justify-content: center; align-items: flex-end; margin-bottom: 40px; gap: 15px;
        }

        .podium-item {
            display: flex; flex-direction: column; align-items: center; cursor: pointer;
            transition: transform 0.3s;
        }
        .podium-item:hover { transform: translateY(-5px); }

        .podium-avatar-wrapper {
            position: relative; margin-bottom: 10px;
        }
        
        .podium-avatar {
            border-radius: 50%; object-fit: cover; background: #333;
        }
        
        .crown-icon {
            position: absolute; top: -25px; left: 50%; transform: translateX(-50%);
            font-size: 24px; filter: drop-shadow(0 0 5px rgba(0,0,0,0.8));
        }

        .rank-badge {
            position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
            width: 24px; height: 24px; border-radius: 50%; color: #000; font-weight: 800; font-size: 14px;
            display: flex; align-items: center; justify-content: center; border: 2px solid #0c0f14;
        }

        .first-place .podium-avatar { width: 100px; height: 100px; border: 4px solid #FFD700; box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
        .first-place .crown-icon { color: #FFD700; font-size: 32px; }
        .first-place .rank-badge { background: #FFD700; }
        .first-place .podium-name { color: #FFD700; font-size: 18px; font-weight: 700; }
        
        .second-place .podium-avatar { width: 80px; height: 80px; border: 3px solid #C0C0C0; box-shadow: 0 0 15px rgba(192, 192, 192, 0.3); }
        .second-place .crown-icon { color: #C0C0C0; }
        .second-place .rank-badge { background: #C0C0C0; }
        .second-place .podium-name { color: #C0C0C0; font-size: 15px; font-weight: 600; }

        .third-place .podium-avatar { width: 80px; height: 80px; border: 3px solid #CD7F32; box-shadow: 0 0 15px rgba(205, 127, 50, 0.3); }
        .third-place .crown-icon { color: #CD7F32; }
        .third-place .rank-badge { background: #CD7F32; }
        .third-place .podium-name { color: #CD7F32; font-size: 14px; font-weight: 600; }

        .podium-count { font-size: 12px; color: #aaa; margin-top: 2px; }

        .rank-list { display: flex; flex-direction: column; gap: 10px; }

        .empty-state {
            text-align: center; color: #555; margin-top: 50px;
        }
      `}</style>

      <header>
        <button onClick={handleBack} aria-label="Voltar">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1>Top Criadores</h1>
      </header>

      <main>
        {loading ? (
            <div className="text-center text-gray-500 mt-10">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2 text-[#FFD700]"></i>
                <p>Carregando ranking...</p>
            </div>
        ) : (
            <>
                {topThree.length >= 3 && (
                    <div className="top-three-container">
                        {/* O Pódio é reordenado aqui para a exibição visual correta (2º, 1º, 3º) */}
                        <PodiumItem user={topThree[1]} position={2} onClick={handleUserClick} />
                        <PodiumItem user={topThree[0]} position={1} onClick={handleUserClick} />
                        <PodiumItem user={topThree[2]} position={3} onClick={handleUserClick} />
                    </div>
                )}

                <div className="rank-list">
                    {/* Se não houver um pódio completo, exibe a lista a partir do início */}
                    {(topThree.length < 3 ? rankedUsers : leaderboardList).map((user, index) => {
                        // O rank precisa ser calculado com base na lista que está sendo usada
                        const rank = topThree.length < 3 ? index + 1 : index + 4;
                        return (
                            <LeaderboardListItem 
                                key={user.id}
                                user={user}
                                rank={rank}
                                onClick={handleUserClick}
                            />
                        );
                    })}
                </div>

                {rankedUsers.length === 0 && !loading && (
                    <div className="empty-state">
                        <i className="fa-solid fa-trophy text-4xl mb-2 opacity-30"></i>
                        <p>Nenhum usuário no ranking ainda.</p>
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  );
};
