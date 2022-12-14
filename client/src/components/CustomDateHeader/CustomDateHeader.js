import PropTypes from "prop-types";
import { HDate } from "@hebcal/core";
import "./CustomDateHeader.css";

const Label = ({ label, drilldownView, onDrillDown }) => {
  try {
    if (!drilldownView) {
      return <span>{label}</span>;
    }

    return <a onClick={onDrillDown}>{label}</a>;
  } catch (error) {
    console.error("error", error);
  }
};

Label.propTypes = {
  label: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  drilldownView: PropTypes.string,
  onDrillDown: PropTypes.func,
  isOffRange: PropTypes.bool,
};

const DateHeader = ({ label, date, drilldownView, onDrillDown }) => {
  // console.log(date);
  const gregToHebDate = (currCellGregDate) => {
    try {
      var hebDate = new HDate(currCellGregDate);

      var hebDateArr = hebDate.renderGematriya().split(" ");
      var hDay = hebDateArr[0];
      var hMonth = hebDateArr[1];
      var hYear = hebDateArr[2];
      var hebCellTitle = "";
      if (hDay === "א׳") hebCellTitle = `${hDay} ${hMonth} ${hYear}`;
      else hebCellTitle = `${hDay} ${hMonth}`;

      return hebCellTitle;
    } catch (error) {
      console.error("error", error);
    }
  };

  try {
    return (
      <div className="custom-date-header">
        <div className="dh-item header-left">
          <Label {...{ label, drilldownView, onDrillDown }} />
        </div>
        <div className="dh-item header-right">
          <span>{gregToHebDate(date)}</span>
        </div>
      </div>
    );
  } catch (error) {
    console.error("error", error);
  }
};

DateHeader.propTypes = {
  label: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  drilldownView: PropTypes.string,
  onDrillDown: PropTypes.func,
  isOffRange: PropTypes.bool,
};

export default DateHeader;
