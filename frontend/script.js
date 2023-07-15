$(document).ready(function() {
  loadTasks();
  $('#task-form').submit(function(event) {
    event.preventDefault();
    let title = $('#title').val();
    let description = $('#description').val();
    addTask(title, description);
    $('#title').val('');
    $('#description').val('');
  });

  function loadTasks() {
    $.ajax({
      url: '../backend/read.php',
      type: 'GET',
      success: function(response) {
        let tasks = JSON.parse(response);
        renderTasks(tasks);
      },
      error: function(_jqXHR, textStatus, errorThrown) {
      }
    });
  }

  function addTask(title, description) {
    $.ajax({
      url: '../backend/create.php',
      type: 'POST',
      data: {
        title: title,
        description: description
      },
      success: function() {
        loadTasks();
      }
    });
  }

  function renderTasks(tasks) {
    $('#task-list').empty();
    tasks.forEach(function(task) {
      let li = $('<li>').attr('data-id', task.id).addClass('task-item');
      let title = $('<span>').text(task.title).addClass('task-title');
      let description = $('<span>').text(task.description).addClass('task-description');
      let actions = $('<span>');
      let editButton = $('<button>').text('Edit').addClass('edit-button task-action');
      let deleteButton = $('<button>').text('Delete').addClass('delete-button task-action');
      actions.append(editButton, deleteButton);
      li.append(title, description, actions);
      $('#task-list').append(li);
    });
  }

  $(document).on('click', '.edit-button', function() {
    let li = $(this).closest('li');
    let taskId = li.attr('data-id');
    let title = li.find('span').eq(0).text();
    let description = li.find('span').eq(1).text();
    
    $('#edit-title').val(title);
    $('#edit-description').val(description);
    $('#edit-task-id').val(taskId);
  });

  $('#edit-form').submit(function(event) {
    event.preventDefault();
    let taskId = $('#edit-task-id').val();
    let title = $('#edit-title').val();
    let description = $('#edit-description').val();
    $.ajax({
      url: '../backend/update.php',
      type: 'POST',
      data: {
        id: taskId,
        title: title,
        description: description,
        status: 'pending'
      },
      success: function() {
        loadTasks();
        $('#edit-title').val('');
        $('#edit-description').val('');
      }
    });
  });

  $(document).on('click', '.delete-button', function() {
    let li = $(this).closest('li');
    let taskId = li.attr('data-id');
    $.ajax({
      url: '../backend/delete.php',
      type: 'POST',
      data: {
        id: taskId
      },
      success: function() {
        li.remove();
      }
    });
  });
});
