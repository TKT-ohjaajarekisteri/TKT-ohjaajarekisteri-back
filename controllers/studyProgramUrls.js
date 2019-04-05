const studyProgramUrlsRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin } = require('../utils/middleware/checkRoute')

studyProgramUrlsRouter.put('/:type', checkAdmin, async (req, res) => {
  try {

    let studyProgramUrl = await db.StudyProgramUrl.findOne({ where: { type: req.params.type } })
    await studyProgramUrl.update({ url: req.body.url })
    res.status(200).end()

  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

module.exports = studyProgramUrlsRouter