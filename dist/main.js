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

var uploadImageToClarafai = type => {
  var url = "";
  const app = new Clarifai.App({
    apiKey: "f577985bc79a416c87965f5d6d32f13b"
  });
  var user_img = document.createElement("img");
  user_img.style.height = "300px";
  user_img.style.width = "300px";

  if (type === "image") {
    console.log("Image Uploaded");
    var file = document.getElementById("user-img").files[0];
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.addEventListener(
      "load",
      function() {
        user_img.src = url;
        url = reader.result.replace(/^data:image\/(.*);base64,/, "");
        // predict the contents of an image by passing in a url
        app.models.predict(Clarifai.FOOD_MODEL, url).then(
          function(response) {
            console.log(response.outputs[0].data.concepts);
          },
          function(err) {
            console.error(err);
          }
        );
      },
      false
    );
  } else {
    console.log("Url");
    url = document.getElementById("user-img-url").value;
    user_img.src = url;
    console.log(user_img);

    // predict the contents of an image by passing in a url
    app.models.predict(Clarifai.FOOD_MODEL, url).then(
      function(response) {
        console.log(response.outputs[0].data.concepts);
      },
      function(err) {
        console.error(err);
      }
    );
  }
  document.getElementById("uplo").appendChild(user_img);
};
