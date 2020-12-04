import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { PieChart, Pie, Legend, Tooltip } from "recharts";

import { useTheme } from "@material-ui/core/styles";

// // Components
// import Title from "./Title";
// import { raw } from "express";

// // Actions

// // Generate Sales Data
// function createData(time, amount) {
//   return { time, amount };
// }

// const data = [
//   createData("00:00", 0),
//   createData("03:00", 300),
//   createData("06:00", 600),
//   createData("09:00", 800),
//   createData("12:00", 1500),
//   createData("15:00", 2000),
//   createData("18:00", 2400),
//   createData("21:00", 2400),
//   createData("24:00", undefined),
// ];

export const Chart = () => {
  const theme = useTheme();

  // let statistic = useSelector((state) => state.am.statistc);
  // let loading = useSelector((state) => state.am.loading);

  const [data, setData] = useState();
  // const payload
  const setLoadingData = async () => {
    const res = await axios.get("/api/am/statistic");
    const originalData = res.data;
    // console.log(originalData);
    let pieCollege = [];
    // console.log(originalData.collegeDistribution);
    const CD = originalData.collegeDistribution;
    Object.keys(CD).forEach((item) => {
      pieCollege.push({ name: item, value: CD[item] });
    });
    console.log(pieCollege);
    setData(pieCollege);
  };

  useEffect(async () => {
    setLoadingData();
  }, []);

  return (
    <React.Fragment>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx={100}
          cy={100}
          outerRadius={80}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </React.Fragment>
  );
};
