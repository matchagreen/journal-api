import express from 'express'
import {validationResult, query, param, checkSchema} from 'express-validator';
import Database from '../../utilities/Database.js'
import Link from '../../models/Link.js'
import { validate } from 'express-jsonschema';

interface GettLink {
    link: string,
    createdAt: Date,
    updatedAt: Date
}

const router = express.Router()
router.get(
    '/username/:username/board/:boardname/links',
    query('page').isInt({min: 1}),
    query('size').isInt({min: 1}),
    param('username').not().isEmpty(),
    param('boardname').not().isEmpty(),
    async (req, res) =>  {
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // URL params
    const username = req.params!.username
    const boardname = req.params!.boardname

    // Query parameters
    const page = parseInt(req.query!.page)
    const size = parseInt(req.query!.size)

    const db = new Database()

    // Get user id and make sure it exists
    const user = await db.getUser(username)
    if (user === null) {
        return res.status(404).json({errors: [`user "${username}" not found`]})
    }
    const userId = user!._id

    // Get board id and make sure it exists
    const board = await db.getBoard(userId, boardname)
    if (board === null) {
        return res.status(404).json({errors: [`board "${boardname}" not found`]})
    }

    const boardId = board!._id

    // Get links
    const links = await db.getBoardLinks(boardId, page, size)
    res.send(links)
})

router.post(
    '/username/:username/board/:boardname/links',
    validate({
        body: {
            type: 'object',
            properties: {
                link: {
                    type: 'string',
                    required: true,
                    minLength: 1,
                },
            },
            additionalProperties: false,
        }
    }),
    async (req, res) => {

    // URL params
    const username = req.params.username
    const boardname = req.params.boardname

    // Req body
    const bodyLink = req.body

    const db = new Database()

    // Get user id and make sure it exists
    const user = await db.getUser(username)
    if (user === null) {
        res.sendStatus(404)
        return
    }
    const userId = user!._id

    // Get board id and make sure it exists
    const board = await db.getBoard(userId, boardname)
    if (board === null) {
        res.sendStatus(404)
        return
    }

    const link: Link = {
        _id: undefined,
        link: bodyLink.link,
        boardId: board._id,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    // Create link object
    const insertedLink = await db.createLink(link)

    const rtn: GettLink = {
        link: insertedLink.link,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
    }

    res.send(rtn)
})

export default router