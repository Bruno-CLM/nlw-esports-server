// ECMAScript Module
import  express from 'express'
import cors from 'cors'
import {User} from './model/User'
import { Prisma, PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesStringToHour } from './utils/convert-minutes-string-to-hour'

const app = express()


app.use(express.json())
app.use(cors())

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

const prisma = new PrismaClient({
    log: ['query']
})

//assync/await

let userAuthenticated : any;


app.get('/games', async(request, response) =>{

    const games = await prisma.game.findMany(
        {
            include: {
                _count :{
                    select : {
                        Ad: true
                    }
                },
            }
        }
    )

    response.json(games);
});

app.post('/games/:id/ads', async(request, response) =>{
    const gameId = request.params.id;
    const body: any = request.body;
    
    console.log(body)

    const ad = await prisma.ad.create({
        data: {
            gameId: gameId,
            name: body.nickname,
            userId: body.userId,
            yearsPlaying: Number(body.yearsPlaying),
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    response.status(201).json(ad);
});

app.post('/user/register', async(request, response) =>{
    const body: any = request.body;

    const user = await prisma.user.create({
        data: {
            name: body.name,         
            email: body.email,       
            discord: body.discord,     
            password: body.password,
            gameFavorits: body.gameFavorits.join(',')
        }
    })



    response.status(201).json(user);
});


app.post('/user/login', async(request, response) =>{
    const body: any = request.body;
    let authetication : boolean = false;

    const user = await prisma.user.findFirst({
        where: {
            email : body.email,
            password: body.password,
        }
    })

    if(user != undefined){
        authetication = true;
        userAuthenticated = user;
    }
    

    response.status(201).json({
        "authenticated" : authetication
    });
});

app.post('/user/login', async(request, response) =>{
    const body: any = request.body;
    let authetication : boolean = false;

    const user = await prisma.user.findFirst({
        where: {
            email : body.email,
            password: body.password,
        }
    })

    if(user != undefined){
        authetication = true;
    }

    response.status(201).json({
        "authenticated" : authetication
    });
});

app.get('/user/:id/sobre', async(request, response) =>{
    const userId = request.params.id
    let retornaUser : boolean = false

    if(parseInt(userId) == userAuthenticated.id){
        retornaUser = true;
    }

    response.json(retornaUser ? userAuthenticated : "Não foi possível localizar o usuário")
});


app.get('/games/:id/ads', async(request, response) =>{
    const gameId = request.params.id

    const ads = await prisma.ad.findMany({

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
    })

    response.json(ads.map(ad => {
        return{
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesStringToHour(ad.hourStart),
            hourEnd: convertMinutesStringToHour(ad.hourEnd)
        }
    }));
});

app.get('/ads/:id/discord', async(request, response) =>{
    const adId = request.params.id

    const ads = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    response.json({
        discord: ads.discord
    });
});

app.listen(3333)
