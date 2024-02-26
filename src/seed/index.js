const prisma = require("../client");
const categories = require("./category")

const seedData = async() => {
  if(process.argv[2] === "up"){
    await prisma.category.createMany({ data: categories })
  }
  
  // if(process.argv[2] === "down"){
  //   await Color.destroy({
  //     where: {},
  //     truncate: true
  //   })
  // }
}

seedData()
  .then()
  .catch((err) => {
    console.log(`Error seed: ${err.message}`);
  })  
  .finally(() => {
    process.exit(0)
  })