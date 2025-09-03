(function() {
  document.getElementById('skip-search').addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.getElementById('search-input');
    target.focus();
  });
})();
