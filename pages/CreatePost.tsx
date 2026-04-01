
import React from 'react';
// O hook foi atualizado para o novo nome com o padrão em português.
import { useCriarPost } from '../hooks/Hook.Criacao.Feed.Padrao';

export const CreatePost: React.FC = () => {
  // A desestruturação foi completamente atualizada para usar os nomes de função em português.
  const {
    dadosPost,
    atualizarCampo, // Renomeado
    isPublishDisabled,
    isProcessing,
    error,
    lidarComMudancaDeMidia, // Renomeado
    lidarComRemocaoDeMidia, // Renomeado
    lidarComVoltar,         // Renomeado
    lidarComCliquePublicar, // Renomeado
    salvarLocalizacao,      // Renomeado
    lidarComMudancaDePais,  // Renomeado
    lidarComMudancaDeEstado,// Renomeado
    avatarUrl,
    username,
    isLocationModalOpen,
    setIsLocationModalOpen,
    targetCountry,
    targetState,
    targetCity,
    setTargetCity,
    countries,
    states,
    cities,
    navigate
  } = useCriarPost(); // Hook renomeado.

  return (
    <div className="h-screen flex flex-col bg-[#0c0f14] text-white font-['Inter'] overflow-hidden">
      <style>{`
        /* ... estilos inalterados ... */
        .error-banner { background: #ff4d4f; color: white; padding: 10px; text-align: center; font-size: 14px; position: absolute; top: 60px; left: 0; right: 0; z-index: 100; }
        header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); height: 60px; z-index: 50; background: #0c0f14; }
        header button { background: none; border: none; font-size: 16px; color: #fff; cursor: pointer; }
        header .publish-btn { background: #00c2ff; color: #000; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 14px; opacity: 1; transition: opacity 0.3s; }
        header .publish-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #333; color: #777; }
        main { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; margin-top: ${error ? '40px' : '0'}; transition: margin-top 0.3s; }
        .input-area { display: flex; gap: 12px; }
        .user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #333; flex-shrink: 0; }
        .text-field { flex: 1; background: transparent; border: none; color: #fff; font-size: 16px; resize: none; min-height: 100px; outline: none; padding-top: 8px; }
        .text-field::placeholder { color: #555; }
        .media-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
        .media-item { width: 100px; height: 120px; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
        .media-item img { width: 100%; height: 100%; object-fit: cover; }
        .remove-btn { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: #fff; border: none; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; }
        .toolbar { display: flex; gap: 15px; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 15px 0; align-items: center; }
        .tool-btn { background: none; border: none; color: #00c2ff; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background 0.2s; }
        .tool-btn:hover { background: rgba(0,194,255,0.1); }
        .settings-list { display: flex; flex-direction: column; gap: 2px; }
        .setting-item { display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; }
        .setting-left { display: flex; align-items: center; gap: 10px; color: #fff; font-size: 15px; font-weight: 500; }
        .setting-icon { color: #888; width: 20px; text-align: center; }
        .setting-value { color: #00c2ff; font-size: 14px; margin-right: 10px; font-weight: 600; }
        .chevron { color: #555; font-size: 12px; }
        .ad-box { background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.2); border-radius: 10px; padding: 15px; margin-bottom: 10px; }
        .ad-input { width: 100%; background: #000; border: 1px solid #333; color: #fff; padding: 10px; border-radius: 6px; margin-top: 5px; outline: none; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal { background: #1a1e26; width: 90%; max-width: 350px; border-radius: 16px; padding: 20px; border: 1px solid #333; }
        .modal select { width: 100%; background: #0c0f14; border: 1px solid #333; color: #fff; padding: 10px; border-radius: 8px; margin-bottom: 10px; outline: none; }
        .modal-actions { display: flex; gap: 10px; margin-top: 15px; }
        .modal-btn { flex: 1; padding: 10px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; }
        .save-btn { background: #00c2ff; color: #000; }
        .cancel-btn { background: transparent; border: 1px solid #555; color: #aaa; }
      `}</style>

      <header>
        <button onClick={lidarComVoltar}>Cancelar</button>
        <span style={{fontWeight: 700, fontSize: '16px'}}>Novo Post</span>
        <button 
            id="publishbtn" 
            className="publish-btn" 
            disabled={isPublishDisabled} 
            onClick={lidarComCliquePublicar}
        >
            {isProcessing ? '...' : (dadosPost.isAnuncio ? 'Confirmar' : 'Publicar')}
        </button>
      </header>

      {error?.geral && <div className="error-banner">{error.geral}</div>}

      <main>
        {dadosPost.isAnuncio && (
            <div className="ad-box">
                <div style={{color: '#FFD700', fontSize:'12px', fontWeight: '900', marginBottom:'5px'}}>IMPULSIONAMENTO PUBLICITÁRIO</div>
                <input type="number" className="ad-input" placeholder="Investimento (Min R$ 10,00)" value={dadosPost.orcamentoAnuncio} onChange={e => atualizarCampo('orcamentoAnuncio', e.target.value)} />
                <input type="text" className="ad-input" placeholder="Link de Ação (https://...)" value={dadosPost.linkAnuncio} onChange={e => atualizarCampo('linkAnuncio', e.target.value)} />
            </div>
        )}

        <div className="input-area">
            {avatarUrl ? (
                <img src={avatarUrl} className="user-avatar" alt="Avatar" />
            ) : (
                <div className="user-avatar" style={{background:'#333', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <i className="fa-solid fa-user text-gray-500"></i>
                </div>
            )}
            <textarea 
                className="text-field" 
                placeholder="No que você está pensando?"
                value={dadosPost.texto} 
                onChange={e => atualizarCampo('texto', e.target.value)}
            ></textarea>
        </div>

        {dadosPost.arquivosMidia.length > 0 && (
            <div className="media-scroll">
                {dadosPost.arquivosMidia.map((m, idx) => (
                    <div key={idx} className="media-item">
                        <img src={m.url} alt="Preview" />
                        <button className="remove-btn" onClick={() => lidarComRemocaoDeMidia(idx)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                ))}
            </div>
        )}

        <div className="toolbar">
            <button className="tool-btn" onClick={() => document.getElementById('mediaInput')?.click()}>
                <i className="fa-regular fa-image"></i>
            </button>
            <button className="tool-btn" onClick={() => navigate('/create-poll')}>
                <i className="fa-solid fa-square-poll-horizontal"></i>
            </button>
            <input type="file" id="mediaInput" hidden multiple accept="image/*" onChange={lidarComMudancaDeMidia} />
        </div>

        <div className="settings-list">
            <div className="setting-item" onClick={() => setIsLocationModalOpen(true)}>
                <div className="setting-left">
                    <i className="fa-solid fa-location-dot setting-icon"></i>
                    <span>Direcionamento Regional</span>
                </div>
                <div style={{display:'flex', alignItems:'center'}}>
                    <span className="setting-value">{dadosPost.localizacao}</span>
                    <i className="fa-solid fa-chevron-right chevron"></i>
                </div>
            </div>
        </div>
      </main>

      {isLocationModalOpen && (
          <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                  <h3 style={{color:'#fff', marginBottom:'15px', textAlign:'center'}}>Alcance do Post</h3>
                  <select value={targetCountry} onChange={lidarComMudancaDePais}>
                      <option value="">Global (Todos)</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {targetCountry && (
                      <select value={targetState} onChange={lidarComMudancaDeEstado}>
                          <option value="">Todo o País</option>
                          {states.map((s: string) => <option key={s} value={s}>{s}</option>)}
                      </select>
                  )}
                  {targetState && (
                      <select value={targetCity} onChange={e => setTargetCity(e.target.value)}>
                          <option value="">Todo o Estado</option>
                          {cities.map((c: string) => <option key={c} value={c}>{c}</option>)}
                      </select>
                  )}
                  <div className="modal-actions">
                      <button className="modal-btn cancel-btn" onClick={() => setIsLocationModalOpen(false)}>Cancelar</button>
                      <button className="modal-btn save-btn" onClick={salvarLocalizacao}>Aplicar</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
