const express = require("express")
const https = require("https")
const request = require("request")
const app = express();
const keys = require("./keys.json")

app.use(express.static(__dirname));

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const Email = req.body.email;
    const data = {
        members: [
            {email_address: Email,
             status: "subscribed",
             merge_fields: {
                FNAME: firstName,
                LNAME: lastName
             }
            }
        ]
    }
  const jsonData = JSON.stringify(data);

  const url  = keys.mailchimp_url
  
  const options = {
    method: "post",
    auth: keys.apikey
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode==200)
       res.sendFile(__dirname+"/success.html")
    else{
        res.sendFile(__dirname+"/failure.html")
        } 
    response.on("data", function(data){
        console.log(JSON.parse(data));
     })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server running on port 3000.");
});

