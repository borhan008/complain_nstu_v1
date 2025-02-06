const { axios } = require("axios");
const { auth } = require("../../../config");

const formatedDate = (date) => {
  const d = new Date(date);

  const options = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return d.toLocaleString("en-US", options);
};

const complainStatus = (status) => {
  switch (status) {
    case "Due":
      return "gray";
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    default:
      return "gray";
  }
};

module.exports = { formatedDate, complainStatus };
