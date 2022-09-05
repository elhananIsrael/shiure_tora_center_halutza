import { useState, useEffect } from "react";
import Home from "./pages/Home";
// import About from "./pages/About";
import "./App.css";
import MyContext from "./MyContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [toraLessonsArr, setToraLessonsArr] = useState([]);

  const getIndex = (arr, key) => {
    try {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]._id === key) {
          return i;
        }
      }
      return -1; //to handle the case where the value doesn't exist
    } catch (error) {
      console.error("error", error);
    }
  };

  const getAllEmailsFromServer = () => {
    fetch("/api/emails")
      .then((response) => {
        return response.json();
      })
      .then((emailsFromDB) => {
        console.log(emailsFromDB);
        let emailToSent = "";
        for (let i = 0; i < emailsFromDB.length; i++) {
          emailToSent += emailsFromDB[i].email + ",";
        }
        console.log(emailToSent);
        return emailsFromDB;
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  const addLessonAndSendEMail = (
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
    eventStatus,
    eventDescription
  ) => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      };
      fetch("/api/shiureToraHalutza", options)
        .then((response) => response.json())
        .then((lessonAdded) => {
          // console.log(lessonAdded);
          let newToraLessonsArr = [...toraLessonsArr, lessonAdded];
          setToraLessonsArr(newToraLessonsArr);

          fetch("/api/emails")
            .then((response) => {
              // console.log(response);
              return response.json();
            })
            .then((emailsFromDB) => {
              // console.log(emailsFromDB);
              let emailsList = "";
              for (let i = 0; i < emailsFromDB.length; i++) {
                emailsList += emailsFromDB[i].email + ",";
              }
              if (emailsList !== "") {
                const options = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    emailsList,
                    eventStatus,
                    eventDescription,
                  }),
                };
                fetch("/api/send-email", options)
                  .then((response) => response.json())
                  .then((emailMessageID) => {
                    // console.log(emailMessageID);
                    return emailMessageID;
                  })
                  .catch((error) => {
                    console.log("fetch error", error);
                  });
              }
              // console.log(emailsList);
              return emailsFromDB;
            })
            .catch((error) => {
              console.log("fetch error", error);
            });

          // getAllEmailsFromServer();
          return lessonAdded._id;
        })
        .catch((error) => {
          console.log("fetch error", error);
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  const updateLessonAndSendEMail = (
    _id,
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
    eventStatus,
    eventDescription
  ) => {
    try {
      let toraLesson = null;
      toraLessonsArr
        .filter((lesson) => lesson._id === _id)
        .map((item) => {
          toraLesson = item;
          // console.log(item);
          return true;
        });
      let toraLessonIndex = null;

      if (toraLesson !== null) {
        toraLessonIndex = getIndex(toraLessonsArr, _id);
        const newToraLesson = {
          _id,
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
        };
        // console.log(newCartItem);
        let newToraLessonsArr = [...toraLessonsArr];
        newToraLessonsArr[toraLessonIndex] = newToraLesson;
        setToraLessonsArr(newToraLessonsArr);
        const options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        };
        fetch(`/api/shiureToraHalutza/${_id}`, options)
          .then((response) => response.json())
          .then((toraLessonUpdated) => {
            fetch("/api/emails")
              .then((response) => response.json())
              .then((emailsFromDB) => {
                // console.log(emailsFromDB);
                let emailsList = "";
                for (let i = 0; i < emailsFromDB.length; i++) {
                  emailsList += emailsFromDB[i].email + ",";
                }
                if (emailsList !== "") {
                  const options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      emailsList,
                      eventStatus,
                      eventDescription,
                    }),
                  };
                  fetch("/api/send-email", options)
                    .then((response) => response.json())
                    .then((emailMessageID) => {
                      // console.log(emailMessageID);
                      return emailMessageID;
                    })
                    .catch((error) => {
                      console.log("fetch error", error);
                    });
                }
                // console.log(emailsList);
                return emailsFromDB;
              })
              .catch((error) => {
                console.log("fetch error", error);
              });

            return toraLessonUpdated;
          })
          .catch((error) => {
            console.log("fetch error", error);
          });
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const deleteLessonAndSendEMail = (_id, eventStatus, eventDescription) => {
    fetch(`/api/shiureToraHalutza/${_id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        let newToraLessonsArr = [...toraLessonsArr];
        setToraLessonsArr(
          newToraLessonsArr.filter((toraLesson) => toraLesson._id !== _id)
        );

        if (
          newToraLessonsArr.filter((toraLesson) => toraLesson._id !== _id)
            .length === 0
        ) {
          setTimeout(getAllToraLessonsFromServer, 5000);
        }

        fetch("/api/emails")
          .then((response) => {
            // console.log(response);
            return response.json();
          })
          .then((emailsFromDB) => {
            // console.log(emailsFromDB);
            let emailsList = "";
            for (let i = 0; i < emailsFromDB.length; i++) {
              emailsList += emailsFromDB[i].email + ",";
            }
            if (emailsList !== "") {
              const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  emailsList,
                  eventStatus,
                  eventDescription,
                }),
              };
              fetch("/api/send-email", options)
                .then((response) => response.json())
                .then((emailMessageID) => {
                  // console.log(emailMessageID);
                  return emailMessageID;
                })
                .catch((error) => {
                  console.log("fetch error", error);
                });
            }
            // console.log(emailsList);
            return emailsFromDB;
          })
          .catch((error) => {
            console.log("fetch error", error);
          });

        return result;
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  const addOrDeleteEmail = (emailToAdd) => {
    fetch("/api/emails") //get all emails from DB
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((emailsFromDB) => {
        // console.log(emailsFromDB);
        const myEmail = emailsFromDB.filter(
          (item) => item.email === emailToAdd
        );

        let emailToSent = "";
        for (let i = 0; i < emailsFromDB.length; i++) {
          emailToSent += emailsFromDB[i].email + ",";
        }
        if (myEmail.length > 0) {
          //so we need to remove this email from DB
          fetch(`/api/emails/${myEmail[0]._id}`, { method: "DELETE" })
            // .then((response) => response.json())
            .then((result) => {
              // console.log(result);
              alert("האימייל שלך הוסר ממערכת עדכוני השיעורים");
              return result;
              // if (newCartArr.filter((product) => product._id !== _id).length === 0) {
              //   setTimeout(getAllProductsFromServer, 5000); }
            })
            .catch((error) => {
              console.log("fetch error", error);
            });
        } //so we need to add this email to DB
        else {
          const LowerCaseEmail = emailToAdd.toLowerCase();
          // console.log(LowerCaseEmail);
          const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: LowerCaseEmail,
            }),
          };
          // console.log(options);
          fetch("/api/emails", options)
            // .then((response) => response.json())
            .then((emailAdded) => {
              // console.log(emailAdded);
              alert("האימייל שלך נרשם למערכת עדכוני השיעורים");
              return emailAdded;
            })
            .catch((error) => {
              console.log("fetch error", error);
            });
        }
        // console.log(emailToSent);
        return emailsFromDB;
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  const addEmail = (email) => {
    try {
      const LowerCaseEmail = email.toLowerCase();
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          LowerCaseEmail,
        }),
      };
      fetch("/api/emails", options)
        .then((response) => response.json())
        .then((emailAdded) => {
          // console.log(emailAdded);
          return emailAdded._id;
        })
        .catch((error) => {
          console.log("fetch error", error);
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  const removeEmail = (_id) => {
    fetch(`/api/emails/${_id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // if (newCartArr.filter((product) => product._id !== _id).length === 0) {
        //   setTimeout(getAllProductsFromServer, 5000); }
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  const sendEmails = (eventStatus, eventDescription) => {
    fetch("/api/emails")
      .then((response) => {
        return response.json();
      })
      .then((emailsFromDB) => {
        console.log(emailsFromDB);
        let emailsList = "";
        for (let i = 0; i < emailsFromDB.length; i++) {
          emailsList += emailsFromDB[i].email + ",";
        }
        console.log(emailsList);
        /////////////////////////////////////////
        if (emailsList !== "") {
          const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emailsList,
              eventStatus,
              eventDescription,
            }),
          };
          fetch("/api/send-email", options)
            .then((response) => response.json())
            .then((emailMessageID) => {
              console.log(emailMessageID);
              return emailMessageID;
            })
            .catch((error) => {
              console.log("fetch error", error);
            });
        }
        /////////////////////////////////////////
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  const getAllToraLessonsFromServer = () => {
    fetch("/api/shiureToraHalutza")
      .then((response) => response.json())
      .then((toraLessonsFromDB) => {
        setToraLessonsArr(toraLessonsFromDB);
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  const addLesson = (
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
    updateDate
  ) => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      };
      fetch("/api/shiureToraHalutza", options)
        .then((response) => response.json())
        .then((lessonAdded) => {
          console.log(lessonAdded);
          let newToraLessonsArr = [...toraLessonsArr, lessonAdded];
          setToraLessonsArr(newToraLessonsArr);
          getAllEmailsFromServer();
          return lessonAdded._id;
        })
        .catch((error) => {
          console.log("fetch error", error);
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  const updateLesson = (
    _id,
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
    updateDate
  ) => {
    try {
      let toraLesson = null;
      toraLessonsArr
        .filter((toraLesson) => toraLesson._id === _id)
        .map((item) => {
          toraLesson = item;
          // console.log(item);
          return true;
        });
      let toraLessonIndex = null;

      if (toraLesson !== null) {
        toraLessonIndex = getIndex(toraLessonsArr, _id);
        const newToraLesson = {
          _id,
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
        };
        // console.log(newCartItem);
        let newToraLessonsArr = [...toraLessonsArr];
        newToraLessonsArr[toraLessonIndex] = newToraLesson;
        setToraLessonsArr(newToraLessonsArr);
        const options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        };
        fetch(`/api/shiureToraHalutza/${_id}`, options)
          .then((response) => response.json())
          .then((toraLessonUpdated) => {})
          .catch((error) => {
            console.log("fetch error", error);
          });
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const removeLesson = (_id) => {
    fetch(`/api/shiureToraHalutza/${_id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        let newToraLessonsArr = [...toraLessonsArr];
        setToraLessonsArr(
          newToraLessonsArr.filter((toraLesson) => toraLesson._id !== _id)
        );

        // if (
        //   newToraLessonsArr.filter((toraLesson) => toraLesson._id !== _id)
        //     .length === 0
        // ) {
        //   setTimeout(getAllToraLessonsFromServer, 5000);
        // }
      })
      .catch((error) => {
        console.log("fetch error", error);
      });
  };

  useEffect(() => {
    try {
      getAllToraLessonsFromServer();
    } catch (error) {
      console.error("error", error);
    }
  }, []);
  try {
    return (
      <Router>
        <MyContext.Provider value={[toraLessonsArr, setToraLessonsArr]}>
          {/* <MyAppBar /> */}

          {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <div className="myBody">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    toraLessonsArr={toraLessonsArr}
                    updateLessonAndSendEMail={updateLessonAndSendEMail}
                    deleteLessonAndSendEMail={deleteLessonAndSendEMail}
                    addLessonAndSendEMail={addLessonAndSendEMail}
                    addOrDeleteEmail={addOrDeleteEmail}
                    updateLesson={updateLesson}
                    removeLesson={removeLesson}
                    addLesson={addLesson}
                  />
                }
              />
              {/* <Route
              path="/"
              element={
                <Home
                  productsArr={productsArr}
                  allCategories={allCategories}
                  setFilterBy_categories={setFilterBy_categories}
                />
              }
            />
            <Route
              path="/products/:_id"
              element={<ProductDetails productsArr={productsArr} />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/admin"
              element={<Admin productsArr={productsArr} />}
            /> */}
              {/* <Route path="/users">
            <Users />
          </Route> */}
            </Routes>
          </div>
        </MyContext.Provider>
      </Router>
    );
  } catch (error) {
    console.error("error", error);
  }
}

export default App;
