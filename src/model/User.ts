export class User {
    
    id : number = 0;
    name : string = "";
    email : string = "";
    discord : string = "";
    password : string = "";
    gameFavorits : string = ""; 
    createdAt : Date = new Date();
  
    constructor( id:number ,name : string, email : string, discord : string, password : string, gameFavorits: string, createdAt : Date) {
        
        this.id = id;
        this.name = name;
        this.email = email;
        this.discord = discord;
        this.password = password;
        this.gameFavorits = gameFavorits;
        this.createdAt = createdAt;
    }
}