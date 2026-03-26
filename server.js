import Fastify from 'fastify';
import { Pool } from 'pg';

const servidor = Fastify();

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "sistema_chamados"
})

servidor.get('/usuarios', async () => {
    const resultado = await sql.query('SELECT * FROM usuario')
    return resultado.rows
})

servidor.post('/usuarios', async (request, reply) => {
    const body = request.body;
    if (!body || !body.nome || !body.email || !body.senha) {
        return reply.status(400).send({ message: 'Nome, email e senha são obrigatórios' });
    }
    await sql.query(
        'INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3)',
        [body.nome, body.email, body.senha]
    )
    reply.status(201).send({ message: 'Usuario criado' })
})

servidor.post('/login', async (request, reply) => {
    const body = request.body;
    if (!body || !body.email || !body.senha) {
        return reply.status(400).send({ erro: 'Email e senha são obrigatórios' });
    }
    const resultado = await sql.query(
        'SELECT * FROM usuario WHERE email = $1 AND senha = $2',
        [body.email, body.senha]
    )
    if (resultado.rows.length === 0) {
        return reply.status(401).send({ message: 'Usuário ou senha inválidos', login: false })
    }
    reply.status(200).send({ message: 'Usuário logado', login: true })
})

servidor.get('/chamados', async (request, reply) => {
    const responsavel_id = request.query.responsavel_id;

    if (responsavel_id) {
        const resultado = await sql.query(
            'SELECT * FROM chamado WHERE responsavel_id = $1',
            [responsavel_id]
        )
        return resultado.rows
    }

    const resultado = await sql.query('SELECT * FROM chamado')
    return resultado.rows
})

// Buscar chamado por ID
servidor.get('/chamados/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query(
        'SELECT * FROM chamado WHERE id = $1',
        [id]
    )
    if (resultado.rows.length === 0) {
        return reply.status(404).send({ message: 'Chamado não encontrado' })
    }
    return resultado.rows[0]
})

// Criar chamado
servidor.post('/chamados', async (request, reply) => {
    const body = request.body;
    if (!body || !body.titulo || !body.responsavel_id) {
        return reply.status(400).send({ message: 'Titulo e responsavel_id são obrigatórios' });
    }
    await sql.query(
        'INSERT INTO chamado (titulo, descricao, responsavel_id) VALUES ($1, $2, $3)',
        [body.titulo, body.descricao, body.responsavel_id]
    )
    reply.status(201).send({ message: 'Chamado criado' })
})

// Editar chamado
servidor.put('/chamados/:id', async (request, reply) => {
    const body = request.body
    const id = request.params.id
    if (!body || !body.titulo || !body.status) {
        return reply.status(400).send({ message: 'Titulo e status são obrigatórios' });
    }
    const chamado = await sql.query('SELECT * FROM chamado WHERE id = $1', [id])
    if (chamado.rows.length === 0) {
        return reply.status(404).send({ message: 'Chamado não existe' })
    }
    await sql.query(
        'UPDATE chamado SET titulo = $1, descricao = $2, status = $3 WHERE id = $4',
        [body.titulo, body.descricao, body.status, id]
    )
    reply.status(200).send({ message: `Chamado ${id} atualizado` })
})

servidor.delete('/chamados/:id', async (request, reply) => {
    const id = request.params.id
   
    if (!id) {
        return reply.status(400).send({ message: 'ID é obrigatório para deletar a chamado' });
    }

    const resultado = await sql.query('DELETE FROM usuario WHERE id = $1', [id])
    console.log(resultado);


    reply.status(200).send({ message: 'chamada deletado' })
})

servidor.listen({ port: 3000 })