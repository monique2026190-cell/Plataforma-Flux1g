
import React from 'react';

interface CardRedirecionamentoPaypalProps {
    price: string;
    onConfirm: () => void;
    onBack: () => void;
    isLoading?: boolean;
    config: any; 
}

export const CardRedirecionamentoPaypal: React.FC<CardRedirecionamentoPaypalProps> = ({ 
    price, onConfirm, onBack, isLoading, config 
}) => {
    const data = config; 

    return (
        <div className="redirection-bridge animate-fade-in flex flex-col items-center">
            <style>{`
                .bridge-container {
                    width: 100%;
                    padding: 20px 10px;
                }
                .provider-shield {
                    width: 70px;
                    height: 70px;
                    background: ${data.color + '1a'};
                    border: 2px solid ${data.color + '44'};
                    border-radius: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: ${data.color};
                    margin: 0 auto 20px;
                    box-shadow: 0 10px 25px ${data.color + '22'};
                    position: relative;
                }
                .secure-badge {
                    position: absolute;
                    bottom: -8px;
                    background: #00ff82;
                    color: #000;
                    font-size: 8px;
                    font-weight: 900;
                    padding: 2px 8px;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 10px rgba(0,255,130,0.3);
                }
                .price-tag-bridge {
                    font-size: 28px;
                    font-weight: 900;
                    color: #fff;
                    margin-bottom: 8px;
                }
                .redirect-msg {
                    font-size: 13px;
                    color: #888;
                    line-height: 1.6;
                    padding: 0 20px;
                    margin-bottom: 30px;
                }
                .confirm-redirect-btn {
                    width: 100%;
                    padding: 18px;
                    background: ${data.color};
                    color: #fff;
                    border: none;
                    border-radius: 16px;
                    font-weight: 800;
                    font-size: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: 0.3s;
                    box-shadow: 0 10px 30px ${data.color + '44'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                .confirm-redirect-btn:hover {
                    filter: brightness(1.1);
                    transform: translateY(-2px);
                }
                .confirm-redirect-btn:active {
                    transform: scale(0.98);
                }
                .back-link {
                    margin-top: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    color: #444;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    cursor: pointer;
                    background: none;
                    border: none;
                    transition: 0.2s;
                }
                .back-link:hover { color: #fff; }
            `}</style>

            <div className="bridge-container">
                <div className="provider-shield">
                    <i className={data.icon}></i>
                    <div className="secure-badge">
                        <i className="fa-solid fa-lock mr-1"></i> Protegido
                    </div>
                </div>

                <div className="price-tag-bridge">{price}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">Total a pagar via {data.name}</div>

                <p className="redirect-msg">{data.msg}</p>

                <button 
                    className="confirm-redirect-btn" 
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                    ) : (
                        <>
                            <span>Confirmar e Ir</span>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </>
                    )}
                </button>

                <button className="back-link" onClick={onBack}>
                    <i className="fa-solid fa-arrow-left mr-2"></i> Alterar Método
                </button>
            </div>
        </div>
    );
};
