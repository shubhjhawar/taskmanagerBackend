// boxManager.js
const express = require('express');
const {ObjectId} = require('mongodb');
const boxManager = express.Router();

const setupRoutes = (database) => {
  boxManager.get('/getBox', (request, response) => {
    database.collection('boxManager').find({}).toArray((error, result) => {
      if (error) {
        return response.status(500).json({error: 'Error retrieving data from database'});
      }
      response.json({name: 'First Board', columns: result});
    });
  });

  boxManager.post('/addBox', (req, res) => {
    const task = req.body;
    if (!task) {
      res.status(400).json({error: 'These tasks have not been transferred'});
      return;
    }
    database.collection('boxManager').insertOne(task)
      .then(result => {
        res.status(201).json(result);
      }).catch(err => {
      res.status(500).json({error: 'Error adding task to database'});
    });
  });

  boxManager.patch('/updateNameBox/:id', (req, res) => {
    const taskId = req.params.id;
    const newName = req.body.name;

    database.collection('boxManager').updateOne({_id: ObjectId(taskId)}, {$set: {name: newName}}, {upsert: true})
      .then(result => {
        if (result.modifiedCount === 0) {
          res.status(404).json({error: 'No box with the specified ID was found'});
          return;
        }
        res.status(200).json({message:'Box name updated successfully'});
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({error: 'Error updating box name'});
      });
  });

  boxManager.delete('/deleteBox/:id', (req, res) => {
    const taskId = req.params.id;
    if (!taskId) {
      res.status(400).json({error: 'No box ID specified'});
      return;
    }
    database.collection('boxManager').deleteOne({_id: ObjectId(taskId)})
      .then(result => {
        if (result.deletedCount === 0) {
          res.status(404).json({error: 'No box with the specified ID was found'});
          return;
        }
        res.status(200).json({message: 'Box deleted successfully'});
      })
      .catch(error => {
        res.status(500).json({error: 'Error deleting box from database'});
      });
  });

  boxManager.post('/addTask', (req, res) => {
    const task = req.body;
    if (!task) {
      res.status(400).json({error: 'These tasks have not been transferred'});
      return;
    }
    database.collection('taskManager').insertOne(task)
    .then(result => {
      res.status(201).json(result);
    }).catch(err => {
      res.status(500).json({error: 'Error adding task to database'});
    });
  });

  boxManager.get('/getTasks', (request, response) => {
    database.collection('taskManager').find({}).toArray((error, result) => {
      if (error) {
        return response.status(500).json({error: 'Error retrieving data from database'});
      }
      response.json(result);
    });
  });

  boxManager.delete('/deleteTask/:id', (req, res) => {
    const taskId = req.params.id;
    if (!taskId) {
      res.status(400).json({error: 'No box ID specified'});
      return;
    }
    console.log(taskId, 'taskId log')

    database.collection('taskManager').deleteOne({_id: ObjectId(taskId)})
    .then(result => {
      if (result.deletedCount === 0) {
        res.status(404).json({error: 'No box with the specified ID was found'});
        return;
      }
      res.status(200).json({message: 'Box deleted successfully'});
    })
    .catch(error => {
      res.status(500).json({error: 'Error deleting box from database'});
    });
  });

  boxManager.patch('/updateTask/:id', (req, res) => {
    const taskId = req.params.id;
    const { heading, description, fixed_dueDate, variable_dueDate, repeat, complete, repeatID, repeatFrequency, newColumnName  } = req.body;

    database.collection('taskManager').updateOne({_id: ObjectId(taskId)}, {$set: {
      heading,
      description,
        fixed_dueDate,
        variable_dueDate,
        repeat,
        complete,
        repeatID,
        repeatFrequency,
        newColumnName
    }})
    .then(result => {
      if (result.modifiedCount === 0) {
        res.status(404).json({error: 'No box with the specified ID was found'});
        return;
      }
      res.status(200).json({message:'Box name updated successfully'});
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({error: 'Error updating box name'});
    });
  });

  boxManager.put('/updateAllTasks', (req, res) => {
    const updatedData = req.body;
    if (!updatedData) {
      return res.status(400).json({error:'No update data was sent'});
    }

    database.collection('boxManager').deleteMany({})
    database.collection('boxManager').insertMany(updatedData)
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

  return boxManager;
};

module.exports = setupRoutes;
