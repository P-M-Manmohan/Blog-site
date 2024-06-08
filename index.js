import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import axios from "axios";

const app = express();
const port = 3000;
var numberOfSubmits = 0;
var titles = [];
var contents = [];
var inc=0;
var users=[];
// var LOC_API="https://api.ipgeolocation.io/getip?apiKey=7e0e27d4f9064c10969b780eda18e957";
var LOC_API="http://ip-api.com/json";
var WEATHER_API="https://api.open-meteo.com/v1/forecast?";

const wmo_code={
	"0":{
		"day":{
			"description":"Sunny",
			"image":"http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night":{
			"description":"Clear",
			"image":"http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"1":{
		"day":{
			"description":"Mainly Sunny",
			"image":"http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night":{
			"description":"Mainly Clear",
			"image":"http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"2":{
		"day":{
			"description":"Partly Cloudy",
			"image":"http://openweathermap.org/img/wn/02d@2x.png"
		},
		"night":{
			"description":"Partly Cloudy",
			"image":"http://openweathermap.org/img/wn/02n@2x.png"
		}
	},
	"3":{
		"day":{
			"description":"Cloudy",
			"image":"http://openweathermap.org/img/wn/03d@2x.png"
		},
		"night":{
			"description":"Cloudy",
			"image":"http://openweathermap.org/img/wn/03n@2x.png"
		}
	},
	"45":{
		"day":{
			"description":"Foggy",
			"image":"http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night":{
			"description":"Foggy",
			"image":"http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"48":{
		"day":{
			"description":"Rime Fog",
			"image":"http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night":{
			"description":"Rime Fog",
			"image":"http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"51":{
		"day":{
			"description":"Light Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"53":{
		"day":{
			"description":"Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"55":{
		"day":{
			"description":"Heavy Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Heavy Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"56":{
		"day":{
			"description":"Light Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"57":{
		"day":{
			"description":"Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"61":{
		"day":{
			"description":"Light Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Light Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"63":{
		"day":{
			"description":"Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"65":{
		"day":{
			"description":"Heavy Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Heavy Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"66":{
		"day":{
			"description":"Light Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Light Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"67":{
		"day":{
			"description":"Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"71":{
		"day":{
			"description":"Light Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Light Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"73":{
		"day":{
			"description":"Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"75":{
		"day":{
			"description":"Heavy Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Heavy Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"77":{
		"day":{
			"description":"Snow Grains",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow Grains",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"80":{
		"day":{
			"description":"Light Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"81":{
		"day":{
			"description":"Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"82":{
		"day":{
			"description":"Heavy Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Heavy Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"85":{
		"day":{
			"description":"Light Snow Showers",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Light Snow Showers",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"86":{
		"day":{
			"description":"Snow Showers",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow Showers",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"95":{
		"day":{
			"description":"Thunderstorm",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Thunderstorm",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"96":{
		"day":{
			"description":"Light Thunderstorms With Hail",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Light Thunderstorms With Hail",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"99":{
		"day":{
			"description":"Thunderstorm With Hail",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Thunderstorm With Hail",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	}
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/users/login",(req,res)=>{
    if(inc==3){
        var msg="Incorrect Credentials";
        inc=0;
        res.render("login.ejs",{error:msg});
    }else{
        res.render("login.ejs");
    }
});

app.get("/users/signin",(req,res)=>{
    if(inc==1){
        var msg="passwords don't match";
        inc=0;
        res.render("signin.ejs",{error:msg});
    }
    else if(inc==2){
        var msg="username is already taken";
        inc=0;
        res.render("signin.ejs",{error:msg});
    }else if(inc==4){
        var msg="password is too Short";
        inc=0;
        res.render("signin.ejs",{error:msg});
    }
    else{
        res.render("signin.ejs");
    }
});

app.post("/signin", async (req,res)=>{
    var userData=req.body;
    try{
        if(req.body.password!=req.body.confirmPassword){
            inc=1;
            res.redirect("/users/signin");
        }else if(users.find(user=> user.username==req.body.username)!=null){
            inc=2;
            res.redirect("/users/signin");
        }else if(req.body.password.length<8){
            inc=4;
            res.redirect("/users/signin");
        }
        else{
        const hashedPassword= await bcrypt.hash(req.body.password,10);
        const user={username:req.body.username, password:hashedPassword, email:req.body.email};
        users.push(user);
        res.redirect("/");
        }
    }
    catch{
        console.log("error");
res.status(500).send();
    }
})

app.post("/login", async(req,res)=>{
    const user=users.find(user=> user.username==req.body.username);
    if(user==null){
        inc=3;
        res.redirect("/users/login");
    }
    try{
        if(bcrypt.compare(req.body.password,user.password)){
            res.redirect("/");
        }else{
            inc=3;
            res.redirect("/users/login");
        }
    }catch{
        res.status(500).send()
    }
})

app.get("/", async (req, res) => {
    console.log(req);
    const loc=await axios.get(LOC_API);
    var lat=loc.data.lat;
    var lon=loc.data.lon;
    const weather_data=await axios.get(WEATHER_API+`latitude=${lat}&longitude=${lon}&current=weather_code`);
    var weather_code=weather_data.data.current.weather_code;
    console.log(wmo_code[weather_code].day.description);
    var icon=wmo_code[weather_code].day.image;
    // const code=codes.find(code=> codes.==weather_code);
    res.render("index.ejs", {
        feed: numberOfSubmits,
        title: titles,
        pic:icon,
    });
});

app.get("/writing", (req, res) => {
    res.render("new_blog.ejs");
});

app.get("/post", (req, res) => {
    var post = req.query.post;
    res.render("partials/blog.ejs", {
        title: titles[post],
        content: contents[post],
        id: post,
    });
});

app.get("/edit", (req, res) => {
    var editNumber = req.query.postId;
    res.render("new_blog.ejs", {
        title: titles[editNumber],
        content: contents[editNumber],
        id: editNumber,
    });
});

app.post("/submit", (req, res) => {
    var newPost = req.query.new;

    if (newPost == 1) {
        numberOfSubmits++;
        titles.push(req.body.title);
        contents.push(req.body.content);
    } else {
        var postId = req.query.id;
        titles[postId] = req.body.title;
        contents[postId] = req.body.content;
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`listening on port : ${port}`);
});
