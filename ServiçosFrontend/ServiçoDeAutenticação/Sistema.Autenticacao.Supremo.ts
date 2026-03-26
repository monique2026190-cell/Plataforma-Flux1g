
// ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo.ts

import { z } from 'zod';
import { IAutenticacaoServico, LoginRequest, LoginResponse, GoogleLoginRequest, GoogleLoginResponse } from '../Contratos/Contrato.Autenticacao';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { CriacaoContaDto } from '../../types/Entrada/Dto.Estrutura.Conta.Flux';

// Módulos de serviço desacoplados
import { servicoGestaoLogin } from './Servico.Gestao.Login';
import { servicoGestaoLogout } from './Servico.Gestao.Logout';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { servicoGestaoConta } from './Servico.Gestao.Conta';
import { servicoGestaoPerfil } from './Servico.Gestao.Perfil';

const log = createServiceLogger('Sistema.Autenticacao.Supremo');

class SistemaAutenticacaoSupremo implements IAutenticacaoServico {
  private gestaoLogin;
  private gestaoLogout;
  private gestaoSessao;
  private gestaoContas;
  private gestaoPerfil;

  constructor() { 
    this.gestaoSessao = servicoGestaoSessao;
    this.gestaoLogin = servicoGestaoLogin;
    this.gestaoLogout = servicoGestaoLogout;
    this.gestaoContas = servicoGestaoConta;
    this.gestaoPerfil = servicoGestaoPerfil;

    log.logInfo('Sistema de Autenticação Supremo inicializado.');
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.gestaoLogin.login(data);
  }

  async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    return this.gestaoLogin.handleGoogleCallback(data.code, data.referredBy);
  }

  async resolverRedirecionamentoLogin(sessionId: string) {
      return this.gestaoSessao.resolverRedirecionamentoLogin(sessionId);
  }
  
  async logout() {
    return this.gestaoLogout.logout();
  }

  async criarConta(dados: CriacaoContaDto): Promise<void> {
    return this.gestaoContas.createAccount(dados);
  }

  async verifyCode(email: string, code: string, isReset: boolean = false): Promise<void> {
    return this.gestaoContas.verifyCode(email, code, isReset);
  }

  async sendVerificationCode(email: string, context: 'verification' | 'reset' = 'verification'): Promise<void> {
    return this.gestaoContas.sendVerificationCode(email, context);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    return this.gestaoContas.resetPassword(email, newPassword);
  }

  async completeProfile(data: any): Promise<void> {
    // @ts-ignore
    return this.gestaoPerfil.completeProfile(data);
  }

  async updateProfile(data: any): Promise<void> {
    // @ts-ignore
    return this.gestaoPerfil.updateProfile(data);
  }

  async verificarSessao(signal: AbortSignal) {
    return this.gestaoSessao.validateSession(signal);
  }

  getCurrentUser() {
    return this.gestaoSessao.getCurrentUser();
  }
}

let instanciaSuprema = null;

export const getInstanciaSuprema = () => {
  if (!instanciaSuprema) {
    instanciaSuprema = new SistemaAutenticacaoSupremo();
  }
  return instanciaSuprema;
};
