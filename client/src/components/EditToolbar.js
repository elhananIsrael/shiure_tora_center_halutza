import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  // GridToolbarDensitySelector,
  GridToolbarExport,
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";
// import { now } from "mongoose";

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);

  const todayDateStr = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + "." + mm + "." + yyyy;
    return today;
  };

  const handleClick = () => {
    const id = `${Math.random() * 1000000000000000000}`;
    // console.log(todayDateStr());
    // console.log("id",id);
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        ravName: "",
        date: "",
        time: "",
        moreDetails: "",
        contactPersonName: "",
        totalNumLessonsRavCanToday: 1,
        updateDate: todayDateStr(),
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "ravName" },
    }));
    // console.log("pageCount", pageCount);
    if (apiRef.current.getRowsCount() === pageSize) apiRef.current.setPage(1);
    else apiRef.current.setPage(pageCount - 1);
    // console.log("pageSize", pageSize);
    // console.log("pageCount", pageCount);
    // console.log("page", page);
    // console.log("rows count", apiRef.current.getRowsCount());

    document
      .querySelector(".MuiDataGrid-virtualScroller")
      .scrollTo(
        0,
        document.querySelector(".MuiDataGrid-virtualScroller").scrollHeight
      );
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      {/* <GridToolbarDensitySelector /> */}
      {/* <GridToolbarExport
        printOptions={{
          // hideFooter: true,
          // hideToolbar: true,
          disableToolbarButton: true,
        }}
      /> */}
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        הוספת שיעור
      </Button>
    </GridToolbarContainer>
  );
}

export default EditToolbar;
