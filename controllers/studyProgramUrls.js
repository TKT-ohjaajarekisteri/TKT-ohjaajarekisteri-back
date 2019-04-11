const studyProgramUrlsRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin } = require('../utils/middleware/checkRoute')

//Get request that returns all study program url objects as JSON
studyProgramUrlsRouter.get('/', checkAdmin, async (req, res) => {
  let studyProgramUrls = await db.StudyProgramUrl.findAll({})
  res.status(200).json(studyProgramUrls)
})

//Updates the study program url of given type or creates a new one if the type doesn't exist
studyProgramUrlsRouter.put('/', checkAdmin, async (req, res) => {
  try {
    //Update existing
    let studyProgramUrl = await db.StudyProgramUrl.findOne({ where: { type: req.body.type } })
    await studyProgramUrl.update({ url: req.body.url })
    res.status(200).end()
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

module.exports = studyProgramUrlsRouter