var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  currentRoom: '',
  friends: {},
  rooms: {}
};  

app.init = () => {
  $('#chats').on('click', '.username', app.handleUsernameClick);
  $('#rooms').on('click', '#createRoom', app.handleRoomCreate);
  $('#rooms').on('change', '#roomSelect', app.changeToRoom);
  $('#send').on('submit', '.submit', app.handleSubmit);
  app.renderRoom('lobby');
  app.currentRoom = 'lobby';
  app.filter = {where: {roomname: app.currentRoom}};
  app.findRooms();
  app.fetch();
  setInterval(app.fetch, 60000);
};

app.send = (message) => {
  app.startSpinner();

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = () => {
  app.clearMessages();
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server + '?order="-createdAt"&limit=100',
    type: 'GET',
    data: app.filter,
    contentType: 'application/json',
    success: function (data) {
      app.renderAll(data['results']);
      app.stopSpinner();

      console.log('chatterbox: Message received');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

app.sanitize = function (string) {
  // Should replace all other special characters
  if (string === undefined) {
    return;
  }
  string = string.replace(/[<]/g, '&lt;');
  string = string.replace(/[>]/g, '&gt;');
  string = string.replace(/[$]/g, '&#33;');
  string = string.replace(/[#]/g, '&#35;');
  string = string.replace(/[&]/g, '&#38;');
  string = string.replace(/[?]/g, '&#63;');
  string = string.replace(/[{]/g, '&#123;');
  string = string.replace(/[}]/g, '&#124;');
  string = string.replace(/[(]/g, '&#40;');
  string = string.replace(/[)]/g, '&#41;');
  string = string.replace(/[\[]/g, '&#91;');
  string = string.replace(/[\]]/g, '&#93;');
  string = string.replace(/[\\]/g, '&#92;');
  string = string.replace(/[/]/g, '&#47;');
  string = string.replace(/[;]/g, '&#59;');
  string = string.replace(/[.]/g, '&#46;');

  return string;
};

app.clearMessages = () => {
  $('#chats').empty();
};

app.renderAll = (data) => {
  for (var i = 0; i < data.length; i++) {
    data[i].username = app.sanitize(data[i].username);
    data[i].text = app.sanitize(data[i].text);
    app.renderMessage(data[i]);
  }
};

app.renderMessage = (message) => {
  if (message.username in app.friends) {
    $('#chats').append(`<div class="message"><span class="username friend">${message.username}</span><span class="text friendMessage">: ${message.text}</span></div>`);
  } else {
    $('#chats').append(`<div class="message"><span class="username">${message.username}</span><span class="text">: ${message.text}</span></div>`);
  }
};

app.findRooms = (data) => {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server + '?order="-createdAt"&limit=500',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      var results = data['results'];

      for (var i = 0; i < results.length; i++) {
        app.rooms[results[i].roomname] = results[i].roomname;
      }
      // render rooms
      for (var room in app.rooms) {
        app.renderRoom(room);
      }
      console.log('chatterbox: Message received');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

app.renderRoom = (roomName) => {
  var $currentRooms = $('#roomSelect').children();
  var exists = false;

  for (var i = 0; i < $currentRooms.length; i++) {
    if ($currentRooms[i].innerText === roomName) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    $('#roomSelect').append(`<option value = ${roomName}>${roomName}</option>`);
  }
};

app.changeToRoom = (event) => {
  app.startSpinner();
  app.currentRoom = event.target.selectedOptions[0].innerText;
  app.filter = {where: {roomname: app.currentRoom}};
  app.fetch();
};

// Event Handlers
app.handleUsernameClick = (event) => {
  var $message = $('#chats .message');

  if (event.target.innerText in app.friends) {
    delete app.friends[event.target.innerText];
  } else {
    app.friends[event.target.innerText] = event.target.innerText;
  }

  for (var i = 0; i < $message.length; i++) {
    if ($message[i].children[0].innerText in app.friends) {
      $message[i].children[0].className = 'username friend';
      $message[i].children[1].className = 'text friendMessage';
    } else {
      $message[i].children[0].className = 'username';
      $message[i].children[1].className = 'text';
    }
  }
};

app.handleRoomCreate = (event) => {
  event.preventDefault();
  app.renderRoom($('#newRoom')[0].value);
  $('#newRoom')[0].value = '';
};

app.handleSubmit = (event) => {
  event.preventDefault();
  var userName = window.location.search.match(/[^=]\w+$/)[0];
  var message = {
    username: userName,
    text: $('#messageBox').val(),
    roomname: app.currentRoom
  };

  app.send(message);
  $('#messageBox')[0].value = '';
};

app.startSpinner = () => {
  $('.spinner img').show();
  $('form input[type=submit]').attr('disabled', true);
};

app.stopSpinner = () => {
  $('.spinner img').fadeOut('fast');
  $('form input[type=submit]').attr('disabled', false);
};

$(document).ready(app.init);

