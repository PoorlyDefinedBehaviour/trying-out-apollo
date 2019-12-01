import morgan from "morgan";
import logger from "../config/Logger";

const loggingMiddleware = morgan("combined", {
  stream: logger.stream,
  skip: () => /test/i.test(process.env.NODE_ENV!)
});

export default loggingMiddleware;
