const path = require('path');
const express = require('express');
const xss = require('xss')
const logger = require('../logger')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router();
const jsonParser = express.json();


foldersRouter
  .route('/api/folders')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders)
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      folder_name
    } = req.body;
    const newFolder = {
      folder_name
    };
    if (folder_name === null) {
      return res.status(404).json({
        error: {
          message: 'New folder must have a name'
        }
      });
    }
      FoldersService.insertFolder(req.app.get('db'), newFolder)
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(folder)
      })
      .catch(next);
  })

  foldersRouter
  .route('/api/folders/:folder_id')
  .get((req, res, next) => {
    const { folder_id } = req.params;
    FoldersService.getById(req.app.get('db'), folder_id)
    .then(folder => {
      if(!folder){
        logger.error(`Folder with ${folder_id} not found`)
        return res.status(404).json({error:{message:'Folder not found'}
      })
      }
      res.json(folder)
      next();
    })
    .catch(next);
  })


module.exports = foldersRouter;
