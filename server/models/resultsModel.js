module.exports = (sequelize, DataTypes) =>{
    const Results = sequelize.define("results", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      result: {
        type: DataTypes.ENUM(
          "severe",
          "moderate",
          "mild",
          "normal",
        ),
        allowNull: false,
      },
      typeOfTest: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      typeOfTestUsed: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
    return Results;
}