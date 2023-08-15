import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";

export default function HomePage() {
  return (
    <Container style={{ marginTop: "7em" }}>
      <h1>The home page</h1>
      <h3>
        Go To <Link to="/activities">Activities</Link>
      </h3>
    </Container>
  );
}
