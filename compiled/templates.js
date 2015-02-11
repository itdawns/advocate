module.exports['core/navbar-header'] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<!-- Brand and toggle get grouped for better mobile display -->\n<div class="navbar-header">\n  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">\n    <span class="sr-only">Toggle navigation</span>\n    <span class="icon-bar"></span>\n    <span class="icon-bar"></span>\n    <span class="icon-bar"></span>\n  </button>\n  <a class="navbar-brand" href="#">Brand</a>\n</div>';

}
return __p
};
module.exports['core/navbar-nav-link'] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<li class="' +
((__t = ( typeof active === 'undefined' ? '' : active )) == null ? '' : __t) +
'"><a href="#">' +
((__t = ( typeof name === 'undefined' ? 'name' : name )) == null ? '' : __t) +
'</a></li>';

}
return __p
};
module.exports['core/navbar-nav'] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<ul class="nav navbar-nav">\n	' +
((__t = ( mountpoint )) == null ? '' : __t) +
'\n</ul>';

}
return __p
};
module.exports['core/navbar'] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<nav class="navbar navbar-default">\n  <div class="container-fluid">\n    \n    ' +
((__t = ( mountpoint )) == null ? '' : __t) +
'\n\n    <!-- responsive items -->\n    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\n\n\n\n    </div>\n\n\n  </div><!-- /.container-fluid -->\n</nav>';

}
return __p
};
module.exports['core/page'] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n\n    <meta charset="utf-8">\n    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <meta name="description" content="">\n    <meta name="author" content="">\n\n    <title>{{title}}</title>\n\n    <!-- Bootstrap Core CSS - Uses Bootswatch Flatly Theme: http://bootswatch.com/flatly/ -->\n    <link href="css/bootstrap.min.css" rel="stylesheet">\n\n</head>\n\n<body id="page-top" class="index">\n\n\n    <!-- Bootstrap Core JavaScript -->\n    <script src="js/bootstrap.min.js"></script>\n\n</body>\n\n</html>';

}
return __p
};