import { Link } from "react-router-dom";
import BackgroundAnimation from "../../components/BackgroundAnimation";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { Typography } from "@mui/material";

const Welcome = () => {
  const { username, isManager, isAdmin } = useAuth();

  useTitle(`Deemed VAT: ${username}`);

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="">
      <Typography
        variant="h6"
        sx={{ color: (theme) => theme.palette.text.primary }}
      >
        {today}
      </Typography>

      <Typography
        variant="h4"
        sx={{ color: (theme) => theme.palette.text.primary }}
      >
        Welcome {username}!
      </Typography>

      {/* <div className="background">
        <BackgroundAnimation />
      </div> */}
    </section>
  );

  return content;
};
export default Welcome;
