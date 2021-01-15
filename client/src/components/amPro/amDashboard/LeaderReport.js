import React, { useState } from "react";

import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Grid,
} from "@material-ui/core";

import useTable from "../../reusable/useTable";
import Controls from "../../reusable/controls/Controls";

const headCellsForSum = [
  { id: "name", label: "Name" },
  { id: "total", label: "Total" },
  { id: "thisWeek", label: "This Week" },
];

function Leader({ data }) {
  const [sumRecords, setSumRecords] = useState(data.kpiAllSum);
  const [amRecords, setAmRecords] = useState({});
  const [singleData, setSingleData] = useState({
    name: "",
    thisWeek: "",
    total: "",
  });

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(
    Object.keys(amRecords).length === 0 ? sumRecords : amRecords,
    headCellsForSum,
    filterFn
  );

  const setSingleAm = (am, name) => {
    let total = 0;
    let thisWeek = 0;
    am.forEach((item) => {
      total += item.total;
      thisWeek += item.thisWeek;
    });
    setSingleData({
      name,
      thisWeek,
      total,
    });
    setAmRecords(am);
  };

  return (
    <>
      {Object.keys(amRecords).length === 0 ? null : (
        <>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography
                style={{ display: "inline", fontWeight: "bold" }}
                color="primary"
                variant="h4"
              >
                {singleData.name}
              </Typography>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Controls.Button
                type="button"
                text="Back to Sum"
                // style={{ marginLeft: "80%" }}
                onClick={() => setAmRecords({})}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Typography
                style={{ display: "inline" }}
                color="primary"
                variant="subtitle1"
              >
                This Week: {singleData.thisWeek}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography
                style={{ display: "inline" }}
                color="primary"
                variant="subtitle1"
              >
                Total: {singleData.total}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item, index) => (
            <TableRow
              key={index}
              onClick={() => {
                if (Object.keys(amRecords).length === 0)
                  setSingleAm(data.kpiAmSum[item.name], item.name);
              }}
            >
              <TableCell align="center">{item.name}</TableCell>
              <TableCell align="center">{item.total}</TableCell>
              <TableCell align="center">{item.thisWeek}</TableCell>
              {/* <TableCell align="center">
              <Box
                component="span"
                onClick={() => {
                  loadLeadDetail(item._id);
                }}
              >
                <Tooltip title="编辑" arrow>
                  <IconButton>
                    <EditIcon color="primary" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                component="span"
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: "Are you sure to delete this Lead?",
                    subTitle: "You can't undo this operation",
                    onConfirm: () => onDelete(item._id),
                  });
                }}
              >
                <Tooltip title="删除" arrow>
                  <IconButton>
                    <DeleteIcon color="secondary" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />
    </>
  );
}

export default Leader;
