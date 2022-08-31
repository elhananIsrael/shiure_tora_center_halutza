const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const { CourierClient } = require("@trycourier/courier");
require("dotenv").config();

function isEmpty(obj) {
  for (var x in obj) {
    return false;
  }
  return true;
}

//Serve static files from the React app
app.use(express.static("client/build"));

app.use(express.json());

try {
  const shiureToraSchema = new mongoose.Schema({
    // id: mongoose.ObjectId,
    ravName: String,
    // lessonSubject: String,
    // price: Number,
    // place: String,
    date: String,
    time: String,
    moreDetails: String,
    contactPersonName: String,
    // contactPersonPhone: String,
    totalNumLessonsRavCanToday: Number,
    // numLessonsLeft: Number,
    updateDate: String,
  });

  const ShiureToraHalutza = mongoose.model(
    "ShiureToraHalutza",
    shiureToraSchema
  );

  // Get all shiurim.
  app.get("/api/shiureToraHalutza", (req, res) => {
    const {
      ravName,
      // lessonSubject,
      // price,
      // place,
      date,
      time,
      moreDetails,
      contactPersonName,
      // contactPersonPhone,
      totalNumLessonsRavCanToday,
      // numLessonsLeft,
      updateDate,
    } = req.query;
    let query = {};
    if (ravName) {
      query.ravName = { $regex: new RegExp(ravName, "i") };
    }
    // if (lessonSubject) {
    //   query.lessonSubject = { $regex: new RegExp(lessonSubject, "i") };
    // }
    // if (price) {
    //   query.price = price;
    //   // query.price = { $regex: new RegExp(price, "i") };
    // }
    // if (place) {
    //   query.place = { $regex: new RegExp(place, "i") };
    // }
    if (date) {
      query.date = date;
      // query.date = { $regex: new RegExp(date, "i") };
    }
    if (time) {
      query.time = time;
      // query.time = { $regex: new RegExp(time, "i") };
    }
    if (moreDetails) {
      query.moreDetails = { $regex: new RegExp(moreDetails, "i") };
    }
    if (contactPersonName) {
      query.contactPersonName = { $regex: new RegExp(contactPersonName, "i") };
    }
    // if (contactPersonPhone) {
    //   query.contactPersonPhone = {
    //     $regex: new RegExp(contactPersonPhone, "i"),
    //   };
    // }
    if (totalNumLessonsRavCanToday) {
      query.totalNumLessonsRavCanToday = totalNumLessonsRavCanToday;
      // query.time = { $regex: new RegExp(time, "i") };
    }
    // if (numLessonsLeft) {
    //   query.numLessonsLeft = numLessonsLeft;
    //   // query.time = { $regex: new RegExp(time, "i") };
    // }
    if (updateDate) {
      query.updateDate = updateDate;
      // query.time = { $regex: new RegExp(time, "i") };
    }
    ShiureToraHalutza.find({ query }, (err, shiureToraHalutza) => {
      if (!isEmpty(err)) console.log("err", err);
      if (!isEmpty(query)) console.log("query", query);
      // console.log(products);
      res.send(shiureToraHalutza);
    });
  });

  // Get one shiur by id.
  app.get("/api/shiureToraHalutza/:id", (req, res) => {
    const { id } = req.params;
    ShiureToraHalutza.findById(id, (err, shiureToraHalutza) => {
      res.send(shiureToraHalutza);
    });
  });

  // Add one shiur to DB.
  app.post("/api/shiureToraHalutza", (req, res) => {
    const {
      ravName,
      // lessonSubject,
      // price,
      // place,
      date,
      time,
      moreDetails,
      contactPersonName,
      // contactPersonPhone,
      totalNumLessonsRavCanToday,
      // numLessonsLeft,
      updateDate,
    } = req.body;
    const shiureToraHalutza = new ShiureToraHalutza({
      ravName,
      // lessonSubject,
      // price,
      // place,
      date,
      time,
      moreDetails,
      contactPersonName,
      // contactPersonPhone,
      totalNumLessonsRavCanToday,
      // numLessonsLeft,
      updateDate,
    });
    shiureToraHalutza.save((err, shiureToraHalutza) => {
      // console.log("err", err, "product", product);
      res.send(shiureToraHalutza);
    });
  });

  // Update one shiur by id.
  app.put("/api/shiureToraHalutza/:id", (req, res) => {
    const { id } = req.params;
    const {
      ravName,
      // lessonSubject,
      // price,
      // place,
      date,
      time,
      moreDetails,
      contactPersonName,
      // contactPersonPhone,
      totalNumLessonsRavCanToday,
      // numLessonsLeft,
      updateDate,
    } = req.body;
    ShiureToraHalutza.findByIdAndUpdate(
      id,
      {
        ravName,
        // lessonSubject,
        // price,
        // place,
        date,
        time,
        moreDetails,
        contactPersonName,
        // contactPersonPhone,
        totalNumLessonsRavCanToday,
        // numLessonsLeft,
        updateDate,
      },
      { new: true },
      (err, shiureToraHalutza) => {
        res.send(shiureToraHalutza);
      }
    );
  });

  // Delete one shiur by id.
  app.delete("/api/shiureToraHalutza/:id", (req, res) => {
    const { id } = req.params;
    ShiureToraHalutza.findByIdAndDelete(id, (err, shiureToraHalutza) => {
      if (!isEmpty(err)) console.log("err", err);
      else console.log(`Shiure Tora in Halutza with id:${id} -deleted`);
      // InitShiureToraHalutza();
      res.send(shiureToraHalutza);
    });
  });

  const emails = new mongoose.Schema({
    // id: mongoose.ObjectId,
    email: String,
  });

  const Emails = mongoose.model("Emails", emails);

  // Get all emails.
  app.get("/api/emails", (req, res) => {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.email = email;
    }

    Emails.find({ query }, (err, emails) => {
      if (!isEmpty(err)) console.log("err", err);
      if (!isEmpty(query)) console.log("query", query);
      // console.log(products);
      res.send(emails);
    });
  });

  // Get one email by id.
  app.get("/api/emails/:id", (req, res) => {
    const { id } = req.params;
    Emails.findById(id, (err, email) => {
      res.send(email);
    });
  });

  // Add one email to DB.
  app.post("/api/emails", (req, res) => {
    const { email } = req.body;
    // console.log("email", email);
    const emails = new Emails({
      email,
    });
    // console.log("emails", emails);
    emails.save((err, emails) => {
      // console.log("err", err, "emails", emails);
      res.send(emails);
    });
  });

  // Delete one email by id.
  app.delete("/api/emails/:id", (req, res) => {
    const { id } = req.params;
    Emails.findByIdAndDelete(id, (err, email) => {
      if (!isEmpty(err)) console.log("err", err);
      else console.log(`Email with id:${id} -deleted`);
      // else InitEmails();
      res.send(email);
    });
  });

  //sending email
  const { AUTHORIZATION_TOKEN, EVENT_ID } = process.env;
  app.post("/api/send-email", function (req, res) {
    const { emailsList, eventStatus, eventDescription } = req.body;
    const courier = CourierClient({
      authorizationToken: AUTHORIZATION_TOKEN,
    });
    courier
      .send({
        eventId: EVENT_ID, // your Notification ID
        recipientId: "RECIPIENT_ID", // usually your system's User ID
        profile: {
          email: emailsList,
        },
        data: { eventStatus, eventDescription }, // optional variables for merging into templates
      })
      .then((resp) => {
        console.log("Email sent", resp);
        console.log("emails List", emailsList);
        res.send(resp);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // The "catchall" handler: For any request that doesn't
  // match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
  });

  // const InitShiureToraHalutza = () => {
  //   ShiureToraHalutza.findOne((err, shiureToraHalutza) => {
  //     console.log(
  //       "ShiureToraHalutza.findOne((err, shiureToraHalutza)",
  //       shiureToraHalutza !== null
  //     );
  //     if (!shiureToraHalutza) {
  //       fs.readFile("./shiure-tora.json", "utf8", (err, data) => {
  //         if (err) throw err;
  //         const shiureToraHalutza = JSON.parse(data);
  //         console.log("shiureToraHalutza", shiureToraHalutza);

  //         ShiureToraHalutza.insertMany(
  //           shiureToraHalutza,
  //           (err, shiureToraHalutzaRes) => {
  //             // res.send(shiureToraHalutzaRes);
  //             console.log("err", err);

  //             console.log("shiureToraHalutzaRes", shiureToraHalutzaRes);
  //           }
  //         );
  //       });
  //     }
  //   });
  // };

  // const InitEmails = () => {
  //   Emails.findOne((err, email) => {
  //     console.log("Emails.findOne((err, email)", email !== null);
  //     if (!email) {
  //       fs.readFile("./emails.json", "utf8", (err, data) => {
  //         if (err) throw err;
  //         const emails = JSON.parse(data);
  //         console.log("emails", emails);

  //         Emails.insertMany(emails, (err, emailsRes) => {
  //           // res.send(emailsRes);
  //           console.log("err", err);

  //           console.log("emailsRes", emailsRes);
  //         });
  //       });
  //     }
  //   });
  // };

  const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
  const mongo_url =
    `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority` ||
    "mongodb://localhost:27017/shiure_tora_center_halutza";
  // const mongo_url =
  //   process.env.MONGO_URL || "mongodb://localhost:27017/shiure_tora_center_halutza";
  const port = process.env.PORT || 5000;
  mongoose.connect(
    mongo_url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      app.listen(port, () => {
        // InitShiureToraHalutza();
        // InitEmails();

        console.log(`app listening on ${port}`);
      });
    }
  );
} catch (error) {
  console.log("ERROR!", error);
}
