$(document).ready(function () {
  const MAX_TITLE_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 1135;
  const READ_URL = '../backend/read.php';
  const CREATE_URL = '../backend/create.php';
  const UPDATE_URL = '../backend/update.php';
  const DELETE_URL = '../backend/delete.php';

  loadTasks();

  $('#task-form').submit(function (event) {
    event.preventDefault();
    const title = $('#title').val();
    const description = $('#description').val();

    if (title.length > MAX_TITLE_LENGTH) {
      alert('Title must be less than 50 characters');
      return;
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      alert('Description must be less than 1135 characters');
      return;
    }

    addTask(title, description);
    $('#title').val('');
    $('#description').val('');
  });

  function loadTasks() {
    $.ajax({
      url: READ_URL,
      type: 'GET',
      success: handleLoadTasksSuccess,
      error: handleAjaxError
    });
  }

  function handleLoadTasksSuccess(response) {
    const tasks = JSON.parse(response);
    renderTasks(tasks);
  }

  function addTask(title, description) {
    $.ajax({
      url: CREATE_URL,
      type: 'POST',
      data: {
        title: title,
        description: description
      },
      success: handleAddTaskSuccess,
      error: handleAjaxError
    });
  }

  function handleAddTaskSuccess() {
    loadTasks();
  }

  function renderTasks(tasks) {
    tasks.sort(function (a, b) {
      if (a.status === 'pending' && b.status === 'completed') {
        return -1;
      } else if (a.status === 'completed' && b.status === 'pending') {
        return 1;
      } else {
        return 0;
      }
    });
  
    $('#task-list').empty();
    tasks.forEach(function (task) {
      const tr = $('<tr>').attr('data-id', task.id);
      const title = $('<td>').text(task.title);
      const description = $('<td>').text(task.description);
      const status = $('<td>');
      const statusSelect = $('<select>').addClass('status-select');
      const pendingOption = $('<option>').attr('value', 'pending').text('Pending');
      const completedOption = $('<option>').attr('value', 'completed').text('Completed');
      statusSelect.append(pendingOption, completedOption);
      statusSelect.val(task.status);
      status.append(statusSelect);
      const actions = $('<td>');
      const editButton = $('<button>').text('Edit').addClass('edit-button task-action');
      const deleteButton = $('<button>').text('Delete').addClass('delete-button task-action');
      actions.append(editButton, deleteButton);
      tr.append(title, description, status, actions);
      $('#task-list').append(tr);
    });
  }
  

  function handleAjaxError(jqXHR, textStatus, errorThrown) {
    showError('An error occurred. Please try again later.');
    console.error('AJAX Error:', textStatus, errorThrown);
  }

  function showError(message) {
    alert('Error: ' + message);
  }

  $(document).on('click', '.edit-button', function () {
    const tr = $(this).closest('tr');
    const taskId = tr.attr('data-id');
    const title = tr.find('td').eq(0).text();
    const description = tr.find('td').eq(1).text();

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
    const taskId = $('#edit-task-id').val();
    const title = $('#edit-title').val();
    const description = $('#edit-description').val();
    $.ajax({
      url: UPDATE_URL,
      type: 'POST',
      data: {
        id: taskId,
        title: title,
        description: description,
        status: 'pending'
      },
      success: handleUpdateTaskSuccess,
      error: handleAjaxError
    });
  });

  function handleUpdateTaskSuccess() {
    loadTasks();
    $('#edit-title').val('');
    $('#edit-description').val('');
  }

  $(document).on('click', '.delete-button', function () {
    const tr = $(this).closest('tr');
    const taskId = tr.attr('data-id');
    $.ajax({
      url: DELETE_URL,
      type: 'POST',
      data: {
        id: taskId
      },
      success: function () {
        tr.remove();
        loadTasks();
      },
      error: handleAjaxError
    });
  });

  $(document).on('change', '.status-select', function () {
    const tr = $(this).closest('tr');
    const taskId = tr.attr('data-id');
    const status = $(this).val();
    $.ajax({
      url: UPDATE_URL,
      type: 'POST',
      data: {
        id: taskId,
        status: status
      },
      success: handleUpdateTaskStatusSuccess,
      error: handleAjaxError
    });
  });

  function handleUpdateTaskStatusSuccess() {
    loadTasks();
  }
});
