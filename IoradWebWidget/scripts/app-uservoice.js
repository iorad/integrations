$(document).ready(function () {
  var user = window.currentUser;
  if (user && user.user && user.user.roles && user.user.roles.admin) {
    ioradWebWidget.uservoice.runApp(jQuery, window);
  }
});
