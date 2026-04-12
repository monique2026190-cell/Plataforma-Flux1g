import React, { useRef } from 'react';
import { useCompleteProfile } from '../hooks/Hook.Perfil.Completar';
import { ModalCorteImagem } from '../Componentes/ComponenteDeInterfaceDeUsuario/Modal.Corte.Imagem';

export const CompleteProfile: React.FC = () => {
    const {
        register,
        onSubmit,
        watch,
        setValue,
        errors,
        isSubmitting,
        previaImagem,
        cortarAberto,
        setCortarAberto,
        imagemOriginal,
        aoMudarImagem,
        aoSalvarImagemCortada,
        aoSair
    } = useCompleteProfile();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const accountType = watch('accountType');

    const handleToggle = () => {
        setValue('accountType', accountType === 'public' ? 'private' : 'public');
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col justify-center items-center p-4">
            <style>{`
                .form-container { width: 100%; max-width: 400px; background-color: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
                .avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; }
                .avatar-wrapper { position: relative; width: 90px; height: 90px; border-radius: 50%; cursor: pointer; }
                .avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid #00c2ff; }
                .edit-icon { position: absolute; bottom: -2px; right: -2px; background: #00c2ff; color: #000; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #0c0f14; }
                .input-group { margin-bottom: 18px; }
                .input-group label { display: block; font-size: 12px; color: #aaa; margin-bottom: 6px; }
                .input-group input, .input-group textarea { width: 100%; padding: 12px; background: #1a1e26; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 15px; outline: none; }
                .error-message { color: #ff4d4d; font-size: 12px; margin-top: 5px; }
                .submit-btn { width: 100%; padding: 14px; background: #00c2ff; color: #000; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
                .logout-btn { background: none; border: none; color: #ff4d4d; font-size: 13px; cursor: pointer; display: block; text-align: center; margin-top: 20px; }
                .account-type-group { display: flex; justify-content: space-between; align-items: center; background: #1a1e26; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
                .account-type-label { font-size: 15px; color: #fff; }
                .account-type-value { font-size: 12px; color: #aaa; }
                .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 28px; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: #00c2ff; }
                input:checked + .slider:before { transform: translateX(22px); }
            `}</style>

            <div className="form-container">
                <h1 className="text-2xl font-bold text-center mb-2">Quase lá!</h1>
                <p className="text-center text-gray-400 mb-8 text-sm">Complete seu perfil para continuar.</p>

                <div className="avatar-section">
                    <div className="avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
                        {previaImagem ? <img src={previaImagem} className="avatar-img" /> : <div className="avatar-img bg-gray-700 flex items-center justify-center"><i className="fa-solid fa-user text-3xl"></i></div>}
                        <div className="edit-icon"><i className="fa-solid fa-camera"></i></div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={aoMudarImagem} accept="image/*" hidden />
                </div>

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Seu apelido</label>
                        <input type="text" {...register('nickname')} placeholder="Ex: Seu Nome" />
                        {errors.nickname && <p className="error-message">{errors.nickname.message}</p>}
                    </div>
                    <div className="input-group">
                        <label>Seu nome de usuário</label>
                        <input type="text" {...register('name')} placeholder="Ex: @seunome" />
                        {errors.name && <p className="error-message">{errors.name.message}</p>}
                    </div>
                    <div className="input-group">
                        <label>Sua bio</label>
                        <textarea {...register('bio')} placeholder="Fale um pouco sobre você" rows={2}></textarea>
                        {errors.bio && <p className="error-message">{errors.bio.message}</p>}
                    </div>

                    <div className="account-type-group">
                        <div>
                            <div className="account-type-label">Conta Privada</div>
                            <div className="account-type-value">{accountType === 'private' ? 'Ativado' : 'Desativado'}</div>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={accountType === 'private'} onChange={handleToggle} />
                            <span className="slider"></span>
                        </label>
                    </div>
                    
                    {errors.root?.serverError && <p className="error-message text-center mb-4">{errors.root.serverError.message}</p>}

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Finalizando...' : 'Concluir Cadastro'}</button>
                </form>

                <button onClick={aoSair} className="logout-btn">Sair da conta</button>
            </div>

            <ModalCorteImagem aberto={cortarAberto} imagemSrc={imagemOriginal} aoFechar={() => setCortarAberto(false)} aoSalvar={aoSalvarImagemCortada} />
        </div>
    );
};
