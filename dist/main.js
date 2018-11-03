var login = () => {
  var uname = document.getElementById("uname").value;
  var pwd = document.getElementById("pwd").value;
  var q = faunadb.query;
  var client = new faunadb.Client({
    secret: "fnAC-5BzmsACCMj3RTsPxdDfLxJ26nM9INSiboaA"
  });

  client
    .query(
      q.Paginate(
        q.Match(q.Index("authenticate_user"), [uname.toLowerCase(), pwd])
      )
    )
    .then(ret => {
      if (ret.data.length) {
        const todoRefs = ret.data[0];
        var vals = Object.values(todoRefs);
        var reference = Object.values(vals)[0].split("/")[2];
        sessionStorage.setItem("isLoggedIn", "true");
        client.query(q.Get(q.Ref(q.Class("users"), reference))).then(ret => {
          sessionStorage.setItem("loggedInUser", JSON.stringify(ret.data));
          self.location = "./home.html";
        });
      } else {
        alert("Invalid credentials");
      }
    });
};

var register = () => {
  var fname = document.getElementById("signup_fname").value;
  var lname = document.getElementById("signup_lname").value;
  var email = document.getElementById("email").value;
  var pwd = document.getElementById("signup_pwd").value;

  var q = faunadb.query;

  var client = new faunadb.Client({
    secret: "fnAC-5BzmsACCMj3RTsPxdDfLxJ26nM9INSiboaA"
  });

  client
    .query(
      q.Create(q.Class("users"), {
        data: {
          fname: fname,
          lname: lname,
          email: email,
          pwd: pwd
        }
      })
    )
    .then(ret => {
      console.log(ret);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("loggedInUser", JSON.stringify(ret.data));
      self.location = "./home.html";
    })
    .catch(err => {
      console.log(err);
      alert("You did something wrong ");
    });
};
