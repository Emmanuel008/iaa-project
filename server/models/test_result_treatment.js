module.exports = (sequelize, DataTypes) =>{
    const TestResultTreatment = sequelize.define("test_result_treatment", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      weight_height: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      height_age: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      weight_age: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      muac: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      result: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      treatment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("approved", "rejected", "pending"),
        defaultValue: "pending"
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    });
    return TestResultTreatment;
}