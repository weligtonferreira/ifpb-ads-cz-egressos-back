const { mongoClient, redisClient } = require('../config/database');
const { MONGO_DATABASE } = process.env;

module.exports = {
    async index(req, res) {
        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        const students = [];

        await Student.find().forEach(s => students.push(s));

        return res.json(students);
    },

    async show(req, res) {
        const { registration } = req.params;

        await redisClient.get(registration, async (err, reply) => {
            if (reply) {
                const data = JSON.parse(reply.toString());

                return res.status(200).json(data);
            } else {
                await mongoClient.connect();

                const DataBase = mongoClient.db(MONGO_DATABASE);
                const Student = DataBase.collection('Student');

                await Student.findOne({ registration }).then(async (response) => {
                    if (response) {
                        await redisClient.setex(registration, (60 * 60), JSON.stringify(response));

                        return res.status(200).json(response);
                    }
                    return res.status(404).json(null);
                });
            }
        });
    },

    async create(req, res) {
        const { body } = req;

        const student = {};

        const { nome, matricula, situacao, cota } = body;

        const cidades = [
            'São José de Piranhas',
            'Cajazeiras',
            'Sousa',
            'São Paulo',
            'Rio de Janeiro',
            'João Pessoa',
            'Cabedelo',
            'Curitiba',
            'Cascavel',
            'Barro',
            'Manaus',
            'Teresina',
            'Campina Grande',
            'Belém',
            'Brasília',
            'Pombal'
        ];

        const cidade = cidades[Math.floor(Math.random() * (cidades.length - 0)) + 0];

        student.nome = nome;
        student.registration = matricula;
        student.situacao = situacao;
        student.curso = 'Tecnologia em Análise e Desenvolvimento de Sistemas';
        student.campus = 'Cajazeiras';
        student.cota = cota;
        student.cidadeNatal = cidade;

        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        await Student.insertOne(student).then(async (response) => {
            return res.json(response.ops[0]);
        });
    },

    async createMany(req, res) {
        const { body } = req;

        const { students } = body;

        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        await Student.insertMany(students).then(async (response) => {
            return res.json(response.ops);
        });
    },

    async update(req, res) {
        const { body } = req;
        const { registration } = req.params;

        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        await Student.updateOne({ registration }, { $set: body }).then(async (response) => {
            await redisClient.get(registration, async (err, reply) => {
                if (reply) {
                    await redisClient.del(registration);
                }
            });
            if (response.matchedCount) {
                return res.status(200).send();
            }
            return res.status(404).send();
        });
    },

    async destroy(req, res) {
        const { registration } = req.params;

        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        await Student.deleteOne({ registration }).then(async (response) => {
            await redisClient.get(registration, async (err, reply) => {
                if (reply) {
                    await redisClient.del(registration);
                }
            });
            if (response.deletedCount) {
                return res.status(200).send();
            }
            return res.status(404).send();
        });
    },
}