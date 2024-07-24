module.exports = (sequelize, DataTypes) =>{
    const TestType = sequelize.define("test_type", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      weight_height: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      height_age: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      weight_age: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      muac: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      muacValue:{
        type: DataTypes.FLOAT,
        allowNull: true
      },
      BMI: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
    return TestType;
}