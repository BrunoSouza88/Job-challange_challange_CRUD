$(document).ready(function() {
  console.log('document ready');
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
    console.log('loadTasks');
    $.ajax({
      url: 'read.php',
      type: 'GET',
      success: function(response) {
        let tasks = JSON.parse(response);
        renderTasks(tasks);
      },
      error: function(_jqXHR, textStatus, errorThrown) {
        console.log('Error:', textStatus, errorThrown);
      }
    });
  }

  function addTask(title, description) {
    console.log('addTask');
    $.ajax({
      url: 'create.php',
      type: 'POST',
      data: {
        title: title,
        description: description
      },
      success: function() {
        console.log('talvez seja aqui?');
        loadTasks();
      }
    });
  }

  function renderTasks(tasks) {
    console.log('renderiza meu filho', tasks);
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
    
    // Preencha os campos de edição diretamente na página
    $('#edit-title').val(title);
    $('#edit-description').val(description);
    $('#edit-task-id').val(taskId);
    
    // Exiba os campos de edição
    $('#edit-title').show();
    $('#edit-description').show();
    $('#edit-submit').show();
  });

  $('#edit-form').submit(function(event) {
    event.preventDefault();
    let taskId = $('#edit-task-id').val();
    let title = $('#edit-title').val();
    let description = $('#edit-description').val();
    $.ajax({
      url: 'update.php',
      type: 'POST',
      data: {
        id: taskId,
        title: title,
        description: description,
        status: 'pending'
      },
      success: function() {
        loadTasks();
        // Limpar campos de edição e ocultá-los após atualizar
        $('#edit-title').val('');
        $('#edit-description').val('');
        $('#edit-title').hide();
        $('#edit-description').hide();
        $('#edit-submit').hide();
      }
    });
  });

  $(document).on('click', '.delete-button', function() {
    let li = $(this).closest('li');
    let taskId = li.attr('data-id');
    $.ajax({
      url: 'delete.php',
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
