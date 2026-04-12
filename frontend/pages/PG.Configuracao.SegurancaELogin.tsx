
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PG_Configuracao_SegurancaELogin: React.FC = () => {
  const navigate = useNavigate();

  const sessions = [
    { id: '1', device: 'Chrome em Windows', location: 'São Paulo, Brasil', timestamp: '2024-07-22T10:00:00Z', isActive: true },
    { id: '2', device: 'Mobile App em iPhone 14', location: 'Rio de Janeiro, Brasil', timestamp: '2024-07-21T15:30:00Z', isActive: false },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
        <style>{`
            .back-btn { background:none; border:none; color:#fff; font-size:24px; cursor:pointer; padding-right: 15px; }
            .settings-section { background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 25px; }
            .setting-row { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .setting-row:last-child { border-bottom: none; }
            .label-title { font-size: 16px; font-weight: 500; color: #fff; }
            .label-desc { font-size: 13px; color: #888; margin-top: 2px; }
            .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: #00c2ff; }
            input:checked + .slider:before { transform: translateX(20px); }
            .section-title { font-size: 14px; color: #00c2ff; margin-bottom: 10px; text-transform: uppercase; font-weight: 700; padding-left: 5px; }
            .password-form { padding: 20px; }
            .input-group { margin-bottom: 15px; }
            .input-group label { display: block; font-size: 13px; color: #aaa; margin-bottom: 5px; }
            .input-group input { width: 100%; padding: 12px; background: #111; border: 1px solid #333; border-radius: 8px; color: #fff; outline: none; transition: 0.3s; }
            .input-group input:focus { border-color: #00c2ff; }
            .save-btn { width: 100%; padding: 12px; background: #00c2ff; color: #000; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; }
            .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
            .session-item { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .session-item:last-child { border-bottom: none; }
            .session-icon { font-size: 24px; color: #aaa; margin-right: 15px; }
            .session-info h4 { font-size: 15px; font-weight: 600; color: #fff; }
            .session-info p { font-size: 12px; color: #888; margin-top: 2px; }
            .active-now { color: #00ff82; font-size: 11px; font-weight: 700; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
            .active-dot { width: 6px; height: 6px; background: #00ff82; border-radius: 50%; }
            .revoke-btn { background: transparent; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 4px 10px; border-radius: 12px; font-size: 11px; cursor: pointer; transition: 0.2s; }
        `}</style>

        <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-10 border-b border-white/10 h-[65px]">
            <button onClick={() => navigate(-1)} className="back-btn"><i className="fa-solid fa-arrow-left"></i></button>
            <h1 className="text-lg font-semibold">Segurança e Login</h1>
        </header>

        <main className="pt-[85px] pb-[40px] w-full max-w-[600px] mx-auto px-5 overflow-y-auto flex-grow">
            <div className="section-title">Alterar Senha</div>
            <div className="settings-section">
                <div className="password-form">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="input-group">
                            <label>Senha Atual</label>
                            <input type="password" />
                        </div>
                        <div className="input-group">
                            <label>Nova Senha</label>
                            <input type="password" />
                        </div>
                        <div className="input-group">
                            <label>Confirmar Nova Senha</label>
                            <input type="password" />
                        </div>
                        <button type="submit" className="save-btn">Alterar Senha</button>
                    </form>
                </div>
            </div>

            <div className="section-title">Preferências</div>
            <div className="settings-section">
                <div className="setting-row">
                    <div>
                        <div className="label-title">Salvar Login</div>
                        <div className="label-desc">Manter dados para login rápido.</div>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked={true} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="flex justify-between items-end mb-2 px-1">
                <div className="section-title mb-0">Sessões Ativas</div>
                <button className="revoke-btn">Sair de outros dispositivos</button>
            </div>
            
            <div className="settings-section">
                {sessions.map(session => (
                    <div className="session-item" key={session.id}>
                        <i className={`fa-solid ${session.device.toLowerCase().includes('mobile') ? 'fa-mobile-screen-button' : 'fa-laptop'} session-icon`}></i>
                        <div className="session-info">
                            <h4>{session.device}</h4>
                            <p>{session.location} • {formatDate(session.timestamp)}</p>
                            {session.isActive && (
                                <div className="active-now">
                                    <div className="active-dot"></div> Ativo agora
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </div>
  );
};
