"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert("customers", [
        {
          full_name: "Firman Dwi",
          username: "frimand",
          email: "firmand@mail.com",
          phone_number: "087777777777"
        }, {
          full_name: "Prasetyo",
          username: "prasetyo",
          email: "prasetyo@mail.com",
          phone_number: "088888888888"
        }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('customers', null, {});
  }
};
