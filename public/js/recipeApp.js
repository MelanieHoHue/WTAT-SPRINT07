$(document).ready(() => {

  const socket = io();
  
  $("#chatForm").submit(() => {
    let text = $("#chat-input").val();
    socket.emit("message", {
      content: text
    });
    console.log(message)
    $("#chat-input").val("");
    return false;
  });
  
  socket.on("message", (message) => {
    console.log('recipeApp message', message)
    displayMessage(message);
  });
  
  let displayMessage = (message) => {
    console.log('displayMessage | message', message);
    $("#chat").prepend(
      $("<li>").html(`<div>
                      ${message.content}
                    </div>`)
    );
  };

  let getCurrentUserClass = (id) => {
    let userId = $('#chat-user-id').val();
    return userId === id ? "current-user": "";
  }

  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get("/api/courses?apiToken=recipeT0k3n", (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach(course => {
        $(".modal-body").append(
          `<div>
						<span class="course-title">
							${course.title}
						</span>
						<button class='button ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
							${course.joined ? "Joined" : "Join"}
						</button>
						<div class="course-description">
							${course.description}
						</div>
					</div>`
        );
      });
    }).then(() => {
      addJoinButtonListener();
    });
  });

  let addJoinButtonListener = () => {
    $(".join-button").click(event => {
      let $button = $(event.target),
        courseId = $button.data("id");
      $.get(`/api/courses/${courseId}/join`, (results = {}) => {
        let data = results.data;
        if (data && data.success) {
          $button
            .text("Joined")
            .addClass("joined-button")
            .removeClass("join-button");
        } else {
          $button.text("Try again");
        }
      });
    });  
  };
  
  
});

