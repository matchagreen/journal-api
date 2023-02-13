import { ObjectId } from 'mongodb';

interface User {
    _id: ObjectId,
    username: string,
    picture: string,
    comment: string,    
}

export default User