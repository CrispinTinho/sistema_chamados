import Fastify from 'fastify';
import {Pool} from 'pg';

const servidor = Fastify();
const sql = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sistema_chamados',
    password: 'senai',
    port: 5432,
});


servidor.get('/usuarios', async (request, reply) => {
    const resultado = await sql.query('SELECT * FROM usuarios');
    reply.status(200).send(resultado.rows);
});

servidor.post('/usuarios', async (request, reply) => {
    const {nome, email, senha} = request.body;
    if (!nome || !email || !senha) {
        return reply.status(400).send({error: 'Nome, email e senha são obrigatórios!'});
    };
    const resultado = await sql.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, senha]);
    reply.status(201).send({message: 'Usuário cadastrado com sucesso!'});
});

servidor.put('/usuarios/:id', async (request, reply) => {
    const {id} = request.params;
    const {nome, email, senha} = request.body;
    if (!nome || !email || !senha) {
        return reply.status(400).send({error: 'Nome, email e senha são obrigatórios!'});
    };
    const busca = await sql.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (busca.rows.length === 0) {
        return reply.status(404).send({error: 'Usuário não encontrado!'});
    };
    const resultado = await sql.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4', [nome, email, senha, id]);
    reply.status(200).send({message: 'Usuário alterado com sucesso!'});
});

servidor.delete('/usuarios/:id', async (request, reply) => {
    const {id} = request.params;
    const busca = await sql.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (busca.rows.length === 0) {
        return reply.status(404).send({error: 'Usuário não encontrado!'});
    };
    const resultado = await sql.query('DELETE FROM usuarios WHERE id = $1', [id]);
    reply.status(200).send({message: 'Usuário excluído com sucesso!'});
});


servidor.get('/chamados', async (request, reply) => {
    const resultado = await sql.query('SELECT * FROM chamados');
    reply.status(200).send(resultado.rows);
});

servidor.get('/chamados/:id', async (request, reply) => {
    const {id} = request.params;
    const resultado = await sql.query('SELECT * FROM chamados WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
        return reply.status(404).send({error: 'Chamado não encontrado!'});
    };
    reply.status(200).send(resultado.rows[0]);
});

servidor.post('/chamados', async (request, reply) => {
    const {titulo, descricao, responsavel_id} = request.body;
    if (!titulo || !descricao || !responsavel_id) {
        return reply.status(400).send({error: 'Título, descrição e responsável pelo chamado são obrigatórios!'});
    };
    const resultado = await sql.query('INSERT INTO chamados (titulo, descricao, responsavel_id) VALUES ($1, $2, $3)', [titulo, descricao, responsavel_id]);
    reply.status(201).send({message: 'Chamado cadastrado com sucesso!'});
});

servidor.post('/procurar/chamados', async (request, reply) => {
    const {responsavel_id} = request.body;
    if (!responsavel_id) {
        return reply.status(400).send({error: 'ID do responsável é obrigatório!'});
    };
    const busca = await sql.query('SELECT * FROM usuarios WHERE id = $1', [responsavel_id]);
    if (busca.rows.length === 0) {
        return reply.status(404).send({error: 'Responsável não encontrado!'});
    };
    const resultado = await sql.query('SELECT * FROM chamados WHERE responsavel_id = $1', [responsavel_id]);
    reply.status(200).send(resultado.rows);
});

servidor.put('/chamados/:id', async (request, reply) => {
    const {id} = request.params;
    const {titulo, descricao, status_chamado, responsavel_id} = request.body;
    if (!titulo || !descricao || !status_chamado || !responsavel_id) {
        return reply.status(400).send({error: 'Título, descrição, status e responsável pelo chamado são obrigatórios!'});
    };
    const busca = await sql.query('SELECT * FROM chamados WHERE id = $1', [id]);
    if (busca.rows.length === 0) {
        return reply.status(404).send({error: 'Chamado não encontrado!'});
    };
    const resultado = await sql.query('UPDATE chamados SET titulo = $1, descricao = $2, status_chamado = $3, responsavel_id = $4 WHERE id = $5', [titulo, descricao, status_chamado, responsavel_id, id]);
    reply.status(200).send({message: 'Chamado alterado com sucesso!'});
});

servidor.delete('/chamados/:id', async (request, reply) => {
    const {id} = request.params;
    const busca = await sql.query('SELECT * FROM chamados WHERE id = $1', [id]);
    if (busca.rows.length === 0) {
        return reply.status(404).send({error: 'Chamado não encontrado!'});
    };
    const resultado = await sql.query('DELETE FROM chamados WHERE id = $1', [id]);
    reply.status(200).send({message: 'Chamado excluído com sucesso!'});
});


servidor.listen({
    port: 3000,
});