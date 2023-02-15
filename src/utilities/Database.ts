import { MongoClient, ObjectId } from 'mongodb';
import User from '../models/User.js';
import Link from '../models/Link.js';
import Board from '../models/Board.js';

enum Collections {
    Boards = "Boards",
    Connections = "Connections",
    Links = "Links",
    Users = "Users"
}

export default class Database {
    private static _uri = 'mongodb://localhost:27017'
    private static _client: MongoClient | null = null

    public static DBName = "Giftlist"

    public constructor() {
        // Initialize singleton db connection
        if (Database._client == null) {
            Database._client = new MongoClient(Database._uri)
        }
    }

    async getUser(username: string): Promise<User|null> {
        const collection = this.getCollection(Collections.Users)

        const query = {
            username: username
        }
        const projection = {
            username: 1,
            picture: 1,
            comment: 1,
        }

        const user: User|null = await collection.findOne(query, projection)
        return user;
    }

    async getBoard(userId: ObjectId, boardName: string): Promise<Board|null> {
        const collection = this.getCollection(Collections.Boards)

        const query = {
            userId: userId,
            name: boardName
        }
        const projection = {
            name: 1,
            isPrivate: 1,
        }

        const board: Board|null = await collection.findOne(query, projection)
        return board
    }

    async getBoardLinks(boardId: string, page: number, size: number): Promise<Link[]> {
        const collection = this.getCollection(Collections.Links)
        const query = {
            boardId: boardId
        }

        const links = await collection.find(query)
            .sort({updatedAt: 1})
            .skip(page > 0 ? (page - 1) * size : 0)
            .limit(size)
            .toArray()

        return links
    }

    // _id should be undefined
    async createLink(link: Link): Promise<Link> {
        const collection = this.getCollection(Collections.Links)
        const ack =  await collection.insertOne(link)
        
        return {
            ...link,
            _id: ack.insertedId
        }
    }

    private getCollection(collection: string) {
        const database = Database._client!.db(Database.DBName)
        return database.collection(collection)
    }
}

let hello: String