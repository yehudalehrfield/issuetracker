/* eslint-disable no-undef */
const chaiHttp = require('chai-http');
const chai = require('chai');

const { assert } = chai;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  let testIssueId;
  test('POST request with every field filled to to test_proj project', (done) => {
    // const todayAndNow = new Date().toISOString();
    chai
      .request(server)
      .post('/api/issues/test_proj')
      .type('form')
      .send({
        issue_title: 'Fill all fields',
        issue_text: 'POST request with all issue fields filled',
        created_by: 'YL',
        assigned_to: 'YL',
        status_text: 'In QA',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Fill all fields');
        assert.equal(res.body.issue_text, 'POST request with all issue fields filled');
        // assert.equal(res.body.created_on, todayAndNow);
        // assert.equal(res.body.updated_on, todayAndNow);
        assert.equal(res.body.created_by, 'YL');
        assert.equal(res.body.assigned_to, 'YL');
        assert.equal(res.body.open, true);
        assert.equal(res.body.status_text, 'In QA');
        done();
      });
  });
  test('POST request with only required fields to test_proj project', (done) => {
    chai
      .request(server)
      .post('/api/issues/test_proj')
      .type('form')
      .send({
        issue_title: 'Required Title',
        issue_text: 'Required Text',
        created_by: 'YL',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Required Title');
        assert.equal(res.body.issue_text, 'Required Text');
        assert.equal(res.body.created_by, 'YL');
        testIssueId = res.body._id;
        done();
      });
  });
  test('POST request with missing required fields to test_proj project', (done) => {
    chai
      .request(server)
      .post('/api/issues/test_proj')
      .type('form')
      .send({
        issue_title: 'Just a title',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });
  test('GET request to view all issues in test_proj project', (done) => {
    chai
      .request(server)
      .get('/api/issues/test_proj')
      .end((err, res) => {
        assert.equal(res.status, 200);
        // what else am i looking for here?
        done();
      });
  });
  test('GET request with filter to view issues in test_proj project', (done) => {
    chai
      .request(server)
      .get('/api/issues/test_proj')
      .query({
        open: true,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // what else am i looking for here?
        done();
      });
  });
  test('GET request with multiple filters to view issues in test_proj project', (done) => {
    chai
      .request(server)
      .get('/api/issues/test_proj')
      .query({
        open: true,
        created_by: 'YL',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // what else am i looking for here?
        done();
      });
  });
  test('PUT request to update one field to test_proj project', (done) => {
    chai
      .request(server)
      .put('/api/issues/test_proj')
      .type('form')
      .send({
        _id: testIssueId,
        issue_title: 'Modified title',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
  });
  test('PUT request to update multiple fields to test_proj project', (done) => {
    chai
      .request(server)
      .put('/api/issues/test_proj')
      .type('form')
      .send({
        _id: testIssueId,
        issue_title: 'Modified title',
        issue_text: 'Modified text',
        created_by: 'AK',
        assigned_to: 'YL',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
  });
  test('PUT request with missing _id to test_proj project', (done) => {
    chai
      .request(server)
      .put('/api/issues/test_proj')
      .type('form')
      .send({
        issue_title: 'Modified title',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  test('PUT request with no updated fields to test_proj project', (done) => {
    chai
      .request(server)
      .put('/api/issues/test_proj')
      .type('form')
      .send({
        _id: testIssueId,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body._id, testIssueId);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
  });
  test('PUT request with invalid _id to test_proj project', (done) => {
    chai
      .request(server)
      .put('/api/issues/test_proj')
      .type('form')
      .send({
        _id: 'invalid_id',
        issue_title: 'Modified title',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, 'invalid_id');
        done();
      });
  });
  test('DELETE request to delete an issue from test_proj project', (done) => {
    chai
      .request(server)
      .delete('/api/issues/test_proj')
      .type('form')
      .send({
        _id: testIssueId,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, testIssueId);
        done();
      });
  });
  test('DELETE request with no id from test_proj project', (done) => {
    chai
      .request(server)
      .delete('/api/issues/test_proj')
      .type('form')
      .send({
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  test('DELETE request with invalid id from test_proj project', (done) => {
    chai
      .request(server)
      .delete('/api/issues/test_proj')
      .type('form')
      .send({
        _id: 'invalid_id',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, 'invalid_id');
        done();
      });
  });
});
