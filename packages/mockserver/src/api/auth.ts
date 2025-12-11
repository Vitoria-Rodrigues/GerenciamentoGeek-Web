import type { FastifyPluginAsync, FastifyInstance, FastifyPluginOptions } from 'fastify';

const AuthRoute: FastifyPluginAsync = async (server: FastifyInstance, opts: FastifyPluginOptions) => {
  // Acessamos o Repositório do TypeORM (configurado no MysqlPlugin)
  const userRepo = server.models.User;
  
  // ---------------------------------------------------------------------------
  // LOGIN (Público)
  // ---------------------------------------------------------------------------
  server.post('/login', async (request, reply) => {
    const { identifier, password } = request.body as any;
    
    // Busca usuário
    const user = await userRepo.findOne({ 
      where: [
        { email: identifier },
        { username: identifier }
      ]
    });

    // ERRO 1: Usuário não existe
    if (!user) {
        // Retornamos 'target: identifier' para o front saber onde mostrar o erro
        return reply.status(404).send({ 
            authenticated: false, 
            message: 'Usuário não encontrado.',
            target: 'identifier' 
        });
    }

    const isMatch = await server.compareHash(password, user.password);
    
    // ERRO 2: Senha incorreta
    if (!isMatch) {
        // Retornamos 'target: password'
      return reply.status(401).send({ 
          authenticated: false, 
          message: 'Senha incorreta.',
          target: 'password'
      });
    }

    // ... Sucesso (geração de token continua igual) ...
    const token = server.jwt.sign({ id: user.id, email: user.email, username: user.username, role: user.role });
    request.session.token = token;
    reply.send({ authenticated: true, token, user: { email: user.email, username: user.username, role: user.role }});
  });

  // ---------------------------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------------------------
  server.post('/logout', async (request, reply) => {
    if (request.session) {
      request.session.destroy();
    }
    reply.send({ message: 'Logout realizado' });
  });

  // ---------------------------------------------------------------------------
  // VERIFY (Verifica se a sessão/token ainda é válido)
  // ---------------------------------------------------------------------------
  server.get('/verify', async (request, reply) => {
    if (!request.session.token) {
      return reply.status(401).send({ message: "Nenhum token de sessão encontrado." });
    }

    try {
      const payload = server.jwt.verify(request.session.token) as { id: string };
      
      const user = await userRepo.findOneBy({ id: payload.id });
      
      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado." });
      }
      
      reply.send({ 
        authenticated: true, 
        token: request.session.token,
        user: {
          email: user.email,
          username: user.username,
          role: user.role
        },
      });

    } catch (err) {
      return reply.status(401).send({ message: "Token inválido ou expirado." });
    }
  });

  // ---------------------------------------------------------------------------
  // CADASTRAR FUNCIONÁRIOS (RF004 - Protegido)
  // Substitui o antigo '/register'
  // ---------------------------------------------------------------------------
  server.post('/employees', {
    // 1. Middleware: Garante que quem chama está logado
    preValidation: [server.authenticate] 
  }, async (request, reply) => {
    
    // O usuário logado vem no request.user (populado pelo server.authenticate)
    const currentUser = request.user; 

    // Regra de Negócio: Apenas Admin e Manager podem cadastrar
    if (currentUser.role !== 'admin' && currentUser.role !== 'manager') {
        return reply.status(403).send({ 
            message: 'Acesso negado. Apenas Administradores e Gerentes podem cadastrar funcionários.' 
        });
    }

    const { email, username, password, role } = request.body as any;

    // Regra de Negócio: Gerente não pode criar um Admin (Hierarquia)
    if (currentUser.role === 'manager' && role === 'admin') {
        return reply.status(403).send({ 
            message: 'Acesso negado. Gerentes não podem criar Administradores.' 
        });
    }
    
    // Verifica se já existe
    const existingUser = await userRepo.findOne({
      where: [
        { email },
        { username }
      ]
    });

    if (existingUser) {
      const message = existingUser.email === email 
        ? 'E-mail já cadastrado.' 
        : 'Nome de usuário já existe.';
      return reply.status(409).send({ message });
    }

    // Gera o hash da senha
    const hashedPassword = await server.genHash(password);
    if (typeof hashedPassword !== 'string') {
        return reply.status(500).send({ message: 'Erro interno ao processar senha.' });
    }

    // Cria o novo funcionário
    const newUser = userRepo.create({
        email, 
        username, 
        password: hashedPassword,
        // Se não foi enviado um cargo, define como 'attendant' (padrão seguro)
        role: role || 'attendant' 
    });
    
    await userRepo.save(newUser);
    
    server.log.info(`Novo funcionário cadastrado: ${username} (${role}) por ${currentUser.username}`);

    reply.status(201).send({ message: 'Funcionário cadastrado com sucesso!' });
  });
};

export default AuthRoute;