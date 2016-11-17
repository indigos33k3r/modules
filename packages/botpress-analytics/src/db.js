const Promise = require('bluebird')
const moment = require('moment')

let knex = null
let bp = null

function initializeDb() {
  if (!knex) {
    throw new Error('you must initialize the database before')
  }

  return knex.schema.createTableIfNotExists('analytics_interactions', function (table) {
    table.increments('id').primary()
    table.timestamp('ts')
    table.string('type')
    table.string('text')
    table.string('user').references('users.id')
    table.enu('direction', ['in', 'out'])
  })
  .then(function() {
    return knex.schema.createTableIfNotExists('analytics_runs', function(table) {
      table.increments('id').primary()
      table.timestamp('ts')
    })
  })
  .then(() => knex)
}

function saveFacebookOut(event) {
  const userId = 'facebook:' + event.raw.to
  const interactionRow = {
    ts: moment(new Date()).format('x'),
    type: event.type,
    text: event.text,
    user: userId,
    direction: 'out'
  }

  return knex('analytics_interactions').insert(interactionRow)
  .then(function(result) { return true })
}

function saveInteractionIn(event) {
  const interactionRow = {
    ts: moment(new Date()).format('x'),
    type: event.type,
    text: event.text,
    user: event.platform + ':' + event.user.id,
    direction: 'in'
  }

  return knex('analytics_interactions').insert(interactionRow)
}

function saveInteractionOut(event) {
  if(event.platform === 'facebook') {
    return saveFacebookOut(event)
  }
}

module.exports = (k, botpress) => {
  knex = k
  bp = botpress

  return {
    initializeDb: initializeDb,
    saveIncoming: saveInteractionIn,
    saveOutgoing: saveInteractionOut
  }
}
