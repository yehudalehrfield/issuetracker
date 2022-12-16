module.exports = function (app, issueModel) {
  app.route('/api/issues/:project')

    .get(async (req, res) => {
      // add query params
      const { project } = req.params;
      const issues = await issueModel.find({ project_name: project });
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

    .put((req, res) => {
      const { project } = req.params;
    })

    .delete((req, res) => {
      const { project } = req.params;
    });
};
