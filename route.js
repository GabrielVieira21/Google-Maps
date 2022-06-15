const express = require('express')

const route = express.Router()

route.get('/', (req, res) => res.render("home"))
route.get('/web', (req, res) => res.render("web"))


module.exports = route