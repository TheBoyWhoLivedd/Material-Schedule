import useTitle from "../../hooks/useTitle";
import { useGetSchedulesQuery } from "./schedulesApiSlice";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";

import { ChevronDown } from "feather-icons-react";

const SummaryPage = () => {
  useTitle("Deemed VAT: Summary Page");

  const { id } = useParams();

  console.log(id);

  const { schedule } = useGetSchedulesQuery("schedulesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });

  console.log(schedule);

  let content;

  content = (
    <div>
      <Typography
        variant="h5"
        sx={{
          marginBottom: "1rem",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        Aggregated Materials (Click on each to reveal details)
      </Typography>
      {(schedule?.summary ? [...schedule.summary] : [])
        .sort((a, b) => (a._id > b._id ? 1 : -1))
        .map((child) => (
          <Accordion>
            <AccordionSummary
              expandIcon={
                <IconButton
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronDown />
                </IconButton>
              }
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                height: "10px",
              }}
            >
              <Typography style={{ marginRight: "10px" }}>
                Total {child._id}
              </Typography>
              <Typography style={{ marginRight: "10px" }}>
                {child.Value}
              </Typography>
              <Typography>{child.unit}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {child.details.map((detail) => (
                  <ListItem style={{ display: "flex" }}>
                    <ListItemText
                      primary={detail.materialDescription}
                      classes={{ primary: "material-description" }}
                      style={{
                        whiteSpace: "nowrap",
                        marginRight: "1rem",
                      }}
                    />
                    <ListItemText
                      primary={detail.computedValue}
                      style={{ marginRight: "1rem" }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );

  return content;
};
export default SummaryPage;
