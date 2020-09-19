const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const dotenv = require('dotenv');
dotenv.config();
const authMiddleware = require('../middleware/is-auth');
const admin_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

describe('Auth middleware', function() {
  it('should throw an error if no authorization', function() {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function(headerName) {
        return 'xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer alotofnumbersandletters';
      }
    };

    sinon.stub( jwt, 'verify' );
    jwt.verify.returns({ userId: 'abc' });

    authMiddleware(req, {}, () => {});

    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');

    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();

  });

  it('should throw an error if the token cannot be verified', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer 123';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
