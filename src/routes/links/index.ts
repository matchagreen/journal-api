import express from 'express'
import Database from '../../utilities/Database.js'
import Link from '../../models/Link.js'

interface PostLink {
    link: string,
}

interface GettLink {
    link: string,
    createdAt: Date,
    updatedAt: Date
}

const router = express.Router()
router.get('/username/:username/board/:boardname/links', async (req, res) =>  {
    // URL params
    const username = req.params.username
    const boardname = req.params.boardname

    // Query parameters
    const page = req.query.page
    const size = req.query.size

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
    const boardId = board!._id

    // Get links
    const links = await db.getBoardLinks(boardId, -1, -1)
    res.send(links)
})

router.post('/username/:username/board/:boardname/links', async (req, res) => {
    // URL params
    const username = req.params.username
    const boardname = req.params.boardname

    // Req body
    const bodyLink: PostLink = req.body

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