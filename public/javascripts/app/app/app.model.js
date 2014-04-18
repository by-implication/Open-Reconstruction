var app = {}

app.currentUser = m.prop(new user.GUEST());

app.xhrConfig = function(xhr){
    xhr.setRequestHeader("Content-Type", "application/json");
}
