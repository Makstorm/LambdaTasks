module.exports.handler = async (event) => {
  if (event.httpMethod === "GET" && event.path === "/fib") {
    return {
      statusCode: 200,
      body: JSON.stringify({ fibonacci: `1,1,2,3,5,8,12,20,32,52` }, null, 2),
    };
  }
  if (event.httpMethod === "GET" && event.path === "/hello") {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: `Hello, ${event.queryStringParameters.name}`,
      }),
    };
  }
};
