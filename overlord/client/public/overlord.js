$(function() {
  insert_message = function(msg) {
    try {
      type = msg.substr(0, msg.indexOf(' '));
      text = msg.substr(msg.indexOf(' ')+1);
      classes = "status list-group-item";
      switch (type) {
        case "Alert:":
          classes += " list-group-item-success";
          break;
        case "Error:":
          classes += " list-group-item-danger";
          break;
        case "Update:":
          classes += " list-group-item-info";
          break;
        default:
          break;
      }

      list_item = '<li class="' + classes + '">' + text + '</li>';
      $("ul#error_list").prepend(list_item);
    }
    catch(err) {
      alert(err);
    }
  }

  bind_button = function(btn, path, request, error) {
    $(btn).click(function() {
      $.ajax({
        url: 'http://localhost:4567' + path,
        type: request,
        crossDomain: true,
        success: function(data) {
          message = data['message'];
          insert_message(message);
        },
        error: function(data) {
          alert(error);
        }
      });
    });
  }

  bind_button('#bomb_boot_btn', '/boot', 'POST', 'Error Booting Bomb');
  bind_button('#bomb_reset_btn', '/bomb', 'PUT', 'Error Resetting Bomb');

  bind_text_field = function(id, path, request, error) {
    $(id).find('.btn').click(function() {
      $.ajax({
        url: 'http://localhost:4567' + path,
        type: request,
        crossDomain: true,
        data: { 'code' : $(id).find('.textbox')[0].value },
        success: function(data) {
          message = data['message'];
          insert_message(message);
        },
        error: function(data) {
          alert(error);
        }
      });
    });
  }

  bind_text_field('#deactivation_code', '/set_deactivation_code', 'POST', 'Oops');
  bind_text_field('#activation_code', '/set_activation_code', 'POST', 'Oops');
  bind_text_field('#submit_code', '/submit_code', 'POST', 'Oops');

  status_timer = setInterval(function() {
    $.ajax({
      url: 'http://localhost:4567/',
      type: 'GET',
      crossDomain: true,
      success: function(data) {
        message = data['message'];
        $('#bomb_state').text(message)
      },
      error: function(data) {
        alert('Error Resetting Bomb');
      }
    });
  }, 500);

  bomb_timer = setInterval(function() {
    $.ajax({
      url: 'http://localhost:4567/timer',
      type: 'GET',
      crossDomain: true,
      success: function(data) {
        message = data['message'];
        $('#timer').text(message)
      },
      error: function(data) {
        alert('Error Getting Time');
      }
    });
  }, 500);
});
