const axios = require('axios');
const chai = require('chai');
const expect = chai.expect;

let token;
let clienteCriado;

// const URL_ENDPOINT_USUARIO = 'https://rota404.cyclic.app/usuario';
// const URL_ENDPOINT_CATEGORIA ='https://rota404.cyclic.app/categoria';
// const URL_ENDPOINT_LOGIN = 'https://rota404.cyclic.app/login';
// const URL_ENDPOINT_PRODUTO = 'https://rota404.cyclic.app/produto';
// const URL_ENDPOINT_CLIENTE = 'https://rota404.cyclic.app/cliente';

const URL_ENDPOINT_USUARIO = 'http://localhost:3000/usuario';
const URL_ENDPOINT_CATEGORIA ='http://localhost:3000/categoria';
const URL_ENDPOINT_LOGIN = 'http://localhost:3000/login';
const URL_ENDPOINT_PRODUTO = 'http://localhost:3000/produto';
const URL_ENDPOINT_CLIENTE = 'http://localhost:3000/cliente';

const emailToTest = `test_${Date.now()}@email.com`;
const passwordToTest = '123123';
const nomeToTest= 'Teste Automatizado';

const INFO_CREATE_USER = {
    nome: nomeToTest,
    email: emailToTest,
    senha: passwordToTest
}
const INFO_LOGIN = {
    email: emailToTest,
    senha: passwordToTest
}
const INFO_PUT_USUARIO = {
    nome: nomeToTest,
    email: emailToTest,
    senha: passwordToTest
  };

const INFO_CREATE_PRODUTO = {
  descricao: nomeToTest,
  quantidade_estoque: 10,
  valor: 50,
  categoria_id: 5
};

describe('1.0 Teste de Requisoção POST para criar usuário', () => {
    it('1.1 Deve retornar status 201 ao tentar criar um usuário', async () => {

        try {
            const resposta = await axios.post(URL_ENDPOINT_USUARIO, INFO_CREATE_USER);
            
            expect(resposta.status).to.equal(201);
        } catch (erro) {
            throw erro;
        }
  });
});

describe('2.0 Teste de Requisição POST para Login', () => {
  it('2.1 Deve realizar login e retornar status 200', async () => {
      try {
          const resposta = await axios.post(URL_ENDPOINT_LOGIN, INFO_LOGIN);

          expect(resposta.status).to.equal(200);

          token = resposta.data.token;
      } catch (erro) {
          throw erro;
      }
  });
});

describe('3.0 Teste de Requisição GET para Obter Usuário Autenticado', () => {
  it('3.1 Deve retornar status 200 ao obter informações do usuário autenticado', async () => {
      if (!token) {
          throw new Error('Token não disponível. O teste de login falhou.');
      }
  
      try {
          const resposta = await axios.get(URL_ENDPOINT_USUARIO, {
          headers: {
              Authorization: `Bearer ${token}`
          }
          });
  
          expect(resposta.status).to.equal(200);
      } catch (erro) {
          throw erro;
      }
  });
});

describe('4.0 Teste de Requisição GET para Obter Categorias', () => {
  it('4.1 Deve retornar status 200 ao obter Categorias', async () => {
      if (!token) {
      throw new Error('Token não disponível. O teste de Categorias falhou.');
      }

      try {
      const resposta = await axios.get(URL_ENDPOINT_CATEGORIA, {
          headers: {
          Authorization: `Bearer ${token}`
          }
      });

      expect(resposta.status).to.equal(200);
      } catch (erro) {
          throw erro;
      }
  });
});

