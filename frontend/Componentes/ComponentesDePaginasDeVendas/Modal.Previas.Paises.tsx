
import React, { Suspense, lazy } from 'react';
import { Group } from '../../types';
import { GeoData } from '../../ServiçosFrontend/geoService';
import { ConversionResult } from '../../ServiçosFrontend/currencyService';
import { Country } from './Modal.Seletor.Pais';

// --- COMPONENTES DE FLUXO ---
// Unificamos tudo sob o PaymentFlowModal, que agora é inteligente o suficiente para lidar com simulação.
const PaymentFlowModal = lazy(() => import('../ComponentesDeProvedores/PaymentFlowModal').then(m => ({ default: m.PaymentFlowModal })));
const EmailCaptureModal = lazy(() => import('../ComponentesDeProvedores/EmailCaptureModal').then(m => ({ default: m.EmailCaptureModal })));
const ModalSeletorProvedor = lazy(() => import('./Modal.Seletor.Provedor').then(m => ({ default: m.ModalSeletorProvedor })));


interface ModalPreviasPaisesProps {
  isOpen: { pix: boolean; email: boolean; simulator: boolean; };
  onClose: () => void;
  group: Group;
  geoData: GeoData | null; // Usado em produção
  priceInfo: ConversionResult | null; // Usado em produção
  onEmailSuccess: (email: string) => void;
  onSimulateConfirm?: (provider: 'syncpay' | 'stripe' | 'paypal', country: Country) => void;
  
  // Props para Simulação (passadas da VipGroupSales)
  isSimulated?: boolean;
  simulationProvider?: 'syncpay' | 'stripe' | 'paypal' | null;
  simulatedGeo?: { countryCode: string; currency: string; countryName: string; } | null;
}

// Componente interno que decide qual modal renderizar
const ModalContent: React.FC<ModalPreviasPaisesProps> = (props) => {
  const { 
    isOpen, onClose, group, 
    isSimulated, simulationProvider, simulatedGeo, 
    geoData, priceInfo 
  } = props;

  // A LÓGICA FOI UNIFICADA.
  // Tanto em produção quanto em simulação, usamos o mesmo componente de fluxo de pagamento.
  // A única diferença é a ORIGEM dos dados (geoData real vs. simulatedGeo).
  
  const provider = isSimulated 
    ? simulationProvider // Em simulação, usamos o provedor escolhido
    : (geoData?.countryCode === 'BR' ? 'syncpay' : 'stripe'); // Em produção, a lógica de sempre

  const geo = isSimulated 
    ? simulatedGeo // Em simulação, usamos o GEO escolhido
    : geoData; // Em produção, o GEO detectado

  if (!provider) return null; // Não renderiza se não houver um provedor definido.

  return (
    <PaymentFlowModal
      isOpen={isOpen.pix}
      onClose={onClose}
      group={group}
      provider={provider}
      geo={geo}
      // Em simulação, não teremos preço convertido, o que é esperado.
      // O próprio ModalOpcoesPagamentosStripe já tem um fallback para isso.
      convertedPriceInfo={priceInfo} 
      // Passamos a flag de simulação para o fluxo de pagamento.
      isSimulation={isSimulated}
    />
  );
};


export const ModalPreviasPaises: React.FC<ModalPreviasPaisesProps> = (props) => {
  const { isOpen, onClose, group, onEmailSuccess, onSimulateConfirm } = props;

  return (
    <Suspense fallback={
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-white"></i>
        </div>
    }>
      {/* O conteúdo do modal de pagamento é sempre decidido pelo ModalContent, que agora é unificado */}
      {isOpen.pix && <ModalContent {...props} />}

      {isOpen.email && (
        <EmailCaptureModal
          isOpen={isOpen.email}
          onClose={onClose}
          onSuccess={onEmailSuccess}
          pixelId={group.pixelId}
          groupId={group.id}
        />
      )}

      {isOpen.simulator && onSimulateConfirm && (
        <ModalSeletorProvedor
          isOpen={isOpen.simulator}
          onClose={onClose}
          onConfirm={onSimulateConfirm}
        />
      )}
    </Suspense>
  );
};
