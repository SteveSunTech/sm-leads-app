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

function BasicReport({ data }) {
  const [records, setRecords] = useState(data);

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
  } = useTable(records, headCellsForSum, filterFn);

  return (
    <>
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item, index) => (
            <TableRow key={index}>
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

export default BasicReport;