describe('5.0 Teste de Requisição PUT para Atualizar Usuário', () => {
  it('5.1 Deve retornar status 201 ao atualizar informações do usuário', async () => {
    if (!token) {
      throw new Error('Token não disponível. O teste de login falhou.');
    }


    try {
      const resposta = await axios.put(URL_ENDPOINT_USUARIO, INFO_PUT_USUARIO, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      expect(resposta.status).to.equal(201);
    } catch (erro) {
      throw erro;
    }
  });
});

describe('6.0 Teste de Requisição POST para Cadastrar Produto', () => {
  it('6.1 Deve retornar status 200 ao cadastrar um produto corretamente', async () => {
    try {
      const resposta = await axios.post(URL_ENDPOINT_PRODUTO, INFO_CREATE_PRODUTO, { headers: {Authorization: `Bearer ${token}`,}});

      expect(resposta.status).to.equal(201);
    } catch (erro) {
      throw erro;
    }
  });

it('6.2 Deve retornar status 400 se o campo descricao não estiver preenchido', async () => {
  const produtoSemDescricao = {
    quantidade_estoque: 5,
    valor: 25.99,
    categoria_id: 2,
  };

  try {
    const resposta = await axios.post(URL_ENDPOINT_PRODUTO, produtoSemDescricao, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status === 400,
    });

    expect(resposta.status).to.equal(400);
  } catch (erro) {
    throw erro;
  }
});

  it('6.3 Deve retornar status 400 se o campo quantidade_estoque não estiver preenchido', async () => {
    const produtoSemQuantidade = {
      descricao: 'Produto Sem Quantidade',
      valor: 30,
      categoria_id: 3,
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_PRODUTO, produtoSemQuantidade, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('6.4 Deve retornar status 400 se o campo valor não estiver preenchido', async () => {
    const produtoSemValor = {
      descricao: 'Produto Sem Valor',
      quantidade_estoque: 8,
      categoria_id: 4,
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_PRODUTO, produtoSemValor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('6.5 Deve retornar status 400 se o campo categoria_id não estiver preenchido', async () => {
    const produtoSemCategoria = {
      descricao: 'Produto Sem Categoria',
      quantidade_estoque: 15,
      valor: 40,
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_PRODUTO, produtoSemCategoria, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('6.6 Deve retornar status 400 se a categoria_id não estiver entre 1 e 8', async () => {
    const produtoCategoriaInvalida = {
      descricao: 'Produto Inválido',
      quantidade_estoque: 5,
      valor: 25,
      categoria_id: 10,
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_PRODUTO, produtoCategoriaInvalida, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });
});

describe('7.0 Teste de Requisição GET para Obter Produtos', () => {
  it('7.1 Deve retornar status 200 ao obter todos os produtos', async () => {
    try {
      const resposta = await axios.get(URL_ENDPOINT_PRODUTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(resposta.status).to.equal(200);
    } catch (erro) {
      throw erro;
    }
  });

  it('7.2 Deve retornar status 200 ao obter produtos filtrados por categoria_id', async () => {
    const categoriaFiltrada = 1;

    try {
      const resposta = await axios.get(`${URL_ENDPOINT_PRODUTO}?categoria_id=${categoriaFiltrada}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(resposta.status).to.equal(200);
    } catch (erro) {
      throw erro;
    }
  });

  it('7.3 Deve retornar status 400 ao filtrar por categoria_id não existente', async () => {
    const categoriaNaoExistente = 10;

    try {
      const resposta = await axios.get(`${URL_ENDPOINT_PRODUTO}?categoria_id=${categoriaNaoExistente}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });
});

describe('8.0 Teste de Requisição GET para Obter Detalhes do Produto por ID', () => {
  it('8.1 Deve retornar status 200 ao obter detalhes do produto com ID existente', async () => {
    const produtoExistenteId = 1;

    try {
      const resposta = await axios.get(`${URL_ENDPOINT_PRODUTO}/${produtoExistenteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(resposta.status).to.equal(200);
    } catch (erro) {
      throw erro;
    }
  });

  it('8.2 Deve retornar status 400 ao tentar obter detalhes do produto com ID decimal', async () => {
    const produtoIdDecimal = 1.5;

    try {
      const resposta = await axios.get(`${URL_ENDPOINT_PRODUTO}/${produtoIdDecimal}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('8.3 Deve retornar status 400 ao tentar obter detalhes do produto com ID string', async () => {
    const produtoIdString = 'abc';

    try {
      const resposta = await axios.get(`${URL_ENDPOINT_PRODUTO}/${produtoIdString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('8.4 Deve retornar status 400 ao tentar obter detalhes do produto com ID negativo', async () => {
    const produtoIdNegativo = -1;

    try {
      const resposta = await axios.get(`${URL_ENDPOINT_PRODUTO}/${produtoIdNegativo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('8.5 Deve retornar status 404 ao tentar obter detalhes de um produto inexistente', async () => {
    const produtoInexistenteId = 959595959;

    try {
      const resposta = await axios.get(`${URL_ENDPOINT_PRODUTO}/${produtoInexistenteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 404,
      });

      expect(resposta.status).to.equal(404);
    } catch (erro) {
      throw erro;
    }
  });
});

describe('9.0 Teste de Requisição DELETE para Deletar um Produto por ID', () => {
  let produtoCriadoId;

  before(async () => {
    try {
      const resposta = await axios.post(URL_ENDPOINT_PRODUTO, {
        descricao: 'produto testeaaaa',
        quantidade_estoque: 2,
        valor: 2,
        categoria_id: 4,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      produtoCriadoId = resposta.data[0].id;
    } catch (erro) {
      console.error('Erro ao criar produto para teste:', erro.response.data);
      throw erro;
    }
  });

  it('9.1 Deve retornar status 200 ao deletar um produto com ID existente', async () => {
    try {
      const resposta = await axios.delete(`${URL_ENDPOINT_PRODUTO}/${produtoCriadoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(resposta.status).to.equal(200);
    } catch (erro) {
      throw erro;
    }
  });

  it('9.2 Deve retornar status 400 ao tentar deletar um produto com ID decimal', async () => {
    const produtoIdDecimal = 1.5;

    try {
      const resposta = await axios.delete(`${URL_ENDPOINT_PRODUTO}/${produtoIdDecimal}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('9.3 Deve retornar status 400 ao tentar deletar um produto com ID string', async () => {
    const produtoIdString = 'abc';

    try {
      const resposta = await axios.delete(`${URL_ENDPOINT_PRODUTO}/${produtoIdString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('9.4 Deve retornar status 400 ao tentar deletar um produto com ID negativo', async () => {
    const produtoIdNegativo = -1;

    try {
      const resposta = await axios.delete(`${URL_ENDPOINT_PRODUTO}/${produtoIdNegativo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('9.5 Deve retornar status 404 ao tentar deletar um produto inexistente', async () => {
    const produtoInexistenteId = 959595959;

    try {
      const resposta = await axios.delete(`${URL_ENDPOINT_PRODUTO}/${produtoInexistenteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 404,
      });

      expect(resposta.status).to.equal(404);
    } catch (erro) {
      throw erro;
    }
  });
});

function generateRandomCPF() {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const cpfNumbers = Array.from({ length: 9 }, () => getRandomInt(0, 9));

  const sum1 = cpfNumbers.reduce((acc, value, index) => acc + value * (10 - index), 0);
  const digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);

  cpfNumbers.push(digit1);

  const sum2 = cpfNumbers.reduce((acc, value, index) => acc + value * (11 - index), 0);
  const digit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);

  cpfNumbers.push(digit2);

  const formattedCPF = cpfNumbers.join('');

  return formattedCPF;
}

describe('10.0 Teste de Requisição POST para Cadastrar Cliente', () => {
  let clienteUniqueEmail;
  let clienteUniqueCPF;

  before(() => {
    clienteUniqueEmail = `cliente_${Date.now()}@example.com`;
    clienteUniqueCPF = generateRandomCPF();
  });

  it('10.1 Deve retornar status 201 ao cadastrar um cliente corretamente', async () => {
    const novoCliente = {
      nome: 'Nome Teste',
      email: clienteUniqueEmail,
      cpf: clienteUniqueCPF,
      cep: '12345678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, novoCliente, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clienteCriado = resposta.data;

      expect(resposta.status).to.equal(201);
    } catch (erro) {
      console.error('Erro ao cadastrar cliente:', erro.response.data);
      throw erro;
    }
  });

  it('10.2 Deve retornar status 400 se o nome estiver vazio ou com números', async () => {
    const clienteInvalidoNome = {
      nome: '',
      email: clienteUniqueEmail,
      cpf: clienteUniqueCPF,
      cep: '12345678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteInvalidoNome, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'O campo nome e obrigatorio');
    } catch (erro) {
      throw erro;
    }
  });

  it('10.3 Deve retornar status 400 se o email estiver vazio ou não estiver no formato de email', async () => {
    const clienteInvalidoEmail = {
      nome: 'Nome Teste',
      email: 'email_invalido',
      cpf: clienteUniqueCPF,
      cep: '12345678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteInvalidoEmail, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'O campo email precisa ter um formato válido');
    } catch (erro) {
      throw erro;
    }
  });

  it('10.4 Deve retornar status 400 se o CPF estiver inválido', async () => {
    const clienteInvalidoCPF = {
      nome: 'Nome Teste',
      email: clienteUniqueEmail,
      cpf: '12345678901',
      cep: '12345678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteInvalidoCPF, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'Digite um CPF válido');
    } catch (erro) {
      throw erro;
    }
  });

  it('10.5 Deve retornar status 400 se o CEP não for um número inteiro', async () => {
    const clienteInvalidoCEP = {
      nome: 'Nome Teste',
      email: clienteUniqueEmail,
      cpf: clienteUniqueCPF,
      cep: '12345.678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteInvalidoCEP, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'O campo CEP so aceita numeros');
    } catch (erro) {
      throw erro;
    }
  });

  it('10.6 Deve retornar status 400 se o número não for um número inteiro', async () => {
    const clienteInvalidoNumero = {
      nome: 'Nome Teste',
      email: clienteUniqueEmail,
      cpf: clienteUniqueCPF,
      cep: '12345678',
      rua: 'Rua Teste',
      numero: '123A',
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteInvalidoNumero, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'O campo precisa ser um número válido');
    } catch (erro) {
      throw erro;
    }
  });

  it('10.7 Deve retornar status 400 se o estado tiver menos de 2 caracteres', async () => {
    const clienteInvalidoEstado = {
      nome: 'Nome Teste',
      email: clienteUniqueEmail,
      cpf: clienteUniqueCPF,
      cep: '12345678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'E', // Estado com menos de 2 caracteres
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteInvalidoEstado, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'digite ao menos a sigla do seu estado');
    } catch (erro) {
      throw erro;
    }
  });

  it('10.8 Deve retornar status 400 se o email já existir na base de dados', async () => {
    const clienteDuplicadoEmail = {
      nome: 'Nome Teste',
      email: clienteUniqueEmail,
      cpf: clienteUniqueCPF,
      cep: '12345678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteDuplicadoEmail, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'Já existe um cliente cadastrado com o e-mail informado.');
    } catch (erro) {
      throw erro;
    }
  });

  it('10.9 Deve retornar status 400 se o CPF já existir na base de dados', async () => {
    const clienteDuplicadoCPF = {
      nome: 'Nome Teste',
      email: `cliente_${Date.now()}@example.com`,
      cpf: clienteUniqueCPF,
      cep: '12345678',
      rua: 'Rua Teste',
      numero: 123,
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'ES',
    };

    try {
      const resposta = await axios.post(URL_ENDPOINT_CLIENTE, clienteDuplicadoCPF, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.data).to.have.property('mensagem', 'Já existe um cliente cadastrado com o cpf informado.');
    } catch (erro) {
      throw erro;
    }
  });
});

describe('11.0 Teste de Requisição PUT para Editar Cliente', () => {
  let clienteExistente;

  before(async () => {

    const buscaClienteExistente = await axios.get(`${URL_ENDPOINT_CLIENTE}/1`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    clienteExistente = buscaClienteExistente.data;
  });

  it('11.1 Deve retornar status 201 ao editar dados do cliente', async () => {
    const clienteEditado = {
      nome: 'Existente',
      email: `email_existente_${Date.now()}@example.com`,
      cpf: generateRandomCPF(),
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteEditado, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(resposta.status).to.equal(201);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.2 Deve retornar status 400 se o nome estiver vazio ou contiver números', async () => {
    const clienteComNomeInvalido = {
      nome: '',
      email: `novo_email_${Date.now()}@example.com`,
      cpf: generateRandomCPF(),
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteComNomeInvalido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.3 Deve retornar status 400 se o email estiver vazio ou não estiver no formato de email', async () => {
    const clienteComEmailInvalido = {
      nome: 'Novo Nome',
      email: 'email_invalido',
      cpf: generateRandomCPF(),
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteComEmailInvalido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.4 Deve retornar status 400 se o CPF estiver inválido ou não possuir de 11 até 14 caracteres', async () => {
    const clienteComCPFInvalido = {
      nome: 'Novo Nome',
      email: `novo_email_${Date.now()}@example.com`,
      cpf: 'cpf_invalido',
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteComCPFInvalido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.5 Deve retornar status 400 se o CEP não for um número inteiro', async () => {
    const clienteComCEPInvalido = {
      nome: 'Novo Nome',
      email: `novo_email_${Date.now()}@example.com`,
      cpf: generateRandomCPF(),
      cep: 'cep_invalido',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteComCEPInvalido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.6 Deve retornar status 400 se o número não for um número inteiro', async () => {
    const clienteComNumeroInvalido = {
      nome: 'Novo Nome',
      email: `novo_email_${Date.now()}@example.com`,
      cpf: generateRandomCPF(),
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 'numero_invalido',
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteComNumeroInvalido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.7 Deve retornar status 400 se o estado tiver menos de 2 caracteres', async () => {
    const clienteComEstadoInvalido = {
      nome: 'Novo Nome',
      email: `novo_email_${Date.now()}@example.com`,
      cpf: generateRandomCPF(),
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'S',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteComEstadoInvalido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.8 Deve retornar status 400 se o email já existir na base de dados', async () => {
    const clienteComEmailExistente = {
      nome: clienteCriado.nome,
      email: clienteCriado.email,
      cpf: generateRandomCPF(),
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente}`, clienteComEmailExistente, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });

  it('11.9 Deve retornar status 400 se o CPF já existir na base de dados', async () => {
    const clienteComCPFExistente = {
      nome: clienteCriado.nome,
      email: `novo_email_${Date.now()}@example.com`,
      cpf: clienteCriado.cpf,
      cep: '87654321',
      rua: 'Nova Rua',
      numero: 456,
      bairro: 'Novo Bairro',
      cidade: 'Nova Cidade',
      estado: 'SP',
    };

    try {
      const resposta = await axios.put(`${URL_ENDPOINT_CLIENTE}/${clienteExistente.id}`, clienteComCPFExistente, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status === 400,
      });

      expect(resposta.status).to.equal(400);
    } catch (erro) {
      throw erro;
    }
  });
});

describe('12.0 Teste de Requisição GET para Obter Clientes', () => {
  it('12.1 Deve retornar status 200 ao obter clientes existentes', async () => {
    try {
      const resposta = await axios.get(URL_ENDPOINT_CLIENTE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(resposta.status).to.equal(200);
    } catch (erro) {
      throw erro;
    }
  });
});