const request = require("supertest");
const app = require("../app");
const TellerModel = require("../models/TellerOfficerModel");
const COModel = require("../models/CommunityOfficerModel");
const DetailCOModel = require("../models/DetailCOModel");
const VaultModel = require("../models/VaultModel");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

const secretJwtToken = process.env.JWT_SECRET;

var userData = {};
var userToken = "";
var idco = "619cb6b9662316fd62fab161"

beforeAll((done) => {
  TellerModel.create({
    _id: "123001",
    name: "Nur Laila",
    nik: "33221199",
    photo: "https://image.pngaaa.com/441/1494441-middle.png",
    password: "123",
  })
    .then((data) => {
      userData = data
      userToken = jwt.sign(
        {
          id: data._id,
          nik: data.nik,
          photo: data.photo
        },
        secretJwtToken
      );
      done();
    })
    .catch((err) => {
      console.log(err)
    })
});

afterEach((done) => {
  TellerModel.findOne({ _id: userData._id })
    .then((data) => {
      userData = data
      done()

    })
    .catch((err) => {
      console.log(err)
    })
})

afterAll((done) => {
  TellerModel.deleteMany({})
    .then((deleted) => {
      done();

    })
    .catch((err) => {
      console.log(err);
    });

  COModel.deleteMany({})
    .then(deleted => {
      done()
    })
    .catch(err => {
      console.log(err)
    })

  DetailCOModel.deleteMany({})
    .then(deleted => {
      done()
    })
    .catch(err => {
      console.log(err)
    })

  VaultModel.deleteMany({})
    .then(deleted => {
      done()
    })
    .catch(err => {
      console.log(err)
    })
});

describe("POST /teller/generateJSON", function () {
  test("Should return success", function (done) {
    request(app)
      .post("/teller/generateJSON")
      .expect(201)
      .then((response) => {
        // console.log(response.body);
        expect(response.body).toEqual(
          expect.objectContaining({
            status : "success"
          })
        );
        done();
      });
  });
});

describe("POST /teller/login", function () {
  test("Should return User Not Found", function (done) {
    request(app)
      .post("/teller/login")
      .send({
        nik: "3322119",
        password: "123",
      })
      .expect(404)
      .then((response) => {
        // console.log(response.body);
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "failed"
          })
        );
        done();
      });
  });
});

describe("POST /teller/login", function () {
  test("Should return token", function (done) {
    request(app)
      .post("/teller/login")
      .send({
        nik: "33221199",
        password: "12",
      })
      .expect(400)
      .then((response) => {
        // console.log(response.body);
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "failed"
          })
        );
        done();
      });
  });
});

describe("GET /vault", function () {
  test('Should Return status success', function (done) {
    request(app)
      .get("/vault/")
      .set("Authorization", userToken)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "success",

          })
        )
        done()
      })

  });
})

describe("GET /vault", function () {
  test('Should Return status failed', function (done) {
    request(app)
      .get("/vault/")
      .expect(401)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "failed",

          })
        )
        done()
      })

  });
})

describe("GET /vault/balance", function () {
  test("Should Return status success", function (done) {
    request(app)
      .get("/vault/balance")
      .set("Authorization", userToken)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "success"
          })
        )
        done()
      })
  });
})

describe("GET /vault/balance", function () {
  test("Should Return status failed", function (done) {
    request(app)
      .get("/vault/balance")
      .expect(401)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "failed"
          })
        )
        done()
      })
  });
})



//by _id
describe("POST /communityofficer/register", function () {
  test("Should return success ", function (done) {
    request(app)
      .post("/communityofficer/register")
      .set("Authorization", userToken)
      .send({
        _id: idco,
        teller: "123123123",
        name: "Jaka",
        nik: "2121",
        region: "jateng",
        password: "1231"
      })
      .expect(201)
      .then((response) => {
        // console.log(response.body)
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.any(Object)
          })
        );
        done();
      });
  });
});



describe("POST /communityofficer/login", function () {
  test("Should return token", function (done) {
    request(app)
      .post("/communityofficer/login")
      .send({
        nik: "2121",
        password: "1231",
      })
      .expect(200)
      .then((response) => {
        // console.log(response.body);
        expect(response.body).toEqual(
          expect.objectContaining({
            access_token: expect.any(String)
          })
        );
        done();
      });
  });
});

describe("GET /communityofficer/", function () {
  test("Should Return status success", function (done) {
    request(app)
      .get("/communityofficer/")
      .set("Authorization", userToken)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "success"
          })
        )
        done()
      })
  });
})

// describe('POST /vault/_idcommunityofficer', () => {
//     test.only('should return status success', (done) => {
//         request(app)
//         .post('/vault/619cb6b9662316fd62fab161')
//         .set("Authorization",userToken)
//         .expect(201)
//     });
// });

