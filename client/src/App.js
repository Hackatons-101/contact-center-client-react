import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Nav, Navbar } from 'react-bootstrap';
import Calls from './Calls';

class App extends Component {
  render() {
    return (
      <Router>
        <AuthButton />
        <Container>
          <Row>
            <Col>
              <Route path="/login" component={Login} />
              <PrivateRoute path="/" exact component={Calls}/>
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

const auth = {
  isAuthenticated: false,
  authenticate(user, callback) {
    fetch(`/api/jwt/${user}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.jwt = result.jwt;
          this.isAuthenticated = true;
          callback(user, result.jwt);
        },
        console.error
      )

  },
  signout(callback) {
    this.user = null;
    this.isAuthenticated = false;
    callback();
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    auth.isAuthenticated ? (
      <Navbar expand="md" bg="light" variant="light">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="https://avatars2.githubusercontent.com/u/551057?s=30&v=4"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Form inline>
            <Button 
              variant="link" 
              block
              onClick={() => {
                auth.signout(() => history.push("/"));
              }}
            >
              Log out
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    ) : ( 
      <React.Fragment></React.Fragment>
    )
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated ? (
          <Component {...props} {...auth} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class Login extends Component {
  state = { redirectToReferrer: false };

  login = (user) => {
    auth.authenticate(user, (user, jwt) => {
      this.setState({ user: user, jwt: jwt, redirectToReferrer: true });
    });
  };

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <Card style={{ margin: "20vh auto 0 auto", width: '18rem' }} className="text-center">
        <Card.Img variant="top" src="https://avatars2.githubusercontent.com/u/551057?s=286&v=4" />
        <Card.Body>
          <Card.Text>Please select a user</Card.Text>
          <Form>
            <Button variant="primary" size="lg" block onClick={() => this.login('Jane')}>Log in as Jane</Button>
            <Button variant="primary" size="lg" block onClick={() => this.login('Joe')}>Log in as Joe</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default App;