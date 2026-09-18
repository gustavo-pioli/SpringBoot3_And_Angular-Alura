import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DadosDetalhamentoMedico, DadosListagemMedico, Page } from '../../../types/type';
import { Medicos } from '../../services/medicos';
import { MedicoForm } from '../medico-form/medico-form';
import { MedicoTabela } from './medico-tabela';

// Diferente de tabela-paginada.spec.ts (função pura, sem Angular nenhum),
// este teste usa TestBed porque MedicoTabela injeta Medicos e MatDialog via
// `inject()` — precisamos de um contexto de injeção pra substituir os dois
// por versões falsas. O objetivo aqui não é reconferir o que já foi testado
// em tabela-paginada.spec.ts, e sim a "fiação" própria deste componente:
// detalhar-antes-de-editar, e só recarregar quando o diálogo fecha com sucesso.
function paginaFalsa<T>(content: T[], totalElements = content.length): Page<T> {
  return { content, totalElements, totalPages: 1, number: 0, size: content.length, first: true, last: true };
}

const medicoListagem: DadosListagemMedico = {
  id: 1,
  nome: 'Ana Souza',
  email: 'ana.souza@email.com',
  crm: '1234',
  especialidade: 'CARDIOLOGIA',
};

const medicoDetalhe: DadosDetalhamentoMedico = {
  ...medicoListagem,
  telefone: '11999999999',
  endereco: { logradouro: '', bairro: '', cep: '', numero: '', complemento: '', cidade: '', uf: '' },
};

describe('MedicoTabela', () => {
  let fixture: ComponentFixture<MedicoTabela>;
  let component: MedicoTabela;
  let medicosMock: { listar: ReturnType<typeof vi.fn>; detalhar: ReturnType<typeof vi.fn>; excluir: ReturnType<typeof vi.fn> };
  let dialogOpenSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    medicosMock = {
      listar: vi.fn().mockReturnValue(of(paginaFalsa([medicoListagem]))),
      detalhar: vi.fn().mockReturnValue(of(medicoDetalhe)),
      excluir: vi.fn().mockReturnValue(of(undefined)),
    };
    // O afterClosed() padrão simula "salvou com sucesso"; testes que precisam
    // do caso "cancelou" sobrescrevem isso antes de chamar o método.
    dialogOpenSpy = vi.fn().mockReturnValue({ afterClosed: () => of(true) });

    await TestBed.configureTestingModule({
      imports: [MedicoTabela],
      providers: [
        { provide: Medicos, useValue: medicosMock },
        { provide: MatDialog, useValue: { open: dialogOpenSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoTabela);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ngOnInit busca a primeira página e preenche os signals da tabela', () => {
    fixture.detectChanges(); // dispara ngOnInit

    expect(medicosMock.listar).toHaveBeenCalledWith(0, 5);
    expect(component.medicos()).toEqual([medicoListagem]);
    expect(component.totalElementos()).toBe(1);
  });

  it('editar() busca o detalhamento do médico e abre o diálogo já preenchido com ele', () => {
    component.editar(1);

    expect(medicosMock.detalhar).toHaveBeenCalledWith(1);
    expect(dialogOpenSpy).toHaveBeenCalledWith(MedicoForm, { data: { medico: medicoDetalhe } });
  });

  it('quando o diálogo de cadastro fecha com sucesso, recarrega a tabela', () => {
    component.cadastrar();

    expect(medicosMock.listar).toHaveBeenCalledTimes(1);
  });

  it('quando o diálogo é cancelado, NÃO recarrega a tabela', () => {
    dialogOpenSpy.mockReturnValue({ afterClosed: () => of(undefined) });

    component.cadastrar();

    expect(medicosMock.listar).not.toHaveBeenCalled();
  });

  it('excluir() não chama o serviço se o usuário não confirmar', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.excluir(1);

    expect(medicosMock.excluir).not.toHaveBeenCalled();
  });

  it('excluir() chama o serviço e recarrega a tabela quando confirmado', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.excluir(1);

    expect(medicosMock.excluir).toHaveBeenCalledWith(1);
    expect(medicosMock.listar).toHaveBeenCalledTimes(1);
  });
});
