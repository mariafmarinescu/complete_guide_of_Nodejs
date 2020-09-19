
const AuthController = require('../controllers/auth');

const mongoose = require('mongoose');
const expect = require('chai').expect;
const sinon = require('sinon');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');
const admin_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

describe('Auth Controller', function () {
  before(function (done) {
    mongoose
      .connect(
        admin_URI
      )
      .then(result => {
        const user = new User({
          email: process.env.UEMAIL,
          password: process.env.EPASS,
          name: process.env.ENAME,
          posts: [],
          _id: process.env.EPID,
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function () { });

  afterEach(function () { });

  it('should throw an error with code 500 when fails accessing db', function (done) {

    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: process.env.UEMAIL,
        password: process.env.EPASS,
      }
    };

    AuthController.login(req, {}, () => { }).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', function (done) {
    const req = { userId: process.env.EUSERID };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, () => { }).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal('I am new!');
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
