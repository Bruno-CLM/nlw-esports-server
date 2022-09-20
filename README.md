# Back-end

## Entidades

Game
Ad
User

### Game

id
title
bannerUrl

### Ad

id
gameId
userId
name
yearsPlaying
discord
weekDays
hourStart
hourEnd
useVoiceChannel
createdAt

### User

id
name    
email
discord
password
gameFavorits

## Casos de uso

- Listagem de games com contagem de anúncios
- Criação de novo anúncio
- Listagem de anúncios por game
- Buscar discord pelo ID do anúncio
- Cadastro de usuario
- Autenticação de usuario 
- Edição de perfil de usuario
- Listagem de ultimos jogadores