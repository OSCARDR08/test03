var  Express  = require("express");
const bodyParser = require("body-parser");
const {request, response } = require("express");
var cors = require('cors');
var mysql = require('mysql');
var dotenv = require('dotenv');

// Creacion conexion a la base de datos

dotenv.config();


    var connection =mysql.createConnection({
        host:'us-cdbr-east-06.cleardb.net',
        user:'b330df94cb10b3',
        password:'e105e52e',
        database:'heroku_e5dfc67dc2cbd2b'
     });

     
//Creacion instancia de Express
var app = Express();

//Habilita el parseo de las url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

var fileUpload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpload());
app.use('/Photos', Express.static(__dirname+'/Photos'));
app.use('/build', Express.static(__dirname+'/build'));

// Se habilita el puerto del servidor
app.listen(process.env.PORT || 3001 ,()=>{


    connection.connect(function(err){

        
        if(err) {
            console.log("Error al intentar conectar");
        }else{
            console.log("Conectada exitosa");

        }    
      
    });

   

   
});

app.get('/api', (request,response)=>{
    response.send('Hello world');
});


app.get('/api/department',(request,response)=> {


    var query = `SELECT * FROM DEPARTMENT`;

    try {
    connection.query(query,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.send(rows);

    });
    }catch(err){
        console.log("Error select department")
    } 

});

app.post('/api/department',(request,response)=> {


    var query = `INSERT INTO DEPARTMENT(DEPARTMENTNAME) values (?)`;
    var values =  [
        request.body['DepartmentName']
    ];

    try {

        connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
                response.json('Added Success!');

            });
        }catch(err){

        console.log("Error insert department")

    }

});

app.put('/api/department',(request,response)=> {


    var query = `UPDATE DEPARTMENT SET DepartmentName=? WHERE DepartmentId=?`;
   
    var values =  [
        request.body['DepartmentName'],
          request.body['DepartmentId']
    ];


    try {
    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Updataed Successfully!');

    });
}catch(err){

    console.log("Error update departemnt")
}

});


app.delete('/api/department/:id',(request,response)=> {

    var query = `DELETE FROM DEPARTMENT WHERE DepartmentId=?`;
   
    var values =  [        
        parseInt(request.params.id)    
    ];
    
    try {

    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Deleted Successfully!');

    });

    } catch(err){

        console.log("Error en delete deparment")
    }

});



app.get('/api/employee',(request,response)=> {


    var query = `SELECT * FROM EMPLOYEE`;

    try {
    connection.query(query,function(err, rows,fields){
          
        if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.send(rows);

        });

    }catch(err){
        console.log("Error en select de empleado")
    }    

});

app.post('/api/employee',(request,response)=> {


    var query = `INSERT INTO EMPLOYEE(EmployeeName,Department,DateOfJoining,PhotoFileName) 
     values(?,?,?,?)`;
    var values =  [
        request.body['EmployeeName'],
        request.body['Department'],
        request.body['DateOfJoining'],
        request.body['PhotoFileName']
    ];


    try {
    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Added Success!');

    });
}catch(err){

    console.log("Error en insert de empleado");
}
});

app.put('/api/employee',(request,response)=> {


    var query = `UPDATE EMPLOYEE 
                 SET EmployeeName=?,
                     Department =?,
                     DateOfJoining=?,
                     PhotoFileName=? 
                WHERE EmployeeId=?`;
   
    var values =  [
        request.body['EmployeeName'],
        request.body['Department'],
        request.body['DateOfJoining'],
        request.body['PhotoFileName'],
        request.body['EmployeeId']
    ];

    try{
    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Updataed Successfully! ' + request.body['EmployeeId'] );

    });

    }catch(err){
        console.log("Error en el update demploeado")
    }

});


app.delete('/api/employee/:id',(request,response)=> {

    var query = `DELETE FROM EMPLOYEE WHERE EmployeeId=?`;
   
    var values =  [        
        parseInt(request.params.id)    
    ];
    
    try{
    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Deleted Successfully!');

    });
}catch(err){
    console.log("Error en delete de employee");

}

});


app.post('/api/employee/savefile',(request,response)=> {

    fs.writeFile("./Photos/" + request.files.file.name,
                               request.files.file.data, 
                               function(err){

                                    if(err){

                                    return console.log(err);
                                    }

                                response.json(request.files.file.name); 
               })

})










