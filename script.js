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
        $('#task-list').empty();
        tasks.forEach(function(task) {
          let row = $('<tr>').attr('data-id', task.id);
          let title = $('<td>').text(task.title);
          let description = $('<td>').text(task.description);
          let actions = $('<td>');
          let editButton = $('<button>').text('Edit').addClass('edit-button');
          let deleteButton = $('<button>').text('Delete').addClass('delete-button');
          actions.append(editButton, deleteButton);
          row.append(title, description, actions);
          $('#task-list').append(row);
        });
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

  $(document).on('click', '.edit-button', function() {
    let row = $(this).closest('tr');
    let taskId = row.attr('data-id');
    let title = row.find('td').eq(0).text();
    let description = row.find('td').eq(1).text();
  });

  // Quando o formulário de edição for enviado
  $('#edit-form').submit(function(event) {
    event.preventDefault();
    let taskId = $(this).closest('tr').attr('data-id');
    let title =  $('#title').val();
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
    let row = $(this).closest('tr');
    let taskId = row.attr('data-id');
    $.ajax({
      url: 'backend.php',
      type: 'POST',
      data: {
        action: 'delete',
        id: taskId
      },
      success: function() {
        row.remove();
      }
    });
  });
});
