"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ECMAScript Module
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const convert_hour_string_to_minutes_1 = require("./utils/convert-hour-string-to-minutes");
const convert_minutes_string_to_hour_1 = require("./utils/convert-minutes-string-to-hour");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// www.minhapi.com:3333/ads
// HTTP methods / API RESTful / HTTP Codes (Tipo de retorno)
// Get, Post, Put (Editando uma entidade), Patch(Edição de informações especificas), Delete(Remoção de entidade)
/**
 * Query: parametros que advem do ?, quando precisamos persistir estado. (Guarda o estado atual da aplicação, e não pode ser usado para envio de informações sensiveis).
 * Route: usamos para identificação de recursos.
 * Body: usamos para quando vamos enviar várias informações de uma requisição.
 */
/**
 * Request Body
 */
const prisma = new client_1.PrismaClient({
    log: ['query']
});
//assync/await
let userAuthenticated;
app.get('/games', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield prisma.game.findMany({
        include: {
            _count: {
                select: {
                    Ad: true
                }
            },
        }
    });
    response.json(games);
}));
app.post('/games/:id/ads', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = request.params.id;
    const body = request.body;
    const ad = yield prisma.ad.create({
        data: {
            gameId,
            userId: body.userId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: (0, convert_hour_string_to_minutes_1.convertHourStringToMinutes)(body.hourStart),
            hourEnd: (0, convert_hour_string_to_minutes_1.convertHourStringToMinutes)(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    });
    response.status(201).json(ad);
}));
app.post('/user/register', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const user = yield prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            discord: body.discord,
            password: body.password,
            gameFavorits: body.gameFavorits.join(',')
        }
    });
    response.status(201).json(user);
}));
app.post('/user/login', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    let authetication = false;
    const user = yield prisma.user.findFirst({
        where: {
            email: body.email,
            password: body.password,
        }
    });
    if (user != undefined) {
        authetication = true;
        userAuthenticated = user;
    }
    response.status(201).json({
        "authenticated": authetication
    });
}));
app.post('/user/login', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    let authetication = false;
    const user = yield prisma.user.findFirst({
        where: {
            email: body.email,
            password: body.password,
        }
    });
    if (user != undefined) {
        authetication = true;
    }
    response.status(201).json({
        "authenticated": authetication
    });
}));
app.get('/user/:id/sobre', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = request.params.id;
    let retornaUser = false;
    if (parseInt(userId) == userAuthenticated.id) {
        retornaUser = true;
    }
    response.json(retornaUser ? userAuthenticated : "Não foi possível localizar o usuário");
}));
app.get('/games/:id/ads', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = request.params.id;
    const ads = yield prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourEnd: true,
            hourStart: true,
            user: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    response.json(ads.map(ad => {
        return Object.assign(Object.assign({}, ad), { weekDays: ad.weekDays.split(','), hourStart: (0, convert_minutes_string_to_hour_1.convertMinutesStringToHour)(ad.hourStart), hourEnd: (0, convert_minutes_string_to_hour_1.convertMinutesStringToHour)(ad.hourEnd) });
    }));
}));
app.get('/ads/:id/discord', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const adId = request.params.id;
    const ads = yield prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    });
    response.json({
        discord: ads.discord
    });
}));
app.listen(3333);
