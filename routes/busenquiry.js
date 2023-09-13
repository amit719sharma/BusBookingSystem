var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.get("/businterface", function (req, res) {
var admin=JSON.parse(localStorage.getItem('ADMIN'))
if(admin)
  res.render("businterface", { message:''})
else
res.render("adminlogin", { message:''})

})

router.get("/displayallbus", function (req, res) {
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
if(!admin)
  res.render("adminlogin", { message:''})
else{
  pool.query(
    //"select F.*,(select C.cityname from cities C where C.citiesid=F.sourcecity) as source ,(select C.cityname from cities C where C.citiesid=F.destinationcity) as destination from flightsdetails F", function (error, result) {

    "select B.*,(select C.cityname from cities C where C.cityid=B.sourcecity) as source ,(select C.cityname from cities C where C.cityid=B.destinationcity) as destination from busdetails B",
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("displayallbus", { data: [], message: "Server Error" });
      } else {
        res.render("displayallbus", { data: result, message: "Success" });
      }
    }
  )}
})

router.get("/searchbyid", function (req, res) {
  console.log(req.query);
  pool.query(
    // "select F.*,(select C.cityname from cities C where C.citiesid=F.sourcecity) as source ,(select C.cityname from cities C where C.citiesid=F.destinationcity) as destination from flightsdetails F where flightid=?", [req.query.fid],
    "select B.*,(select C.cityname from cities C where C.cityid=B.sourcecity) as source ,(select C.cityname from cities C where C.cityid=B.destinationcity) as destination from busdetails B where busid=?",
    [req.query.bid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("busbyid", { data: [], message: "Server Error" });
      } else {
        console.log(result[0]);
        res.render("busbyid", { data: result[0], message: "Success" });
      }
    })
})

router.get("/searchbyidforimage", function (req, res) {
  console.log(req.query);
  pool.query(
    "select B.*,(select C.cityname from cities C where C.cityid=B.sourcecity) as source ,(select C.cityname from cities C where C.cityid=B.destinationcity) as destination from busdetails B where busid=?",
    [req.query.bid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("showimage", { data: [], message: "Server Error" });
      } 
      else {
        res.render("showimage", { data: result[0], message: "Success" });
      }
    })
})

router.post("/bussubmit", upload.single("logo"), function (req, res) {
  //var days = (""+req.body.days)
  // console.log("d'ays",req.query.days)
  //  var days = "" + req.body.days;
  console.log("BODY", req.body);
  console.log("FILE", req.file);
  var days = ("" + req.body.days).replaceAll("'", '"');
  pool.query(
    "insert into busdetails(busname, bustype, totalseats, days, sourcecity, departuretime, destinationcity, arrivaltime, company, logo)values(?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.busname,
      req.body.bustype,
      req.body.totalseats,
      days,
      req.body.sourcecity,
      req.body.departuretime,
      req.body.destinationcity,
      req.body.arrivaltime,
      req.body.company,
      req.file.filename,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("businterface", { message: "Server Error" });
      } else {
        res.render("businterface", {
          message: "Record Submitted Successfully",
        });
      }
    }
  );
});

router.get("/fetchallcities", function (req, res) {
  pool.query("select* from cities", function (error, result) {
    if (error) {
      res.status(500).json({ result: [], message: "Server Error" });
    } else {
      res.status(200).json({ result: result, message: "Success" });
    }
  });
});

router.post("/bus_edit_delete", function (req, res) {
  if(req.body.btn=="Edit"){
  var days = ("" + req.body.days).replaceAll("'", '"');
  pool.query(
    "update busdetails set busname=?, bustype=?, totalseats=?, days=?, sourcecity=?, departuretime=?, destinationcity=?, arrivaltime=?, company=? where busid=?",
    [
      req.body.busname,
      req.body.bustype,
      req.body.totalseats,
      days,
      req.body.sourcecity,
      req.body.departuretime,
      req.body.destinationcity,
      req.body.arrivaltime,
      req.body.company,
      req.body.busid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.redirect("/bus/displayallbus")
      }
      else {
        res.redirect("/bus/displayallbus")
      }
    })
  }
  else{
    var days = ("" + req.body.days).replaceAll("'", '"');
    pool.query(
      "delete busdetails set busname=?, bustype=?, totalseats=?, days=?, sourcecity=?, departuretime=?, destinationcity=?, arrivaltime=?, company=? where busid=?",
      [
        req.body.busid
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/bus/displayallbus")
        }
        else {
          res.redirect("/bus/displayallbus")
        }
      })
  }
})

router.post("/editimage", upload.single("logo"), function (req, res) {
  console.log("BODY", req.body);
  console.log("FILE", req.file);
  pool.query(
    "update busdetails set logo=? where busid=?",[req.file.originalname,req.body.busid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.redirect('/bus/displayallbus')
      } else {
        res.redirect('/bus/displayallbus')
      }
    }
  );
});

module.exports = router;






