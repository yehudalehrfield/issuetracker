const mongoose = require('mongoose');

module.exports = (app, issueModel) => {
  app.route('/api/issues/:project')

    .get(async (req, res) => {
      const { project } = req.params; // get project
      const searchParams = req.query; // get query params
      searchParams.project_name = project; // add project to query params
      // retrieve the issue docs matching the query
      const issues = await issueModel.find(searchParams);
      // return the array
      res.send(issues);
    })

    .post(async (req, res) => {
      const { project } = req.params; // get project
      const todayDateAndTime = new Date(); // insertion date and time
      // check for required fields (shouldn't this already be caught on the front end?)
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json({ error: 'required field(s) missing' });
      } else {
        // insert new issue doc into the database
        const newIssue = await issueModel.create({
          project_name: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          created_on: todayDateAndTime,
          updated_on: todayDateAndTime,
          assigned_to: req.body.assigned_to || '',
          status_text: req.body.status_text || '',
        });
        // return the issue doc
        res.json(newIssue);
      }
    })

    .put(async (req, res) => {
      // const { project } = req.params; // necessary?
      const todayDateAndTime = new Date();
      const updatedFields = { updated_on: todayDateAndTime };
      // get all updated fields (those not empty in the form)
      Object.keys(req.body).forEach((prop) => {
        if (req.body[prop]) {
          updatedFields[prop] = req.body[prop];
        }
      });
      if (!req.body._id) {
        // if no id, return error for missing id
        res.json({ error: 'missing _id' });
      } else if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
        // if invalid id, return update error
        res.json({
          error: 'could not update',
          _id: req.body._id,
        });
      } else if (Object.keys(updatedFields).length < 3) { // no updated fields
        // if there are no updated fields, return error for no updates
        res.json({
          error: 'no update field(s) sent',
          _id: req.body._id,
        });
      } else {
        try {
          // get the issue doc and update
          await issueModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.body._id),
            updatedFields,
            { returnDocument: 'after' },
          );
          res.json({
            result: 'successfully updated',
            _id: req.body._id,
          });
        } catch {
          // catch any other errors, return update error
          // valid id but not exisiting (?)
          res.json({
            error: 'could not update',
            _id: req.body._id,
          });
        }
      }
    })

    .delete(async (req, res) => {
      // const { project } = req.params; // necessary?
      if (!req.body._id) {
        // if missing id, return error
        res.json({ error: 'missing _id' });
      } else if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
        // if invalid id, return error in deletion
        res.json({ error: 'could not delete', _id: req.body._id });
      } else {
        try {
          // delete doc from the database
          await issueModel.findByIdAndDelete(req.body._id);
          // return upon successful deletion
          res.json({ result: 'successfully deleted', _id: req.body._id });
        } catch {
          // catch any other errors, return error in deletion
          // valid id but not exisiting (?)
          res.json({ error: 'could not delete', _id: req.body._id });
        }
      }
    });
};
