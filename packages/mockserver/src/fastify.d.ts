import 'fastify';
import { DataSource, Repository } from 'typeorm';
import { User } from '../models/User';

declare module 'fastify' {
    interface FastifyInstance {

        db: DataSource;
        models: {
            User: Repository<User>;
        };

        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        genHash(password: string): Promise<string | Error>;
        compareHash(password: string, hashedPass: string): Promise<boolean | Error>;
        
        config: {
            SERVER_HOST: string;
            SERVER_PORT: number;
            JWT_SECRET: string;
            SESSION_SECRET: string;
            
            // Configs MySQL
            DB_HOST: string;
            DB_PORT: number;
            DB_USER: string;
            DB_PASS: string;
            DB_NAME: string;

            // Seed Admin User
            DEFAULT_ADMIN_NAME: string;
            DEFAULT_ADMIN_EMAIL: string;
            DEFAULT_ADMIN_PASS: string;
        };
    }

    interface FastifyRequest {
        user: { 
            id: string;
            username: string;
            email: string;
            role: string;
        }
    }
    interface Session {
        token?: string;
    }
}