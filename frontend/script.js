$(document).ready(function () {
  loadTasks();
  $('#task-form').submit(function (event) {
    event.preventDefault();
    let title = $('#title').val();
    let description = $('#description').val();

    if (title.length > 50) {
      alert('Title must be less than 50 characters');
      return;
    }
    if (description.length > 1135) {
      alert('Description must be less than 1135 characters');
      return;
    }

    addTask(title, description);
    $('#title').val('');
    $('#description').val('');
  });

  function loadTasks() {
    $.ajax({
      url: '../backend/read.php',
      type: 'GET',
      success: function (response) {
        let tasks = JSON.parse(response);
        renderTasks(tasks);
      },
      error: function (_jqXHR, textStatus, errorThrown) {
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
      success: function () {
        loadTasks();
      }
    });
  }

  function renderTasks(tasks) {
    tasks.sort(function (a, b) {
      if (a.status === 'completed' && b.status === 'pending') {
        return -1;
      } else if (a.status === 'pending' && b.status === 'completed') {
        return 1;
      } else {
        return 0;
      }
    });

    $('#task-list').empty();
    tasks.forEach(function (task) {
      let tr = $('<tr>').attr('data-id', task.id);
      let title = $('<td>').text(task.title);
      let description = $('<td>').text(task.description);
      let status = $('<td>');
      let statusSelect = $('<select>').addClass('status-select');
      let pendingOption = $('<option>').attr('value', 'pending').text('Pending');
      let completedOption = $('<option>').attr('value', 'completed').text('Completed');
      statusSelect.append(pendingOption, completedOption);
      statusSelect.val(task.status);
      status.append(statusSelect);
      let actions = $('<td>');
      let editButton = $('<button>').text('Edit').addClass('edit-button task-action');
      let deleteButton = $('<button>').text('Delete').addClass('delete-button task-action');
      actions.append(editButton, deleteButton);
      tr.append(title, description, status, actions);
      $('#task-list').append(tr);
    });
  }


  $(document).on('click', '.edit-button', function () {
    let tr = $(this).closest('tr');
    let taskId = tr.attr('data-id');
    let title = tr.find('td').eq(0).text();
    let description = tr.find('td').eq(1).text();
  
    tr.addClass('highlight');
    $('#edit-task-id').val(taskId);
    $('#edit-title')
      .val(title)
      .addClass('highlight-background');
    $('#edit-description')
      .val(description)
      .addClass('highlight-background');
  
    setTimeout(function () {
      tr.removeClass('highlight');
      $('#edit-title, #edit-description').removeClass('highlight-background');
    }, 1000);
  
    $('html, body').animate({ scrollTop: 0 }, 500);
  });
  
  

  $('#edit-form').submit(function (event) {
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
      success: function () {
        loadTasks();
        $('#edit-title').val('');
        $('#edit-description').val('');
      }
    });
  });

  $(document).on('click', '.delete-button', function () {
    let tr = $(this).closest('tr');
    let taskId = tr.attr('data-id');
    $.ajax({
      url: '../backend/delete.php',
      type: 'POST',
      data: {
        id: taskId
      },
      success: function () {
        tr.remove();
      }
    });
  });

  $(document).on('change', '.status-select', function () {
    let tr = $(this).closest('tr');
    let taskId = tr.attr('data-id');
    let status = $(this).val();
    $.ajax({
      url: '../backend/update.php',
      type: 'POST',
      data: {
        id: taskId,
        status: status
      },
      success: function () {
        loadTasks();
      }
    });
  });
});
