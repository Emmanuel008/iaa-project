module.exports = (sequelize, DataTypes) =>{
    const GivenTreatment = sequelize.define("given_treatment",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        treatment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        typeOfMalnutrition: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    return GivenTreatment
}