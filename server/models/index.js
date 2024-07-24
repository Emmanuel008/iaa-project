const dbConfig = require("../config/dbConfig.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel.js")(sequelize, DataTypes);
db.hospitals = require("./hospitalModel.js")(sequelize, DataTypes);
db.hospital_infos = require("./hospitalInfoModel.js")(sequelize, DataTypes);
db.patients = require("./patientModel.js")(sequelize, DataTypes);
db.admiting_infos = require("./admitingInfoModal.js")(sequelize, DataTypes);

db.test_types = require("./testTypeModal.js")(sequelize, DataTypes);
db.results = require("./resultsModel.js")(sequelize, DataTypes);
db.height_weight_results = require("./height_weightResultTableModal.js")(
  sequelize,
  DataTypes
);
db.height_age_results = require("./height_ageResultTable.js")(
  sequelize,
  DataTypes
);
db.weight_age_results = require("./weight_ageResultModal.js")(
  sequelize,
  DataTypes
);
db.bmi_age_results = require("./bmiResultTable.js")(sequelize, DataTypes);

db.treatments = require("./treatmentModal.js")(sequelize, DataTypes);
db.given_treatments = require("./givenTreatment.js")(sequelize, DataTypes);

// // Define associations after defining all models
db.hospitals.hasMany(db.users, { foreignKey: "hospital_id" });
db.hospitals.hasMany(db.hospital_infos, { foreignKey: "hospital_id" });
db.hospitals.hasMany(db.patients, { foreignKey: "hospital_id" });
db.patients.hasMany(db.admiting_infos, { foreignKey: "patient_card_no"});
db.admiting_infos.hasMany(db.test_types, { foreignKey: "admit_id" });
db.admiting_infos.hasMany(db.results, {foreignKey: "admit_id",});
db.admiting_infos.hasMany(db.given_treatments, { foreignKey: "admit_id" });



db.users.belongsTo(db.hospitals, { foreignKey: "hospital_id" });
db.hospital_infos.belongsTo(db.hospitals, { foreignKey: "hospital_id" });
db.patients.belongsTo(db.hospitals, { foreignKey: "hospital_id" });
db.admiting_infos.belongsTo(db.patients, { foreignKey: "patient_card_no" });
db.test_types.belongsTo(db.admiting_infos, { foreignKey: "admit_id" });
db.results.belongsTo(db.admiting_infos, {foreignKey: "admit_id",});
db.given_treatments.belongsTo(db.admiting_infos, { foreignKey: "admit_id" });






db.sequelize
  .sync({ force: false })
  .then(() => {})
  .then(() => {
    console.log("Yes re-sync done.");
  });

module.exports = db;