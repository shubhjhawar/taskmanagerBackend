const express = require('express');
const {ObjectId} = require('mongodb');
const taskManager = express.Router();


const setupRoutes = (database) => {
  taskManager.put('/updateAllTasks', (req, res) => {
    const updatedData = req.body;
    if (!updatedData) {
      return res.status(400).json({error:'No update data was sent'});
    }

    database.collection('taskManager').deleteMany({})
    database.collection('taskManager').insertMany(updatedData)
      .then(result => {
        if (result.modifiedCount === 0) {
          return res.status(404).json({error: 'Could not find or update data'});
        }
        return res.status(200).json({message: 'The taskManager collection has been updated successfully'});
      })
      .catch(error => {
        console.error(error);
        return res.status(500).json({error: 'Error updating taskManager collection'});
      });
  });

  return taskManager;
}

module.exports = setupRoutes;
