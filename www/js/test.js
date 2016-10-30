var applicationID = 'A7BD302D';
var namespace = 'urn:x-cast:com.telasocial.tagvisor';
var slideURL = 'http://www.slidequest.com/Taboca/po0ph?mode=run';

var dataSend = {
    url    : slideURL,
    force  : false,
    reload : true,
    reload_time: 60*1000
}

var _session = null;
var _receiverAvailability = null;
var _sessionUpdatedFired = false;
var _mediaUpdatedFired = false;

var apiConfig = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        document.getElementById("startTestPlugin").addEventListener("click", startTestPlugin);
        document.getElementById("startTestPlugin2").addEventListener("click", startTestPlugin2);
        document.getElementById("startTestPlugin3").addEventListener("click", startTestPlugin3);

    }
};

function startTestPlugin() {
    //console.log('initialize should succeed');
    var sessionRequest = new chrome.cast.SessionRequest(applicationID);
    apiConfig = new chrome.cast.ApiConfig(sessionRequest, function(session) {
      document.getElementById('canvas').innerHTML += '<p>SessionCallback..</p>';
      _session = session;

    }, function(available) {
      document.getElementById('canvas').innerHTML += '<p>ReceiverCallback..</p>';
      _receiverAvailability = available;
    });

    chrome.cast.initialize(apiConfig, function() {
          document.getElementById('canvas').innerHTML += '<p>Initialize done.</p>';
          //console.log('initialize done');
    }, function(err) {
          document.getElementById('canvas').innerHTML += '<p>Initialize error.</p>';
    });

}

function startTestPlugin2() {


    chrome.cast.requestSession(function(session) {
          //console.log('request session success');
          document.getElementById('canvas').innerHTML += '<p>Request session success.</p>';
          _session = session;
          var updateListener = function(isAlive) {
            _sessionUpdatedFired = true;
            session.removeUpdateListener(updateListener);
          };
          session.addUpdateListener(updateListener);
    }, function(err) {
          //console.log('request session error');
          document.getElementById('canvas').innerHTML += '<p>Request session error: ' + JSON.stringify(err) + '</p>';
    });

}

function startTestPlugin3() {

    // chrome.cast.Session.prototype.sendMessage = function (namespace, message, successCallback, errorCallback) {
    _session.sendMessage(namespace, dataSend, function() {
      //console.log('loadRequest success', media);
      document.getElementById('canvas').innerHTML += '<p>Sent message.</p>';
    }, function(err) {
      //console.log('loadRequest error', err);
      document.getElementById('canvas').innerHTML += '<p>Not sent error: ' + JSON.stringify(err) + '</p>';
    });

}


app.initialize();
