$.ajax({
  url: window.location.href,
  method: 'GET',
  start_time: new Date().getTime(),
  complete: function(data) {
    alert('This request took ' + (new Date().getTime() - this.start_time)+' ms');
  }
});