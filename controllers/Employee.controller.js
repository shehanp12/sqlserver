const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function signUp(req, res) {

    models.Employee.findOne({where:{phoneNumber:req.body.phoneNumber}}).then(result =>{

        if(result){
            res.status(409).json({
                message: "This user is already exists",
            });
        }else{
            bcryptjs.genSalt(10,function (err,salt) {

                bcryptjs.hash(req.body.password,salt,function (err,hash) {

                    const employee = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        password: hash,
                        phoneNumber: req.body.phoneNumber,
                        employeeAdress: req.body.employeeAdress,
                        departmentId: req.body.departmentId

                    }

                    models.Employee.create(employee).then(result => {
                        res.status(201).json({
                            message: "Employee created successfully"
                        });

                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong!"
                        })

                    });
                })
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong!",
        });
    })

}

function login(req, res){
    models.Employee.findOne({where:{id:req.body.id}}).then(user => {
        if(user === null){
            res.status(401).json({
                message: "Invalid credentials!",
            });
        }else{
            bcryptjs.compare(req.body.password, user.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        password: user.password,
                        id: user.id
                    }, "secret", function(err, token){
                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token
                        });
                    });
                }else{
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
}


module.exports ={
    signUp:signUp,
    login:login

}
