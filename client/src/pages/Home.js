// https://mui.com/x/react-data-grid/editing/
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  DataGrid,
  heIL,
  GridRowModes,
  GridActionsCellItem,
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
  // var today = new Date();
  var dd = String(myDate.getDate()).padStart(2, "0");
  var mm = String(myDate.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = myDate.getFullYear();

  var result = dd + "." + mm + "." + yyyy;
  return result;
};

const strToDate = (stringDate) => {
  const dateArr = stringDate.split(".");
  var dateDay = dateArr[0];
  var dateMonth = dateArr[1];
  var dateYear = dateArr[2];
  var stringDateUpdated = `${dateYear}-${dateMonth}-${dateDay}`;
  // console.log(gregDate);
  var date = new Date(stringDateUpdated);
  return date;
};

const getDesc = (item) => {
  var gregDate = item.date;
  var check = Date.parse(item.date);
  // console.log(gregDate, check, check.toString() === "NaN");
  if (check.toString() === "NaN") gregDate = strToDate(item.date);
  var hebDate = new HDate(gregDate).renderGematriya();
  gregDate = dateStr(gregDate);
  var hebUpdateDate = new HDate(strToDate(item.updateDate)).renderGematriya();
  var myDesc = `שם הרב: ${item.ravName}
  תאריך: ${hebDate} (${gregDate}) 
  שעת השיעור: ${item.time}
  פרטים נוספים: ${item.moreDetails}
  שם איש הקשר: ${item.contactPersonName}
  מקסימום שיעורים שהרב יכול להעביר: ${item.totalNumLessonsRavCanToday}
  תאריך עדכון אחרון: ${hebUpdateDate} (${item.updateDate})`;
  return myDesc;
};

const ValidateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  // alert("You have entered an invalid email address!")
  return false;
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
  const [rows, setRows] = useState([]);
  const [isNotValidEmail, setIsNotValidEmail] = useState(true);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
  });
  const divRef = useRef(null);
  const textFieldRef = useRef("");

  // const updateAllNumLessonsLeft = (ravName, date) => {
  //   var countLessons = 0;
  //   var maxTotalNumLessonsRavCanToday = 0;
  //   // productsArr.map;
  // };

  // const updateCurrNumLessonsLeft = (currRavName, currDate) => {
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
  // };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
    // const editedRow = rows.find((row) => row.id === id);
    // console.log(editedRow);
  };

  const handleDeleteClick = (id) => () => {
    const myRow = rows.filter((row) => row.id === id);
    // console.log(myRow);
    var desc = getDesc(myRow[0]);
    setRows(rows.filter((row) => row.id !== id));
    deleteLessonAndSendEMail(id, "השיעור הוסר", desc);
    // console.log("handleDeleteClick");
    // console.log(rows);myRow
    // updateAllNumLessonsLeft(myRow[0].ravName, myRow[0].date);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    // console.log(editedRow);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    // console.log(rows);
    var desc = getDesc(newRow);
    if (newRow.isNew) {
      // console.log(newRow.date);
      // console.log("processRowUpdate-if (newRow.isNew)", newRow);
      // var desc = getDesc(newRow);
      newRow.date = dateStr(newRow.date);
      addLessonAndSendEMail(
        newRow.ravName,
        newRow.date,
        newRow.time,
        newRow.moreDetails,
        newRow.contactPersonName,
        newRow.totalNumLessonsRavCanToday,
        // newRow.numLessonsLeft,
        newRow.updateDate,
        "שיעור חדש",
        desc
      );
    } else if (newRow.isNew !== true) {
      // console.log(newRow.date);
      // var desc = getDesc(newRow);
      // console.log(desc);
      // console.log("processRowUpdate-if (newRow.isNew !== true)", newRow);
      var today = new Date();
      newRow.date = dateStr(newRow.date);
      newRow.updateDate = dateStr(today);
      // console.log(newRow);
      updateLessonAndSendEMail(
        newRow.id,
        newRow.ravName,
        newRow.date,
        newRow.time,
        newRow.moreDetails,
        newRow.contactPersonName,
        newRow.totalNumLessonsRavCanToday,
        // newRow.numLessonsLeft,
        newRow.updateDate,
        "השיעור עודכן",
        desc
      );
    }
    const updatedRow = { ...newRow, isNew: false };
    // updateAllNumLessonsLeft(newRow.ravName, newRow.date);
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
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
      type: "string",
      editable: false,
      // flex: 1,
    },
    {
      field: "ravName",
      headerName: "שם הרב",
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
      width: 95,
      type: "date",
      // "string",
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
            totalNumLessonsRavCanToday: myToraLesson.totalNumLessonsRavCanToday,
            // numLessonsLeft: myProduct.numLessonsLeft,
            updateDate: myToraLesson.updateDate,
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
  }, [toraLessonsArr]);
  return (
    <>
      {toraLessonsArr.length > 0 ? (
        <div style={{ height: 500, width: "100%", direction: "rtl" }}>
          <div style={{ display: "flex", height: 500 }}>
            <div style={{ flexGrow: 1, height: 500 }}>
              <Typography variant="h3" sx={{ margin: "10px" }} align="center">
                שיעורים בישובי חלוצה והסביבה
              </Typography>

              <DataGrid
                localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
                // autoHeight={true}
                // onCellFocusOut={(
                //   params, // GridCellEditCommitParams
                //   event, // MuiEvent<MuiBaseEvent>
                //   details // GridCallbackDetails
                // ) => {
                //   console.log("params", params);
                //   console.log("event", event);
                //   console.log("details", details);
                //   // console.log(details.click);defaultValue type
                //   console.log(event.explicitOriginalTarget?.valueAsNumber);
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
                    backgroundColor: "rgba(2, 26, 78, 0.671)",
                    fontSize: 13,
                  },
                  "& .MuiDataGrid-virtualScrollerRenderZone": {
                    "& .MuiDataGrid-row": {
                      "&:nth-of-type(2n)": {
                        backgroundColor: "rgba(143, 179, 255, 0.37)",
                      },
                    },
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
      ) : (
        <>
          <h1 style={{ textAlign: "center" }}>ברוכים הבאים</h1>
          <Loader />
        </>
      )}
    </>
  );
}

export default Home;
