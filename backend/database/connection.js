
module.exports = {
   // connection: "mongodb://"+ process.env.DB_USER  +":"+ process.env.DB_PASS +"@ds213896.mlab.com:13896/todos" //standard with credentials
   connection: "mongodb://localhost:27017/TO_DO_DB" //local
  //connection: "mongodb://host.docker.internal:27017/TO_DO_DB" //docker
}