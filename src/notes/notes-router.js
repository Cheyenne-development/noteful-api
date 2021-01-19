const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const NotesService = require('./notes-service');

const notesRouter = express.Router();
const bodyParser = express.json();

notesRouter
  .route('/api/notes')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const {
      note_name,
      modified,
      content,
      folder_id
    } = req.body;
    const newNote = {
      note_name,
      modified,
      content,
      folder_id
    };
    NotesService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(note)
      })
      .catch(next);
  })

notesRouter
  .route('/api/notes/:note_id')
  .all((req, res, next) => {
    const {
      note_id
    } = req.params
    NotesService.getById(req.app.get('db'), note_id)
      .then(note => {
        if (!note) {
          logger.error(`Note with ${note_id} not found`)
          return res.status(404).json({
            error: {
              message: 'Note not found'
            }
          })
        }
        res.note = note;
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(note)
    next();
  })

  .delete((req, res, next) => {
    const {
      note_id
    } = req.params;
    NotesService.deleteNote(req.app.get('db'), note_id)
      .then(row => {
        logger.info(`Note with ${note_id} removed`)
        res.status(204).end();
      })
      .catch(next)
  })


module.exports = notesRouter


//route is /api/notes
/* operation  needed get, post, delete
DB needs   id, name, modified, folderid, content */