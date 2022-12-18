module.exports = (app, issueModel) => {
  app.route('/api/issues/:project')

    .get(async (req, res) => {
      // add query params
      const { project } = req.params;
      const searchParams = req.query;
      searchParams.project_name = project;
      console.log(searchParams);
      const issues = await issueModel.find(searchParams);
      res.send(issues);
    })

    .post(async (req, res) => {
      const { project } = req.params;
      const todayDateAndTime = new Date();
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json({ error: 'required field(s) missing' });
      } else {
        const newIssue = await issueModel.create({
          project_name: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          created_on: todayDateAndTime,
          updated_on: todayDateAndTime,
          assigned_to: req.body.assigned_to, // does this need a ternary to become ''
          status_text: req.body.status_text, // does this need a ternary to become ''
        });
        res.json(newIssue);
      }
    })

    .put(async (req, res) => {
      // const { project } = req.params; // why is this needed? or is it?
      const todayDateAndTime = new Date();
      const updatedFields = { updated_on: todayDateAndTime };
      // get all updated fields (those not empty in the form)
      Object.keys(req.body).forEach((prop) => {
        if (req.body[prop]) {
          updatedFields[prop] = req.body[prop];
        }
      });
      console.log(req.body);
      console.log(updatedFields);
      console.log(`updated fields length: ${Object.keys(updatedFields).length}`);
      if (!req.body._id) {
        res.json({ error: 'missing id' });
      } else if (Object.keys(updatedFields).length < 3) {
        res.json({
          error: 'no update field(s) sent',
          _id: req.body._id,
        });
      } else {
        const updatedIssue = await issueModel.findByIdAndUpdate(
          req.body._id,
          updatedFields,
          { returnDocument: 'after' },
        );
        console.log(updatedIssue);
        res.json({
          result: 'successfully updated',
          _id: req.body._id,
        });
      }
    })

    .delete((req, res) => {
      const { project } = req.params;
    });
};
