
import React, { useState } from 'react';

const EventToggle: React.FC<{ label: string, description: string, defaultChecked?: boolean }> = ({ label, description, defaultChecked = false }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
            <div>
                <h4 className="font-medium text-white/90">{label}</h4>
                <p className="text-sm text-white/50">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
};

export const CardMetaADSEventos: React.FC = () => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
            <h3 className="font-bold text-lg text-white/90 mb-4">Eventos do Meta ADS</h3>
            <p className="text-sm text-white/50 mb-6">Selecione quais eventos de conversão você deseja enviar do nosso servidor para a API de Conversões do Meta.</p>

            <div className="space-y-4">
                <EventToggle 
                    label="Visualização de Página (Page View)"
                    description="Enviado quando um usuário visualiza uma página."
                    defaultChecked={true}
                />
                <EventToggle 
                    label="Iniciar Checkout (Initiate Checkout)"
                    description="Enviado quando um usuário inicia o processo de checkout."
                    defaultChecked={true}
                />
                <EventToggle 
                    label="Compra (Purchase)"
                    description="Enviado quando uma compra é concluída com sucesso."
                    defaultChecked={true}
                />
                <EventToggle 
                    label="Cadastro (Complete Registration)"
                    description="Enviado quando um usuário completa um cadastro."
                />
                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-4">
                    Salvar Configuração de Eventos
                </button>
            </div>
        </div>
    );
};
