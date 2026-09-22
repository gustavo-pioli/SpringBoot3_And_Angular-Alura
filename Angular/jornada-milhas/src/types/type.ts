export type Especialidade = 'ORTOPEDIA' | 'GINECOLOGIA' | 'CARDIOLOGIA' | 'DERMATOLOGIA';

export interface DadosListagemMedico {
  id: number;
  nome: string;
  email: string;
  crm: string;
  especialidade: Especialidade;
}

// Espelha o Page<T> que o Spring Data devolve na serialização JSON
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}


export interface DadosAutenticacao{
  login: string;
  senha: string;
}

export interface DadosTokenJWT {
  token: string;
  refreshToken: string;
}

export interface DadosRefreshToken {
  refreshToken: string;
}

// --- Endereço: usado por médico e paciente. Dois tipos porque o backend também
// separa "dado de entrada" (DadosEndereco, sem id/regra própria) de "dado de saída"
// (Endereco, o @Embeddable devolvido pela API).
export interface DadosEndereco {
  logradouro: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  complemento?: string;
  numero?: string;
}

export interface Endereco {
  logradouro: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string;
  cidade: string;
  uf: string;
}

// --- Médico: cadastro (POST), atualização parcial (PUT) e detalhamento (GET por id).
export interface DadosCadastroMedico {
  nome: string;
  telefone: string;
  email: string;
  crm: string;
  especialidade: Especialidade;
  endereco: DadosEndereco;
}

// Atualização é parcial de propósito: a API só permite alterar nome, telefone
// e endereço (crm, email e especialidade são imutáveis após o cadastro).
export interface DadosAtualizacaoMedico {
  id: number;
  nome?: string;
  telefone?: string;
  endereco?: DadosEndereco;
}

export interface DadosDetalhamentoMedico {
  id: number;
  nome: string;
  email: string;
  crm: string;
  telefone: string;
  especialidade: Especialidade;
  endereco: Endereco;
}

// --- Paciente: só existe cadastro e listagem na API (sem detalhe, edição ou exclusão).
export interface DadosCadastroPaciente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: DadosEndereco;
}

export interface DadosListagemPaciente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

// --- Consulta: agendamento (POST) e cancelamento (DELETE). Não existe endpoint de
// listagem no backend, então a tela mantém as consultas agendadas na sessão em memória.
export type MotivoCancelamento = 'PACIENTE_DESISTIU' | 'MEDICO_CANCELOU' | 'OUTROS';

export interface DadosAgendamentoConsulta {
  idPaciente: number;
  data: string; // formato aceito pelo LocalDateTime do backend: "yyyy-MM-ddTHH:mm"
  idMedico?: number; // se omitido, a especialidade abaixo é obrigatória
  especialidade?: Especialidade;
}

export interface DadosCancelamentoConsulta {
  idConsulta: number;
  motivo: MotivoCancelamento;
}

export interface DadosDetalhamentoConsulta {
  id: number;
  idMedico: number;
  nomeMedico: string;
  idPaciente: number;
  nomePaciente: string;
  data: string;
}

// Formato de erro devolvido pelo TratadorDeErros quando a validação de @Valid falha.
export interface ErroValidacao {
  campo: string;
  mensagem: string;
}