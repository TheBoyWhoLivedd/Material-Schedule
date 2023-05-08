import { Link } from "react-router-dom";
import BackgroundAnimation from "../../components/BackgroundAnimation";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

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
      <p>{today}</p>

      <h1>Welcome {username}!</h1>

      {/* <div className="background">
        <BackgroundAnimation />
      </div> */}
    </section>
  );

  return content;
};
export default Welcome;
