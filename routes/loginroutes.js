var mysql      = require('mysql');
var bcrypt = require('bcryptjs');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'users'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

exports.register = async function(req,res){

    var users={
       "email":req.body.email,
       "password":req.body.password
     }
    
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      } else {
        res.send({
          "code":200,
          "success":"user registered sucessfully"
            });
        }
    });
  }

  exports.login = async function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM users WHERE email = ?',[email], async function (error, results, fields) {
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        if(results.length >0){
          const comparision = await bcrypt.compare(password, results[0].password)
          if(comparision){
              res.send({
                "code":200,
                "success":"login sucessfull"
              })
          }
          else{
            res.send({
                 "code":204,
                 "success":"Email and password does not match"
            })
          }
        }
        else{
          res.send({
            "code":206,
            "success":"Email does not exits"
              });
        }
      }
      });
  }