// https://mui.com/x/react-data-grid/editing/
import PropTypes from "prop-types";
import { useState, useEffect, useRef, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
// import { makeStyles } from "@material-ui/styles";
import {
  DataGrid,
  heIL,
  GridRowModes,
  GridActionsCellItem,
  // GridCellModes,
  // useGridApiContext,
} from "@mui/x-data-grid";
import Loader from "../components/Loader/Loader";
import EditToolbar from "../components/EditToolbar";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
// import CustomPagination from "../components/CustomPagination";
import HebCalendarRBC from "../components/HebCalendarRBC/HebCalendarRBC";
// import HebCalendarFC from "../components/HebCalendarFC/HebCalendarFC";
// import { CenterFocusStrong } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { HDate } from "@hebcal/core";

const dateStr = (myDate) => {
  try {
    // var today = new Date();
    var dd = String(myDate.getDate()).padStart(2, "0");
    var mm = String(myDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = myDate.getFullYear();

    var result = dd + "." + mm + "." + yyyy;
    return result;
  } catch (error) {
    console.error("error", error);
  }
};

const strToDate = (stringDate) => {
  try {
    // console.log(stringDate?.split("."));
    const dateArr = stringDate.split(".");
    var dateDay = dateArr[0];
    var dateMonth = dateArr[1];
    var dateYear = dateArr[2];
    var stringDateUpdated = `${dateYear}-${dateMonth}-${dateDay}`;
    // console.log(gregDate);
    var date = new Date(stringDateUpdated);
    return date;
  } catch (error) {
    console.error("error", error);
  }
};

const getNotEqualFieldToDesc = (fieldName, field) => {
  try {
    // console.log(
    //   fieldName,
    //   field,
    //   fieldName !== "date",
    //   fieldName !== "updateDate"
    // );
    if (fieldName !== "date" && fieldName !== "updateDate") {
      return `
      ( עודכן במקום הערך:  ${field})`;
    } //this fiels is or "date" or "updateDate".
    else {
      var hebDate = new HDate(strToDate(field)).renderGematriya();
      return `
      ( עודכן במקום הערך: ${hebDate} (${field}) )`;
    }
  } catch (error) {
    console.error("error", error);
  }
};

const getDescHome = (item, fieldNotEqualsArr = []) => {
  try {
    //in Home.js, 'item.date' and 'item.updateDate' from dataGrid is Date type.
    // console.log(item.date, item.updateDate);
    var hebDate = new HDate(item.date).renderGematriya();
    var hebUpdateDate = new HDate(item.updateDate).renderGematriya();
    var myDesc = `שם הרב: ${item.ravName}${
      fieldNotEqualsArr["ravName"]
        ? getNotEqualFieldToDesc("ravName", fieldNotEqualsArr["ravName"])
        : ""
    }
  תאריך: ${hebDate} (${dateStr(item.date)})${
      fieldNotEqualsArr["date"]
        ? getNotEqualFieldToDesc("date", fieldNotEqualsArr["date"])
        : ""
    } 
  שעת השיעור: ${item.time}${
      fieldNotEqualsArr["time"]
        ? getNotEqualFieldToDesc("time", fieldNotEqualsArr["time"])
        : ""
    }
  פרטים נוספים: ${item.moreDetails}${
      fieldNotEqualsArr["moreDetails"]
        ? getNotEqualFieldToDesc(
            "moreDetails",
            fieldNotEqualsArr["moreDetails"]
          )
        : ""
    }
  שם איש הקשר: ${item.contactPersonName}${
      fieldNotEqualsArr["contactPersonName"]
        ? getNotEqualFieldToDesc(
            "contactPersonName",
            fieldNotEqualsArr["contactPersonName"]
          )
        : ""
    }
  מקסימום שיעורים שהרב יכול להעביר: ${item.totalNumLessonsRavCanToday}${
      fieldNotEqualsArr["totalNumLessonsRavCanToday"]
        ? getNotEqualFieldToDesc(
            "totalNumLessonsRavCanToday",
            fieldNotEqualsArr["totalNumLessonsRavCanToday"]
          )
        : ""
    }
  תאריך עדכון אחרון: ${hebUpdateDate} (${dateStr(item.updateDate)})${
      fieldNotEqualsArr["updateDate"]
        ? getNotEqualFieldToDesc("updateDate", fieldNotEqualsArr["updateDate"])
        : ""
    }`;
    return myDesc;
  } catch (error) {
    console.error("error", error);
  }
};

const ValidateEmail = (email) => {
  try {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    // alert("You have entered an invalid email address!")
    return false;
  } catch (error) {
    console.error("error", error);
  }
};

const isEqualsLessons = (oldLesson, newLesson) => {
  try {
    // var notEqualsArr = false;
    const fieldNames = [
      "contactPersonName",
      "date",
      "moreDetails",
      "ravName",
      "time",
      "totalNumLessonsRavCanToday",
      "updateDate",
    ];
    var notEqualsArr = {};
    fieldNames.forEach((field) => {
      if (field !== "date" && field !== "updateDate") {
        if (oldLesson[field] !== newLesson[field])
          notEqualsArr = {
            ...notEqualsArr,
            [field]: oldLesson[field],
          };
      } else {
        //if thid 'date'  or 'updateDate' field.
        if (oldLesson[field] !== dateStr(newLesson[field]))
          notEqualsArr = {
            ...notEqualsArr,
            [field]: oldLesson[field],
          };
      }
    });
    // if (
    //   lesson1.contactPersonName === lesson2.contactPersonName &&
    //   lesson1.date === dateStr(lesson2.date) &&
    //   lesson1.moreDetails === lesson2.moreDetails &&
    //   lesson1.ravName === lesson2.ravName &&
    //   lesson1.time === lesson2.time &&
    //   lesson1.totalNumLessonsRavCanToday === lesson2.totalNumLessonsRavCanToday &&
    //   lesson1.updateDate === dateStr(lesson2.updateDate)
    // )

    // notEqualsArr = true;
    // console.log("lesson1", lesson1);
    // console.log("lesson2", les son2);
    // console.log(notEqualsArr);
    return notEqualsArr;
  } catch (error) {
    console.error("error", error);
  }
};

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
};

function Home({
  toraLessonsArr,
  addOrDeleteEmail,
  updateLessonAndSendEMail,
  deleteLessonAndSendEMail,
  addLessonAndSendEMail,
}) {
  const [rowModesModel, setRowModesModel] = useState({});
  // const [myCellModesModel, setMyCellModesModel] = useState({});
  const [rows, setRows] = useState([]);
  const [isNotValidEmail, setIsNotValidEmail] = useState(true);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
  });
  const [editRowsModel, setEditRowsModel] = useState({});

  const divRef = useRef(null);
  const textFieldRef = useRef("");

  // const updateAllNumLessonsLeft = (ravName, date) => {
  // try{
  //   var countLessons = 0;
  //   var maxTotalNumLessonsRavCanToday = 0;
  //   // productsArr.map;
  // } catch (error) {
  //   console.error("error",error);
  // }
  // };

  // const updateCurrNumLessonsLeft = (currRavName, currDate) => {
  // try{
  //   var countLessons = 0;
  //   var CurrNumLessonsLeft = 0;
  //   var maxTotalNumLessonsRavCanToday = 1;
  //   const allLessonsRavToday = toraLessonsArr.filter(
  //     (item) =>
  //       item.ravName === new RegExp(currRavName, "i") && item.date === currDate
  //   );
  //   countLessons = allLessonsRavToday.length;
  //   if (allLessonsRavToday.length > 0) {
  //     var maxUpdateDate = allLessonsRavToday[0].updateDate;
  //     maxTotalNumLessonsRavCanToday =
  //       allLessonsRavToday[0].totalNumLessonsRavCanToday;
  //     allLessonsRavToday.map((item) => {
  //       if (strToDate(item.updateDate) > strToDate(maxUpdateDate)) {
  //         maxTotalNumLessonsRavCanToday = item.totalNumLessonsRavCanToday;
  //       }
  //     });
  //   }
  // } catch (error) {
  //   console.error("error",error);
  // }
  // };

  const handleRowEditStart = (params, event) => {
    try {
      // console.log(params, event);
      event.defaultMuiPrevented = true;
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleRowEditStop = (params, event) => {
    try {
      // console.log(params, event);
      event.defaultMuiPrevented = true;
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleEditClick = (id) => () => {
    try {
      // const apiRef = useGridApiContext();
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      // setMyCellModesModel({
      //   [id]: {
      //     ravName: { mode: GridCellModes.View, ignoreModifications: true },
      //   },
      // });
      // console.log(myCellModesModel);
      // apiRef.current.stopCellEditMode(id, "ravName");
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleSaveClick = (id) => () => {
    try {
      // ////////////////////////
      // console.log(rowModesModel[id]);
      // const editedRow = rowModesModel[id].find((row) => row.id === id);
      // console.log(rowModesModel[id]);
      if (!rowModesModel[id].ravNameError && !rowModesModel[id].dateError) {
        // //////////////
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View },
        });
      } else {
        alert("לא ניתן לשמור שיעור ללא תאריך וללא שם הרב.");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleDeleteClick = (id) => () => {
    try {
      const myRow = rows.filter((row) => row.id === id);
      // console.log(myRow);
      var desc = getDescHome(myRow[0]);
      setRows(rows.filter((row) => row.id !== id));
      deleteLessonAndSendEMail(id, "השיעור הוסר", desc);
      // console.log("handleDeleteClick");
      // console.log(rows);myRow
      // updateAllNumLessonsLeft(myRow[0].ravName, myRow[0].date);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleCancelClick = (id) => () => {
    try {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = rows.find((row) => row.id === id);
      // console.log(editedRow);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const processRowUpdate = (newRow) => {
    try {
      var oldItem = toraLessonsArr.filter(
        (lesson) => lesson._id === newRow.id
      )[0];
      // console.log(rowModesModel);
      // console.log(toraLessonsArr);

      if (!newRow.date || !newRow.ravName) {
        // console.log(toraLessonsArr, newRow, oldItem);

        if (oldItem) {
          var oldDate = oldItem.date;
          var oldRavName = oldItem.ravName;
          newRow.date = oldDate;
          newRow.ravName = oldRavName;
        }
        setRowModesModel({
          ...rowModesModel,
          [newRow.id]: { mode: GridRowModes.Edit },
        });
        // console.log("mytest");
        alert("לא ניתן לשמור שיעור ללא תאריך וללא שם הרב.");
        return newRow;
      } else {
        // console.log(rows);
        var today = new Date();
        newRow.updateDate = today;
        var desc = getDescHome(newRow);

        if (newRow.isNew) {
          // console.log(newRow.date);
          // console.log("processRowUpdate-if (newRow.isNew)", newRow);
          // var desc = getDescHome(newRow);
          addLessonAndSendEMail(
            newRow.ravName,
            dateStr(newRow.date),
            newRow.time,
            newRow.moreDetails,
            newRow.contactPersonName,
            newRow.totalNumLessonsRavCanToday,
            // newRow.numLessonsLeft,
            dateStr(newRow.updateDate),
            "שיעור חדש",
            desc
          );
        } else if (newRow.isNew !== true) {
          // var oldItem = toraLessonsArr.filter(
          //   (lesson) => lesson._id === newRow.id
          // )[0];
          if (oldItem) {
            const fieldNotEquals = isEqualsLessons(oldItem, newRow);
            // console.log("fieldNotEquals", fieldNotEquals);
            if (fieldNotEquals !== {}) {
              desc = getDescHome(newRow, fieldNotEquals);

              // console.log(newRow.date);
              // var desc = getDescHome(newRow);
              // console.log(desc);
              // console.log("processRowUpdate-if (newRow.isNew !== true)", newRow);
              // console.log(newRow);
              updateLessonAndSendEMail(
                newRow.id,
                newRow.ravName,
                dateStr(newRow.date),
                newRow.time,
                newRow.moreDetails,
                newRow.contactPersonName,
                newRow.totalNumLessonsRavCanToday,
                // newRow.numLessonsLeft,
                dateStr(newRow.updateDate),
                "השיעור עודכן",
                desc
              );
            } else {
              //when 'oldItem'!=null && fieldNotEquals==={};
            }
          } else {
            //when 'oldItem'===null or something like that.
            updateLessonAndSendEMail(
              newRow.id,
              newRow.ravName,
              dateStr(newRow.date),
              newRow.time,
              newRow.moreDetails,
              newRow.contactPersonName,
              newRow.totalNumLessonsRavCanToday,
              // newRow.numLessonsLeft,
              dateStr(newRow.updateDate),
              "השיעור עודכן",
              desc
            );
          }
        }
        const updatedRow = { ...newRow, isNew: false };
        // updateAllNumLessonsLeft(newRow.ravName, newRow.date);
        // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const theme = createTheme({
    direction: "rtl", // Both here and <body dir="rtl">
  });
  // Create rtl cache
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      type: "string",
      // hide: true,
      // disableColumnSelector={true}.
      // hideable: false,
      editable: false,
      // flex: 1,
    },
    {
      field: "updateDate",
      headerName: "תאריך עדכון אחרון",
      width: 95,
      type: "date",
      editable: false,
      // flex: 1,
    },
    {
      field: "ravName",
      headerName: "שם הרב",
      preProcessEditCellProps: (params) => {
        try {
          // console.log(params);
          const hasError = !params.props.value;
          // console.log(params.props.value, params.row.date);
          setRowModesModel({
            ...rowModesModel,
            [params.id]: { mode: GridRowModes.Edit, ravNameError: hasError },
          });
          return { ...params.props, error: !params.props.value };
        } catch (error) {
          console.error("error", error);
        }
      },
      // width: 350,
      type: "string",
      editable: true,
      flex: 1,
    },
    // {
    //   field: "lessonSubject",
    //   headerName: "נושא השיעור",
    //   // width: 350,
    //   type: "string",
    //   editable: true,
    // },
    // {
    //   field: "price",
    //   headerName: "מחיר",
    //   width: 70,
    //   type: "number",
    //   editable: true,
    // },
    // {
    //   field: "place",
    //   headerName: "מיקום (ישוב ואולם בישוב)",
    //   // width: 240,
    //   // headerClassName: "super-app-theme--header",
    //   // headerAlign: "center",
    //   type: "string",
    //   editable: true,
    // },
    {
      field: "date",
      headerName: "תאריך",
      width: 105,
      type: "date",
      preProcessEditCellProps: (params) => {
        try {
          // console.log(params);
          const hasError = !params.props.value;
          // console.log(params.props.value, params.row.ravName);
          setRowModesModel({
            ...rowModesModel,
            [params.id]: { mode: GridRowModes.Edit, dateError: hasError },
          });
          return { ...params.props, error: !params.props.value };
        } catch (error) {
          console.error("error", error);
        }
      },
      // error: true,
      // "string",
      // require,
      editable: true,
      // flex: 1,
    },
    {
      field: "time",
      headerName: "שעה",
      width: 95,
      type: "string",
      editable: true,
      // flex: 1,
    },
    {
      field: "moreDetails",
      headerName: "פרטים נוספים",
      // width: 240,
      type: "string",
      editable: true,
      flex: 1,
    },
    {
      field: "contactPersonName",
      headerName: "שם איש הקשר",
      // width: 240,
      type: "string",
      editable: true,
      flex: 1,
    },
    // {
    //   field: "contactPersonPhone",
    //   headerName: "פלאפון/טלפון של איש הקשר",
    //   // width: 240,
    //   type: "string",
    //   editable: true,
    // },
    {
      field: "totalNumLessonsRavCanToday",
      headerName: "מקסימום שיעורים שהרב יכול להעביר",
      width: 70,
      type: "number",
      // renderHeader: () => <strong>מקסימום שיעורים שהרב יכול להעביר</strong>,
      editable: true,
      // flex: 1,
    },
    // {
    //   field: "numLessonsLeft",
    //   headerName: "מספר שיעורים שעוד ניתן לקבוע עם הרב",
    //   width: 70,
    //   type: "number",
    //   editable: false,
    //   // flex: 1,
    // },
    {
      field: "actions",
      type: "actions",
      headerName: "עדכון/מחיקה",
      width: 100,
      cellClassName: "actions",
      // disableExport: true,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // console.log("rowModesModel", rowModesModel);
  // console.log("rows", rows);

  useEffect(() => {
    try {
      let tempRows = [];
      // console.log(productsArr);

      toraLessonsArr.map(
        (myToraLesson) =>
          (tempRows = [
            ...tempRows,

            {
              id: myToraLesson._id,
              ravName: myToraLesson.ravName,
              date: strToDate(myToraLesson.date),
              time: myToraLesson.time,
              moreDetails: myToraLesson.moreDetails,
              contactPersonName: myToraLesson.contactPersonName,
              totalNumLessonsRavCanToday:
                myToraLesson.totalNumLessonsRavCanToday,
              // numLessonsLeft: myProduct.numLessonsLeft,
              updateDate: strToDate(myToraLesson.updateDate),
            },
          ])
      );
      setRows(tempRows);
      if (
        (divRef !== undefined || divRef !== null) &&
        divRef.current &&
        divRef.current
      ) {
        console.log(divRef.current);
        divRef.current.style.height = `${60.5 * tempRows.length}px`;
        console.log(divRef.current.style.height);
      }
      // console.log("tempRows", tempRows);
    } catch (error) {
      console.error("error", error);
    }
  }, [toraLessonsArr]);

  // TODO v5: remove
  function getThemePaletteMode(palette) {
    try {
      return palette.type || palette.mode;
    } catch (error) {
      console.error("error", error);
    }
  }

  const isDark = getThemePaletteMode(theme.palette) === "dark";

  // const handleEditRowsModelChange = useCallback((newModel) => {
  //   try {
  //     console.log(newModel);
  //     const updatedModel = { ...newModel };
  //     Object.keys(updatedModel).forEach((id) => {
  //       if (updatedModel[id].date) {
  //         const isNotValid = !updatedModel[id].date.value;
  //         updatedModel[id].date = {
  //           ...updatedModel[id].date,
  //           error: isNotValid,
  //         };
  //       }
  //     });
  //     setEditRowsModel(updatedModel);
  //   } catch (error) {
  //     console.error("error", error);
  //   }
  // }, []);

  try {
    return (
      <>
        {/* {toraLessonsArr.length > 0 ? ( */}
        <div style={{ height: 500, width: "100%", direction: "rtl" }}>
          <div style={{ display: "flex", height: 500 }}>
            <div style={{ flexGrow: 1, height: 500 }}>
              <Typography variant="h3" sx={{ margin: "10px" }} align="center">
                שיעורים בישובי חלוצה והסביבה
              </Typography>

              <DataGrid
                // cellModesModel={myCellModesModel}
                // {{ 1: { name: { mode: GridCellModes.View, ignoreModifications: true } } }}
                // />
                // loading
                localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
                isCellEditable={(params) => {
                  const currentRow = rows.find(
                    (row) => row.id === params.rowNode.id
                  );

                  // console.log(params);
                  if (params.field === "ravName" && !currentRow.isNew)
                    return false;
                  else return true;
                }}
                ////////////

                // editRowsModel={editRowsModel}
                // onEditRowsModelChange={handleEditRowsModelChange}
                /////////////

                // {params.row.isNew === true ||  (params.row.isNew !== true && )}
                // autoHeight={true}
                // onCellFocusOut={(
                //   params, // GridCellEditCommitParams
                //   event, // MuiEvent<MuiBaseEvent>
                //   details // GridCallbackDetails
                // ) => {
                //   console.log("params", params);
                //   console.log("event", event);
                //   console.log("details", details);
                //   // if(params.colDef.)
                //   // console.log(details.click);defaultValue type
                //   // console.log(event.explicitOriginalTarget?.valueAsNumber);
                // }}
                headerHeight={85}
                disableColumnMenu={true}
                sx={{
                  "& .MuiDataGrid-columnHeaderTitle": {
                    textOverflow: "clip",
                    whiteSpace: "break-spaces",
                    lineHeight: 1,
                    textAlign: "center",
                    alignContent: "center",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "rgb(0, 50, 155)",
                    color: "white",
                    fontSize: 13,
                  },
                  "& .MuiDataGrid-virtualScrollerRenderZone": {
                    "& .MuiDataGrid-row": {
                      "&:nth-of-type(2n)": {
                        backgroundColor: "rgba(143, 179, 255, 0.37)",
                      },
                    },
                  },
                  "& .Mui-error": {
                    // backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
                    // color: isDark ? "#ff4343" : "#750f0f",
                    borderColor: theme.palette.error.main,
                    backgroundColor: `rgb(126,10,15, ${
                      theme.palette.mode === "dark" ? 0 : 0.1
                    })`,
                    color: theme.palette.error.main,
                  },
                }}
                rows={rows}
                columns={columns}
                editMode="row"
                onProcessRowUpdateError={(error) => console.log(error)}
                // options={{
                //   paging: false,
                // }}
                rowModesModel={rowModesModel}
                onRowEditStart={handleRowEditStart}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                // pagination
                // pageSize={6}
                // rowsPerPageOptions={[6]}
                components={{
                  // Pagination: CustomPagination,
                  // Pagination: "",
                  Toolbar: EditToolbar,
                  NoRowsOverlay: () => (
                    <Stack
                      height="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      אין שיעורים במאגר הנתונים
                    </Stack>
                  ),
                  NoResultsOverlay: () => (
                    <Stack
                      height="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      אין שיעורים התואמים לחיפוש זה
                    </Stack>
                  ),
                }}
                componentsProps={{
                  toolbar: {
                    setRows,
                    setRowModesModel,
                    // printOptions: { disableToolbarButton: true },
                  },
                }}
                experimentalFeatures={{ newEditingApi: true }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // Hide column id, the other columns will remain visible
                      id: false,
                    },
                  },
                  sorting: {
                    sortModel: [{ field: "updateDate", sort: "desc" }],
                  },
                }}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => {
                  var updatedNewModel = {
                    ...newModel,
                    id: false,
                  };
                  // console.log(updatedNewModel);
                  setColumnVisibilityModel(updatedNewModel);
                }}
                // columnVisibilityModel={{
                //   // Hide column id, the other columns will remain visible
                //   id: false,
                // }}
              />

              <div style={{ display: "inline-grid" }}>
                <Box
                  component="span"
                  sx={{
                    p: 2,
                    border: "1px dashed grey",
                    display: "inline-flex",
                  }}
                >
                  <Button
                    style={{ marginBottom: "30px", marginTop: "10px" }}
                    variant="outlined"
                    disabled={isNotValidEmail}
                    onClick={() => {
                      addOrDeleteEmail(textFieldRef.current.value);
                      // console.log(ValidateEmail(textFieldRef.current.value));
                      textFieldRef.current.value = "";
                      // alert(textFieldRef.current.value);
                    }}
                  >
                    אישור
                  </Button>
                  <CacheProvider value={cacheRtl}>
                    <ThemeProvider theme={theme}>
                      <div dir="rtl">
                        <TextField
                          onChange={(e) => {
                            setIsNotValidEmail(!ValidateEmail(e.target.value));
                          }}
                          id="addDeleteEmailInput"
                          // error={isNotValidEmail}
                          inputRef={textFieldRef}
                          label="הוספת/הסרת אימייל לעדכונים"
                          defaultValue=""
                          sx={{ margin: "10px", direction: "ltr" }}
                          align="center"
                          helperText="לאימייל זה ישלחו עדכונים על הוספת/הסרת/עדכון שיעורים"
                        />
                      </div>
                    </ThemeProvider>
                  </CacheProvider>
                </Box>
              </div>
              <HebCalendarRBC lessonEvents={toraLessonsArr} />
            </div>
          </div>
        </div>
        {/* ) : (
          <>
            <h1 style={{ textAlign: "center" }}>ברוכים הבאים</h1>
            <Loader />
          </>
        )} */}
      </>
    );
  } catch (error) {
    console.error("error", error);
  }
}

export default Home;
