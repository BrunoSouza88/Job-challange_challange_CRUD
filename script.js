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
      url: 'backend.php',
      type: 'GET',
      data: { action: 'read' },
      success: function(response) {
        let tasks = JSON.parse(response);
        renderTasks(tasks);
      },
      error: function(_jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }

  function addTask(title, description) {
    $.ajax({
      url: 'backend.php',
      type: 'POST',
      data: {
        action: 'create',
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
      let li = $('<li>').attr('data-id', task.id);
      let title = $('<span>').text(task.title);
      let description = $('<span>').text(task.description);
      let actions = $('<span>');
      let editButton = $('<button>').text('Edit').addClass('edit-button');
      let deleteButton = $('<button>').text('Delete').addClass('delete-button');
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
  });

  $('#edit-form').submit(function(event) {
    event.preventDefault();
    let taskId = $(this).closest('li').attr('data-id');
    let title = $('#title').val();
    let description = $('#description').val();
    $.ajax({
      url: 'backend.php',
      type: 'POST',
      data: {
        action: 'update',
        id: taskId,
        title: title,
        description: description,
        status: 'pending'
      },
      success: function() {
        loadTasks();
      }
    });
  });

  $(document).on('click', '.delete-button', function() {
    let li = $(this).closest('li');
    let taskId = li.attr('data-id');
    $.ajax({
      url: 'backend.php',
      type: 'POST',
      data: {
        action: 'delete',
        id: taskId
      },
      success: function() {
        li.remove();
      }
    });
  });
});
