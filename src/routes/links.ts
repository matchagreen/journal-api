import express from 'express'
import Database from '../utilities/Database.js'

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

export default router