var uploadImageToClarafai = type => {
  var url = "";
  var base64url = "";
  const app = new Clarifai.App({
    apiKey: "f577985bc79a416c87965f5d6d32f13b"
  });

  if (type === "image") {
    var file = document.getElementById("user-img").files[0];
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener(
        "load",
        function() {
          url = reader.result;
          base64url = reader.result.replace(/^data:image\/(.*);base64,/, "");
          // predict the contents of an image by passing in a url
          app.models.predict(Clarifai.FOOD_MODEL, base64url).then(
            function(response) {
              generateUserDishCard(url, response.outputs[0].data.concepts);
            },
            function(err) {
              console.error(err);
            }
          );
        },
        false
      );
    } else {
      alert("No Image Uploaded");
    }
  } else {
    url = document.getElementById("user-img-url").value;
    if (url !== "") {
      // predict the contents of an image by passing in a url
      app.models.predict(Clarifai.FOOD_MODEL, url).then(
        function(response) {
          generateUserDishCard(url, response.outputs[0].data.concepts);
        },
        function(err) {
          console.error(err);
        }
      );
    } else alert("Enter A URL");
  }
};

function generateUserDishCard(url, data) {
  var userCard = document.getElementById("user-dish-card");
  userCard.style.visibility = "visible";
  //   console.log(data);
  var dish_img = document.getElementById("dish-img");
  dish_img.src = url;

  var mainIngredients = [];
  var additionalIngredients = [];
  var maybeContains = [];

  Array.from(data).forEach(ingredient => {
    if (ingredient.value > 0.65) mainIngredients.push(ingredient.name);
    else if (ingredient.value > 0.35)
      additionalIngredients.push(ingredient.name);
    else maybeContains.push(ingredient.name);
  });

  mainIngredients.forEach((item, i) => {
    if (i == 1)
      document.getElementById("mainI").innerHTML = "Main Ingredients:\n";
    if (i < 10)
      document.getElementById("mainI").innerHTML += `<li>${item}</li>`;
  });
  additionalIngredients.forEach((item, i) => {
    if (i == 1)
      document.getElementById("addI").innerHTML = "Additional Ingredients: \n";
    if (i < 10) document.getElementById("addI").innerHTML += `<li>${item}</li>`;
  });
  maybeContains.forEach((item, i) => {
    if (i == 1)
      document.getElementById("maybeI").innerHTML = "May also contain: \n";
    if (i < 10)
      document.getElementById("maybeI").innerHTML += `<li>${item}</li>`;
  });
}
