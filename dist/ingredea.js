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
  var topIngredients = "";
  
  mainIngredients.forEach((item, i) => {
    if (i == 0)
      document.getElementById("mainI").innerHTML = "<b>Main Ingredients:</b>\n";
    if(i < 5)  topIngredients += item+"," 
    if (i < 10)
      document.getElementById("mainI").innerHTML += `<li>${item}</li>`;
  });
  additionalIngredients.forEach((item, i) => {
    if (i == 0)
      document.getElementById("addI").innerHTML = "<b>Additional Ingredients: </b>\n";
    if (i < 10) document.getElementById("addI").innerHTML += `<li>${item}</li>`;
  });
  maybeContains.forEach((item, i) => {
    if (i == 0)
      document.getElementById("maybeI").innerHTML = "<b>May also contain: </b>\n";
    if (i < 10)
      document.getElementById("maybeI").innerHTML += `<li>${item}</li>`;
  });
  topIngredients = topIngredients.replace(" ","%20");
  topIngredients = topIngredients.slice(0,topIngredients.length-1);
  generateSuggestions(topIngredients);
}

function generateSuggestions(searchString){
  fetch(`https://api.edamam.com/search?q=${searchString}&app_id=4485101a&app_key=94a4dfd20a876aa86be092aa4c145667&from=0&to=5`)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    var results = myJson.hits;
    var recipes = [];
    document.getElementById('user-suggestions').innerHTML = ``;
 
results.forEach(item =>{
  recipes.push({
    "dish_name": item.recipe.label,
    "recipe_address": item.recipe.url,
    "recipe_source": item.recipe.source,
    "diet_labels": item.recipe.dietLabels,
    "health_labels": item.recipe.healthLabels,
  });

document.getElementById('user-suggestions').innerHTML += `
<ul> <h3>${item.recipe.label}</h3>
<li>Full Recipe at <a href="${item.recipe.url}">${item.recipe.url}</a></li>
<li>Recipe source: ${item.recipe.source}</li>
<li>Diet Labels:  ${item.recipe.dietLabels}</li>
<li>Health Labels: ${item.recipe.healthLabels}</li>
</ul>
`;

});
console.log(recipes);
})
}