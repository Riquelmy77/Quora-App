const Datastore = require('nedb');
const path = require('path');

const eventsDB = new Datastore({ filename: path.join(__dirname, 'events.db'), autoload: true });
const notesDB = new Datastore({ filename: path.join(__dirname, 'notes.db'), autoload: true });
const tasksDB = new Datastore({ filename: path.join(__dirname, 'tasks.db'), autoload: true });

module.exports = { eventsDB, notesDB, tasksDB };