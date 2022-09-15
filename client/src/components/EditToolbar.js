import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  // GridToolbarDensitySelector,
  // GridToolbarExport,
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
  // const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);

  const todayDateStr = () => {
    try {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = dd + "." + mm + "." + yyyy;
      return today;
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleClick = () => {
    try {
      const id = `${Math.random() * 1000000000000000000}`;
      // console.log(todayDateStr());
      // console.log(apiRef);
      // console.log("id", id);
      setRows((oldRows) => [
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
        ...oldRows,
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "ravName" },
      }));
      if (apiRef.current.getRowsCount() > 0) {
        if (apiRef.current.getRowsCount() === pageSize)
          apiRef.current.setPage(1);
        else apiRef.current.setPage(pageCount - 1);
      }
      // console.log("pageSize", pageSize);
      // console.log("pageCount", pageCount);
      // console.log("page", page);
      // console.log("rows count", apiRef.current.getRowsCount());
      ///////////////////////////
      const dataGridInDoc = document.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      if (dataGridInDoc !== null) {
        // const width = dataGridInDoc.clientWidth;
        const width = dataGridInDoc.offsetWidth;
        // height = dataGridInDoc.clientHeight;
        document
          .querySelector(".MuiDataGrid-virtualScroller")
          // .scrollTo(width, 0);
          .scrollTo(width + width, 0);
      }
      ///////////////////////////
      // document.querySelector(".MuiDataGrid-virtualScroller").scrollTo(
      //   0,
      //   0
      //   // document.querySelector(".MuiDataGrid-virtualScroller").scrollHeight
      // );
    } catch (error) {
      console.error("error", error);
    }
  };
  try {
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
  } catch (error) {
    console.error("error", error);
  }
}

export default EditToolbar;
