const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Person = require('./models/person');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://RodainaKhalil:rodaina2002@cluster0.q5dgd6i.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

//----------------------------------------------------------------------------------------------------------------

//ROUTES & CRUD OPERATIONS

// Creating Person 1 & Saving 
app.get('/add-person', (req, res)  => {
    const person = new Person({
        name: 'Person 1',
        age: 20,
        favoriteFoods: ['burger', 'fries'],
    })

    person.save()
        .then(result => {
            res.send(result);
        })
        .catch(err =>  {
            console.log(err);
        });
});

// Create Multiple People
app.get('/create-people', (req, res) => {
    Person.create([
        {name: 'Person 2', age: 30, favoriteFoods: ['pasta', 'fries', 'pizza']},
        {name: 'Person 3', age: 21, favoriteFoods: ['pasta', 'pizza']},
        {name: 'Person 4', age: 20, favoriteFoods: ['pizza', 'burger']},
        {name: 'Person 5', age: 44, favoriteFoods: ['pasta', 'burger', 'pizza']},
        {name: 'Person 6', age: 21, favoriteFoods: ['pasta', 'fries', 'pizza', 'burger']}
    ])
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Create Multiple People using arrayOfPeople
app.get('/create-people-array', (req, res) => {
    const arrayOfPeople = [
        {name: 'Person 2', age: 30, favoriteFoods: ['pasta', 'fries', 'pizza']},
        {name: 'Person 3', age: 21, favoriteFoods: ['pasta', 'pizza', 'burritos']},
        {name: 'Person 4', age: 20, favoriteFoods: ['pizza', 'burger']},
        {name: 'Person 5', age: 44, favoriteFoods: ['pasta', 'burger','burritos', 'pizza']},
        {name: 'Person 6', age: 21, favoriteFoods: ['pasta', 'fries', 'pizza', 'burger']},
        {name: 'Mary', age: 21, favoriteFoods: ['pasta', 'pizza']},
        {name: 'Mary', age: 44, favoriteFoods: ['pasta', 'burger', 'pizza']}
    ]
    Person.create(arrayOfPeople)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
})

// Getting all People
app.get('/all-people', (req, res) => {
    Person.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Getting all People having a given name (Person  1)
app.get('/person1', (req, res) => {
    Person.find({name: 'Person 1'})
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Getting a Single Person with Certain Favorite Food (Fries)
app.get('/person-fries', (req, res) => {
    Person.findOne({ favoriteFoods : 'fries' })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
})

// Getting a certain Person by ID
app.get('/single-person', (req, res) =>  {
    const personId = '64fb57f9152655fc8e8aa21d';
    Person.findById(personId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Classic Updates using Find, Edit, then Save
app.get('/classic-update', (req, res) =>  {
    const personId = '64fb57f9152655fc8e8aa21d';
    Person.findById(personId)
        .then(result => {
            result.favoriteFoods.push('Hamburger');
            result.save();
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Perform New Updates on a Document
app.get('/find-update', (req, res) =>  {
    const personName = 'Person 6';
    Person.findOneAndUpdate(
        { name: personName },
        { age: 20 },
        { new: true },
    )
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Delete One Person
app.get('/delete-person', (req, res) =>  {
    const personId = '64fb585b152655fc8e8aa21f';
    Person.findByIdAndRemove(personId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Delete many Documents with same Name (Person 1)
app.get('/delete-people', (req, res) =>  {
    const personName = 'Mary';
    Person.deleteMany({ name: personName })
        .then(result => {
            res.send(result);
            done();
        })
        .catch(err => {
            console.log(err);
        });
});

// Chain Search Query
app.get('/chain', (req, res) =>  {
    Person.find({ favoriteFoods: 'burritos' })
        .sort('name')
        .limit(2)
        .select('-age')
        .exec()
        .then(result => {
            res.send(result);
            done(null, result);
        })
        .catch(err => {
            console.error(err);
            done(err, null);
        });
});


//----------------------------------------------------------------------------------------------------------------

// Default Route (Index)
app.get('/', (req, res) => {
    res.redirect('/people');
});

//About Page
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});
  

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });