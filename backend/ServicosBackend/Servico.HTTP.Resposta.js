class ServicoRespostaHTTP {

  static sucesso(res, dados, mensagem = "Sucesso") {
    return res.status(200).json({
      sucesso: true,
      mensagem,
      dados
    });
  }

  static criado(res, dados, mensagem = "Criado com sucesso") {
    return res.status(201).json({
      sucesso: true,
      mensagem,
      dados
    });
  }

  static requisicaoInvalida(res, mensagem = "Requisição inválida") {
    return res.status(400).json({
      sucesso: false,
      mensagem
    });
  }

  static erro(res, mensagem = "Erro interno") {
    return res.status(500).json({
      sucesso: false,
      mensagem
    });
  }

  static naoAutorizado(res, mensagem = "Não autorizado") {
    return res.status(401).json({
      sucesso: false,
      mensagem
    });
  }

  static naoEncontrado(res, mensagem = "Recurso não encontrado") {
    return res.status(404).json({
      sucesso: false,
      mensagem
    });
  }

}

export default ServicoRespostaHTTP;