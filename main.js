var publicKey = 'tsekmdgq9oe26i5fh1kd389p19';
var secretKey = 'j7vu507a1ht594a1t6vrqek4d5';
var assessmentId;

Traitify.setPublicKey(publicKey);
Traitify.setHost("https://api-sandbox.traitify.com");
Traitify.setVersion("v1");

function apiCall(method, key, url, data, responseHandler) {
  var httpRequest = new XMLHttpRequest();

  function requestCheck() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200 || httpRequest.status === 201) {
        responseHandler(JSON.parse(httpRequest.responseText));
      }
      else {
        alert('Request Status: ' + httpRequest.status);
      }
    }
  }

  httpRequest.onreadystatechange = requestCheck;

  httpRequest.open(method, url, true);
  httpRequest.setRequestHeader('Authorization', 'Basic ' + key + ":x");
  httpRequest.send(data);
}

function consolePretty(object) {
  console.log(JSON.stringify(object, null, '\t'));
}

function codePretty(object) {
  return "<pre>" + JSON.stringify(object, null, '\t') + "</pre>";
}

function createAssessment() {
  apiCall('POST', secretKey, 'https://api-sandbox.traitify.com/v1/assessments',
    "{\"deck_id\":\"career-deck\"}", assessmentHandler
  );
}

function assessmentHandler(data) {

  assessmentId = data.id;

  document.getElementById('assessmentJSON').innerHTML = codePretty(data);

  var slideDeckWidget = Traitify.ui.load("slideDeck", assessmentId, "#slideDeck");

  slideDeckWidget.onFinished(function() {
    showCareers(assessmentId);
  });

}

function showCareers(id) {
  var careersJSON = document.getElementById("careersJSON");
  Traitify.getCareers(id).then(function(data){
    careersJSON.innerHTML = codePretty(data);
  });
}

window.onload = function() {

  createAssessment();

};