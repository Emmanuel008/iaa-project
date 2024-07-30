module.exports = (sequelize, DataTypes) =>{
    const Treatment = sequelize.define(
      "treatment",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        patientCategory: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        resultCategory: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        treatment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    );
    return Treatment;
}