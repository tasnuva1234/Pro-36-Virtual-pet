var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var food;
var milkNumber = 8;
var milkFed = 0;

function preload(){
sadDog=loadImage("doggy.png");
happyDog=loadImage("dogHappy.png");
room = loadImage("room.jpg")

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  
  //To load the food class
  food = new Food();

  //To read the data from firbase
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  //To create the sad dog
  dog=createSprite(780,270,150,150);
  dog.addImage(sadDog);
  dog.scale=0.13;

  input = createInput ("Fill your Dog's Name"); 
  input.position (200, 95); 

  var name = input.value();

  //To create the feed dog button
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  //To ceate the button to add the food
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(room);
  food.display();


  //To read the time on firebase
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  //To write the time
  fill("black");
  textSize(20);

  //To locate the time 
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 320,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",320,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 320,30);
   }
  
   fill("white");
  stroke("red");
  textSize(25);
  text("Number of Milk:"+milkNumber,20,340)

  fill("white");
  stroke("green");
  textSize(25);
  text("Number of Milk fed:"+milkFed,20,370)

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  food.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  milkNumber = milkNumber-1
  milkFed = milkFed+1
  
  var foodCount = food.getFoodStock();
  if(foodCount <= 0){
      food.updateFoodStock(foodCount *0);

  }else{
      food.updateFoodStock(foodCount -1);
  }
  
 
    
  database.ref('/').update({
    Food:food.getFoodStock(),
    FeedTime:hour()
    
  })
   
  
}

//function to add food stock
function addFoods(){
  milkNumber = milkNumber+1
  foodS++;
  database.ref('/').update({
    Food:foodS

  })

  

}