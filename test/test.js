let chai = require("chai")
let chaiHttp = require("chai-http")
let app = require("../app")
let should = chai.should()

chai.use(chaiHttp);

describe('Persons', () => {

    describe('/GET persons', () => {

        it('it should Get all persons', (done) => {
            chai.request(app)
                .get('/dismissed')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
    })

    describe('/GET positions ', () => {
        it('it should Get all positions', (done) => {
            chai.request(app)
                .get('/pos')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array');
                    done();
                })
        })
    })

})