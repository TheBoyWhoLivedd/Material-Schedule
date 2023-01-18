import useTitle from "../../hooks/useTitle";
import {  useGetSchedulesQuery } from "./schedulesApiSlice";
import { useParams } from "react-router-dom";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@material-ui/core";

import { ChevronDown } from "feather-icons-react";

const SummaryPage = () => {
  useTitle("techNotes: Summary Page");

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
      {schedule?.summary?.map((child) => (
        <ExpansionPanel>
          <ExpansionPanelSummary
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
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {child.details.map((detail) => (
                <ListItem>
                  <ListItemText
                    primary={detail.materialDescription}
                    style={{ whiteSpace: "nowrap", marginRight: "1rem" }}
                  />
                  <ListItemText
                    primary={detail.computedValue}
                    style={{ marginRight: "1rem" }}
                  />
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );

  return content;
};
export default SummaryPage;
