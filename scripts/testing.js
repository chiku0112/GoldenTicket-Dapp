const Marketplace =  require("../src/GoldenTicket.json");
async function getNFts () {
const MyContract = await ethers.getContractFactory("GoldenTicket");
const contract = await MyContract.attach(
  Marketplace.address
);

var vals = await contract.getListPrice();
console.log(vals);

}

getNFts();


