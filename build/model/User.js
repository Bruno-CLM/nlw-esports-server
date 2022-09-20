"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, email, discord, password, gameFavorits, createdAt) {
        this.id = 0;
        this.name = "";
        this.email = "";
        this.discord = "";
        this.password = "";
        this.gameFavorits = "";
        this.createdAt = new Date();
        this.id = id;
        this.name = name;
        this.email = email;
        this.discord = discord;
        this.password = password;
        this.gameFavorits = gameFavorits;
        this.createdAt = createdAt;
    }
}
exports.User = User;
