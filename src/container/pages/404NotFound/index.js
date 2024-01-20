import React from "react";
import './index.scss';
import { Result, Flex } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Link to="/">Back To Home</Link>}
    style={{height: '100vh'}}
  />
);
export default NotFound;
