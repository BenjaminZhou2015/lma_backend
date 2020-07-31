let chai = require("chai");
let server = require("../server")
let chaiHttp = require("chai-http");


//Assertion Style
chai.should();
expect = chai.expect();


chai.use(chaiHttp);

// response.expect = chai.expect();
describe("API Tests", () =>{
    /**
     * Test the GET rout
     */


    describe("GET /api/users", () =>{
        it("It should GET all the users",(done)=>{
            chai.request(server)
                .get("/api/users")
                .end((err, response) =>{
                    response.should.have.status(200);
                    done();
                })
        })
    })

    describe("GET /api/machines", () =>{
        it("It should GET all the machines",(done)=>{
            chai.request(server)
                .get("/api/machines")
                .end((err, response) =>{
                    response.should.have.status(200);
                    // response.body.should.be.a('json');
                    response.body.should.have.property('machines');
                    // response.should.exist();
                    done();
                })
        })
    })


    describe("GET /api/locations", () =>{
        it("It should GET all the locations",(done)=>{
            chai.request(server)
                .get("/api/locations")
                .end((err, response) =>{
                    response.should.have.status(200);
                    // response.body.should.be.a('json');
                    response.body.should.have.property('locations');
                    // response.should.exist();
                    done();
                })
        })
    })

    describe("GET /api/machines/:locationID", () =>{
        it("It should GET all the /machines/:locationID",(done)=>{
            chai.request(server)
                .get("/api/machines/:locationID")
                .end((err, response) =>{
                    response.should.have.status(200);
                    // response.body.should.be.a('json');
                    response.body.should.have.property('machines');
                    // response.should.exist();
                    done();
                })
        })
        //
        // it("It should GET any /machines/:locationID",(done)=>{
        //     chai.request(server)
        //         .get("/api/machines/:locationID")
        //         .end((err, response) =>{
        //             response.should.have.status(200);
        //             // response.body.should.be.a('json');
        //             response.body.should.have.property('machines');
        //             // response.should.exist();
        //             done();
        //         })
        // })

    })



    /**
     * Test the Post route
     */

    describe("POST api/checkEmail", () =>{
        it("It should POST checkEmail",(done)=>{
            const email = "yifeihu08@gmail.com"
            chai.request(server)
                .post("/api/checkEmail")
                .send(email)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.have.property( "isAvailable").eq(true);
                    // response.body.should.have.property('locations');
                    // response.should.exist();
                    done();
                })
        })
    })

    //how to design a successful register test case?
    describe("POST api/users/register", () =>{
        it("It should POST register successfully",(done)=>{
            const user = {
                firstName: "Elon",
                lastName:"Musk",
                email: "elonmusk@gmail.com",
                password: "elonmusk",
                locationID: ""
            }
            chai.request(server)
                .post("/api//users/register")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.have.property( "isSuccess").eq(false);
                    response.body.should.have.property( "msg").eq( "E11000 duplicate key error collection: lma.users index: email_1 dup key: { email: \"elonmusk@gmail.com\" }");
                    done();
                })
        })
    })



    describe("POST api/users/login", () =>{
        it("It should POST login successfully",(done)=>{
            const user = {
                email: "elonmusk@gmail.com",
                password: "elonmusk",
            }
            chai.request(server)
                .post("/api/users/login")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.have.property( "isSuccess").eq(true);
                    // response.body.should.have.property('locations');
                    // response.should.exist();
                    done();
                })
        })
    })

    describe("POST api/admin/login", () =>{
        it("It should not log in succesfully because Elon is not an Admin",(done)=>{
            const user = {
                username: "elonmusk@gmail.com",
                password: "elonmusk",
            }
            chai.request(server)
                .post("/api/admin/login")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.have.property( "isSuccess").eq("false");
                    response.body.should.have.property( "msg").eq("Your username or password is wrong");
                    // response.body.should.have.property('locations');
                    // response.should.exist();
                    done();
                })
        })
    })


    // describe("POST api/scanToOpen", () =>{
    //     it("It should not log in succesfully because Elon is not an Admin",(done)=>{
    //         const user = {
    //             token: "ZWxvbm11c2tAZ21haWwuY29t",
    //         }
    //         chai.request(server)
    //             .post("/api/scanToOpen")
    //             .send(user)
    //             .end((err, response) =>{
    //                 response.should.have.status(200);
    //                 response.body.should.have.property( "isSuccess").eq("false");
    //                 response.body.should.have.property( "msg").eq("Your username or password is wrong");
    //                 // response.body.should.have.property('locations');
    //                 // response.should.exist();
    //                 done();
    //             })
    //     })
    // })
    //


    /**
     * Test DELETE
     */


    describe("DELETE api/locations/:id", () =>{
        it("It should not find the id/ IT should not DELETE anything",(done)=>{
            const id =  "fff"
            chai.request(server)
                .delete("/api/locations/:id")
                .send(id)
                .end((err, response) =>{
                    response.should.have.status(404);
                    response.body.should.have.property( "isSuccess").eq(false);
                    response.body.should.have.property( "msg").eq("Cannot find the Location");
                    // response.body.should.have.property('locations');
                    // response.should.exist();
                    done();
                })
        })
    })


    /**
     * Test Put
     */


    describe("PUT api/locations/:id", () =>{
        it("It should not find the id/ IT should update anything",(done)=>{
            const id =  "fff"
            chai.request(server)
                .put("/api/locations/:id")
                .send(id)
                .end((err, response) =>{
                    response.should.have.status(404);
                    response.body.should.have.property( "isSuccess").eq(false);
                    response.body.should.have.property( "msg").eq("Cannot find the Location");
                    // response.body.should.have.property('locations');
                    // response.should.exist();
                    done();
                })
        })
    })
})


