const { randCity, randPoint, revertPoints } = require('../functions');
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
        const { matricula } = req.params;

        await redisClient.get(matricula, async (err, reply) => {
            if (reply) {
                const data = JSON.parse(reply.toString());

                return res.status(200).json(data);
            } else {
                await mongoClient.connect();

                const DataBase = mongoClient.db(MONGO_DATABASE);
                const Student = DataBase.collection('Student');

                await Student.findOne({ matricula }).then(async (response) => {
                    if (response) {
                        await redisClient.setex(matricula, (60 * 60), JSON.stringify(response));

                        return res.status(200).json(response);
                    }
                    return res.status(404).json(null);
                });
            }
        });
    },

    async create(req, res) {
        const { body } = req;

        const randCityData = randCity();

        body.cidade = randCityData[0];
        body.local = randPoint(randCityData[1]);
        body.svgPoint = revertPoints(body.local);

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

        students.map(student => {
            let randCityData = randCity();

            student.cidade = randCityData[0];
            student.local = randPoint(randCityData[1]);
            student.svgPoint = revertPoints(student.local);
        });

        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        await Student.insertMany(students).then(async (response) => {
            return res.json(response.ops);
        });
    },

    async update(req, res) {
        const { body } = req;
        const { matricula } = req.params;

        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        await Student.updateOne({ matricula }, { $set: body }).then(async (response) => {
            await redisClient.get(matricula, async (err, reply) => {
                if (reply) {
                    await redisClient.del(matricula);
                }
            });
            if (response.matchedCount) {
                return res.status(200).send();
            }
            return res.status(404).send();
        });
    },

    async destroy(req, res) {
        const { matricula } = req.params;

        await mongoClient.connect();

        const DataBase = mongoClient.db(MONGO_DATABASE);
        const Student = DataBase.collection('Student');

        await Student.deleteOne({ matricula }).then(async (response) => {
            await redisClient.get(matricula, async (err, reply) => {
                if (reply) {
                    await redisClient.del(matricula);
                }
            });
            if (response.deletedCount) {
                return res.status(200).send();
            }
            return res.status(404).send();
        });
    },
}