const express = require("express");

const app = express();
app.use(
  express.json({
    type: [
      "application/json",
      "application/csp-report",
      "application/reports+json",
    ],
  })
);
app.use(express.urlencoded());

app.get("/", (request, response) => {
  // Note:  report-to replaces report-uri, but it is not supported yet.
  response.set(
    "Content-Security-Policy-Report-Only",
    `default-src 'self'; report-to csp-endpoint`
  );
  // Note: report_to and not report-to for NEL.
  response.set("NEL", `{"report_to": "network-errors", "max_age": 2592000}`);

  // The Report-To header tells the browser where to send
  // CSP violations, browser interventions, deprecations, and network errors.
  // The default group (first example below) captures interventions and
  // deprecation reports. Other groups are referenced by their "group" name.
  response.set(
    "Report-To",
    `{
    "max_age": 2592000,
    "endpoints": [{
      "url": "https://reporting-observer-api-demo.glitch.me/reports"
    }],
  }, {
    "group": "csp-endpoint",
    "max_age": 2592000,
    "endpoints": [{
      "url": "https://reporting-observer-api-demo.glitch.me/csp-reports"
    }],
  }, {
    "group": "network-errors",
    "max_age": 2592000,
    "endpoints": [{
      "url": "https://reporting-observer-api-demo.glitch.me/network-reports"
    }]
  }`
  );

  response.sendFile("./index.html");
});

function echoReports(request, response) {
  // Record report in server logs or otherwise process results.
  for (const report of request.body) {
    console.log(report.body);
  }
  response.send(request.body);
}

app.post("/csp-reports", (request, response) => {
  console.log(`${request.body.length} CSP violation reports:`);
  echoReports(request, response);
});

app.post("/network-reports", (request, response) => {
  console.log(`${request.body.length} Network error reports:`);
  echoReports(request, response);
});

app.post("/reports", (request, response) => {
  console.log(`${request.body.length} deprecation/intervention reports:`);
  echoReports(request, response);
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
