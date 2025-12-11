import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import 'reflect-metadata';
import bcrypt from 'bcrypt'; // Importamos bcrypt diretamente aqui para o seed

const MysqlPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  try {
    server.log.info('Iniciando conexão com MySQL via TypeORM...');

    const AppDataSource = new DataSource({
      type: "mysql",
      host: server.config.DB_HOST,
      port: server.config.DB_PORT,
      username: server.config.DB_USER,
      password: server.config.DB_PASS,
      database: server.config.DB_NAME,
      entities: [User], 
      synchronize: true, 
      logging: ['error'], 
      timezone: 'Z'
    });

    await AppDataSource.initialize();
    server.log.info('✅ MySQL Conectado com Sucesso!');

    server.decorate('db', AppDataSource);
    server.decorate('models', {
        User: AppDataSource.getRepository(User)
    });

    // --- LÓGICA DE SEED (Criação do Admin Padrão) ---
    const userRepo = AppDataSource.getRepository(User);
    const usersCount = await userRepo.count();

    if (usersCount === 0) {
        server.log.warn('⚠️ Nenhum usuário encontrado. Criando Admin Padrão...');
        
        const hashedPassword = await bcrypt.hash(server.config.DEFAULT_ADMIN_PASS, 10);
        
        const adminUser = userRepo.create({
            username: server.config.DEFAULT_ADMIN_NAME,
            email: server.config.DEFAULT_ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin' // Role suprema
        });

        await userRepo.save(adminUser);
        server.log.info(`👑 Admin Padrão criado: ${adminUser.email} / senha do .env`);
    } else {
        server.log.info('✔ Usuários já existem no banco. Seed pulado.');
    }
    // ------------------------------------------------

    server.addHook('onClose', async (instance) => {
      if (instance.db.isInitialized) {
        await instance.db.destroy();
      }
    });

  } catch (err) {
    server.log.error(err, '❌ Falha ao conectar no MySQL');
    process.exit(1);
  }
};

export default fp(MysqlPlugin);