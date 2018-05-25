$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {      
      $("#articles").append("<p dataId='" + data[i]._id + "'>" + data[i].title + "<br>" + data[i].link + "</p>");
      $("#articles").append("<br>")
      $("#articles").append("<a href='" + data[i].link + "' >")
    }
  });


  $("#scrapeBtn").on("click", function() {
    
    $("#notes").empty();
    var ID = $(this).attr("dataId");
  
    
    $.ajax({
      method: "GET",
      url: "/articles/" + ID
    })
      .done(function(data) {
        console.log(data);
        
        $("#scrapeResults").append("<h1>" + data.title + "</h1>");   
        $("#scrapeResults").append("<button dataId='" + data._id + "' id='saveNote'></button>");
  
      });
  });
  

  $(document).on("click", "#saveNote", function() {
    var ID = $(this).attr("dataId");

    $.ajax({
      method: "POST",
      url: "/articles/" + ID,
      data: {
        
        title: $("#title").val(),
        
        body: $("#body").val()
      }
    })
      
      .done(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#title").val("");
    $("#body").val("");
  });