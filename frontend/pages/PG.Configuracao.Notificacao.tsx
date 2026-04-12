
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingItem = ({ icon, label, description, checked, disabled }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
        <div className="flex items-center">
            <i className={`fa-solid ${icon} w-6 text-center text-lg mr-4 text-gray-400`}></i>
            <div>
                <h4 className="font-semibold text-white">{label}</h4>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
        <label className="switch">
            <input type="checkbox" checked={checked} onChange={() => {}} disabled={disabled} />
            <span className="slider"></span>
        </label>
    </div>
);

export const PG_Configuracao_Notificacao: React.FC = () => {
    const navigate = useNavigate();
    const disabled = false;

    return (
        <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-50 border-b border-white/10 h-[65px]">
                <button onClick={() => navigate(-1)} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold">Notificações</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pt-[85px] pb-10 px-5 max-w-[600px] mx-auto w-full no-scrollbar">
                
                <div className="bg-white/5 p-4 rounded-2xl mb-6">
                    <SettingItem 
                        icon="fa-bell-slash" 
                        label="Pausar Tudo" 
                        description="Desativar temporariamente todas as notificações." 
                        checked={false} 
                        disabled={false} 
                    />
                </div>

                <div className="space-y-2 mt-6">
                    <div className="bg-white/5 rounded-2xl">
                        <h3 className="text-sm font-bold text-[#00c2ff] p-4 uppercase tracking-wider">Social</h3>
                        <SettingItem icon="fa-user-plus" label="Novos Seguidores" description="Quando alguém começar a seguir você." checked={true} disabled={disabled} />
                        <SettingItem icon="fa-heart" label="Curtidas" description="Em suas postagens, comentários ou reels." checked={true} disabled={disabled} />
                        <SettingItem icon="fa-comment" label="Comentários" description="Em suas postagens e reels." checked={true} disabled={disabled} />
                        <SettingItem icon="fa-at" label="Menções" description="Quando alguém mencionar você em uma postagem." checked={true} disabled={disabled} />
                    </div>

                    <div className="bg-white/5 rounded-2xl">
                        <h3 className="text-sm font-bold text-[#00c2ff] p-4 uppercase tracking-wider">Comunicação</h3>
                        <SettingItem icon="fa-comments" label="Chats" description="Novas mensagens em suas conversas." checked={true} disabled={disabled} />
                        <SettingItem icon="fa-users" label="Atividade em Grupos" description="Novas postagens ou interações importantes." checked={false} disabled={disabled} />
                    </div>

                    <div className="bg-white/5 rounded-2xl">
                        <h3 className="text-sm font-bold text-[#00c2ff] p-4 uppercase tracking-wider">Negócios</h3>
                        <SettingItem icon="fa-store" label="Atividade da Loja" description="Vendas, perguntas e novas avaliações." checked={true} disabled={disabled} />
                        <SettingItem icon="fa-bullhorn" label="Campanhas de Anúncios" description="Atualizações sobre suas campanhas ativas." checked={true} disabled={disabled} />
                    </div>

                    <div className="bg-white/5 rounded-2xl">
                         <h3 className="text-sm font-bold text-[#00c2ff] p-4 uppercase tracking-wider">Preferências de E-mail</h3>
                        <SettingItem icon="fa-newspaper" label="Newsletter Semanal" description="Resumo das novidades e destaques." checked={true} disabled={false} />
                        <SettingItem icon="fa-briefcase" label="Oportunidades e Parcerias" description="Alertas sobre oportunidades de negócios." checked={false} disabled={false} />
                    </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-dashed border-white/10 opacity-40 mt-6 mb-10">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-relaxed text-center">
                        <i className="fa-solid fa-shield-halved mr-1"></i> Notificações críticas de segurança e transações financeiras não podem ser desativadas.
                    </p>
                </div>
            </main>
             <style>{`
                .switch{position:relative;display:inline-block;width:44px;height:24px;}
                .switch input{opacity:0;width:0;height:0;}
                .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#333;transition:.4s;border-radius:25px;}
                .slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:white;transition:.4s;border-radius:50%;}
                input:checked + .slider{background-color:#00c2ff;}
                input:checked + .slider:before{transform:translateX(20px);}
             `}</style>
        </div>
    );
};
