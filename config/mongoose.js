const mongoose = require('mongoose');

mongoose
  .connect("mongodb+srv://alina:alina82@cluster-test.ibpnh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-test")
  .then(() => {
    console.log('DB is connected');
  })
  .catch((err) => console.log(err));
