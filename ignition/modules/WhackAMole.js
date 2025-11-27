const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WhackAMoleModule", (m) => {
  const whackAMole = m.contract("WhackAMole");

  return { whackAMole };
});

